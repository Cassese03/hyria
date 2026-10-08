import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { LockerPlayer } from './roster';
import { LockerAudio } from './audio';
import {
  DEFAULT_KIT,
  createJerseyCanvas,
  createMeshBumpTexture,
  drawJerseyTexture,
  type DefaultArt,
  type KitOptions,
} from './jerseyTexture';
import {
  HANG_LENGTH,
  HOOK_TO_SHOULDER,
  JERSEY_H,
  createHangerParts,
  createJerseyGeometry,
  createJerseyMaterials,
} from './jerseyGeometry';

export type LockerMode = 'overview' | 'detail';

export interface LockerSceneOptions {
  container: HTMLElement;
  roster: LockerPlayer[];
  audio: LockerAudio;
  onReady: () => void;
  onHighlight: (index: number) => void;
  onMode: (mode: LockerMode) => void;
}

const RAIL_Y = 2.45;
const RAIL_Z = -0.7;
const RAIL_LEN = 6.2;
const LOW_SCALE = 0.375; // 768×576 per le maglie appese
const OVERVIEW_FOV = 38;
const DETAIL_FOV = 27;
const KEY_INTENSITY = 30;

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

interface JerseyRig {
  index: number;
  slot: THREE.Group;
  swing: THREE.Group;
  spin: THREE.Group;
  outer: THREE.Mesh;
  inner: THREE.Mesh;
  materials: ReturnType<typeof createJerseyMaterials>;
  lowCanvas: HTMLCanvasElement;
  lowTex: THREE.CanvasTexture;
  x: number;
  ry: number;
  lift: number;
  tilt: number;
  lowDirty: boolean;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export class LockerScene {
  private opts: LockerSceneOptions;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(OVERVIEW_FOV, 1, 0.1, 40);
  private rigs: JerseyRig[] = [];
  private disposables: { dispose: () => void }[] = [];
  private raycaster = new THREE.Raycaster();
  private timer = new THREE.Timer();
  private raf = 0;
  private disposed = false;
  private ro: ResizeObserver;

  private mode: LockerMode = 'overview';
  private highlight = 0;
  private hovered = -1;
  private kit: KitOptions = { ...DEFAULT_KIT };
  private art: DefaultArt = { logo: null, sponsor: null };

  // 2K "hero" texture condivisa: è assegnata solo alla maglia in dettaglio
  private hiCanvas: HTMLCanvasElement;
  private hiTex: THREE.CanvasTexture;
  private hiOwner = -1;
  private hiDirty = false;

  // camera
  private blend = 0;
  private blendFrom = 0;
  private blendTo = 0;
  private blendT = 1;
  private blendDur = 1.5;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private lookAt = new THREE.Vector3();
  private reduceMotion: boolean;

  // rotazione utente della maglia selezionata
  private userRot = 0;
  private spinVel = 0;
  private snapTarget: number | null = null;
  private dragging = false;
  private downX = 0;
  private downY = 0;
  private downT = 0;
  private lastMoveX = 0;
  private lastMoveT = 0;
  private wheelLock = 0;

  private labelEl: HTMLElement | null = null;
  private tmp = new THREE.Vector3();
  private beams: { mesh: THREE.Mesh; base: number; center: boolean }[] = [];
  private keySpot!: THREE.SpotLight;

  private constructor(opts: LockerSceneOptions) {
    this.opts = opts;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { container } = opts;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.75 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    const el = this.renderer.domElement;
    el.className = 'locker-canvas';
    el.setAttribute('aria-hidden', 'true');
    container.appendChild(el);

    this.hiCanvas = createJerseyCanvas(1);
    this.hiTex = this.makeTexture(this.hiCanvas);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();

    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointercancel', this.onPointerUp);
    el.addEventListener('pointerleave', this.onPointerLeave);
    el.addEventListener('wheel', this.onWheel, { passive: true });
  }

  /** Creazione asincrona: aspetta font e stemma prima di disegnare le texture. */
  static async create(opts: LockerSceneOptions) {
    const s = new LockerScene(opts);
    try {
      await Promise.race([
        Promise.all([
          document.fonts.load(`400 120px "Graduate"`),
          document.fonts.load(`700 70px "Montserrat"`),
        ]),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch {
      /* si usano i font di fallback */
    }
    const [logo, sponsor] = await Promise.all([
      loadImage('/images/logo-hyria-white.png'),
      loadImage('/images/sponsor-maglia.png'),
    ]);
    s.art = { logo, sponsor };
    if (s.disposed) return s;
    s.build();
    s.opts.onReady();
    s.loop();
    return s;
  }

  private makeTexture(canvas: HTMLCanvasElement) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.disposables.push(tex);
    return tex;
  }

  // ───────────────────────────── costruzione scena ─────────────────────────────

  private build() {
    const { scene } = this;
    scene.background = new THREE.Color(0x030203);
    scene.fog = new THREE.Fog(0x030203, 8, 18);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.22;
    this.disposables.push(pmrem, envTex);

    this.buildRoom();
    this.buildLights();
    this.buildRail();
    this.buildJerseys();
    this.applyLayout(true);
  }

  private std(params: THREE.MeshStandardMaterialParameters) {
    const m = new THREE.MeshStandardMaterial(params);
    this.disposables.push(m);
    return m;
  }

  private buildRoom() {
    const { scene } = this;

    // venatura del legno
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const g = c.getContext('2d')!;
    g.fillStyle = '#4a2a1c';
    g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * 256;
      g.strokeStyle = `rgba(${Math.random() > 0.5 ? '20,8,4' : '120,70,40'},${0.05 + Math.random() * 0.12})`;
      g.lineWidth = 0.5 + Math.random() * 2;
      g.beginPath();
      g.moveTo(x, 0);
      g.bezierCurveTo(x + (Math.random() - 0.5) * 18, 170, x + (Math.random() - 0.5) * 18, 340, x + (Math.random() - 0.5) * 10, 512);
      g.stroke();
    }
    const grain = this.makeTexture(c);

    // doghe verticali scanalate (fluted): capsule affiancate
    const flute = new THREE.CapsuleGeometry(0.052, 5.2, 4, 12);
    const wood = this.std({ color: 0x8a6a58, map: grain, roughness: 0.5, metalness: 0.05 });
    const count = 130;
    const wall = new THREE.InstancedMesh(flute, wood, count);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m4.makeTranslation((i - count / 2) * 0.11, 1.9, -1.2);
      wall.setMatrixAt(i, m4);
    }
    wall.receiveShadow = true;
    scene.add(wall);
    this.disposables.push(flute);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(40, 8), this.std({ color: 0x050202, roughness: 1 }));
    back.position.set(0, 2, -1.27);
    scene.add(back);

    // pavimento lucido
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      this.std({ color: 0x0d0b0c, roughness: 0.28, metalness: 0.25 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // panca: blocco scuro + seduta in legno
    const base = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 0.44), this.std({ color: 0x120c0b, roughness: 0.7 }));
    base.position.set(0, 0.2, -0.98);
    base.castShadow = base.receiveShadow = true;
    scene.add(base);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(6.04, 0.07, 0.5), this.std({ color: 0x3a2118, map: grain, roughness: 0.45 }));
    seat.position.set(0, 0.435, -0.98);
    seat.castShadow = seat.receiveShadow = true;
    scene.add(seat);

    // barra LED neon + alone sul pavimento
    const ledMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.95, 0.04, 0.07), toneMapped: false });
    this.disposables.push(ledMat);
    const led = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.035, 0.03), ledMat);
    led.position.set(0, 0.03, -0.74);
    scene.add(led);

    // alone: fascia che sfuma dal LED verso la camera e verso le estremità
    const gc = document.createElement('canvas');
    gc.width = 512;
    gc.height = 128;
    const gg = gc.getContext('2d')!;
    const vg = gg.createLinearGradient(0, 0, 0, 128);
    vg.addColorStop(0, 'rgba(255,30,45,0.95)');
    vg.addColorStop(0.18, 'rgba(255,20,40,0.45)');
    vg.addColorStop(1, 'rgba(255,0,20,0)');
    gg.fillStyle = vg;
    gg.fillRect(0, 0, 512, 128);
    gg.globalCompositeOperation = 'destination-in';
    const hg = gg.createLinearGradient(0, 0, 512, 0);
    hg.addColorStop(0, 'rgba(0,0,0,0)');
    hg.addColorStop(0.12, 'rgba(0,0,0,1)');
    hg.addColorStop(0.88, 'rgba(0,0,0,1)');
    hg.addColorStop(1, 'rgba(0,0,0,0)');
    gg.fillStyle = hg;
    gg.fillRect(0, 0, 512, 128);
    const glowTex = this.makeTexture(gc);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      opacity: 0.38,
    });
    this.disposables.push(glowMat);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.5), glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(0, 0.006, -0.73 + 0.75);
    scene.add(glow);
  }

  private buildLights() {
    const { scene } = this;
    scene.add(new THREE.AmbientLight(0xffe6d2, 0.6));

    const warm = 0xffe0c0;
    const makeSpot = (x: number, intensity: number, angle: number, shadow: boolean) => {
      const s = new THREE.SpotLight(warm, intensity, 14, angle, 0.75, 2);
      s.position.set(x, 3.45, 0.3);
      s.target.position.set(x, 1.7, RAIL_Z);
      if (shadow) {
        s.castShadow = true;
        s.shadow.mapSize.set(1024, 1024);
        s.shadow.bias = -0.0006;
        s.shadow.normalBias = 0.025;
        s.shadow.camera.near = 1;
        s.shadow.camera.far = 8;
      }
      scene.add(s, s.target);
      return s;
    };
    this.keySpot = makeSpot(0, KEY_INTENSITY, 0.5, true);
    makeSpot(-1.2, 16, 0.62, false);
    makeSpot(1.2, 16, 0.62, false);

    // luce rossa del LED: lava le doghe dal basso e tinge l'orlo delle maglie
    const wash = new THREE.SpotLight(0xff1b2e, 5, 5, 0.95, 1, 2);
    wash.position.set(0, 0.55, -0.55);
    wash.target.position.set(0, 2.1, -1.2);
    scene.add(wash, wash.target);
    for (const x of [-1.6, 1.6]) {
      const p = new THREE.PointLight(0xff1b2e, 0.9, 3.6, 2);
      p.position.set(x, 0.75, -0.35);
      scene.add(p);
    }

    // binario luci + faretti con fasci visibili
    const track = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.04, 0.07), this.std({ color: 0x050505, roughness: 0.6 }));
    track.position.set(0, 3.62, 0.3);
    scene.add(track);

    const beamMat = (opacity: number) => {
      const m = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color(0xffc080) }, uOpacity: { value: opacity } },
        vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
          void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0);
            vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);
            float along = smoothstep(0.0, 0.85, vUv.y);
            gl_FragColor = vec4(uColor, f * along * uOpacity); }`,
      });
      this.disposables.push(m);
      return m;
    };
    const canGeo = new THREE.CylinderGeometry(0.06, 0.085, 0.17, 20);
    const lensMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.2, 0.8), toneMapped: false });
    this.disposables.push(canGeo, lensMat);
    const canMat = this.std({ color: 0x080808, roughness: 0.4, metalness: 0.6 });
    const up = new THREE.Vector3(0, 1, 0);
    [-2.4, -1.2, 0, 1.2, 2.4].forEach((x) => {
      const from = new THREE.Vector3(x, 3.5, 0.3);
      const to = new THREE.Vector3(x, 1.2, RAIL_Z);
      const dir = from.clone().sub(to);
      const len = dir.length();
      dir.normalize();

      const can = new THREE.Mesh(canGeo, canMat);
      can.position.copy(from);
      can.quaternion.setFromUnitVectors(up, dir);
      scene.add(can);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.062, 20), lensMat);
      lens.position.copy(from).addScaledVector(dir, -0.088);
      lens.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().negate());
      scene.add(lens);
      this.disposables.push(lens.geometry);

      const center = x === 0;
      const geo = new THREE.CylinderGeometry(0.05, 0.62, len, 28, 1, true);
      this.disposables.push(geo);
      const beam = new THREE.Mesh(geo, beamMat(center ? 0.1 : 0.05));
      beam.position.copy(from).addScaledVector(dir, -len / 2);
      beam.quaternion.setFromUnitVectors(up, dir);
      scene.add(beam);
      this.beams.push({ mesh: beam, base: center ? 0.1 : 0.05, center });
    });
  }

  private buildRail() {
    const { scene } = this;
    const matte = this.std({ color: 0x0c0c0e, roughness: 0.45, metalness: 0.7 });
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, RAIL_LEN, 20), matte);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, RAIL_Y, RAIL_Z);
    rail.castShadow = true;
    scene.add(rail);
    this.disposables.push(rail.geometry);

    // staffe a parete (evitano il centro, dove la maglia sale in primo piano)
    for (const x of [-2.7, -1.4, 1.4, 2.7]) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.015), matte);
      plate.position.set(x, RAIL_Y, -1.19);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, 0.5), matte);
      arm.position.set(x, RAIL_Y - 0.018, (RAIL_Z - 1.19) / 2);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16), matte);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(x, RAIL_Y, RAIL_Z + 0.02);
      scene.add(plate, arm, cap);
      this.disposables.push(plate.geometry, arm.geometry, cap.geometry);
    }
    for (const x of [-RAIL_LEN / 2, RAIL_LEN / 2]) {
      const end = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 10), matte);
      end.position.set(x, RAIL_Y, RAIL_Z);
      scene.add(end);
      this.disposables.push(end.geometry);
    }
  }

  private buildJerseys() {
    const { scene, opts } = this;
    const geo = createJerseyGeometry();
    const bump = createMeshBumpTexture(this.renderer);
    const chrome = this.std({ color: 0xe8e8ee, metalness: 1, roughness: 0.14, envMapIntensity: 3.2 });
    this.disposables.push(geo, bump);

    opts.roster.forEach((player, index) => {
      const lowCanvas = createJerseyCanvas(LOW_SCALE);
      drawJerseyTexture(lowCanvas, player, this.kit, this.art);
      const lowTex = this.makeTexture(lowCanvas);
      const materials = createJerseyMaterials(lowTex, bump);
      this.disposables.push(materials.outer, materials.inner);

      const slot = new THREE.Group();
      const swing = new THREE.Group();
      const hang = new THREE.Group();
      const spin = new THREE.Group();
      hang.position.y = -HANG_LENGTH;

      const outer = new THREE.Mesh(geo, materials.outer);
      const inner = new THREE.Mesh(geo, materials.inner);
      outer.castShadow = true;
      outer.userData.index = index;
      inner.userData.index = index;

      const parts = createHangerParts(chrome);
      spin.add(parts.body, outer, inner);
      parts.hook.castShadow = true;
      hang.add(parts.hook, spin);
      swing.add(hang);
      slot.add(swing);
      slot.position.set(0, RAIL_Y, RAIL_Z);
      scene.add(slot);

      this.rigs.push({
        index,
        slot,
        swing,
        spin,
        outer,
        inner,
        materials,
        lowCanvas,
        lowTex,
        x: 0,
        ry: 0,
        lift: 0,
        tilt: 0,
        lowDirty: false,
      });
    });
  }

  // ───────────────────────────── layout maglie ─────────────────────────────

  private slotTarget(index: number) {
    const k = index - this.highlight;
    if (k === 0) return { x: 0, ry: 0 };
    const sign = Math.sign(k);
    const n = Math.abs(k) - 1;
    const detail = this.mode === 'detail';
    const start = detail ? 1.2 : 0.58;
    const gap = detail ? 0.14 : 0.115;
    return { x: sign * (start + n * gap), ry: -sign * (1.0 + (hash(index) - 0.5) * 0.14) };
  }

  private applyLayout(instant: boolean) {
    for (const rig of this.rigs) {
      const t = this.slotTarget(rig.index);
      if (instant) {
        rig.x = t.x;
        rig.ry = t.ry;
        this.placeRig(rig, 0);
      }
    }
  }

  private placeRig(rig: JerseyRig, time: number) {
    const isHL = rig.index === this.highlight;
    const sway = this.reduceMotion ? 0 : Math.sin(time * 0.9 + rig.index * 1.7) * 0.0045;
    rig.slot.position.set(rig.x, RAIL_Y + rig.lift * 0.035, RAIL_Z);
    rig.swing.rotation.z = sway + rig.tilt;
    rig.swing.rotation.x = this.reduceMotion ? 0 : Math.cos(time * 0.7 + rig.index) * 0.003;
    rig.spin.rotation.y = rig.ry + (isHL ? this.userRot : 0);
  }

  // ───────────────────────────── API pubblica ─────────────────────────────

  getMode() {
    return this.mode;
  }

  getHighlight() {
    return this.highlight;
  }

  setLabelElement(el: HTMLElement | null) {
    this.labelEl = el;
  }

  setHighlight(index: number, silent = false) {
    const i = THREE.MathUtils.clamp(index, 0, this.rigs.length - 1);
    if (i === this.highlight) return;
    this.highlight = i;
    this.userRot = this.snapRot(this.userRot);
    this.spinVel = 0;
    this.snapTarget = null;
    if (!silent) this.opts.audio.clink();
    if (this.mode === 'detail') this.assignHi();
    this.opts.onHighlight(i);
  }

  step(delta: number) {
    const n = this.rigs.length;
    this.setHighlight(THREE.MathUtils.clamp(this.highlight + delta, 0, n - 1));
  }

  openDetail(index?: number) {
    if (index !== undefined) this.setHighlight(index);
    if (this.mode === 'detail') return;
    this.mode = 'detail';
    this.userRot = 0;
    this.spinVel = 0;
    this.assignHi();
    this.startBlend(1, 1.5);
    this.opts.audio.swoosh('in');
    this.opts.onMode('detail');
  }

  closeDetail() {
    if (this.mode === 'overview') return;
    this.mode = 'overview';
    this.snapTarget = this.snapRot(this.userRot);
    this.startBlend(0, 1.25);
    this.opts.audio.swoosh('out');
    this.opts.onMode('overview');
  }

  /** Porta la maglia sul lato opposto (fronte ↔ retro). */
  flip() {
    if (this.mode !== 'detail') return;
    const half = Math.round(this.userRot / Math.PI);
    this.snapTarget = (half + 1) * Math.PI;
    this.spinVel = 0;
    this.opts.audio.clink();
  }

  setKit(kit: KitOptions) {
    this.kit = kit;
    this.hiDirty = true;
    for (const r of this.rigs) r.lowDirty = true;
  }

  /** PNG HD della maglia selezionata, isolata dalle altre e inquadrata frontalmente. */
  screenshot(): { dataUrl: string; filename: string } | null {
    const rig = this.rigs[this.highlight];
    if (!rig) return null;
    const player = this.opts.roster[this.highlight];
    const { container } = this.opts;
    const prevPR = this.renderer.getPixelRatio();
    const w = 1620;
    const h = 2160;

    this.ensureHi(this.highlight);
    const prevMap = rig.materials.outer.map;
    this.useMap(rig, this.hiTex);
    this.rigs.forEach((r) => (r.slot.visible = r === rig));
    const prevBeamVis = this.beams.map((b) => b.mesh.visible);
    this.beams.forEach((b) => (b.mesh.visible = false));

    const cam = new THREE.PerspectiveCamera(DETAIL_FOV, w / h, 0.1, 40);
    const cy = RAIL_Y - HOOK_TO_SHOULDER - JERSEY_H / 2 + 0.03;
    cam.position.set(rig.x, cy, RAIL_Z + 3.35);
    cam.lookAt(rig.x, cy, RAIL_Z);

    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);
    this.renderer.render(this.scene, cam);
    const dataUrl = this.renderer.domElement.toDataURL('image/png');

    this.renderer.setPixelRatio(prevPR);
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);
    this.rigs.forEach((r) => (r.slot.visible = true));
    this.beams.forEach((b, i) => (b.mesh.visible = prevBeamVis[i]));
    if (prevMap) this.useMap(rig, prevMap);

    const slug = player.lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { dataUrl, filename: `hyria-maglia-${player.number}-${slug}.png` };
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointercancel', this.onPointerUp);
    el.removeEventListener('pointerleave', this.onPointerLeave);
    el.removeEventListener('wheel', this.onWheel);
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    el.remove();
  }

  // ───────────────────────────── texture hero (2K) ─────────────────────────────

  private useMap(rig: JerseyRig, map: THREE.Texture) {
    rig.materials.outer.map = map;
    rig.materials.inner.map = map;
  }

  private ensureHi(index: number) {
    if (this.hiOwner === index && !this.hiDirty) return;
    drawJerseyTexture(this.hiCanvas, this.opts.roster[index], this.kit, this.art);
    this.hiTex.needsUpdate = true;
    this.hiOwner = index;
    this.hiDirty = false;
  }

  /** Assegna la texture 2K alla maglia selezionata e riporta le altre al tier basso. */
  private assignHi() {
    this.rigs.forEach((r) => {
      if (r.index !== this.highlight) this.useMap(r, r.lowTex);
    });
    this.ensureHi(this.highlight);
    this.useMap(this.rigs[this.highlight], this.hiTex);
  }

  // ───────────────────────────── camera ─────────────────────────────

  private startBlend(to: number, dur: number) {
    this.blendFrom = this.blend;
    this.blendTo = to;
    this.blendT = 0;
    this.blendDur = this.reduceMotion ? dur * 0.3 : dur;
  }

  private resize() {
    const { container } = this.opts;
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private updateCamera() {
    const cam = this.camera;
    const aspect = cam.aspect;
    const e = easeInOutCubic(this.blend);

    // overview: altezza occhi, puntata sul binario
    const ovFov = OVERVIEW_FOV;
    const tanOv = Math.tan(THREE.MathUtils.degToRad(ovFov / 2));
    const ovDist = Math.max(5.0, (aspect < 0.95 ? 0.95 : 1.3) / (aspect * tanOv));
    const par = 1 - e;
    const ovPos = new THREE.Vector3(
      this.pointerSmooth.x * 0.38 * par,
      (aspect < 0.95 ? 1.62 : 1.56) + this.pointerSmooth.y * 0.14 * par,
      RAIL_Z + ovDist,
    );
    const ovLook = new THREE.Vector3(this.pointerSmooth.x * 0.12 * par, aspect < 0.95 ? 1.85 : 1.53, RAIL_Z);

    // dettaglio: maglia sul terzo sinistro (desktop) o in alto (mobile)
    const stacked = aspect < 0.95;
    const tanDt = Math.tan(THREE.MathUtils.degToRad(DETAIL_FOV / 2));
    const visH = stacked ? 2.75 : 1.95;
    const dtDist = visH / 2 / tanDt;
    const halfH = visH / 2;
    const halfW = halfH * aspect;
    const jy = RAIL_Y - HOOK_TO_SHOULDER - JERSEY_H / 2 + 0.02;
    const ndcX = stacked ? 0 : -0.34;
    const ndcY = stacked ? 0.3 : -0.07;
    const dtX = -ndcX * halfW;
    const dtY = jy - ndcY * halfH;
    const dtPos = new THREE.Vector3(dtX, dtY, RAIL_Z + dtDist);
    const dtLook = new THREE.Vector3(dtX, dtY, RAIL_Z);

    cam.position.lerpVectors(ovPos, dtPos, e);
    cam.position.y += Math.sin(Math.PI * e) * 0.1; // lieve arco di dolly
    this.lookAt.lerpVectors(ovLook, dtLook, e);
    cam.fov = THREE.MathUtils.lerp(ovFov, DETAIL_FOV, e);
    cam.updateProjectionMatrix();
    cam.lookAt(this.lookAt);
  }

  // ───────────────────────────── loop ─────────────────────────────

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const time = this.timer.getElapsed();

    // timeline camera
    if (this.blendT < 1) {
      this.blendT = Math.min(1, this.blendT + dt / this.blendDur);
      this.blend = this.blendFrom + (this.blendTo - this.blendFrom) * this.blendT;
    }
    this.pointerSmooth.x = THREE.MathUtils.damp(this.pointerSmooth.x, this.pointer.x, 3, dt);
    this.pointerSmooth.y = THREE.MathUtils.damp(this.pointerSmooth.y, this.pointer.y, 3, dt);
    this.updateCamera();

    // rotazione utente: inerzia / snap
    if (!this.dragging) {
      if (this.snapTarget !== null) {
        this.userRot = THREE.MathUtils.damp(this.userRot, this.snapTarget, 5, dt);
        if (Math.abs(this.userRot - this.snapTarget) < 0.002) {
          this.userRot = this.snapTarget;
          this.snapTarget = null;
          if (this.mode === 'overview') this.userRot = 0;
        }
      } else if (Math.abs(this.spinVel) > 0.001) {
        this.userRot += this.spinVel * dt;
        this.spinVel *= Math.exp(-2.6 * dt);
      }
    }

    // maglie sul binario
    for (const rig of this.rigs) {
      const t = this.slotTarget(rig.index);
      const prevX = rig.x;
      rig.x = THREE.MathUtils.damp(rig.x, t.x, 7, dt);
      rig.ry = THREE.MathUtils.damp(rig.ry, t.ry, 7, dt);
      const hoverTarget = rig.index === this.hovered && rig.index !== this.highlight && this.mode === 'overview' ? 1 : 0;
      rig.lift = THREE.MathUtils.damp(rig.lift, hoverTarget, 12, dt);
      const vx = dt > 0 ? (rig.x - prevX) / dt : 0;
      rig.tilt = THREE.MathUtils.damp(rig.tilt, THREE.MathUtils.clamp(-vx * 0.05, -0.12, 0.12), 8, dt);
      this.placeRig(rig, time);
    }

    // texture sporche: una per frame per non bloccare l'interazione
    if (this.hiDirty && this.mode === 'detail') this.ensureHi(this.highlight);
    const dirty = this.rigs.find((r) => r.lowDirty);
    if (dirty) {
      drawJerseyTexture(dirty.lowCanvas, this.opts.roster[dirty.index], this.kit, this.art);
      dirty.lowTex.needsUpdate = true;
      dirty.lowDirty = false;
    }

    // fasci e faro principale reagiscono alla modalità
    const e = easeInOutCubic(this.blend);
    for (const b of this.beams) {
      (b.mesh.material as THREE.ShaderMaterial).uniforms.uOpacity.value = b.base * (b.center ? 1 + e * 0.9 : 1 - e * 0.5);
    }
    this.keySpot.intensity = KEY_INTENSITY * (1 + e * 0.15);

    this.updateLabel(e);
    this.renderer.render(this.scene, this.camera);
  };

  private updateLabel(e: number) {
    const el = this.labelEl;
    if (!el) return;
    this.tmp.set(0, RAIL_Y - HANG_LENGTH - 0.07, RAIL_Z);
    this.tmp.project(this.camera);
    const { clientWidth: w, clientHeight: h } = this.opts.container;
    const x = (this.tmp.x * 0.5 + 0.5) * w;
    const y = (-this.tmp.y * 0.5 + 0.5) * h;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, 0)`;
    el.style.opacity = String(Math.max(0, 1 - e * 3.5));
  }

  // ───────────────────────────── input ─────────────────────────────

  private pickIndex(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = this.raycaster.intersectObjects(this.rigs.map((r) => r.outer), false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  }

  private snapRot(r: number) {
    return Math.round(r / (Math.PI * 2)) * Math.PI * 2;
  }

  private onPointerDown = (e: PointerEvent) => {
    this.opts.audio.unlock();
    this.downX = this.lastMoveX = e.clientX;
    this.downY = e.clientY;
    this.downT = this.lastMoveT = performance.now();
    this.dragging = true;
    this.snapTarget = null;
    this.spinVel = 0;
    this.renderer.domElement.setPointerCapture(e.pointerId);
    if (this.mode === 'detail') this.renderer.domElement.style.cursor = 'grabbing';
  };

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1));

    if (this.dragging) {
      const dx = e.clientX - this.lastMoveX;
      if (this.mode === 'detail' && this.rigs[this.highlight]) {
        const now = performance.now();
        const dRot = dx * 0.011;
        this.userRot += dRot;
        const dtm = Math.max(1, now - this.lastMoveT) / 1000;
        this.spinVel = THREE.MathUtils.lerp(this.spinVel, dRot / dtm, 0.5);
        this.lastMoveT = now;
      }
      this.lastMoveX = e.clientX;
      return;
    }
    if (e.pointerType === 'mouse') {
      const idx = this.pickIndex(e.clientX, e.clientY);
      this.hovered = idx;
      this.renderer.domElement.style.cursor =
        this.mode === 'detail' ? (idx === this.highlight ? 'grab' : idx >= 0 ? 'pointer' : 'default') : idx >= 0 ? 'pointer' : 'default';
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.dragging) return;
    this.dragging = false;
    try {
      this.renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      /* già rilasciato */
    }
    const totalDx = e.clientX - this.downX;
    const elapsed = performance.now() - this.downT;
    const moved = Math.hypot(totalDx, e.clientY - this.downY);
    const wasClick = moved < 8 && elapsed < 600;
    this.renderer.domElement.style.cursor = this.mode === 'detail' ? 'grab' : 'default';

    if (performance.now() - this.lastMoveT > 90) this.spinVel = 0;

    if (wasClick) {
      const idx = this.pickIndex(e.clientX, e.clientY);
      if (idx < 0) return;
      if (this.mode === 'overview') this.openDetail(idx);
      else if (idx !== this.highlight) this.setHighlight(idx);
      return;
    }
    // swipe orizzontale nella panoramica = sfoglia il roster
    if (this.mode === 'overview' && Math.abs(totalDx) > 50 && Math.abs(totalDx) > Math.abs(e.clientY - this.downY)) {
      this.step(totalDx < 0 ? 1 : -1);
    }
  };

  private onPointerLeave = () => {
    this.hovered = -1;
    this.pointer.set(0, 0);
  };

  private onWheel = (e: WheelEvent) => {
    if (this.mode !== 'overview') return;
    const now = performance.now();
    if (now < this.wheelLock) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (Math.abs(d) < 20) return;
    this.wheelLock = now + 280;
    this.step(d > 0 ? 1 : -1);
  };
}

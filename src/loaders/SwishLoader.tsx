import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RIM_R, createGlowTexture } from '../arena/textures';
import {
  LoaderShell,
  LogoSlab,
  beamMaterial,
  clamp01,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  fitDistance,
  seg,
  useLoaderClock,
  useLogoTexture,
  type LoaderProps,
} from './shared';

/* Idea 1 — "Swish": ripresa da replay al rallentatore, di tre quarti dal basso.
   Il pallone gira sul ferro mentre il cronometro dei 24" scende col caricamento;
   poi entra pulito, la retina si apre e frusta, il LED del tabellone si accende
   d'arancio e dal canestro sale lo stemma. */

const MAROON = '#5e0303';
const ORANGE = '#d96c00';
const LED = '#ff5a00';
const BALL_R = 0.12;
const ORBIT_Y = 0.125; // il pallone appoggiato sul ferro
const INTRO = 0.95; // secondi del tiro iniziale
const BOARD_Z = -0.405;
const LOGO_TO = new THREE.Vector3(0, 0.5, 0.5);
const FOV = 36;

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/* ─── Texture ────────────────────────────────────────────────────────────── */

const BW = 2048;
const BH = 1024;
const SEAM_AMP = BW * 0.146; // apertura delle cuciture curve

/** Le cuciture di un pallone vero: equatore, un meridiano e le due curve */
function seamPath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0, BH / 2);
  ctx.lineTo(BW, BH / 2);
  for (const x of [BW / 4, (BW * 3) / 4]) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, BH);
  }
  for (const cx of [0, BW / 2, BW]) {
    for (const dir of [-1, 1]) {
      for (let y = 0; y <= BH; y += 8) {
        const x = cx + dir * SEAM_AMP * Math.sin((Math.PI * y) / BH);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
  }
}

/** Stampa lo stemma sulla sfera: riga per riga, allargando verso i poli
    così sul pallone non risulta deformato */
function printOnSphere(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, latDeg: number, sizeDeg: number) {
  const h = (sizeDeg / 180) * BH;
  const top = BH * (0.5 - latDeg / 180) - h / 2;
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  for (let row = 0; row < h; row++) {
    const lat = THREE.MathUtils.degToRad(latDeg + (0.5 - (row + 0.5) / h) * sizeDeg);
    const w = ((sizeDeg / Math.max(0.2, Math.cos(lat))) / 360) * BW;
    const sy = (row / h) * sh;
    for (const x of [cx, cx - BW, cx + BW]) {
      if (x + w / 2 < 0 || x - w / 2 > BW) continue;
      ctx.drawImage(img, 0, sy, sw, Math.max(1, sh / h), x - w / 2, top + row, w, 1.2);
    }
  }
}

/** Pelle del pallone con lo stemma Hyria stampato nei pannelli tra le cuciture curve */
function ballTextures(logo: HTMLImageElement) {
  const rand = rng(7);

  // colore
  const c = document.createElement('canvas');
  c.width = BW;
  c.height = BH;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#c4561a';
  ctx.fillRect(0, 0, BW, BH);
  for (let i = 0; i < 90; i++) {
    const x = rand() * BW;
    const y = rand() * BH;
    const r = 60 + rand() * 220;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const tone = rand() > 0.5 ? '120, 40, 8' : '235, 120, 50';
    g.addColorStop(0, `rgba(${tone}, 0.14)`);
    g.addColorStop(1, `rgba(${tone}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 40000; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(60,20,4,0.16)' : 'rgba(255,190,140,0.1)';
    ctx.fillRect(rand() * BW, rand() * BH, 2, 2);
  }
  ctx.imageSmoothingQuality = 'high';
  printOnSphere(ctx, logo, BW / 2, 36, 50);
  printOnSphere(ctx, logo, 0, -36, 50);
  ctx.fillStyle = '#2a0b04';
  ctx.font = '800 30px Montserrat, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '6px';
  ctx.fillText('HYRIA BASKET · NOLA', BW / 2, BH * (0.5 - 7 / 180));
  ctx.save();
  ctx.translate(BW, BH * (0.5 + 7 / 180));
  ctx.fillText('HYRIA BASKET · NOLA', 0, 0);
  ctx.translate(-BW, 0);
  ctx.fillText('HYRIA BASKET · NOLA', 0, 0);
  ctx.restore();
  ctx.strokeStyle = '#1a0b05';
  ctx.lineWidth = 13;
  seamPath(ctx);
  ctx.stroke();

  // rilievo: grana a puntini e cuciture incavate
  const b = document.createElement('canvas');
  b.width = BW;
  b.height = BH;
  const bctx = b.getContext('2d') as CanvasRenderingContext2D;
  bctx.fillStyle = '#7a7a7a';
  bctx.fillRect(0, 0, BW, BH);
  for (let i = 0; i < 70000; i++) {
    const v = 140 + rand() * 90;
    bctx.fillStyle = `rgb(${v},${v},${v})`;
    bctx.beginPath();
    bctx.arc(rand() * BW, rand() * BH, 2 + rand() * 2.2, 0, Math.PI * 2);
    bctx.fill();
  }
  bctx.strokeStyle = '#0a0a0a';
  bctx.lineWidth = 16;
  seamPath(bctx);
  bctx.stroke();

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(b);
  bump.anisotropy = 8;
  return { map, bump };
}

/** Raggi di luce dietro lo stemma */
function raysTexture() {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.translate(S / 2, S / 2);
  const rand = rng(3);
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + rand() * 0.1;
    const w = 0.03 + rand() * 0.06;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S / 2);
    g.addColorStop(0, 'rgba(255,190,120,0.9)');
    g.addColorStop(0.35, 'rgba(255,140,50,0.35)');
    g.addColorStop(1, 'rgba(255,120,30,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, S / 2, a - w, a + w);
    ctx.closePath();
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Cronometro dei 24" a LED: le cifre sono fatte di puntini, come quelli veri */
function useShotClock() {
  return useMemo(() => {
    const GW = 44;
    const GH = 26;
    const P = 8;
    const c = document.createElement('canvas');
    c.width = GW * P;
    c.height = GH * P;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    const m = document.createElement('canvas');
    m.width = GW;
    m.height = GH;
    const mctx = m.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;

    const draw = (n: number, on = true) => {
      mctx.clearRect(0, 0, GW, GH);
      mctx.fillStyle = '#fff';
      mctx.font = '900 25px Montserrat, Arial, sans-serif';
      mctx.textAlign = 'center';
      mctx.textBaseline = 'middle';
      mctx.fillText(String(n), GW / 2, GH / 2 + 1.5);
      const px = mctx.getImageData(0, 0, GW, GH).data;
      ctx.fillStyle = '#050406';
      ctx.fillRect(0, 0, c.width, c.height);
      const lit = n === 0 ? '#ff3b1f' : '#ff8a1f';
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const isOn = on && px[(y * GW + x) * 4 + 3] > 110;
          ctx.fillStyle = isOn ? lit : '#1d0d08';
          ctx.shadowColor = isOn ? lit : 'transparent';
          ctx.shadowBlur = isOn ? 6 : 0;
          ctx.beginPath();
          ctx.arc(x * P + P / 2, y * P + P / 2, P * 0.36, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      tex.needsUpdate = true;
    };
    draw(24);
    return { tex, draw };
  }, []);
}

/* ─── Retina: corde intrecciate, con nodi e un filo di cedimento ─────────── */

const NET_ROWS = 6;
const NET_STRANDS = 16;
const NET_LEN = 0.44;
const NET_TOP = -0.016; // la retina pende dai ganci sotto il ferro
const NET_SUB = 3; // ogni corda tra due nodi è spezzata in 3 per farla curvare
const NET_PIECES = NET_ROWS * NET_STRANDS * 2 * NET_SUB;
const NET_KNOTS = NET_ROWS * NET_STRANDS;

interface NetState {
  ballY: number; // quota del pallone quando è dentro la retina
  inside: boolean;
  drag: number; // 0..1 la retina viene tirata giù
  whip: number; // 0..1 avanzamento del colpo di frusta dopo il passaggio
  jiggle: number; // vibrazione del ferro mentre il pallone ci gira sopra
  t: number;
}

/** Trama a spina di pesce della corda intrecciata */
function braidTexture() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 128;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 32, 128);
  ctx.lineWidth = 5;
  for (let y = -32; y < 160; y += 16) {
    ctx.strokeStyle = '#d0d0d0';
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(16, y + 10);
    ctx.lineTo(32, y);
    ctx.stroke();
    ctx.strokeStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.moveTo(0, y + 7);
    ctx.lineTo(16, y + 17);
    ctx.lineTo(32, y + 7);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 3);
  return t;
}

function Net({ state }: { state: NetState }) {
  const cords = useRef<THREE.InstancedMesh>(null);
  const knots = useRef<THREE.InstancedMesh>(null);
  const nodes = useMemo(() => Array.from({ length: (NET_ROWS + 1) * NET_STRANDS }, () => new THREE.Vector3()), []);
  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      s: new THREE.Vector3(),
      mid: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      p0: new THREE.Vector3(),
      p1: new THREE.Vector3(),
      sag: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      one: new THREE.Quaternion(),
    }),
    [],
  );
  const cordGeo = useMemo(() => new THREE.CylinderGeometry(0.0046, 0.0046, 1, 7, 1, true), []);
  const knotGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f3efe6',
        roughness: 0.92,
        sheen: 1,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#ffffff'),
        bumpMap: braidTexture(),
        bumpScale: 2.5,
      }),
    [],
  );

  useFrame(() => {
    const cm = cords.current;
    const km = knots.current;
    if (!cm || !km) return;
    const { ballY, inside, drag, whip, jiggle, t } = state;
    const whipK = Math.sin(whip * Math.PI * 3) * (1 - whip) ** 2;

    for (let r = 0; r <= NET_ROWS; r++) {
      const f = r / NET_ROWS;
      const y = NET_TOP - NET_LEN * f * (1 + 0.32 * drag * f) + whipK * 0.09 * f;
      for (let k = 0; k < NET_STRANDS; k++) {
        let rad = THREE.MathUtils.lerp(RIM_R, 0.122, f) + 0.014 * Math.sin(Math.PI * f);
        rad *= 1 - whipK * 0.14 * f;
        // il pallone allarga le maglie al suo passaggio
        if (inside) {
          const d = y - ballY;
          const reach = BALL_R + 0.016;
          if (Math.abs(d) < reach) rad = Math.max(rad, Math.sqrt(reach * reach - d * d));
        }
        const sway = Math.sin(t * 1.7 + r * 0.7) * 0.05 * f + Math.sin(t * 13 + k) * jiggle * 0.02 * f;
        const a = ((k + r * 0.5) * Math.PI * 2) / NET_STRANDS + sway;
        const yy = y + Math.sin(t * 9 + k * 1.3) * jiggle * 0.004 * f;
        nodes[r * NET_STRANDS + k].set(Math.cos(a) * rad, yy, Math.sin(a) * rad);
      }
    }

    // ogni corda cede un po' verso il basso e verso l'esterno a metà
    let i = 0;
    const piece = (a: THREE.Vector3, b: THREE.Vector3, u0: number, u1: number) => {
      const len = a.distanceTo(b);
      tmp.sag.set(a.x + b.x, 0, a.z + b.z).normalize().multiplyScalar(0.0035);
      tmp.sag.y = -0.09 * len;
      tmp.p0.lerpVectors(a, b, u0).addScaledVector(tmp.sag, 4 * u0 * (1 - u0));
      tmp.p1.lerpVectors(a, b, u1).addScaledVector(tmp.sag, 4 * u1 * (1 - u1));
      tmp.dir.subVectors(tmp.p1, tmp.p0);
      const l = tmp.dir.length();
      tmp.mid.addVectors(tmp.p0, tmp.p1).multiplyScalar(0.5);
      tmp.q.setFromUnitVectors(tmp.up, tmp.dir.divideScalar(l || 1));
      tmp.s.set(1, l * 1.04, 1);
      tmp.m.compose(tmp.mid, tmp.q, tmp.s);
      cm.setMatrixAt(i++, tmp.m);
    };
    const cord = (a: THREE.Vector3, b: THREE.Vector3) => {
      for (let s = 0; s < NET_SUB; s++) piece(a, b, s / NET_SUB, (s + 1) / NET_SUB);
    };
    for (let r = 0; r < NET_ROWS; r++) {
      for (let k = 0; k < NET_STRANDS; k++) {
        const a = nodes[r * NET_STRANDS + k];
        cord(a, nodes[(r + 1) * NET_STRANDS + k]);
        cord(a, nodes[(r + 1) * NET_STRANDS + ((k - 1 + NET_STRANDS) % NET_STRANDS)]);
      }
    }
    cm.instanceMatrix.needsUpdate = true;

    // nodi dove le corde si incrociano
    tmp.s.set(0.0068, 0.0082, 0.0068);
    for (let n = 0; n < NET_KNOTS; n++) {
      tmp.m.compose(nodes[NET_STRANDS + n], tmp.one, tmp.s);
      km.setMatrixAt(n, tmp.m);
    }
    km.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={cords} args={[cordGeo, mat, NET_PIECES]} frustumCulled={false} />
      <instancedMesh ref={knots} args={[knotGeo, mat, NET_KNOTS]} frustumCulled={false} />
    </>
  );
}

/* ─── Canestro ───────────────────────────────────────────────────────────── */

const BOARD_W = 1.8;
const BOARD_H = 1.05;
const BOARD_CY = 0.375;
const GLASS_T = 0.02;
const GLASS_FRONT = BOARD_Z + GLASS_T / 2;

/** Un'asta cilindrica tra due punti */
function Rod({ from, to, r, material }: { from: [number, number, number]; to: [number, number, number]; r: number; material: THREE.Material }) {
  const { mid, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    return {
      mid: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()),
      len: a.distanceTo(b),
    };
  }, [from, to]);
  return (
    <mesh position={mid} quaternion={quat} material={material}>
      <cylinderGeometry args={[r, r, len, 12]} />
    </mesh>
  );
}

/** Striscia di vernice bianca sul cristallo */
function Paint({ x, y, w, h, material }: { x: number; y: number; w: number; h: number; material: THREE.Material }) {
  return (
    <mesh position={[x, y, GLASS_FRONT + 0.0006]} material={material}>
      <planeGeometry args={[w, h]} />
    </mesh>
  );
}

const BRACES: [[number, number, number], [number, number, number]][] = [
  [[0.045, -0.07, BOARD_Z + 0.15], [0.085, -0.012, -RIM_R * 0.6]],
  [[-0.045, -0.07, BOARD_Z + 0.15], [-0.085, -0.012, -RIM_R * 0.6]],
];

function Hoop({ clockTex, led }: { clockTex: THREE.Texture; led: THREE.MeshStandardMaterial }) {
  const mats = useMemo(
    () => ({
      glass: new THREE.MeshPhysicalMaterial({
        // vetro trasparente con i riflessi del palazzetto: dietro si vedono luci e tribune
        color: '#dcefe8',
        transparent: true,
        opacity: 0.16,
        roughness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.4,
        depthWrite: false,
      }),
      paint: new THREE.MeshStandardMaterial({ color: '#f6f4ef', roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -2 }),
      alu: new THREE.MeshStandardMaterial({ color: '#1b1c21', metalness: 0.85, roughness: 0.3 }),
      steel: new THREE.MeshStandardMaterial({ color: '#2c2d33', metalness: 0.8, roughness: 0.36 }),
      bolt: new THREE.MeshStandardMaterial({ color: '#9a9ca3', metalness: 0.95, roughness: 0.25 }),
      pad: new THREE.MeshPhysicalMaterial({
        color: MAROON,
        roughness: 0.82,
        sheen: 0.25,
        sheenRoughness: 0.7,
        sheenColor: new THREE.Color('#b8524a'),
      }),
      // ferro verniciato a polvere: arancio con una mano lucida sopra
      coat: new THREE.MeshPhysicalMaterial({
        color: '#e0560c',
        roughness: 0.42,
        metalness: 0.25,
        clearcoat: 0.8,
        clearcoatRoughness: 0.22,
      }),
    }),
    [],
  );
  const W = BOARD_W;
  const H = BOARD_H;
  const CY = BOARD_CY;
  const L = 0.05; // larghezza delle linee regolamentari

  return (
    <group>
      {/* cristallo temperato */}
      <RoundedBox args={[W, H, GLASS_T]} radius={0.006} smoothness={3} position={[0, CY, BOARD_Z]} material={mats.glass} />
      {/* linee verniciate: bordo e quadrato di tiro */}
      <Paint x={0} y={CY + H / 2 - L / 2} w={W} h={L} material={mats.paint} />
      <Paint x={0} y={CY - H / 2 + L / 2} w={W} h={L} material={mats.paint} />
      <Paint x={W / 2 - L / 2} y={CY} w={L} h={H - 2 * L} material={mats.paint} />
      <Paint x={-W / 2 + L / 2} y={CY} w={L} h={H - 2 * L} material={mats.paint} />
      <Paint x={0} y={0.45 - L / 2} w={0.59} h={L} material={mats.paint} />
      <Paint x={0} y={L / 2} w={0.59} h={L} material={mats.paint} />
      <Paint x={0.295 - L / 2} y={0.225} w={L} h={0.45 - 2 * L} material={mats.paint} />
      <Paint x={-0.295 + L / 2} y={0.225} w={L} h={0.45 - 2 * L} material={mats.paint} />

      {/* telaio in alluminio dietro al cristallo, con la striscia LED */}
      {[CY + H / 2 + 0.012, CY - H / 2 - 0.012].map((y) => (
        <RoundedBox key={y} args={[W + 0.05, 0.045, 0.06]} radius={0.012} smoothness={3} position={[0, y, BOARD_Z - 0.026]} material={mats.alu} />
      ))}
      {[W / 2 + 0.012, -W / 2 - 0.012].map((x) => (
        <RoundedBox key={x} args={[0.045, H + 0.05, 0.06]} radius={0.012} smoothness={3} position={[x, CY, BOARD_Z - 0.026]} material={mats.alu} />
      ))}
      {[CY + H / 2 + 0.012, CY - H / 2 - 0.012].map((y) => (
        <mesh key={y} position={[0, y, BOARD_Z + 0.0045]} material={led}>
          <boxGeometry args={[W + 0.03, 0.012, 0.004]} />
        </mesh>
      ))}
      {[W / 2 + 0.012, -W / 2 - 0.012].map((x) => (
        <mesh key={x} position={[x, CY, BOARD_Z + 0.0045]} material={led}>
          <boxGeometry args={[0.012, H + 0.03, 0.004]} />
        </mesh>
      ))}

      {/* imbottiture: sotto e sui due angoli bassi */}
      <RoundedBox args={[W + 0.1, 0.1, 0.13]} radius={0.04} smoothness={4} position={[0, CY - H / 2 - 0.045, BOARD_Z - 0.01]} material={mats.pad} />
      {[W / 2 + 0.03, -W / 2 - 0.03].map((x) => (
        <RoundedBox key={x} args={[0.1, 0.36, 0.13]} radius={0.04} smoothness={4} position={[x, CY - H / 2 + 0.14, BOARD_Z - 0.01]} material={mats.pad} />
      ))}

      {/* braccio della struttura */}
      <RoundedBox args={[0.16, 0.16, 1.8]} radius={0.02} smoothness={2} position={[0, CY, BOARD_Z - 0.95]} material={mats.steel} />
      <RoundedBox args={[0.13, 1.6, 0.13]} radius={0.02} smoothness={2} position={[0, CY - 0.58, BOARD_Z - 1.6]} rotation-x={0.75} material={mats.steel} />

      {/* cronometro dei 24" sopra il tabellone */}
      <RoundedBox args={[0.68, 0.32, 0.17]} radius={0.02} smoothness={3} position={[0, CY + H / 2 + 0.2, BOARD_Z - 0.02]} material={mats.alu} />
      <mesh position={[0, CY + H / 2 + 0.2, BOARD_Z + 0.0655]}>
        <planeGeometry args={[0.6, 0.25]} />
        <meshBasicMaterial map={clockTex} toneMapped={false} />
      </mesh>

      {/* attacco del ferro: piastra con bulloni, molla di sgancio, tiranti */}
      <RoundedBox args={[0.24, 0.16, 0.02]} radius={0.006} smoothness={2} position={[0, -0.03, GLASS_FRONT + 0.01]} material={mats.steel} />
      {[
        [0.09, 0.025],
        [-0.09, 0.025],
        [0.09, -0.085],
        [-0.09, -0.085],
      ].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, GLASS_FRONT + 0.024]} rotation-x={Math.PI / 2} material={mats.bolt}>
          <cylinderGeometry args={[0.011, 0.011, 0.01, 6]} />
        </mesh>
      ))}
      <RoundedBox args={[0.12, 0.09, 0.14]} radius={0.014} smoothness={3} position={[0, -0.05, GLASS_FRONT + 0.09]} material={mats.coat} />
      <RoundedBox
        args={[0.08, 0.014, -RIM_R - GLASS_FRONT - 0.1]}
        radius={0.005}
        smoothness={2}
        position={[0, -0.008, (GLASS_FRONT + 0.1 - RIM_R) / 2]}
        material={mats.coat}
      />
      {BRACES.map(([a, b], i) => (
        <Rod key={i} from={a} to={b} r={0.0065} material={mats.coat} />
      ))}

      {/* ferro e ganci della retina */}
      <mesh rotation-x={Math.PI / 2} material={mats.coat}>
        <torusGeometry args={[RIM_R, 0.0095, 20, 128]} />
      </mesh>
      {Array.from({ length: NET_STRANDS }, (_, k) => {
        const a = (k * Math.PI * 2) / NET_STRANDS;
        return (
          <mesh key={k} position={[Math.cos(a) * RIM_R, -0.012, Math.sin(a) * RIM_R]} rotation-y={-a} material={mats.coat}>
            <torusGeometry args={[0.0075, 0.0018, 6, 16]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Ambiente: luci del palazzetto sfocate e fasci nella foschia ────────── */

/** Palazzetto sfocato: tribune scure, file di luci al soffitto, qualche bagliore caldo */
function backdropTexture() {
  const W = 1024;
  const H = 605;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  const rand = rng(19);
  ctx.fillStyle = '#0c0306';
  ctx.fillRect(0, 0, W, H);
  const blob = (x: number, y: number, r: number, color: string, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${color}, ${a})`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  // tribune: una fascia appena più calda a metà altezza
  const band = ctx.createLinearGradient(0, H * 0.45, 0, H * 0.85);
  band.addColorStop(0, 'rgba(70, 14, 14, 0)');
  band.addColorStop(0.5, 'rgba(70, 14, 14, 0.55)');
  band.addColorStop(1, 'rgba(70, 14, 14, 0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, H);
  // file di luci al soffitto
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 14; i++) {
      blob(30 + i * 70 + rand() * 20, H * (0.12 + row * 0.11) + rand() * 8, 26 + rand() * 12, '255, 232, 205', 0.5 - row * 0.15);
    }
  }
  // tabellone centrale e bagliori sparsi in tribuna
  blob(W / 2, H * 0.3, 140, '255, 120, 40', 0.18);
  for (let i = 0; i < 40; i++) {
    blob(rand() * W, H * (0.45 + rand() * 0.4), 10 + rand() * 30, rand() > 0.5 ? '255, 150, 70' : '255, 225, 200', 0.12 + rand() * 0.18);
  }
  // bordi che sfumano nel colore di fondo
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.62);
  v.addColorStop(0, 'rgba(12, 3, 6, 0)');
  v.addColorStop(1, 'rgba(12, 3, 6, 1)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Arena() {
  const backdrop = useMemo(backdropTexture, []);
  const clock = useLoaderClock();
  const glow = useMemo(createGlowTexture, []);
  const spots = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 26 }, () => ({
      pos: [(r() - 0.5) * 20, -1 + r() * 9, -7 - r() * 8] as [number, number, number],
      scale: 0.7 + r() * 2.2,
      color: r() > 0.55 ? '#ff9a3c' : '#ffe6c8',
      phase: r() * Math.PI * 2,
    }));
  }, []);
  const beams = useMemo(
    () =>
      [
        [-4.5, 9, -10, -1.6, -3, -4.5],
        [4.8, 9.5, -10.5, 1.8, -3, -5],
        [0.4, 10, -12, 0.2, -3, -6],
      ].map(([x, y, z, tx, ty, tz]) => {
        const from = new THREE.Vector3(x, y, z);
        const to = new THREE.Vector3(tx, ty, tz);
        const len = from.distanceTo(to);
        const geo = new THREE.ConeGeometry(Math.tan(0.11) * len, len, 32, 1, true);
        geo.scale(1, 1 / len, 1);
        const mat = beamMaterial('#ffd9ae', 3);
        mat.uniforms.uOn.value = 0.9;
        return {
          geo,
          mat,
          len,
          mid: from.clone().add(to).multiplyScalar(0.5),
          quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), from.clone().sub(to).normalize()),
        };
      }),
    [],
  );
  const refs = useRef<(THREE.Sprite | null)[]>([]);

  useFrame(() => {
    const dim = 1 - easeInOutCubic(seg(clock.outro, 0.28, 0.6)) * 0.55;
    refs.current.forEach((sp, i) => {
      if (!sp) return;
      (sp.material as THREE.SpriteMaterial).opacity = (0.2 + 0.1 * Math.sin(clock.t * 0.7 + spots[i].phase)) * dim;
    });
    beams.forEach((b) => (b.mat.uniforms.uOn.value = 0.9 * dim));
  });

  return (
    <>
      {/* fondale opaco: è quello che si vede, rifratto, attraverso il cristallo */}
      <mesh position={[0, 2, -14]}>
        <planeGeometry args={[44, 26]} />
        <meshBasicMaterial map={backdrop} fog={false} toneMapped={false} />
      </mesh>
      {spots.map((s, i) => (
        <sprite key={i} ref={(el) => void (refs.current[i] = el)} position={s.pos} scale={s.scale}>
          <spriteMaterial map={glow} color={s.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
        </sprite>
      ))}
      {beams.map((b, i) => (
        <mesh key={i} geometry={b.geo} material={b.mat} position={b.mid} quaternion={b.quat} scale={[1, b.len, 1]} />
      ))}
    </>
  );
}

/* ─── Scintille del canestro ─────────────────────────────────────────────── */

const SPARKS = 150;

function Sparks({ fire }: { fire: { at: number } }) {
  const clock = useLoaderClock();
  const glow = useMemo(createGlowTexture, []);
  const data = useMemo(() => {
    const r = rng(77);
    const pos = new Float32Array(SPARKS * 3);
    const vel = Array.from({ length: SPARKS }, () => {
      const a = r() * Math.PI * 2;
      const out = 0.5 + r() * 1.6;
      return { a, v: new THREE.Vector3(Math.cos(a) * out, 0.6 + r() * 2.2, Math.sin(a) * out), life: 0.6 + r() * 0.9 };
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { pos, vel, geo };
  }, []);
  const mat = useRef<THREE.PointsMaterial>(null);

  useFrame(() => {
    if (!mat.current) return;
    const age = fire.at < 0 ? -1 : clock.t - fire.at;
    if (age < 0 || age > 1.6) {
      mat.current.opacity = 0;
      return;
    }
    const g = -4.2;
    data.vel.forEach((p, i) => {
      const tt = Math.min(age, p.life);
      data.pos[i * 3] = Math.cos(p.a) * RIM_R + p.v.x * tt;
      data.pos[i * 3 + 1] = p.v.y * tt + 0.5 * g * tt * tt;
      data.pos[i * 3 + 2] = Math.sin(p.a) * RIM_R + p.v.z * tt;
    });
    data.geo.attributes.position.needsUpdate = true;
    mat.current.opacity = 1 - clamp01(age / 1.3);
  });

  return (
    <points geometry={data.geo} frustumCulled={false}>
      <pointsMaterial
        ref={mat}
        map={glow}
        color="#ffae5c"
        size={0.05}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Scena ──────────────────────────────────────────────────────────────── */

function SwishScene() {
  const clock = useLoaderClock();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);

  const ball = useRef<THREE.Mesh>(null);
  const logo = useRef<THREE.Group>(null);
  const rays = useRef<THREE.Sprite>(null);
  const halo = useRef<THREE.Sprite>(null);
  const key = useRef<THREE.SpotLight>(null);
  const logoLight = useRef<THREE.PointLight>(null);
  const ledGlow = useRef<THREE.Mesh>(null);

  const logoTex = useLogoTexture();
  const ballTex = useMemo(() => ballTextures(logoTex.image as HTMLImageElement), [logoTex]);
  const glow = useMemo(createGlowTexture, []);
  const raysTex = useMemo(raysTexture, []);
  const shotClock = useShotClock();
  const led = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#000000', emissive: new THREE.Color('#ffe8d0'), emissiveIntensity: 0.6, toneMapped: false }),
    [],
  );
  const ledColors = useMemo(() => ({ idle: new THREE.Color('#ffe8d0'), hot: new THREE.Color(LED) }), []);

  const net = useMemo<NetState>(() => ({ ballY: 0, inside: false, drag: 0, whip: 0, jiggle: 0, t: 0 }), []);
  const fire = useMemo(() => ({ at: -1 }), []);
  const shownSec = useRef(24);
  const blink = useRef(true);

  const intro = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.5, -1.8, 1.6),
        new THREE.Vector3(-0.7, 1.35, 0.7),
        new THREE.Vector3(-RIM_R, ORBIT_Y, 0),
      ),
    [],
  );
  const tmp = useMemo(
    () => ({ p: new THREE.Vector3(), look: new THREE.Vector3(), cam: new THREE.Vector3(), front: new THREE.Vector3() }),
    [],
  );
  const theta = useRef(Math.PI);
  const speed = useRef(0);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const { t, outro, progress, done } = clock;
    const b = ball.current;
    const lg = logo.current;
    if (!b || !lg || !rays.current || !halo.current || !key.current || !logoLight.current || !ledGlow.current) return;

    // cronometro: scende col caricamento, a zero lampeggia
    if (done) {
      const on = Math.floor(outro * 10) % 2 === 0;
      if (shownSec.current !== 0 || on !== blink.current) {
        shownSec.current = 0;
        blink.current = on;
        shotClock.draw(0, on);
      }
    } else {
      const sec = Math.max(1, Math.ceil(24 * (1 - progress)));
      if (sec !== shownSec.current) {
        shownSec.current = sec;
        shotClock.draw(sec);
      }
    }

    // pallone: tiro → giri sul ferro → spirale dentro → giù nella retina
    const p = tmp.p;
    net.inside = false;
    net.jiggle = 0;
    if (t < INTRO) {
      intro.getPoint(easeOutCubic(t / INTRO), p);
      b.rotation.set(0, 0, -t * 11);
    } else {
      speed.current = THREE.MathUtils.damp(speed.current, done ? 7.5 : 4.4, 3, dt);
      theta.current -= speed.current * dt;
      const spiral = easeInCubic(seg(outro, 0, 0.14));
      const r = RIM_R * (1 - spiral);
      p.set(Math.cos(theta.current) * r, ORBIT_Y - spiral * 0.11, Math.sin(theta.current) * r);
      p.y += Math.abs(Math.sin(t * 8)) * 0.008 * (1 - spiral); // piccoli saltelli sul ferro
      const drop = seg(outro, 0.14, 0.42);
      p.y -= drop * drop * 2.4;
      b.rotation.set(0, -theta.current, 0);
      b.rotateZ(theta.current * (RIM_R / BALL_R));
      net.jiggle = (1 - spiral) * (t < INTRO + 0.4 ? 2 : 1);
      net.inside = spiral > 0.9 && p.y > -NET_LEN - BALL_R * 2;
      if (drop > 0 && fire.at < 0) fire.at = t;
    }
    b.position.copy(p);
    b.visible = p.y > -1.6;
    net.ballY = p.y;
    net.drag = Math.sin(Math.PI * seg(outro, 0.15, 0.38));
    net.whip = seg(outro, 0.3, 0.95);
    net.t = t;

    // LED del tabellone: da bianco caldo ad arancio pieno al canestro
    const hit = fire.at < 0 ? 0 : clamp01(1 - (t - fire.at) / 1.6);
    led.emissive.copy(ledColors.idle).lerp(ledColors.hot, fire.at < 0 ? 0 : 1);
    led.emissiveIntensity = fire.at < 0 ? 0.12 : 1 + hit * 1.2;
    (ledGlow.current.material as THREE.MeshBasicMaterial).opacity = fire.at < 0 ? 0 : 0.25 + hit * 0.5;

    // lo stemma sale dal canestro, con raggi e alone alle spalle
    const lk = seg(outro, 0.26, 0.66);
    lg.visible = lk > 0;
    lg.scale.setScalar(Math.max(0.001, easeOutBack(lk)));
    lg.position.set(
      0,
      THREE.MathUtils.lerp(-0.05, LOGO_TO.y, easeOutCubic(lk)) + Math.sin(t * 1.4) * 0.012 * lk,
      THREE.MathUtils.lerp(0, LOGO_TO.z, easeOutCubic(lk)),
    );
    // un quarto di giro soltanto: il retro dello stemma non si vede mai
    lg.rotation.y = (1 - easeOutCubic(lk)) * -1.3;
    const rm = rays.current.material as THREE.SpriteMaterial;
    rm.opacity = easeOutCubic(lk) * 0.3;
    rm.rotation += dt * 0.12;
    rays.current.scale.setScalar(0.8 + easeOutCubic(lk) * 1.7);
    (halo.current.material as THREE.SpriteMaterial).opacity = easeOutCubic(lk) * 0.6;
    logoLight.current.intensity = easeOutCubic(lk) * 2.2;

    // il palazzetto si abbassa quando arriva lo stemma
    const dim = 1 - easeInOutCubic(seg(outro, 0.28, 0.6)) * 0.6;
    key.current.intensity = 5.5 * dim;
    scene.environmentIntensity = 0.9 * dim;

    // camera: replay di tre quarti dal basso che gira piano, poi si mette davanti allo stemma
    const aspect = size.width / size.height;
    const dist = fitDistance(3.15, 2.1, aspect, FOV);
    const settle = easeOutCubic(seg(t, 0, 1.8));
    const ang = 0.62 - Math.min(t, 10) * 0.075;
    const R = dist * (1.35 - settle * 0.35);
    tmp.cam.set(Math.sin(ang) * R, -0.55 + settle * 0.4 + Math.sin(t * 0.5) * 0.03, Math.cos(ang) * R);
    tmp.look.set(0, 0.16 - (1 - settle) * 0.1, 0);
    const push = easeInOutCubic(seg(outro, 0.3, 1));
    tmp.front.set(0, LOGO_TO.y - 0.04, LOGO_TO.z + dist * 0.52);
    tmp.cam.lerp(tmp.front, push);
    tmp.look.lerp(LOGO_TO, push);
    camera.position.copy(tmp.cam);
    camera.lookAt(tmp.look);
    if (camera.fov !== FOV) {
      camera.fov = FOV;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      {/* sfondo vero (non trasparente): serve al cristallo per avere qualcosa da rifrangere */}
      <color attach="background" args={['#0c0306']} />
      <fog attach="fog" args={['#0c0306', 5, 18]} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color="#fff1dd" position={[0, 6, 2]} scale={[8, 1.5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#ffd9b0" position={[-5, 2, 4]} scale={[3, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} color="#ff8a2a" position={[5, 1, -3]} scale={[2, 6, 1]} target={[0, 0, 0]} />
        {/* striscia che si riflette in diagonale sul cristallo */}
        <Lightformer form="rect" intensity={1.6} color="#fff6ec" position={[-1.6, 3.2, 3.4]} scale={[0.5, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#7a0a0a" position={[0, -4, 0]} scale={[14, 14, 1]} target={[0, 0, 0]} />
      </Environment>

      <ambientLight intensity={0.12} color="#ffd8c0" />
      <spotLight ref={key} position={[1.6, 4.2, 3.2]} angle={0.42} penumbra={0.9} intensity={5.5} decay={0} color="#fff0de" />
      {/* controluce calda da dietro il tabellone */}
      <pointLight position={[0.4, 1.4, -2.2]} intensity={3} decay={0} distance={5} color="#ff9a3c" />
      <pointLight position={[-1.5, -1.6, 1]} intensity={1.2} decay={0} distance={4} color={ORANGE} />
      <pointLight ref={logoLight} position={[0.3, 0.7, 1.6]} intensity={0} decay={0} distance={3} color="#fff2e2" />

      <Arena />
      <Hoop clockTex={shotClock.tex} led={led} />
      {/* bagliore del LED sul vetro */}
      <mesh ref={ledGlow} position={[0, 0.375, BOARD_Z - 0.01]}>
        <planeGeometry args={[2.3, 1.5]} />
        <meshBasicMaterial map={glow} color={LED} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Net state={net} />
      <Sparks fire={fire} />

      <mesh ref={ball}>
        <sphereGeometry args={[BALL_R, 64, 32]} />
        <meshPhysicalMaterial
          map={ballTex.map}
          bumpMap={ballTex.bump}
          bumpScale={1.4}
          roughness={0.62}
          clearcoat={0.25}
          clearcoatRoughness={0.45}
          envMapIntensity={0.7}
        />
      </mesh>

      <sprite ref={rays} position={[LOGO_TO.x, LOGO_TO.y, LOGO_TO.z - 0.35]} scale={1}>
        <spriteMaterial map={raysTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
      </sprite>
      <sprite ref={halo} position={[LOGO_TO.x, LOGO_TO.y, LOGO_TO.z - 0.3]} scale={2.2}>
        <spriteMaterial map={glow} color="#ff7a1a" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
      </sprite>

      <group ref={logo} visible={false}>
        <LogoSlab size={1.05} depth={0.05} layers={12} />
      </group>
    </>
  );
}

export default function SwishLoader(props: LoaderProps) {
  return (
    <LoaderShell {...props} minMs={1600} outroMs={2600}>
      <SwishScene />
    </LoaderShell>
  );
}

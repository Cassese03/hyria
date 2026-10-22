import { use, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { arena } from './store';
import { loadAssets, shot } from './assets';
import {
  BOARD_H,
  COURT_W,
  FLOOR_L,
  FLOOR_W,
  RIM_R,
  RIM_X,
  RIM_Y,
  createAdBoard,
  createBallTexture,
  createCourtTexture,
  createGlowTexture,
  createJumboBrand,
  createJumboStats,
  createLedStrip,
  createShadowTexture,
  createShotClock,
  seatLetterMask,
  type BoardItem,
  type JumboContent,
} from './textures';

const MAROON = '#5e0303';
const ORANGE = '#d96c00';
const BG = '#0b0306';

const BANNER_X = [-11.5, -6.9, -2.3, 2.3, 6.9, 11.5];
const BANNER_Z = -10.5;
const BANNER_Y = 9;

/* ─── Parquet ────────────────────────────────────────────────────────────── */

function Floor({ logo, mobile, title }: { logo: HTMLImageElement | null; mobile: boolean; title?: string }) {
  const gl = useThree((s) => s.gl);
  const map = useMemo(() => createCourtTexture(logo, gl.capabilities.getMaxAnisotropy(), title), [logo, gl, title]);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#140508" roughness={0.95} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[FLOOR_L, FLOOR_W]} />
        {mobile ? (
          <meshStandardMaterial map={map} roughness={0.5} />
        ) : (
          <MeshReflectorMaterial
            map={map}
            resolution={1024}
            blur={[260, 80]}
            mixBlur={0.85}
            mixStrength={1.6}
            mixContrast={1}
            roughness={0.55}
            depthScale={0.5}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            metalness={0}
            mirror={0}
          />
        )}
      </mesh>
    </>
  );
}

/* ─── Canestri ───────────────────────────────────────────────────────────── */

function netGeometry() {
  const strands = 14;
  const rows = 5;
  const point = (r: number, k: number) => {
    const t = r / rows;
    const rad = RIM_R * (1 - t) + 0.13 * t;
    const a = ((k + r * 0.5) * Math.PI * 2) / strands;
    return [Math.cos(a) * rad, -0.42 * t, Math.sin(a) * rad];
  };
  const pts: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < strands; k++) {
      pts.push(...point(r, k), ...point(r + 1, k), ...point(r, k), ...point(r + 1, k - 1));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

function Hoop({ side, clock }: { side: 1 | -1; clock: THREE.Texture }) {
  const net = useRef<THREE.Group>(null);
  const netGeo = useMemo(netGeometry, []);
  const white = <meshStandardMaterial color="#f4f1ec" roughness={0.5} />;

  // la retina del canestro finale "respira" quando il pallone entra
  useFrame(() => {
    if (side !== -1 || !net.current) return;
    const k = shot.t >= 0.5 && shot.t <= 0.8 ? Math.sin((Math.PI * (shot.t - 0.5)) / 0.3) : 0;
    net.current.scale.set(1 - k * 0.12, 1 + k * 0.38, 1 - k * 0.12);
    net.current.rotation.y = k * 0.25;
  });

  return (
    <group rotation-y={side === 1 ? 0 : Math.PI}>
      <mesh position={[15.6, 0.55, 0]}>
        <boxGeometry args={[1.3, 1.1, 1.6]} />
        <meshStandardMaterial color={MAROON} roughness={0.7} />
      </mesh>
      <mesh position={[15.6, 2.9, 0]}>
        <boxGeometry args={[0.22, 3.6, 0.22]} />
        <meshStandardMaterial color="#1b1a1f" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[14.25, 3.7, 0]}>
        <boxGeometry args={[2.75, 0.18, 0.18]} />
        <meshStandardMaterial color="#1b1a1f" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[14.6, 3.05, 0]} rotation-z={-0.62}>
        <boxGeometry args={[2.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#1b1a1f" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* tabellone in cristallo */}
      <mesh position={[12.83, 3.425, 0]}>
        <boxGeometry args={[0.03, 1.05, 1.8]} />
        <meshStandardMaterial color="#cfe3ff" transparent opacity={0.16} roughness={0.05} depthWrite={false} />
      </mesh>
      {[3.925, 2.925].map((y) => (
        <mesh key={y} position={[12.82, y, 0]}>
          <boxGeometry args={[0.04, 0.05, 1.8]} />
          {white}
        </mesh>
      ))}
      {[0.875, -0.875].map((z) => (
        <mesh key={z} position={[12.82, 3.425, z]}>
          <boxGeometry args={[0.04, 1.05, 0.05]} />
          {white}
        </mesh>
      ))}
      {[3.05, 3.5].map((y) => (
        <mesh key={y} position={[12.8, y, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.59]} />
          {white}
        </mesh>
      ))}
      {[0.27, -0.27].map((z) => (
        <mesh key={z} position={[12.8, 3.275, z]}>
          <boxGeometry args={[0.02, 0.45, 0.05]} />
          {white}
        </mesh>
      ))}
      <mesh position={[12.84, 2.86, 0]}>
        <boxGeometry args={[0.1, 0.12, 1.84]} />
        <meshStandardMaterial color={MAROON} roughness={0.7} />
      </mesh>
      {/* cronometro dei 24" */}
      <mesh position={[12.9, 4.17, 0]}>
        <boxGeometry args={[0.22, 0.34, 0.62]} />
        <meshStandardMaterial color="#0d0c10" roughness={0.6} />
      </mesh>
      <mesh position={[12.785, 4.17, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[0.56, 0.28]} />
        <meshBasicMaterial map={clock} toneMapped={false} />
      </mesh>
      {/* ferro e retina */}
      <mesh position={[12.73, RIM_Y - 0.02, 0]}>
        <boxGeometry args={[0.16, 0.04, 0.14]} />
        <meshStandardMaterial color={ORANGE} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[RIM_X, RIM_Y, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[RIM_R, 0.012, 10, 48]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.35} metalness={0.4} roughness={0.35} />
      </mesh>
      <group ref={net} position={[RIM_X, RIM_Y, 0]}>
        <lineSegments geometry={netGeo}>
          <lineBasicMaterial color="#f2efe9" transparent opacity={0.85} />
        </lineSegments>
      </group>
    </group>
  );
}

/* ─── Tabellone centrale ─────────────────────────────────────────────────── */

function Jumbotron({ logo, animate, content }: { logo: HTMLImageElement | null; animate: boolean; content?: JumboContent }) {
  const invalidate = useThree((s) => s.invalidate);
  const brand = useMemo(() => createJumboBrand(logo), [logo]);
  const stats = useMemo(() => createJumboStats(), []);
  const count = useRef({ start: -1, done: false });

  // pagine interne: il tabellone mostra i dati della pagina (es. la classifica)
  useEffect(() => {
    if (!content) return;
    stats.render(content);
    invalidate();
  }, [content, stats, invalidate]);

  // contatore: riparte da zero ogni volta che la camera arriva davanti al tabellone
  useFrame(() => {
    if (!animate) return;
    const c = count.current;
    const near = arena.cam > 2.4 && arena.cam < 3.6;
    if (!near && c.done && (arena.cam < 1.6 || arena.cam > 4.4)) c.done = false;
    if (near && !c.done && c.start < 0) c.start = performance.now();
    if (c.start >= 0 && !c.done) {
      const t = Math.min(1, (performance.now() - c.start) / 1400);
      const e = 1 - Math.pow(1 - t, 3);
      stats.draw(Math.round(50 * e), Math.round(15 * e));
      if (t >= 1) {
        c.done = true;
        c.start = -1;
      } else invalidate();
    }
  });

  const faces: [THREE.Texture, [number, number, number], number][] = [
    [stats.texture, [0, 0, 2.61], 0],
    [stats.texture, [0, 0, -2.61], Math.PI],
    [brand, [2.61, 0, 0], Math.PI / 2],
    [brand, [-2.61, 0, 0], -Math.PI / 2],
  ];

  return (
    <group position={[0, 10.2, 0]}>
      <mesh>
        <boxGeometry args={[5.2, 3.1, 5.2]} />
        <meshStandardMaterial color="#0c0b10" metalness={0.5} roughness={0.5} />
      </mesh>
      {faces.map(([map, pos, rot], i) => (
        <mesh key={i} position={pos} rotation-y={rot}>
          <planeGeometry args={[4.8, 2.7]} />
          <meshBasicMaterial map={map} toneMapped={false} color="#e6e6e6" />
        </mesh>
      ))}
      {/* cornice LED sul bordo inferiore */}
      {[
        [0, 2.6, 0],
        [0, -2.6, 0],
        [2.6, 0, Math.PI / 2],
        [-2.6, 0, Math.PI / 2],
      ].map(([x, z, rot]) => (
        <mesh key={`${x}${z}`} position={[x, -1.58, z]} rotation-y={rot}>
          <boxGeometry args={[5.28, 0.1, 0.08]} />
          <meshBasicMaterial color="#ff8a1f" toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[5.26, 0.06, 5.26]} />
        <meshBasicMaterial color="#5e0303" toneMapped={false} />
      </mesh>
      {[
        [2.2, 2.2],
        [-2.2, 2.2],
        [2.2, -2.2],
        [-2.2, -2.2],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 8.5, z]}>
          <cylinderGeometry args={[0.025, 0.025, 14, 6]} />
          <meshBasicMaterial color="#1c1a20" />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Tribune, panchine, tavolo ufficiali ────────────────────────────────── */

function chairGeometry() {
  const seat = new THREE.BoxGeometry(0.46, 0.09, 0.42);
  seat.translate(0, 0.42, 0);
  const back = new THREE.BoxGeometry(0.46, 0.44, 0.06);
  back.translate(0, 0.66, -0.2);
  const leg = new THREE.BoxGeometry(0.07, 0.4, 0.07);
  leg.translate(0, 0.2, 0);
  return mergeGeometries([seat, back, leg]);
}

interface Placement {
  x: number;
  y: number;
  z: number;
  yaw: number;
  color: string;
}

function Instances({ geometry, items, roughness = 0.8 }: { geometry: THREE.BufferGeometry; items: Placement[]; roughness?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const c = new THREE.Color();
    items.forEach((it, i) => {
      q.setFromAxisAngle(up, it.yaw);
      m.compose(new THREE.Vector3(it.x, it.y, it.z), q, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.set(it.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, items.length]}>
      <meshStandardMaterial roughness={roughness} />
    </instancedMesh>
  );
}

const STEP = 0.85;
const RISE = 0.42;

function Stands({ mobile }: { mobile: boolean }) {
  const chair = useMemo(chairGeometry, []);
  const stepGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const { seats, steps } = useMemo(() => {
    const seats: Placement[] = [];
    const steps: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const tone = () => {
      const r = rand();
      if (r < 0.06) return '#2a0a0c';
      return r < 0.5 ? '#5e0303' : '#6c0808';
    };

    // tribuna opposta: i seggiolini arancio compongono la scritta HYRIA
    const farRows = 14;
    const farCols = 55;
    const lit = seatLetterMask(farCols, farRows);
    for (let r = 0; r < farRows; r++) {
      const z = -(10.4 + r * STEP);
      const h = 0.12 + r * RISE;
      steps.push({ pos: [0, h / 2, z], size: [32, h, STEP] });
      for (let c = 0; c < farCols; c++) {
        seats.push({ x: -14.85 + c * 0.55, y: h, z, yaw: 0, color: lit(c, farRows - 1 - r) ? ORANGE : tone() });
      }
    }
    // tribuna lato panchine
    const nearRows = mobile ? 6 : 9;
    for (let r = 0; r < nearRows; r++) {
      const z = 10.9 + r * STEP;
      const h = 0.12 + r * RISE;
      steps.push({ pos: [0, h / 2, z], size: [32, h, STEP] });
      for (let c = 0; c < 55; c++) seats.push({ x: -14.85 + c * 0.55, y: h, z, yaw: Math.PI, color: tone() });
    }
    // curve dietro i canestri
    const endRows = mobile ? 7 : 11;
    for (const side of [-1, 1]) {
      for (let r = 0; r < endRows; r++) {
        const x = side * (17.6 + r * STEP);
        const h = 0.12 + r * RISE;
        steps.push({ pos: [x, h / 2, 0], size: [STEP, h, 17] });
        for (let c = 0; c < 28; c++) {
          seats.push({ x, y: h, z: -7.42 + c * 0.55, yaw: (-side * Math.PI) / 2, color: tone() });
        }
      }
    }
    // panchine delle squadre
    for (const side of [-1, 1]) {
      for (let i = 0; i < 10; i++) {
        seats.push({ x: side * (4.6 + i * 0.6), y: 0, z: 9.15, yaw: Math.PI, color: MAROON });
      }
    }
    return { seats, steps };
  }, [mobile]);

  const stepMesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = stepMesh.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    steps.forEach((s, i) => {
      m.compose(new THREE.Vector3(...s.pos), new THREE.Quaternion(), new THREE.Vector3(...s.size));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [steps]);

  return (
    <>
      <Instances geometry={chair} items={seats} />
      <instancedMesh ref={stepMesh} args={[stepGeo, undefined, steps.length]}>
        <meshStandardMaterial color="#1d1518" roughness={0.95} />
      </instancedMesh>
    </>
  );
}

function ScorersTable({ tour, text }: { tour: boolean; text?: string }) {
  const led = useMemo(() => createLedStrip(text), [text]);
  useFrame(() => {
    if (tour) led.offset.x = arena.cam * 0.18;
  });
  return (
    <group position={[0, 0, COURT_W / 2 + 1.25]}>
      <mesh position={[0, 0.425, 0]}>
        <boxGeometry args={[6, 0.85, 0.75]} />
        <meshStandardMaterial color="#121015" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.44, 0.38]}>
        <planeGeometry args={[5.9, 0.6]} />
        <meshBasicMaterial map={led} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─── Stendardi con la galleria ──────────────────────────────────────────── */

function Banners({ photos, logo, tour }: { photos: (HTMLImageElement | null)[]; logo: HTMLImageElement | null; tour: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const videoMat = useRef<THREE.MeshBasicMaterial>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  const maps = useMemo(
    () =>
      photos.map((img) => {
        // fuori dal percorso della Home lo slot del video mostra lo stemma
        if (!img && !tour && logo) {
          const c = document.createElement('canvas');
          c.width = c.height = 512;
          const ctx = c.getContext('2d') as CanvasRenderingContext2D;
          ctx.fillStyle = '#efe6d8';
          ctx.fillRect(0, 0, 512, 512);
          ctx.drawImage(logo, 16, 16, 480, 480);
          const t = new THREE.CanvasTexture(c);
          t.colorSpace = THREE.SRGBColorSpace;
          return t;
        }
        if (!img) return null;
        const t = new THREE.Texture(img);
        t.colorSpace = THREE.SRGBColorSpace;
        t.needsUpdate = true;
        return t;
      }),
    [photos, logo, tour],
  );

  useEffect(
    () => () => {
      video.current?.pause();
      video.current?.removeAttribute('src');
    },
    [],
  );

  // il video si carica solo quando la camera si avvicina alla tribuna
  useFrame(() => {
    const near = tour && arena.cam > 3.3 && arena.cam < 6.2;
    if (near && !video.current && videoMat.current) {
      const v = document.createElement('video');
      v.src = '/images/1.mp4';
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.crossOrigin = 'anonymous';
      const tex = new THREE.VideoTexture(v);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = videoMat.current;
      // finché non c'è il primo fotogramma lo slot resta un telo bordeaux
      v.addEventListener('loadeddata', () => {
        mat.map = tex;
        mat.color.set('#d6d6d6');
        mat.needsUpdate = true;
        invalidate();
      }, { once: true });
      video.current = v;
    }
    const v = video.current;
    if (!v) return;
    if (near && v.paused) v.play().catch(() => undefined);
    if (!near && !v.paused) v.pause();
    if (near && !v.paused) invalidate();
  });

  return (
    <>
      {BANNER_X.map((x, i) => (
        <group key={x} position={[x, BANNER_Y, BANNER_Z]}>
          <mesh position={[0, -0.3, 0]}>
            <planeGeometry args={[4.1, 5]} />
            <meshStandardMaterial color="#4a0303" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -2.62, 0.01]}>
            <planeGeometry args={[4.1, 0.09]} />
            <meshBasicMaterial color={ORANGE} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.1, 0.02]}>
            <planeGeometry args={[3.6, 3.6]} />
            {maps[i] ? (
              <meshBasicMaterial map={maps[i]} toneMapped={false} color="#d6d6d6" />
            ) : (
              <meshBasicMaterial ref={videoMat} toneMapped={false} color="#2a0405" />
            )}
          </mesh>
          {[-1.8, 1.8].map((cx) => (
            <mesh key={cx} position={[cx, 7, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 9.6, 5]} />
              <meshBasicMaterial color="#1c1a20" />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/* ─── Soffitto e sala ────────────────────────────────────────────────────── */

function Hall() {
  const glow = useMemo(createGlowTexture, []);
  const lamps = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let x = -12; x <= 12; x += 4) for (const z of [-6, -2, 2, 6]) out.push([x, 19.5, z]);
    return out;
  }, []);
  return (
    <>
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[62, 30, 54]} />
        <meshStandardMaterial color="#0d0408" roughness={1} side={THREE.BackSide} />
      </mesh>
      {[-8, 0, 8].map((z) => (
        <mesh key={z} position={[0, 20.2, z]}>
          <boxGeometry args={[40, 0.35, 0.35]} />
          <meshStandardMaterial color="#17141a" roughness={0.8} />
        </mesh>
      ))}
      {lamps.map((p) => (
        <group key={p.join()} position={p}>
          <mesh>
            <boxGeometry args={[0.7, 0.12, 0.7]} />
            <meshBasicMaterial color="#fff3e2" toneMapped={false} />
          </mesh>
          <sprite scale={3}>
            <spriteMaterial map={glow} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </>
  );
}

/* ─── Il tiro finale ─────────────────────────────────────────────────────── */

const SHOT_FROM = new THREE.Vector3(-8.7, 1.0, 1.7);
const SHOT_RIM = new THREE.Vector3(-RIM_X, RIM_Y + 0.32, 0);
const SHOT_CTRL = new THREE.Vector3(-10.7, 5.8, 0.8);
const SHOT_REST = new THREE.Vector3(-11.3, 0.12, 0.5);

export function ShotBall({ reduced }: { reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const ball = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const map = useMemo(createBallTexture, []);
  const shadowMap = useMemo(createShadowTexture, []);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(SHOT_FROM, SHOT_CTRL, SHOT_RIM), []);
  const p = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const b = ball.current;
    const sh = shadow.current;
    if (!b || !sh) return;
    if (reduced) {
      b.visible = sh.visible = false;
      return;
    }
    if (arena.cam < 5.2) {
      shot.armed = true;
      shot.t = -1;
    }
    if (shot.armed && arena.cam > 5.85) {
      shot.armed = false;
      shot.t = 0;
    }
    b.visible = sh.visible = shot.t >= 0;
    if (shot.t < 0) return;
    if (shot.t < 1) {
      shot.t = Math.min(1, shot.t + Math.min(dt, 0.1) / 2);
      invalidate();
    }
    const t = shot.t;
    if (t < 0.5) {
      curve.getPoint(t / 0.5, p);
    } else if (t < 0.62) {
      const k = (t - 0.5) / 0.12;
      p.set(SHOT_RIM.x, SHOT_RIM.y - k * k * 0.9, 0);
    } else {
      const k = (t - 0.62) / 0.38;
      p.lerpVectors(new THREE.Vector3(SHOT_RIM.x, 0, 0), SHOT_REST, Math.min(1, k * 1.3));
      const fall = RIM_Y - 0.58;
      if (k < 0.3) p.y = 0.12 + fall * (1 - (k / 0.3) ** 2);
      else if (k < 0.65) p.y = 0.12 + 0.6 * Math.sin((Math.PI * (k - 0.3)) / 0.35);
      else p.y = 0.12 + 0.18 * Math.sin((Math.PI * (k - 0.65)) / 0.35);
    }
    b.position.copy(p);
    b.rotation.z = t * 14;
    sh.position.set(p.x, 0.015, p.z);
    const lift = Math.min(1, p.y / 4);
    sh.scale.setScalar(0.5 + lift * 0.6);
    (sh.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - lift);
  });

  return (
    <>
      <mesh ref={ball} visible={false}>
        <sphereGeometry args={[0.12, 32, 16]} />
        <meshStandardMaterial map={map} roughness={0.75} />
      </mesh>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} visible={false}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={shadowMap} transparent depthWrite={false} />
      </mesh>
    </>
  );
}


/* ─── Cartelloni LED a bordo campo ───────────────────────────────────────── */

/** Una fila di cartelloni lungo la linea laterale opposta, con i loghi che scorrono */
export function AdBoards({ items, animate }: { items: BoardItem[]; animate: boolean }) {
  const board = useMemo(() => createAdBoard(items), [items]);
  const length = 30;
  useEffect(() => {
    board.texture.repeat.x = length / board.length;
  }, [board]);
  useFrame((_, dt) => {
    if (animate) board.texture.offset.x = (board.texture.offset.x + (Math.min(dt, 0.1) * 0.55) / board.length) % 1;
  });
  return (
    <group position={[0, 0, -(FLOOR_W / 2 + 0.35)]}>
      <mesh position={[0, BOARD_H / 2 + 0.05, -0.1]}>
        <boxGeometry args={[length + 0.2, BOARD_H + 0.1, 0.18]} />
        <meshStandardMaterial color="#0d0b10" roughness={0.6} />
      </mesh>
      <mesh position={[0, BOARD_H / 2 + 0.05, 0.001]}>
        <planeGeometry args={[length, BOARD_H]} />
        <meshBasicMaterial map={board.texture} toneMapped={false} color="#e8e8e8" />
      </mesh>
    </group>
  );
}

/* ─── Canestro minibasket ────────────────────────────────────────────────── */

const MINI_RIM_Y = 2.6; // altezza regolamentare minibasket

/** Canestro mobile da minibasket, rivolto verso +z, con un pallone che rimbalza davanti */
export function MiniHoop({ position, animate }: { position: [number, number, number]; animate: boolean }) {
  const netGeo = useMemo(netGeometry, []);
  const ballMap = useMemo(createBallTexture, []);
  const shadowMap = useMemo(createShadowTexture, []);
  const ball = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const metal = <meshStandardMaterial color="#1b1a1f" metalness={0.6} roughness={0.4} />;
  const white = <meshStandardMaterial color="#f4f1ec" roughness={0.5} />;

  useFrame(({ clock }) => {
    const b = ball.current;
    const sh = shadow.current;
    if (!b || !sh) return;
    const t = animate ? clock.elapsedTime : 0.35;
    const h = Math.abs(Math.sin(t * 2.6)) * 0.95;
    b.position.y = 0.11 + h;
    b.rotation.x = animate ? t * 3 : 0.4;
    sh.scale.setScalar(0.55 + h * 0.35);
    (sh.material as THREE.MeshBasicMaterial).opacity = 0.75 - h * 0.45;
  });

  return (
    <group position={position}>
      {/* base zavorrata */}
      <mesh position={[0, 0.16, -0.75]}>
        <boxGeometry args={[1.1, 0.32, 1.3]} />
        <meshStandardMaterial color={MAROON} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.55, -1.1]} rotation-x={0.12}>
        <boxGeometry args={[0.1, 2.8, 0.1]} />
        {metal}
      </mesh>
      <mesh position={[0, 2.9, -0.65]}>
        <boxGeometry args={[0.08, 0.08, 0.8]} />
        {metal}
      </mesh>
      {/* tabellone ridotto */}
      <mesh position={[0, 2.85, -0.25]}>
        <boxGeometry args={[1.2, 0.9, 0.025]} />
        <meshStandardMaterial color="#cfe3ff" transparent opacity={0.18} roughness={0.05} depthWrite={false} />
      </mesh>
      {[3.29, 2.41].map((y) => (
        <mesh key={y} position={[0, y, -0.24]}>
          <boxGeometry args={[1.2, 0.04, 0.03]} />
          {white}
        </mesh>
      ))}
      {[0.59, -0.59].map((x) => (
        <mesh key={x} position={[x, 2.85, -0.24]}>
          <boxGeometry args={[0.04, 0.9, 0.03]} />
          {white}
        </mesh>
      ))}
      <mesh position={[0, MINI_RIM_Y + 0.22, -0.23]}>
        <boxGeometry args={[0.5, 0.035, 0.02]} />
        {white}
      </mesh>
      <mesh position={[0, MINI_RIM_Y, RIM_R - 0.2]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[RIM_R, 0.012, 10, 48]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.35} metalness={0.4} roughness={0.35} />
      </mesh>
      <lineSegments geometry={netGeo} position={[0, MINI_RIM_Y, RIM_R - 0.2]}>
        <lineBasicMaterial color="#f2efe9" transparent opacity={0.85} />
      </lineSegments>
      {/* pallone (taglia 5) */}
      <mesh ref={ball} position={[0.35, 0.11, 1.6]}>
        <sphereGeometry args={[0.11, 32, 16]} />
        <meshStandardMaterial map={ballMap} roughness={0.75} />
      </mesh>
      <mesh ref={shadow} position={[0.35, 0.012, 1.6]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.45, 0.45]} />
        <meshBasicMaterial map={shadowMap} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Il palazzetto ──────────────────────────────────────────────────────── */

interface WorldProps {
  mobile: boolean;
  reduced: boolean;
  /** true = percorso della Home (contatore, video, tiro); false = intestazioni */
  tour: boolean;
  /** scritta sulla fascia del lato opposto */
  title?: string;
  jumbo?: JumboContent;
  ledText?: string;
  /** stendardi al posto della galleria (es. l'archivio storico) */
  banners?: ReactNode;
  onReady: () => void;
  children?: ReactNode;
}

export function ArenaWorld({ mobile, reduced, tour, title, jumbo, ledText, banners, onReady, children }: WorldProps) {
  const { logo, photos } = use(loadAssets());
  const clock = useMemo(createShotClock, []);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 28, 72]} />
      <ambientLight intensity={0.35} color="#ffe6d0" />
      <hemisphereLight args={['#ffe2c4', '#2a0505', 0.6]} />
      <spotLight position={[0, 20, 1]} angle={0.9} penumbra={0.65} intensity={3} decay={0} color="#fff1df" />
      <directionalLight position={[8, 14, 10]} intensity={0.8} color="#ffe9d6" />
      <directionalLight position={[-10, 10, -8]} intensity={0.45} color="#ffcfa8" />

      <Floor logo={logo} mobile={mobile} title={title} />
      <Hoop side={1} clock={clock} />
      <Hoop side={-1} clock={clock} />
      <Jumbotron logo={logo} animate={tour && !reduced} content={jumbo} />
      <Stands mobile={mobile} />
      <ScorersTable tour={tour} text={ledText} />
      {banners ?? <Banners photos={photos} logo={logo} tour={tour} />}
      <Hall />
      {children}
    </>
  );
}

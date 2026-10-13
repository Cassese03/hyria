import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlowTexture } from '../arena/textures';
import {
  LoaderShell,
  easeInOutCubic,
  easeOutCubic,
  fitDistance,
  seg,
  useLoaderClock,
  useLogoTexture,
  type LoaderProps,
} from './shared';

/* Idea 2 — "Le Rovine di Hyria": un tondo di ceramica a figure rosse
   (come le anfore nolane) si ricompone coccio dopo coccio tra le colonne
   antiche; alla fine le crepe si accendono d'arancio, come un kintsugi. */

const DISC_R = 1.3;
const SHARD_DEPTH = 0.08;
const TERRACOTTA = '#b4541f';
const IDENTITY = new THREE.Quaternion();

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/** Il tondo dipinto: fondo nero lucido, greca in terracotta, stemma al centro */
function medallionTexture(logo: HTMLImageElement) {
  const S = 2048; // lo stemma finisce a ~1500 px, nitido anche a tutto schermo
  const px = S / 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  const C = S / 2;
  const R = S / 2;
  const rand = rng(23);

  ctx.fillStyle = TERRACOTTA;
  ctx.fillRect(0, 0, S, S);
  const g = ctx.createRadialGradient(C, C * 0.85, 0, C, C, R * 0.84);
  g.addColorStop(0, '#2a0d0a');
  g.addColorStop(1, '#0e0405');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(C, C, R * 0.84, 0, Math.PI * 2);
  ctx.fill();

  // greca sulla fascia esterna
  const inner = R * 0.86;
  const h = R * 0.1;
  const n = 30;
  ctx.strokeStyle = '#140605';
  ctx.lineWidth = h * 0.13;
  ctx.lineJoin = 'miter';
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.translate(C, C);
    ctx.rotate((i * Math.PI * 2) / n);
    ctx.translate(0, -inner - h * 0.08);
    const w = (2 * Math.PI * inner) / n;
    const u = w / 5;
    const v = h / 5;
    const key: [number, number][] = [
      [0, 0], [0, -4], [4, -4], [4, -1], [2, -1], [2, -2.6], [3, -2.6],
    ];
    ctx.beginPath();
    key.forEach(([x, y], k) => (k ? ctx.lineTo(-w / 2 + x * u, y * v) : ctx.moveTo(-w / 2 + x * u, y * v)));
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(w / 2, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = TERRACOTTA;
  ctx.lineWidth = 4 * px;
  ctx.beginPath();
  ctx.arc(C, C, R * 0.79, 0, Math.PI * 2);
  ctx.stroke();

  const ls = R * 1.5;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(logo, C - ls / 2, C - ls / 2, ls, ls);

  // patina: puntini e graffi di una ceramica antica
  for (let i = 0; i < 2600 * px * px; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,220,180,0.06)';
    ctx.fillRect(rand() * S, rand() * S, 2 * px, 2 * px);
  }
  ctx.strokeStyle = 'rgba(255, 230, 200, 0.05)';
  ctx.lineWidth = 1.5 * px;
  for (let i = 0; i < 40; i++) {
    const x = rand() * S;
    const y = rand() * S;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 120 * px, y + (rand() - 0.5) * 120 * px);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface Shard {
  geometry: THREE.ExtrudeGeometry;
  home: THREE.Vector3;
  from: THREE.Vector3;
  fromRot: THREE.Quaternion;
  delay: number;
  seed: number;
}

/** Spacca il disco in ~50 cocci irregolari (anelli concentrici con vertici sfalsati) */
function buildShards(): Shard[] {
  const rand = rng(2025);
  const n = 10;
  const radii = [0.36, 0.68, 1];
  const ang: number[][] = radii.map((_, k) =>
    Array.from({ length: n }, (_, j) => ((j + (k % 2) * 0.5 + (rand() - 0.5) * 0.45) * Math.PI * 2) / n),
  );
  const P = (k: number, j: number): [number, number] => {
    const jj = (j + n) % n;
    const a = ang[k][jj] + (j >= n ? Math.PI * 2 : 0);
    const r = k === 2 ? 1 : radii[k] * (0.92 + rand() * 0.16);
    return [Math.cos(a) * r, Math.sin(a) * r];
  };
  // i vertici interni vanno fissati una volta sola perché i cocci combacino
  const pts = radii.map((_, k) => Array.from({ length: n + 1 }, (_, j) => P(k, j)));
  pts.forEach((ring) => (ring[n] = ring[0]));
  const arc = (a0: number, a1: number) => {
    const out: [number, number][] = [];
    for (let i = 0; i <= 6; i++) {
      const a = a0 + ((a1 - a0) * i) / 6;
      out.push([Math.cos(a), Math.sin(a)]);
    }
    return out;
  };
  const center: [number, number] = [(rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08];

  const polys: [number, number][][] = [];
  for (let j = 0; j < n; j++) {
    polys.push([center, pts[0][j], pts[0][j + 1]]);
    const a = pts[0][j];
    const b = pts[0][j + 1];
    const c = pts[1][j];
    const d = pts[1][j + 1];
    if (j % 2) polys.push([a, c, d], [a, d, b]);
    else polys.push([a, c, b], [b, c, d]);
    // anello esterno: due cocci per spicchio, con il bordo curvo
    const a0 = ang[2][j];
    let a1 = ang[2][(j + 1) % n];
    if (a1 < a0) a1 += Math.PI * 2;
    if (j === n - 1 && a1 - a0 > Math.PI) a1 -= Math.PI * 2;
    const am = a0 + (a1 - a0) * (0.35 + rand() * 0.3);
    polys.push([c, ...arc(a0, am)], [c, ...arc(am, a1), d]);
  }

  return polys.map((poly) => {
    const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, y)));
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: SHARD_DEPTH, bevelEnabled: false, curveSegments: 1 });
    // UV del tondo calcolate dalla posizione nel disco
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) * 0.5 + 0.5, pos.getY(i) * 0.5 + 0.5);
    const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
    const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    // un filo di spazio tra i cocci: lì si accende la crepa
    geometry.translate(-cx, -cy, -SHARD_DEPTH / 2);
    geometry.scale(DISC_R * 0.975, DISC_R * 0.975, 1);
    geometry.computeVertexNormals();

    const home = new THREE.Vector3(cx * DISC_R, cy * DISC_R, 0);
    const dir = new THREE.Vector3(cx + (rand() - 0.5) * 0.8, cy + (rand() - 0.5) * 0.8, 0).normalize();
    const from = home
      .clone()
      .addScaledVector(dir, 2.2 + rand() * 2.6)
      .add(new THREE.Vector3(0, (rand() - 0.5) * 1.2, -2.5 + rand() * 3.5));
    const fromRot = new THREE.Quaternion().setFromEuler(
      new THREE.Euler((rand() - 0.5) * Math.PI * 2, (rand() - 0.5) * Math.PI * 2, (rand() - 0.5) * Math.PI),
    );
    const r = Math.hypot(cx, cy);
    return { geometry, home, from, fromRot, delay: Math.min(0.7, r * 0.5 + rand() * 0.25), seed: rand() * Math.PI * 2 };
  });
}

function Column({ x, z, h, capital, tilt = 0 }: { x: number; z: number; h: number; capital?: boolean; tilt?: number }) {
  const ground = -2.4;
  return (
    <group position={[x, ground, z]}>
      <mesh position-y={0.1}>
        <boxGeometry args={[1.05, 0.2, 1.05]} />
        <meshStandardMaterial color="#5b4a42" roughness={0.95} />
      </mesh>
      <mesh position-y={0.2 + h / 2}>
        <cylinderGeometry args={[0.34, 0.4, h, 18, 1]} />
        <meshStandardMaterial color="#6e5a50" roughness={0.9} flatShading />
      </mesh>
      {capital ? (
        <>
          <mesh position-y={0.2 + h + 0.08}>
            <cylinderGeometry args={[0.48, 0.34, 0.16, 18]} />
            <meshStandardMaterial color="#6e5a50" roughness={0.9} flatShading />
          </mesh>
          <mesh position-y={0.2 + h + 0.22}>
            <boxGeometry args={[1.05, 0.14, 1.05]} />
            <meshStandardMaterial color="#5b4a42" roughness={0.95} />
          </mesh>
        </>
      ) : (
        // rocchio spezzato appoggiato storto sulla cima
        <mesh position={[0.06, 0.2 + h + 0.12, 0]} rotation={[tilt, 0.4, tilt * 0.6]}>
          <cylinderGeometry args={[0.33, 0.34, 0.3, 18, 1]} />
          <meshStandardMaterial color="#6e5a50" roughness={0.9} flatShading />
        </mesh>
      )}
    </group>
  );
}

function Dust() {
  const clock = useLoaderClock();
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rand = rng(5);
    const p = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      p[i * 3] = (rand() - 0.5) * 12;
      p[i * 3 + 1] = (rand() - 0.5) * 6;
      p[i * 3 + 2] = (rand() - 0.5) * 7 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.t * 0.03;
    ref.current.position.y = ((clock.t * 0.08) % 1) * 0.3;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.028} color="#ffb877" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function RovineScene() {
  const clock = useLoaderClock();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const logo = useLogoTexture();
  const glow = useMemo(createGlowTexture, []);

  const shards = useMemo(buildShards, []);
  const mats = useMemo(() => {
    const face = new THREE.MeshStandardMaterial({ map: medallionTexture(logo.image as HTMLImageElement), roughness: 0.38, metalness: 0.05 });
    const side = new THREE.MeshStandardMaterial({ color: '#8f3f17', roughness: 0.95, emissive: new THREE.Color('#ff7a12'), emissiveIntensity: 0 });
    return [face, side];
  }, [logo]);

  const disc = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const seam = useRef<THREE.Mesh>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const halo = useRef<THREE.Sprite>(null);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const spin = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  useFrame(() => {
    const { t, progress, outro } = clock;
    const g = disc.current;
    if (!g || !seam.current || !sweep.current || !halo.current) return;

    // i cocci arrivano dai bordi verso il centro seguendo il caricamento
    shards.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const a = easeInOutCubic(seg(progress, s.delay, s.delay + 0.3));
      const free = 1 - a;
      m.position.lerpVectors(s.from, s.home, a);
      m.position.y += Math.sin(t * 1.3 + s.seed) * 0.14 * free;
      euler.set(t * 0.3 * free + s.seed, t * 0.2 * free, 0);
      spin.setFromEuler(euler);
      q.copy(s.fromRot).multiply(spin).slerp(IDENTITY, a);
      m.quaternion.copy(q);
    });

    // kintsugi: le crepe si accendono, poi una lama di luce attraversa il tondo
    const crack = Math.sin(Math.PI * seg(outro, 0.02, 0.7)) * 0.8 + seg(outro, 0.5, 1) * 0.35;
    const seamMat = seam.current.material as THREE.MeshBasicMaterial;
    seamMat.opacity = Math.min(1, seg(progress, 0.55, 1) * 0.25 + crack);
    (mats[1] as THREE.MeshStandardMaterial).emissiveIntensity = crack * 1.6;
    const sw = seg(outro, 0.25, 0.75);
    sweep.current.position.set(THREE.MathUtils.lerp(-2.6, 2.6, easeInOutCubic(sw)), 0.6, 1.1);
    sweep.current.intensity = Math.sin(Math.PI * sw) * 9;
    (halo.current.material as THREE.SpriteMaterial).opacity = 0.18 + seg(progress, 0.3, 1) * 0.2 + crack * 0.25;

    // il tondo oscilla mentre carica, poi si mette dritto davanti alla camera
    const settle = easeInOutCubic(seg(outro, 0.4, 0.9));
    g.rotation.y = Math.sin(t * 0.5) * 0.32 * (1 - settle);
    g.rotation.x = Math.sin(t * 0.37) * 0.08 * (1 - settle);
    g.position.y = Math.sin(t * 0.8) * 0.05 * (1 - settle);

    const aspect = size.width / size.height;
    const dist = fitDistance(6, 3.2, aspect);
    const intro = easeOutCubic(seg(t, 0, 2));
    const push = easeInOutCubic(seg(outro, 0.45, 1));
    camera.position.set(Math.sin(t * 0.25) * 0.4 * (1 - push), 0.35 - intro * 0.2, dist * (1.2 - intro * 0.2) - push * dist * 0.38);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#0d0306', 6.5, 15]} />
      <ambientLight intensity={0.28} color="#ffd9b8" />
      <directionalLight position={[-3, 5, 4]} intensity={1.7} color="#ffd2a0" />
      <pointLight position={[2.5, -1, -2]} intensity={2} decay={0} color="#d96c00" />
      <pointLight ref={sweep} intensity={0} decay={0} distance={4} color="#ffcf9a" />

      <Column x={-4.3} z={-3} h={4.4} capital />
      <Column x={-2.7} z={-5.2} h={2.2} tilt={0.35} />
      <Column x={3.5} z={-2.4} h={3.1} tilt={-0.3} />
      <Column x={5.2} z={-6} h={5.2} capital />
      <mesh position={[2.1, -2.12, -0.8]} rotation={[0, 0.7, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.8, 18]} />
        <meshStandardMaterial color="#5f4d45" roughness={0.95} flatShading />
      </mesh>
      <mesh position-y={-2.4} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#1f0f0c" roughness={1} />
      </mesh>
      <Dust />

      <sprite ref={halo} position={[0, 0, -1.2]} scale={6}>
        <spriteMaterial map={glow} color="#d96c00" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      <group ref={disc}>
        {/* dietro i cocci: la luce che filtra dalle crepe */}
        <mesh ref={seam} position-z={-0.02}>
          <circleGeometry args={[DISC_R * 0.995, 64]} />
          <meshBasicMaterial color="#ff8a1f" transparent opacity={0} toneMapped={false} />
        </mesh>
        {shards.map((s, i) => (
          <mesh key={i} ref={(el) => void (refs.current[i] = el)} geometry={s.geometry} material={mats} />
        ))}
      </group>
    </>
  );
}

export default function RovineLoader(props: LoaderProps) {
  return (
    <LoaderShell {...props} minMs={1800} outroMs={2300}>
      <RovineScene />
    </LoaderShell>
  );
}

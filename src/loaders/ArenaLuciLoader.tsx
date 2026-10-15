import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FLOOR_L, FLOOR_W, createCourtTexture, createGlowTexture } from '../arena/textures';
import {
  LoaderShell,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  fitDistance,
  seg,
  useLoaderClock,
  beamMaterial,
  useLogoTexture,
  type LoaderProps,
} from './shared';

/* Idea 4 — "Luci dell'Arena": il palazzetto è al buio, i riflettori si
   accendono uno a uno col caricamento; per ultimo quello sul cerchio
   centrale, poi la camera si tuffa dentro lo stemma. */

const RIG_Y = 15;

interface Rig {
  from: THREE.Vector3;
  to: THREE.Vector3;
  angle: number;
  at: number; // soglia di avanzamento a cui si accende
  intensity: number;
}

// a coppie simmetriche, dagli angoli verso il centro
const RIGS: Rig[] = [
  [-13, -8, -9, -4.5],
  [13, 8, 9, 4.5],
  [13, -8, 9, -4.5],
  [-13, 8, -9, 4.5],
  [-6, -10, -4, -3],
  [6, 10, 4, 3],
  [6, -10, 4, -3],
  [-6, 10, -4, 3],
].map(([x, z, tx, tz], i) => ({
  from: new THREE.Vector3(x, RIG_Y, z),
  to: new THREE.Vector3(tx, 0, tz),
  angle: 0.27,
  at: 0.08 + (Math.floor(i / 2) * 0.72) / 4 + (i % 2) * 0.06,
  intensity: 2.4,
}));

const CENTER: Rig = {
  from: new THREE.Vector3(0, 18, 0),
  to: new THREE.Vector3(0, 0, 0),
  angle: 0.135,
  at: 1,
  intensity: 5,
};

/** Accensione da lampada a scarica: due sfarfallii e poi piena */
const flicker = (dt: number) => {
  if (dt < 0) return 0;
  if (dt > 0.42) return 1;
  const steps = [0.9, 0, 0.6, 0.1, 1, 0.35, 1];
  return steps[Math.floor((dt / 0.42) * steps.length)];
};

function Spot({ rig, glow }: { rig: Rig; glow: THREE.Texture }) {
  const clock = useLoaderClock();
  const light = useRef<THREE.SpotLight>(null);
  const halo = useRef<THREE.Sprite>(null);
  const onAt = useRef(-1);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.copy(rig.to);
    return o;
  }, [rig]);
  const beam = useMemo(() => {
    const len = rig.from.distanceTo(rig.to);
    const geo = new THREE.ConeGeometry(Math.tan(rig.angle) * len, len, 40, 1, true);
    geo.scale(1, 1 / len, 1); // altezza normalizzata per lo shader
    const mid = rig.from.clone().add(rig.to).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      rig.from.clone().sub(rig.to).normalize(),
    );
    return { geo, mid, quat, len, mat: beamMaterial() };
  }, [rig]);

  useFrame(() => {
    if (!light.current || !halo.current) return;
    const ready = rig === CENTER ? clock.done : clock.progress >= rig.at;
    if (ready && onAt.current < 0) onAt.current = clock.t;
    const f = onAt.current < 0 ? 0 : flicker(clock.t - onAt.current);
    light.current.intensity = rig.intensity * f;
    beam.mat.uniforms.uOn.value = f;
    (halo.current.material as THREE.SpriteMaterial).opacity = f * 0.9;
  });

  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={light}
        position={rig.from}
        target={target}
        angle={rig.angle}
        penumbra={0.55}
        decay={0}
        intensity={0}
        color="#fff1dc"
      />
      <mesh geometry={beam.geo} material={beam.mat} position={beam.mid} quaternion={beam.quat} scale={[1, beam.len, 1]} />
      <mesh position={rig.from}>
        <cylinderGeometry args={[0.35, 0.45, 0.5, 16]} />
        <meshStandardMaterial color="#141218" metalness={0.6} roughness={0.4} />
      </mesh>
      <sprite ref={halo} position={rig.from.clone().addScaledVector(rig.to.clone().sub(rig.from).normalize(), 0.4)} scale={2.4}>
        <spriteMaterial map={glow} color="#fff0d8" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </>
  );
}

/** Tribune appena accennate nel buio */
function Stands() {
  const tiers = useMemo(() => {
    const out: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    for (let k = 0; k < 4; k++) {
      const off = 1.2 + k * 1.1;
      const y = 0.25 + k * 0.55;
      out.push({ pos: [0, y, -(FLOOR_W / 2 + off)], size: [FLOOR_L + 4 + k * 2, 0.5 + k * 1.1, 1.1] });
      out.push({ pos: [0, y, FLOOR_W / 2 + off], size: [FLOOR_L + 4 + k * 2, 0.5 + k * 1.1, 1.1] });
      out.push({ pos: [-(FLOOR_L / 2 + off), y, 0], size: [1.1, 0.5 + k * 1.1, FLOOR_W + k * 2] });
      out.push({ pos: [FLOOR_L / 2 + off, y, 0], size: [1.1, 0.5 + k * 1.1, FLOOR_W + k * 2] });
    }
    return out;
  }, []);
  return (
    <>
      {tiers.map((t, i) => (
        <mesh key={i} position={t.pos}>
          <boxGeometry args={t.size} />
          <meshStandardMaterial color="#2a0a0d" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

function ArenaLuciScene() {
  const clock = useLoaderClock();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const logo = useLogoTexture();
  const glow = useMemo(createGlowTexture, []);
  const court = useMemo(
    // senza stemma: nel parquet (64 px/m) verrebbe solo ~250 px, lo appoggiamo sopra a parte
    () => createCourtTexture(null, Math.min(8, gl.capabilities.getMaxAnisotropy())),
    [gl],
  );
  const tmp = useMemo(() => ({ start: new THREE.Vector3(), pos: new THREE.Vector3(), end: new THREE.Vector3() }), []);
  const startAngle = useRef<number | null>(null);

  useFrame(() => {
    const { t, outro } = clock;
    const aspect = size.width / size.height;
    const portrait = aspect < 0.9;
    const fov = portrait ? 58 : 40;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // panoramica lenta dall'alto della tribuna
    const R = fitDistance(19, 24, aspect, fov) * (portrait ? 0.62 : 1);
    const a = -0.45 + t * 0.035;
    const drop = easeOutCubic(seg(t, 0, 2.5));
    tmp.start.set(Math.sin(a) * R, 15 - drop * 3, Math.cos(a) * R);

    if (!clock.done) {
      camera.position.copy(tmp.start);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (startAngle.current === null) startAngle.current = a;

    // finale: si scende in verticale sullo stemma e ci si passa dentro
    const sa = startAngle.current;
    tmp.start.set(Math.sin(sa) * R, 12, Math.cos(sa) * R);
    const k = easeInOutCubic(seg(outro, 0.15, 0.8));
    tmp.end.set(0, portrait ? 7.5 : 5.5, 0.9);
    tmp.pos.lerpVectors(tmp.start, tmp.end, k);
    const dive = easeInCubic(seg(outro, 0.78, 1));
    tmp.pos.lerp(new THREE.Vector3(0, 1.8, 0.3), dive);
    camera.position.copy(tmp.pos);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#050103', 28, 60]} />
      <ambientLight intensity={0.05} color="#ffcfb0" />
      <hemisphereLight args={['#3a1418', '#000000', 0.15]} />

      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[FLOOR_L, FLOOR_W]} />
        <meshStandardMaterial map={court} roughness={0.42} metalness={0.05} />
      </mesh>
      {/* stemma del cerchio centrale, con la sua texture in alta risoluzione */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, -0.05]}>
        <planeGeometry args={[3.9, 3.9]} />
        <meshStandardMaterial map={logo} transparent depthWrite={false} roughness={0.42} metalness={0.05} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#120507" roughness={0.9} />
      </mesh>
      <Stands />

      {RIGS.map((r, i) => (
        <Spot key={i} rig={r} glow={glow} />
      ))}
      <Spot rig={CENTER} glow={glow} />
    </>
  );
}

export default function ArenaLuciLoader(props: LoaderProps) {
  return (
    <LoaderShell {...props} minMs={1800} outroMs={2600} background="radial-gradient(120% 90% at 50% 30%, #1a0306 0%, #050103 70%)">
      <ArenaLuciScene />
    </LoaderShell>
  );
}

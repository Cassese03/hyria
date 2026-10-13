import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RIM_R, createBallTexture, createGlowTexture } from '../arena/textures';
import {
  LoaderShell,
  LogoSlab,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  fitDistance,
  seg,
  useLoaderClock,
  type LoaderProps,
} from './shared';

/* Idea 1 — "Swish": il pallone gira sul ferro finché il sito carica,
   poi entra pulito e dal canestro esce lo stemma. */

const MAROON = '#5e0303';
const ORANGE = '#d96c00';
const BALL_R = 0.12;
const ORBIT_Y = 0.13; // il pallone appoggiato sul ferro
const INTRO = 0.9; // secondi del tiro iniziale
const BOARD_Z = -0.405;
const LOGO_TO = new THREE.Vector3(0, 0.42, 0.55);

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

/** Cronometro dei 24": scende da 24 a 0 insieme al caricamento */
function useShotClock() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 160;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const draw = (n: number) => {
      ctx.fillStyle = '#07060a';
      ctx.fillRect(0, 0, 256, 160);
      ctx.fillStyle = n === 0 ? '#ff3b1f' : '#ff8a1f';
      ctx.font = '900 118px Montserrat, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(n), 128, 86);
      tex.needsUpdate = true;
    };
    draw(24);
    return { tex, draw };
  }, []);
}

function Hoop({ clockTex }: { clockTex: THREE.Texture }) {
  const white = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f4f1ec', roughness: 0.5 }), []);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1b1a1f', metalness: 0.6, roughness: 0.4 }), []);
  return (
    <group>
      {/* tabellone in cristallo */}
      <mesh position={[0, 0.375, BOARD_Z]}>
        <boxGeometry args={[1.8, 1.05, 0.03]} />
        <meshStandardMaterial color="#cfe3ff" transparent opacity={0.14} roughness={0.05} depthWrite={false} />
      </mesh>
      {[0.9, -0.15].map((y) => (
        <mesh key={y} position={[0, y, BOARD_Z + 0.02]} material={white}>
          <boxGeometry args={[1.8, 0.05, 0.02]} />
        </mesh>
      ))}
      {[0.875, -0.875].map((x) => (
        <mesh key={x} position={[x, 0.375, BOARD_Z + 0.02]} material={white}>
          <boxGeometry args={[0.05, 1.05, 0.02]} />
        </mesh>
      ))}
      {/* quadrato di tiro */}
      {[0, 0.45].map((y) => (
        <mesh key={y} position={[0, y, BOARD_Z + 0.02]} material={white}>
          <boxGeometry args={[0.59, 0.05, 0.01]} />
        </mesh>
      ))}
      {[0.27, -0.27].map((x) => (
        <mesh key={x} position={[x, 0.225, BOARD_Z + 0.02]} material={white}>
          <boxGeometry args={[0.05, 0.45, 0.01]} />
        </mesh>
      ))}
      <mesh position={[0, -0.19, BOARD_Z]}>
        <boxGeometry args={[1.84, 0.12, 0.1]} />
        <meshStandardMaterial color={MAROON} roughness={0.7} />
      </mesh>
      {/* braccio e struttura dietro */}
      <mesh position={[0, 0.375, BOARD_Z - 0.35]} material={steel}>
        <boxGeometry args={[0.18, 0.18, 0.7]} />
      </mesh>
      <mesh position={[0, 1.6, BOARD_Z - 0.7]} material={steel}>
        <boxGeometry args={[0.22, 3, 0.22]} />
      </mesh>
      {/* cronometro */}
      <mesh position={[0, 1.07, BOARD_Z - 0.02]}>
        <boxGeometry args={[0.62, 0.36, 0.2]} />
        <meshStandardMaterial color="#0d0c10" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.07, BOARD_Z + 0.085]}>
        <planeGeometry args={[0.56, 0.31]} />
        <meshBasicMaterial map={clockTex} toneMapped={false} />
      </mesh>
      {/* ferro */}
      <mesh position={[0, -0.02, BOARD_Z + 0.08]}>
        <boxGeometry args={[0.14, 0.04, 0.16]} />
        <meshStandardMaterial color={ORANGE} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[RIM_R, 0.012, 12, 64]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.45} metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Luci sfocate del palazzetto sullo sfondo */
function Bokeh() {
  const glow = useMemo(createGlowTexture, []);
  const spots = useMemo(() => {
    let s = 11;
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    return Array.from({ length: 18 }, () => ({
      pos: [(r() - 0.5) * 16, (r() - 0.3) * 7, -6 - r() * 6] as [number, number, number],
      scale: 0.8 + r() * 1.8,
      color: r() > 0.6 ? '#ff9a3c' : '#ffe2c0',
      phase: r() * Math.PI * 2,
    }));
  }, []);
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const clock = useLoaderClock();

  useFrame(() => {
    refs.current.forEach((sp, i) => {
      if (!sp) return;
      const m = sp.material as THREE.SpriteMaterial;
      m.opacity = (0.18 + 0.1 * Math.sin(clock.t * 0.8 + spots[i].phase)) * (1 - clock.outro * 0.5);
    });
  });

  return (
    <>
      {spots.map((s, i) => (
        <sprite key={i} ref={(el) => void (refs.current[i] = el)} position={s.pos} scale={s.scale}>
          <spriteMaterial map={glow} color={s.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

function SwishScene() {
  const clock = useLoaderClock();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  const ball = useRef<THREE.Mesh>(null);
  const net = useRef<THREE.Group>(null);
  const logo = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.PointLight>(null);
  const halo = useRef<THREE.Sprite>(null);

  const ballMap = useMemo(createBallTexture, []);
  const glow = useMemo(createGlowTexture, []);
  const netGeo = useMemo(netGeometry, []);
  const shotClock = useShotClock();
  const shownSec = useRef(24);

  const intro = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.9, -1.4, 1.3),
        new THREE.Vector3(-0.9, 1.5, 0.6),
        new THREE.Vector3(-RIM_R, ORBIT_Y, 0),
      ),
    [],
  );
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), look: new THREE.Vector3(), cam: new THREE.Vector3() }), []);
  const theta = useRef(Math.PI);
  const speed = useRef(0);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const { t, outro, progress } = clock;
    const b = ball.current;
    const n = net.current;
    const lg = logo.current;
    if (!b || !n || !lg || !ring.current || !flash.current || !halo.current) return;

    // cronometro dei 24"
    const sec = clock.done ? 0 : Math.max(1, Math.ceil(24 * (1 - progress)));
    if (sec !== shownSec.current) {
      shownSec.current = sec;
      shotClock.draw(sec);
    }

    // pallone: tiro iniziale → giri sul ferro → entra → cade nella retina
    const p = tmp.p;
    if (t < INTRO) {
      intro.getPoint(easeOutCubic(t / INTRO), p);
      b.rotation.z = -t * 12;
    } else {
      speed.current = THREE.MathUtils.damp(speed.current, clock.done ? 7 : 4.6, 3, dt);
      theta.current -= speed.current * dt;
      const spiral = easeInCubic(seg(outro, 0, 0.16));
      const r = RIM_R * (1 - spiral);
      p.set(Math.cos(theta.current) * r, ORBIT_Y - spiral * 0.12 + Math.sin(t * 9) * 0.006 * (1 - spiral), Math.sin(theta.current) * r);
      const drop = seg(outro, 0.16, 0.42);
      p.y -= drop * drop * 2.6;
      // rotola lungo il ferro
      b.rotation.set(0, -theta.current, 0);
      b.rotateZ(theta.current * (RIM_R / BALL_R));
    }
    b.position.copy(p);
    b.visible = outro < 0.42;

    // la retina si allunga al passaggio del pallone
    const k = Math.sin(Math.PI * seg(outro, 0.14, 0.4));
    n.scale.set(1 - k * 0.14, 1 + k * 0.45, 1 - k * 0.14);
    n.rotation.y = k * 0.3 + Math.sin(t * 2) * 0.02;

    // lo stemma esce dal canestro
    const lk = seg(outro, 0.2, 0.62);
    lg.visible = lk > 0;
    lg.scale.setScalar(Math.max(0.001, easeOutBack(lk)));
    lg.position.set(0, THREE.MathUtils.lerp(-0.1, LOGO_TO.y, easeOutCubic(lk)), THREE.MathUtils.lerp(0, LOGO_TO.z, easeOutCubic(lk)));
    lg.rotation.y = (1 - easeOutCubic(lk)) * Math.PI * 2 + Math.sin(t * 1.2) * 0.06 * lk;

    // onda d'urto arancio dal ferro
    const rk = seg(outro, 0.16, 0.55);
    ring.current.visible = rk > 0 && rk < 1;
    ring.current.scale.setScalar(1 + easeOutCubic(rk) * 9);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - rk) * 0.9;
    flash.current.intensity = Math.sin(Math.PI * seg(outro, 0.16, 0.6)) * 6;
    (halo.current.material as THREE.SpriteMaterial).opacity = easeOutCubic(lk) * 0.55;

    // camera: entra dal basso, poi si avvicina allo stemma
    const aspect = size.width / size.height;
    const dist = fitDistance(2.5, 2.1, aspect);
    const intro01 = easeOutCubic(seg(t, 0, 1.4));
    const push = easeInOutCubic(seg(outro, 0.3, 1));
    tmp.cam.set(Math.sin(t * 0.4) * 0.1 * (1 - push), 0.15 + intro01 * 0.38, dist * (1.25 - intro01 * 0.25));
    tmp.cam.lerp(new THREE.Vector3(0, LOGO_TO.y + 0.05, LOGO_TO.z + dist * 0.62), push);
    tmp.look.set(0, 0.12, 0).lerp(LOGO_TO, push);
    camera.position.copy(tmp.cam);
    camera.lookAt(tmp.look);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight position={[0.6, 4, 3]} angle={0.45} penumbra={0.8} intensity={4} decay={0} color="#ffe6c8" />
      <directionalLight position={[-3, 2, 4]} intensity={0.8} color="#ffd2a8" />
      <pointLight position={[0, -1.2, -1]} intensity={1.4} decay={0} color={ORANGE} />
      <pointLight ref={flash} position={[0, 0.3, 0.8]} intensity={0} decay={0} color="#ff8a1f" />

      <Bokeh />
      <Hoop clockTex={shotClock.tex} />

      <group ref={net}>
        <lineSegments geometry={netGeo}>
          <lineBasicMaterial color="#f2efe9" transparent opacity={0.9} />
        </lineSegments>
      </group>

      <mesh ref={ball}>
        <sphereGeometry args={[BALL_R, 40, 20]} />
        <meshStandardMaterial map={ballMap} roughness={0.75} />
      </mesh>

      <mesh ref={ring} rotation-x={Math.PI / 2} visible={false}>
        <torusGeometry args={[RIM_R, 0.006, 8, 96]} />
        <meshBasicMaterial color="#ff8a1f" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <sprite ref={halo} position={[LOGO_TO.x, LOGO_TO.y, LOGO_TO.z - 0.3]} scale={2.6}>
        <spriteMaterial map={glow} color="#ff7a1a" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      <group ref={logo} visible={false}>
        <LogoSlab size={1.15} depth={0.06} layers={12} />
      </group>
    </>
  );
}

export default function SwishLoader(props: LoaderProps) {
  return (
    <LoaderShell {...props} minMs={1500} outroMs={2000}>
      <SwishScene />
    </LoaderShell>
  );
}

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS, arena, subscribeArena } from './store';
import { ArenaWorld, ShotBall } from './world';

/* ─── Camera guidata dallo scroll ────────────────────────────────────────── */

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function CameraRig({ reduced, desktop, introAt }: { reduced: boolean; desktop: boolean; introAt: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  const portrait = size.width < size.height * 0.9;

  const curves = useMemo(() => {
    const pos = STATIONS.map((st) => new THREE.Vector3(...((portrait && st.mPos) || st.pos)));
    const look = STATIONS.map((st) => new THREE.Vector3(...((portrait && st.mLook) || st.look)));
    return {
      pos: new THREE.CatmullRomCurve3(pos, false, 'centripetal'),
      look: new THREE.CatmullRomCurve3(look, false, 'centripetal'),
    };
  }, [portrait]);

  const state = useRef({ intro: reduced || arena.s > 0.05 ? 1 : 0, introStart: -1 });
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3(), right: new THREE.Vector3() }), []);

  useEffect(() => subscribeArena(invalidate), [invalidate]);

  useEffect(() => {
    const wait = Math.max(0, introAt - performance.now());
    const id = window.setTimeout(() => invalidate(), wait + 16);
    return () => window.clearTimeout(id);
  }, [introAt, invalidate]);

  useEffect(() => {
    if (!desktop || reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [desktop, reduced, invalidate]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    let busy = false;

    // tragitto: con "riduci movimento" la camera salta di tappa in tappa
    const target = reduced ? Math.round(arena.s) : arena.s;
    if (reduced) arena.cam = target;
    else {
      arena.cam = THREE.MathUtils.damp(arena.cam, target, 3.2, dt);
      if (Math.abs(arena.cam - target) > 1e-4) busy = true;
      else arena.cam = target;
    }
    const t = THREE.MathUtils.clamp(arena.cam / (STATIONS.length - 1), 0, 1);
    curves.pos.getPoint(t, tmp.pos);
    curves.look.getPoint(t, tmp.look);

    // ingresso: la camera scende dall'alto della tribuna fino al centrocampo
    const st = state.current;
    if (st.intro < 1) {
      const now = performance.now();
      if (now >= introAt) {
        if (st.introStart < 0) st.introStart = now;
        st.intro = Math.min(1, (now - st.introStart) / 2600);
      }
      const k = 1 - ease(st.intro);
      tmp.pos.add(new THREE.Vector3(4 * k, 3.5 * k, 8 * k));
      busy = true;
    }

    // leggera parallasse col mouse
    if (desktop && !reduced) {
      const pt = pointer.current;
      pt.sx = THREE.MathUtils.damp(pt.sx, pt.x, 4, dt);
      pt.sy = THREE.MathUtils.damp(pt.sy, pt.y, 4, dt);
      tmp.right.subVectors(tmp.look, tmp.pos).cross(camera.up).normalize();
      tmp.pos.addScaledVector(tmp.right, pt.sx * 0.35);
      tmp.pos.y -= pt.sy * 0.2;
      if (Math.abs(pt.sx - pt.x) > 1e-3 || Math.abs(pt.sy - pt.y) > 1e-3) busy = true;
    }

    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.look);
    const fov = portrait ? 60 : 42;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    if (busy) invalidate();
  });

  return null;
}


/* ─── Scena della Home ───────────────────────────────────────────────────── */

interface SceneProps {
  mobile: boolean;
  reduced: boolean;
  introAt: number;
  onReady: () => void;
}

export default function ArenaScene({ mobile, reduced, introAt, onReady }: SceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 20, 24] }}
    >
      <Suspense fallback={null}>
        <ArenaWorld mobile={mobile} reduced={reduced} tour onReady={onReady}>
          <ShotBall reduced={reduced} />
          <CameraRig reduced={reduced} desktop={!mobile} introAt={introAt} />
        </ArenaWorld>
      </Suspense>
    </Canvas>
  );
}

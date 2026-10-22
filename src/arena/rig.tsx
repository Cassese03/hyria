import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Station, Track } from './store';

/* ─── Camera guidata dallo scroll ────────────────────────────────────────── */

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

interface RigProps {
  stations: Station[];
  track: Track;
  reduced: boolean;
  desktop: boolean;
  introAt: number;
}

export function CameraRig({ stations, track, reduced, desktop, introAt }: RigProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  const portrait = size.width < size.height * 0.9;
  const tr = track.state;

  const curves = useMemo(() => {
    const pos = stations.map((st) => new THREE.Vector3(...((portrait && st.mPos) || st.pos)));
    const look = stations.map((st) => new THREE.Vector3(...((portrait && st.mLook) || st.look)));
    return {
      pos: new THREE.CatmullRomCurve3(pos, false, 'centripetal'),
      look: new THREE.CatmullRomCurve3(look, false, 'centripetal'),
    };
  }, [stations, portrait]);

  const state = useRef({ intro: reduced || tr.s > 0.05 ? 1 : 0, introStart: -1 });
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3(), right: new THREE.Vector3() }), []);

  useEffect(() => track.subscribe(invalidate), [track, invalidate]);

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
    const target = reduced ? Math.round(tr.s) : tr.s;
    if (reduced) {
      // salto di tappa: un frame in più, così chi legge `cam` (es. gli stendardi) si aggiorna
      if (tr.cam !== target) busy = true;
      tr.cam = target;
    } else {
      tr.cam = THREE.MathUtils.damp(tr.cam, target, 3.2, dt);
      if (Math.abs(tr.cam - target) > 1e-4) busy = true;
      else tr.cam = target;
    }
    const t = stations.length > 1 ? THREE.MathUtils.clamp(tr.cam / (stations.length - 1), 0, 1) : 0;
    curves.pos.getPoint(t, tmp.pos);
    curves.look.getPoint(t, tmp.look);

    // ingresso: la camera scende dall'alto della tribuna fino alla prima tappa
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

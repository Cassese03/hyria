import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { STATIONS, homeTrack } from './store';
import { CameraRig } from './rig';
import { ArenaWorld, ShotBall } from './world';

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
          <CameraRig stations={STATIONS} track={homeTrack} reduced={reduced} desktop={!mobile} introAt={introAt} />
        </ArenaWorld>
      </Suspense>
    </Canvas>
  );
}

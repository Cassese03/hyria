import { Suspense, use, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { loadBoardItems, type Sponsor } from './assets';
import { SHOTS, type HeroShot, type ShotName } from './shots';
import type { JumboContent } from './textures';
import { AdBoards, ArenaWorld, MiniHoop } from './world';
import { HistoryBanners } from './history';
import type { HistoryBanner } from '../storia/track';

/* ─── Camera fissa con ingresso e parallasse ─────────────────────────────── */

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function HeroCamera({ shot, reduced, desktop, introAt }: { shot: ShotName | HeroShot; reduced: boolean; desktop: boolean; introAt: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  const portrait = size.width < size.height * 0.9;

  const { pos, look } = useMemo(() => {
    const s: HeroShot = typeof shot === 'string' ? SHOTS[shot] : shot;
    return {
      pos: new THREE.Vector3(...((portrait && s.mPos) || s.pos)),
      look: new THREE.Vector3(...((portrait && s.mLook) || s.look)),
    };
  }, [shot, portrait]);

  const intro = useRef({ start: -1, t: reduced ? 1 : 0 });
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), dir: new THREE.Vector3(), right: new THREE.Vector3() }), []);

  useEffect(() => {
    const id = window.setTimeout(() => invalidate(), Math.max(0, introAt - performance.now()) + 16);
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
    tmp.pos.copy(pos);
    tmp.dir.subVectors(look, pos).normalize();
    tmp.right.crossVectors(tmp.dir, camera.up).normalize();

    // ingresso: un passo indietro e poi la camera avanza sull'inquadratura
    const it = intro.current;
    if (it.t < 1) {
      const now = performance.now();
      if (now >= introAt) {
        if (it.start < 0) it.start = now;
        it.t = Math.min(1, (now - it.start) / 2200);
      }
      const k = 1 - ease(it.t);
      tmp.pos.addScaledVector(tmp.dir, -3.2 * k).addScaledVector(tmp.right, 1.2 * k);
      tmp.pos.y += 0.5 * k;
      busy = true;
    }

    if (desktop && !reduced) {
      const pt = pointer.current;
      pt.sx = THREE.MathUtils.damp(pt.sx, pt.x, 4, dt);
      pt.sy = THREE.MathUtils.damp(pt.sy, pt.y, 4, dt);
      tmp.pos.addScaledVector(tmp.right, pt.sx * 0.3);
      tmp.pos.y -= pt.sy * 0.15;
      if (Math.abs(pt.sx - pt.x) > 1e-3 || Math.abs(pt.sy - pt.y) > 1e-3) busy = true;
    }

    camera.position.copy(tmp.pos);
    camera.lookAt(look);
    const fov = portrait ? 60 : 42;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    if (busy) invalidate();
  });

  return null;
}

function Boards({ sponsors, animate }: { sponsors: Sponsor[]; animate: boolean }) {
  const items = use(loadBoardItems(sponsors));
  return <AdBoards items={items} animate={animate} />;
}

/* ─── Scena dell'intestazione ────────────────────────────────────────────── */

export interface ArenaHeroProps {
  /** inquadratura con nome (shots.ts) o calcolata dalla pagina: in quel caso deve restare stabile */
  shot: ShotName | HeroShot;
  floorTitle: string;
  boards?: Sponsor[];
  /** contenuto del tabellone centrale */
  jumbo?: JumboContent;
  /** testo della striscia LED del tavolo ufficiali */
  ledText?: string;
  /** canestro minibasket con pallone che rimbalza */
  miniHoop?: [number, number, number];
  /** stendardi dell'archivio storico al posto della galleria, con quello acceso */
  history?: { banners: HistoryBanner[]; active: number };
  mobile: boolean;
  reduced: boolean;
  introAt: number;
  /** false quando l'intestazione è fuori schermo: si smette di disegnare */
  active: boolean;
  onReady: () => void;
}

export default function ArenaHero(props: ArenaHeroProps) {
  const { shot, floorTitle, boards, jumbo, ledText, miniHoop, history, mobile, reduced, introAt, active, onReady } = props;
  // cartelloni e pallone si muovono di continuo; il resto si ridisegna solo quando serve
  const moving = (boards || miniHoop) && !reduced;
  const frameloop = !active ? 'never' : moving ? 'always' : 'demand';
  return (
    <Canvas
      frameloop={frameloop}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 8, 12] }}
    >
      <Suspense fallback={null}>
        <ArenaWorld
          mobile={mobile}
          reduced={reduced}
          tour={false}
          title={floorTitle}
          jumbo={jumbo}
          ledText={ledText}
          banners={history && <HistoryBanners banners={history.banners} active={history.active} />}
          onReady={onReady}
        >
          {boards && <Boards sponsors={boards} animate={!reduced} />}
          {miniHoop && <MiniHoop position={miniHoop} animate={!reduced} />}
          <HeroCamera shot={shot} reduced={reduced} desktop={!mobile} introAt={introAt} />
        </ArenaWorld>
      </Suspense>
    </Canvas>
  );
}

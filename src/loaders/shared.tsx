import { Suspense, createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { canUseWebGL } from '../arena/shots';
import LoadingPage from '../components/LoadingPage';
import '../styles/loaders.css';

/* ─── Orologio condiviso: le scene leggono da qui avanzamento e finale ───── */

export interface LoaderClock {
  t: number; // secondi da quando la scena è pronta
  progress: number; // 0..1, quello mostrato nella barra
  done: boolean; // caricamento concluso, parte il finale
  outro: number; // 0..1 avanzamento dell'animazione finale
  ready: boolean;
  reduced: boolean;
}

const ClockContext = createContext<LoaderClock | null>(null);

export const useLoaderClock = () => {
  const clock = useContext(ClockContext);
  if (!clock) throw new Error('useLoaderClock fuori da LoaderShell');
  return clock;
};

export interface LoaderProps {
  isLoading: boolean;
  onAnimationEnd?: () => void;
}

/* ─── Utilità di animazione ──────────────────────────────────────────────── */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Avanzamento 0..1 di `v` dentro l'intervallo [a, b] */
export const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/** Distanza della camera perché una larghezza `w` stia nello schermo anche in verticale */
export const fitDistance = (base: number, w: number, aspect: number, fov = 40) =>
  Math.max(base, w / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect));

/* ─── Stemma in 3D ───────────────────────────────────────────────────────── */

// versione 2000×2000: quella da 500 px si sgranava a tutto schermo
export const LOGO_SRC = '/images/bestQualita.png';

export function useLogoTexture() {
  const tex = useTexture(LOGO_SRC);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  if (tex.colorSpace !== THREE.SRGBColorSpace) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(16, maxAniso);
    tex.needsUpdate = true;
  }
  return tex;
}

interface LogoSlabProps {
  size?: number;
  depth?: number;
  layers?: number;
  edge?: string;
  glow?: number;
}

/** Lo stemma con spessore: tanti strati ritagliati sull'alpha del PNG, come una medaglia.
    alphaToCoverage passa il ritaglio all'antialiasing, così i bordi non vengono a scalini. */
export function LogoSlab({ size = 2, depth = 0.12, layers = 14, edge = '#4a0b06', glow = 0.22 }: LogoSlabProps) {
  const tex = useLogoTexture();
  const geo = useMemo(() => new THREE.PlaneGeometry(size, size), [size]);
  const mats = useMemo(
    () => ({
      face: new THREE.MeshStandardMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: glow,
        alphaTest: 0.5,
        alphaToCoverage: true,
        roughness: 0.42,
        metalness: 0.15,
      }),
      edge: new THREE.MeshStandardMaterial({
        map: tex,
        color: edge,
        alphaTest: 0.5,
        alphaToCoverage: true,
        roughness: 0.35,
        metalness: 0.7,
        side: THREE.DoubleSide,
      }),
    }),
    [tex, edge, glow],
  );

  return (
    <group>
      {Array.from({ length: layers }, (_, i) => (
        <mesh key={i} geometry={geo} material={mats.edge} position-z={-depth / 2 + (depth * i) / (layers - 1)} />
      ))}
      <mesh geometry={geo} material={mats.face} position-z={depth / 2 + 0.002} />
    </group>
  );
}

/* ─── Guscio comune: canvas, barra, uscita ───────────────────────────────── */

interface Hud {
  root: HTMLDivElement | null;
  pct: HTMLSpanElement | null;
  bar: HTMLSpanElement | null;
}

/** oltre questo tempo reale il loader esce comunque */
const MAX_WAIT_S = 4;

function Driver({
  clock,
  loading,
  minS,
  outroS,
  hud,
  onOutroEnd,
}: {
  clock: LoaderClock;
  loading: { current: boolean };
  minS: number;
  outroS: number;
  hud: { current: Hud };
  onOutroEnd: () => void;
}) {
  const outroStart = useRef(-1);
  const startedAt = useRef(0);
  const ended = useRef(false);
  const shown = useRef(-1);

  useFrame((_, raw) => {
    if (!clock.ready) return;
    const dt = Math.min(raw, 0.05);
    clock.t += dt;
    // tempo reale: su dispositivi lenti dt è limitato e clock.t rallenta, il loader non deve restare a oltranza
    const now = performance.now();
    if (!startedAt.current) startedAt.current = now;
    const overdue = (now - startedAt.current) / 1000 > MAX_WAIT_S;

    if (!overdue && (loading.current || clock.t < minS)) {
      // mentre carica la barra si avvicina al 90% senza mai arrivarci
      const target = 0.9 * (1 - Math.exp(-clock.t / 1.4));
      clock.progress = THREE.MathUtils.damp(clock.progress, target, 4, dt);
    } else if (!clock.done) {
      clock.progress = THREE.MathUtils.damp(clock.progress, 1, 7, dt);
      if (clock.progress > 0.995) {
        clock.progress = 1;
        clock.done = true;
        outroStart.current = now;
      }
    } else {
      clock.outro = Math.min(1, (now - outroStart.current) / 1000 / outroS);
      if (clock.outro >= 1 && !ended.current) {
        ended.current = true;
        onOutroEnd();
      }
    }

    const h = hud.current;
    const pct = Math.round(clock.progress * 100);
    if (pct !== shown.current && h.pct && h.bar) {
      shown.current = pct;
      h.pct.textContent = String(pct).padStart(2, '0');
      h.bar.style.transform = `scaleX(${clock.progress})`;
    }
    if (clock.done && h.root && !h.root.dataset.done) h.root.dataset.done = 'true';
  });

  return null;
}

function Ready({ clock }: { clock: LoaderClock }) {
  useEffect(() => {
    clock.ready = true;
  }, [clock]);
  return null;
}

interface ShellProps extends LoaderProps {
  /** durata minima prima che possa partire il finale */
  minMs?: number;
  /** durata dell'animazione finale */
  outroMs: number;
  background?: string;
  children: ReactNode;
}

export function LoaderShell({ isLoading, onAnimationEnd, minMs = 1500, outroMs, background, children }: ShellProps) {
  const [webgl] = useState(canUseWebGL);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);
  const loading = useRef(isLoading);
  const hud = useRef<Hud>({ root: null, pct: null, bar: null });
  const endCb = useRef(onAnimationEnd);
  const clock = useMemo<LoaderClock>(
    () => ({
      t: 0,
      progress: 0,
      done: false,
      outro: 0,
      ready: false,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    }),
    [],
  );

  useEffect(() => {
    loading.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    endCb.current = onAnimationEnd;
  }, [onAnimationEnd]);

  useEffect(() => {
    if (!fading) return;
    const id = window.setTimeout(() => {
      setVisible(false);
      endCb.current?.();
    }, 350);
    return () => window.clearTimeout(id);
  }, [fading]);

  if (!webgl) return <LoadingPage isLoading={isLoading} onAnimationEnd={onAnimationEnd} />;
  if (!visible) return null;

  const outroS = (clock.reduced ? outroMs * 0.5 : outroMs) / 1000;

  return (
    <div className={`hl-loader${fading ? ' is-fading' : ''}`} style={background ? { background } : undefined}>
      <Canvas
        className="hl-loader__canvas"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 40, near: 0.05, far: 200, position: [0, 0, 6] }}
      >
        <ClockContext.Provider value={clock}>
          <Driver
            clock={clock}
            loading={loading}
            minS={minMs / 1000}
            outroS={outroS}
            hud={hud}
            onOutroEnd={() => setFading(true)}
          />
          <Suspense fallback={null}>
            {children}
            <Ready clock={clock} />
          </Suspense>
        </ClockContext.Provider>
      </Canvas>

      <div className="hl-loader__hud" ref={(el) => void (hud.current.root = el)} aria-hidden="true">
        <span className="hl-loader__brand">Hyria Basket · Nola</span>
        <span className="hl-loader__bar">
          <span ref={(el) => void (hud.current.bar = el)} />
        </span>
        <span className="hl-loader__pct">
          <span ref={(el) => void (hud.current.pct = el)}>00</span>%
        </span>
      </div>
      <span className="hl-sr" role="status">
        Caricamento in corso
      </span>
    </div>
  );
}

/* ─── Fascio di luce volumetrico (cono additivo) ─────────────────────────── */

/** Da usare su un ConeGeometry con altezza normalizzata a 1 (punta = lampada) */
export const beamMaterial = (color = '#ffe2bd', soft = 1.6) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOn: { value: 0 } },
    vertexShader: /* glsl */ `
      uniform float uOn;
      varying float vH;
      varying float vEdge;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vec3 n = normalize(mat3(modelMatrix) * normal);
        vec3 v = normalize(cameraPosition - wp.xyz);
        vEdge = pow(abs(dot(n, v)), ${soft.toFixed(2)});
        vH = position.y; // -0.5 alla base, 0.5 alla lampada
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOn;
      varying float vH;
      varying float vEdge;
      void main() {
        float fall = smoothstep(-0.5, 0.5, vH);
        gl_FragColor = vec4(uColor * vEdge * (0.04 + 0.16 * fall) * uOn, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

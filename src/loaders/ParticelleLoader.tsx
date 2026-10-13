import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlowTexture } from '../arena/textures';
import { isMobileDevice } from '../arena/shots';
import {
  LoaderShell,
  LogoSlab,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  fitDistance,
  seg,
  useLoaderClock,
  type LoaderProps,
} from './shared';

/* Idea 6 — "Stemma + particelle": lo stemma in 3D al centro, intorno
   migliaia di scintille che col caricamento si raccolgono in un pallone
   che gira alle sue spalle come un'aureola; alla fine esplodono verso di noi. */

const BALL_R = 1.45;
const BALL_Z = -0.6;

const vertexShader = /* glsl */ `
  attribute vec3 aStart;
  attribute float aDelay;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uProgress;
  uniform float uOutro;
  uniform float uSize;
  uniform float uPR;
  varying vec3 vColor;
  varying float vAlpha;

  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  void main() {
    float k = smoothstep(aDelay, aDelay + 0.18, uProgress);

    // nuvola sparsa che orbita lenta
    vec3 s = aStart;
    s.xz = rot(uTime * (0.12 + aSeed * 0.22)) * s.xz;
    s.y += sin(uTime * (0.6 + aSeed) + aSeed * 6.2831) * 0.25;

    // superficie del pallone che ruota, leggermente inclinato
    vec3 tg = position;
    tg.xz = rot(uTime * 0.8) * tg.xz;
    tg.yz = rot(0.35) * tg.yz;
    vec3 dir = normalize(tg);
    tg.z += ${BALL_Z.toFixed(2)};

    vec3 p = mix(s, tg, k);
    p += normalize(vec3(aSeed - 0.5, 0.4, 0.6)) * sin(k * 3.14159) * 0.7;

    // finale: esplosione verso l'esterno e verso la camera
    float o = uOutro * uOutro;
    p += (dir * 7.0 + vec3(0.0, 0.0, 6.0)) * o * (0.5 + aSeed);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float front = step(0.3, -mv.z);
    gl_PointSize = front * uSize * uPR * mix(0.7, 1.3, aSeed) * mix(0.75, 1.0, k) * (6.0 / max(-mv.z, 0.3));
    vColor = aColor;
    vAlpha = mix(0.35, 1.0, k) * (1.0 - smoothstep(0.55, 1.0, uOutro)) * front;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

function buildParticles(count: number) {
  let seed = 9;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const target = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const delay = new Float32Array(count);
  const seeds = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const body = new THREE.Color('#ff7414').multiplyScalar(0.7);
  const seamCol = new THREE.Color('#ffe7c8');
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const seam = rand() < 0.32;
    if (seam) {
      // le cuciture: due cerchi massimi e i due archi laterali
      const a = rand() * Math.PI * 2;
      const kind = Math.floor(rand() * 4);
      if (kind === 0) v.set(0, Math.cos(a), Math.sin(a));
      else if (kind === 1) v.set(Math.cos(a), 0, Math.sin(a));
      else {
        const x = kind === 2 ? 0.62 : -0.62;
        const r = Math.sqrt(1 - x * x);
        v.set(x, Math.cos(a) * r, Math.sin(a) * r);
      }
    } else {
      v.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1);
      if (v.lengthSq() < 1e-4) v.set(0, 1, 0);
      v.normalize();
    }
    v.multiplyScalar(BALL_R);
    target.set([v.x, v.y, v.z], i * 3);

    const r = 3.4 + rand() * 4;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(rand() * 2 - 1);
    start.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.6, r * Math.sin(ph) * Math.sin(th) - 1], i * 3);

    // prima le cuciture, così il disegno del pallone si legge subito
    delay[i] = seam ? rand() * 0.45 : 0.1 + rand() * 0.72;
    seeds[i] = rand();
    const c = seam ? seamCol : body;
    color.set([c.r, c.g, c.b], i * 3);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(target, 3));
  g.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  g.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  g.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);
  return g;
}

function ParticelleScene() {
  const clock = useLoaderClock();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const glow = useMemo(createGlowTexture, []);
  const geo = useMemo(() => buildParticles(isMobileDevice() ? 2200 : 4200), []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uOutro: { value: 0 },
          uSize: { value: 5 },
          uPR: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const logo = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const flash = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const { t, progress, outro } = clock;
    const lg = logo.current;
    if (!lg || !halo.current || !flash.current) return;

    mat.uniforms.uTime.value = t;
    mat.uniforms.uProgress.value = progress;
    mat.uniforms.uOutro.value = outro;
    mat.uniforms.uPR.value = dpr;

    // stemma: entra con un rimbalzo, ondeggia, al finale "batte" una volta
    const pulse = Math.sin(Math.PI * seg(outro, 0, 0.35)) * 0.12;
    lg.scale.setScalar(easeOutBack(seg(t, 0, 0.9)) * (1 + pulse));
    lg.rotation.y = Math.sin(t * 0.6) * 0.35 * (1 - easeInOutCubic(seg(outro, 0, 0.5)));
    lg.rotation.x = Math.sin(t * 0.45) * 0.06;
    lg.position.y = Math.sin(t * 0.9) * 0.05;

    (halo.current.material as THREE.SpriteMaterial).opacity = 0.12 + progress * 0.35 + Math.sin(Math.PI * seg(outro, 0, 0.5)) * 0.4;
    flash.current.intensity = Math.sin(Math.PI * seg(outro, 0, 0.4)) * 5;

    const aspect = size.width / size.height;
    const dist = fitDistance(7, 3.8, aspect);
    const push = easeInOutCubic(seg(outro, 0.25, 1));
    const intro = easeOutCubic(seg(t, 0, 1.6));
    camera.position.set(Math.sin(t * 0.3) * 0.25 * (1 - push), 0.1, dist * (1.15 - intro * 0.15) - push * dist * 0.45);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 5]} intensity={1.6} color="#ffe2c4" />
      <pointLight position={[0, 0, -2]} intensity={3} decay={0} color="#d96c00" />
      <pointLight ref={flash} position={[0, 0, 2]} intensity={0} decay={0} color="#ff9a3c" />

      <sprite ref={halo} position={[0, 0, BALL_Z - 0.4]} scale={6.5}>
        <spriteMaterial map={glow} color="#d96c00" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      <points geometry={geo} material={mat} />

      <group ref={logo} position-z={0.45}>
        <LogoSlab size={2.6} depth={0.16} layers={18} />
      </group>
    </>
  );
}

export default function ParticelleLoader(props: LoaderProps) {
  return (
    <LoaderShell {...props} minMs={1500} outroMs={1700}>
      <ParticelleScene />
    </LoaderShell>
  );
}

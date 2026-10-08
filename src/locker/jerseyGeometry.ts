import * as THREE from 'three';

/** Altezza della canotta in metri (dall'orlo alla spalla) e distanza spalla → asse del binario. */
export const JERSEY_H = 1.02;
export const HOOK_TO_SHOULDER = 0.105;
/** Distanza verticale tra asse binario e orlo inferiore della maglia appesa. */
export const HANG_LENGTH = JERSEY_H + HOOK_TO_SHOULDER;

const NU = 64; // suddivisioni attorno al busto (per metà pannello)
const NV = 84; // suddivisioni in altezza

type Knot = [number, number];

function profile(knots: Knot[], t: number) {
  if (t <= knots[0][0]) return knots[0][1];
  for (let i = 1; i < knots.length; i++) {
    if (t <= knots[i][0]) {
      const [t0, v0] = knots[i - 1];
      const [t1, v1] = knots[i];
      const k = (t - t0) / (t1 - t0);
      const e = (1 - Math.cos(k * Math.PI)) / 2;
      return v0 + (v1 - v0) * e;
    }
  }
  return knots[knots.length - 1][1];
}

/** Semi-larghezza della maglia ad altezza t. */
const WIDTH: Knot[] = [[0, 0.3], [0.2, 0.305], [0.4, 0.295], [0.62, 0.3], [0.8, 0.272], [0.9, 0.235], [1, 0.2]];
/** Semi-spessore (la maglia appesa è quasi piatta, con un leggero rigonfiamento). */
const DEPTH: Knot[] = [[0, 0.045], [0.2, 0.055], [0.4, 0.06], [0.62, 0.062], [0.8, 0.05], [0.92, 0.03], [1, 0.012]];

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/** Caduta della spalla verso la punta (le spalline scendono dal collo al giromanica). */
export const shoulderDrop = (t: number, absX: number) => 0.035 * smooth(0.8, 1, t) * Math.min(1, absX / 0.2);

/** Quota Y (origine all'orlo) del bordo superiore della spallina a distanza x dal centro. */
export const strapTopY = (absX: number) => JERSEY_H * 0.992 - shoulderDrop(0.992, absX);

/**
 * Canotta come tubo schiacciato: due pannelli (fronte/retro) che si incontrano ai fianchi.
 * Giromanica e scollo non sono geometria ma "buchi" nell'alpha della texture (stessa
 * parametrizzazione ortogonale s/t), per questo il mesh va usato con alphaTest.
 */
export function createJerseyGeometry() {
  const cols = NU + 1;
  const rows = NV + 1;
  const count = cols * rows * 2;
  const pos = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const index: number[] = [];

  let v = 0;
  for (const back of [false, true]) {
    const base = v;
    for (let j = 0; j < rows; j++) {
      const t = j / NV;
      const w = profile(WIDTH, t);
      const d = profile(DEPTH, t);
      for (let i = 0; i < cols; i++) {
        const theta = -Math.PI / 2 + (Math.PI * i) / NU;
        const s = Math.sin(theta);
        const dir = back ? -1 : 1;
        const x = dir * s * w;
        const folds = (0.0035 * Math.sin(s * 8.5 + t * 3.2) + 0.0022 * Math.sin(s * 19 - t * 6.1)) * (1 - smooth(0.7, 0.95, t)) * Math.cos(theta);
        const z = dir * (Math.cos(theta) * d + folds);
        const y = t * JERSEY_H - shoulderDrop(t, Math.abs(x));
        pos.set([x, y, z], v * 3);
        uv.set([(back ? 0.5 : 0) + (s + 1) / 4, t], v * 2);
        v++;
      }
    }
    for (let j = 0; j < NV; j++) {
      for (let i = 0; i < NU; i++) {
        const a = base + j * cols + i;
        const b = a + 1;
        const c = a + cols;
        const e = c + 1;
        index.push(a, b, c, b, e, c);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

export interface JerseyMaterials {
  outer: THREE.MeshStandardMaterial;
  inner: THREE.MeshStandardMaterial;
}

export function createJerseyMaterials(map: THREE.Texture, bump: THREE.Texture): JerseyMaterials {
  const shared = {
    map,
    bumpMap: bump,
    bumpScale: 0.9,
    roughness: 0.82,
    metalness: 0,
    alphaTest: 0.5,
    alphaToCoverage: true,
  } as const;
  // interno: tessuto a tinta unita (niente stampe specchiate), la texture serve solo per l'alpha
  const inner = new THREE.MeshStandardMaterial({ ...shared, bumpMap: null, side: THREE.BackSide });
  inner.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      '#include <map_fragment>\n\tdiffuseColor.rgb = vec3(0.075, 0.008, 0.012);',
    );
  };
  return {
    outer: new THREE.MeshStandardMaterial({ ...shared, side: THREE.FrontSide }),
    inner,
  };
}

/** Appendino cromato: la parte "swivel" (uncino) resta sul binario, il corpo ruota con la maglia. */
export function createHangerParts(chrome: THREE.Material) {
  const r = 0.0042;

  // spalle: V schiacciata che passa dentro le spalline
  const tipY = strapTopY(0.205) - 0.012;
  const midY = strapTopY(0.0) - 0.012;
  const shoulder = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.215, tipY - 0.006, 0),
      new THREE.Vector3(-0.205, tipY, 0),
      new THREE.Vector3(-0.1, (tipY + midY) / 2, 0),
      new THREE.Vector3(0, midY, 0),
      new THREE.Vector3(0.1, (tipY + midY) / 2, 0),
      new THREE.Vector3(0.205, tipY, 0),
      new THREE.Vector3(0.215, tipY - 0.006, 0),
    ],
    false,
    'catmullrom',
    0.2,
  );
  const body = new THREE.Group();
  body.add(new THREE.Mesh(new THREE.TubeGeometry(shoulder, 40, r, 8), chrome));

  // asta verticale dal centro delle spalle fino all'uncino
  const railY = JERSEY_H + HOOK_TO_SHOULDER;
  const loopR = 0.026;
  const stemTop = railY - loopR;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(r, r, stemTop - midY, 8), chrome);
  stem.position.y = (stemTop + midY) / 2;
  body.add(stem);

  // uncino a "?" che abbraccia il binario (piano ⟂ al binario)
  const hook = new THREE.Mesh(new THREE.TorusGeometry(loopR, r, 8, 28, Math.PI * 1.55), chrome);
  hook.rotation.set(0, Math.PI / 2, -Math.PI / 2);
  hook.position.y = railY;

  return { body, hook, railY };
}

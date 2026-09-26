// The hall: one open room after Lina Bo Bardi's glass easels (MASP, 1968).
// This module owns the canvas and the camera. All text, controls and labels are React (Hall.tsx);
// the engine only reports what the visitor is looking at and where they are.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Exhibit } from '@/content/hall';
import { AISLE, EYE, ROW, layout, planFrame } from './layout';
import { drawHomage, PAINTINGS } from './walls';

export type HallEvents = {
  hover: (id: string | null, x: number, y: number) => void;
  /** A walk to an easel has started, from a click on the canvas or from the page. */
  walk: (id: string) => void;
  /** The visitor started moving on their own: dragging, the keyboard, or a click on the floor. */
  roam: () => void;
  arrive: (id: string | null) => void;
  turned: (id: string, back: boolean) => void;
  pose: (x: number, z: number, yaw: number) => void;
  /** The first frame with the front row drawn is on screen: the poster can go. */
  ready: () => void;
  /** The opening step into the room has ended, or was skipped. */
  opened: () => void;
};

export type HallOptions = {
  rows: Exhibit[][];
  years: string[];
  font: string;
  reduced: boolean;
  /** Motion paused by the visitor: the room holds the opening view instead of stepping in. */
  paused: boolean;
  mobile: boolean;
  quality: 'high' | 'low';
  start?: string;
  on: HallEvents;
};

export type HallController = {
  walkTo: (id: string) => void;
  select: (id: string) => void;
  turn: () => void;
  entrance: () => void;
  setPaused: (paused: boolean) => void;
  /** 0–1 with the page scroll: the roof lifts off and the camera rises until it looks straight down on the plan. */
  crane: (p: number) => void;
  dispose: () => void;
};

type Pose = { pos: THREE.Vector3; look: THREE.Vector3 };
type Easel = {
  e: Exhibit;
  group: THREE.Group;
  art: THREE.Mesh;
  artMat: THREE.MeshStandardMaterial;
  backMat: THREE.MeshStandardMaterial;
  center: THREE.Vector3;
  top: number;
};
type Tween =
  | { kind: 'walk'; t0: number; dur: number; curve: THREE.CatmullRomCurve3; from: Pose; to: Pose }
  | { kind: 'turn'; t0: number; dur: number; easel: Easel; dir: 1 | -1 }
  | { kind: 'go'; t0: number; dur: number; from: Pose; to: Pose };

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeIO = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));

// ——— procedural textures ———
function noiseCanvas(size: number, paint: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  paint(c.getContext('2d')!);
  return c;
}
function concreteMaps() {
  const albedo = noiseCanvas(512, g => {
    g.fillStyle = '#b1aca2';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 26000; i++) {
      const v = 110 + Math.random() * 120;
      g.fillStyle = `rgba(${v},${v - 4},${v - 10},${Math.random() * 0.3})`;
      g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2.2, 1 + Math.random() * 2.2);
    }
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(70,66,60,${Math.random() * 0.35})`;
      g.beginPath();
      g.arc(Math.random() * 512, Math.random() * 512, 0.6 + Math.random() * 2.2, 0, 7);
      g.fill();
    }
  });
  // A normal map from the same kind of noise: pits and grain catch the sun.
  const height = noiseCanvas(256, g => {
    const im = g.createImageData(256, 256);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 70;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    g.filter = 'blur(1px)';
    g.drawImage(g.canvas, 0, 0);
  });
  const hd = height.getContext('2d')!.getImageData(0, 0, 256, 256).data;
  const normal = noiseCanvas(256, g => {
    const im = g.createImageData(256, 256);
    const h = (x: number, y: number) => hd[(((y + 256) % 256) * 256 + ((x + 256) % 256)) * 4] / 255;
    for (let y = 0; y < 256; y++)
      for (let x = 0; x < 256; x++) {
        const dx = (h(x + 1, y) - h(x - 1, y)) * 2.2,
          dy = (h(x, y + 1) - h(x, y - 1)) * 2.2;
        const l = Math.hypot(dx, dy, 1),
          o = (y * 256 + x) * 4;
        im.data[o] = ((-dx / l) * 0.5 + 0.5) * 255;
        im.data[o + 1] = ((-dy / l) * 0.5 + 0.5) * 255;
        im.data[o + 2] = (1 / l) * 255;
        im.data[o + 3] = 255;
      }
    g.putImageData(im, 0, 0);
  });
  const a = new THREE.CanvasTexture(albedo),
    n = new THREE.CanvasTexture(normal);
  a.colorSpace = THREE.SRGBColorSpace;
  [a, n].forEach(t => (t.wrapS = t.wrapT = THREE.RepeatWrapping));
  return { albedo: a, normal: n };
}
function floorMaps() {
  // Polished concrete: broad mottling in colour and in gloss, so the sheen breaks up across the room.
  const c = noiseCanvas(1024, g => {
    g.fillStyle = '#808080';
    g.fillRect(0, 0, 1024, 1024);
    g.filter = 'blur(38px)';
    for (let i = 0; i < 140; i++) {
      const v = 100 + Math.random() * 60;
      g.fillStyle = `rgba(${v},${v},${v},0.5)`;
      g.beginPath();
      g.ellipse(Math.random() * 1024, Math.random() * 1024, 40 + Math.random() * 160, 30 + Math.random() * 110, Math.random() * 3, 0, 7);
      g.fill();
    }
    g.filter = 'none';
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`;
      g.fillRect(Math.random() * 1024, Math.random() * 1024, 1.5, 1.5);
    }
  });
  const rough = new THREE.CanvasTexture(c),
    tint = new THREE.CanvasTexture(c);
  tint.colorSpace = THREE.SRGBColorSpace;
  [rough, tint].forEach(t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 5);
  });
  return { rough, tint };
}
function contactShadow() {
  const c = noiseCanvas(128, g => {
    const gr = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,.75)');
    gr.addColorStop(0.45, 'rgba(0,0,0,.35)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  });
  return new THREE.CanvasTexture(c);
}
function skyTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#f4f6f2');
  gr.addColorStop(0.55, '#e4e9e1');
  gr.addColorStop(1, '#b7bfb1');
  g.fillStyle = gr;
  g.fillRect(0, 0, 1024, 256);
  g.filter = 'blur(16px)';
  let s = 5;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 28; i++) {
    g.fillStyle = `rgba(${104 + r() * 20},${118 + r() * 20},${100 + r() * 16},${0.3 + r() * 0.25})`;
    g.beginPath();
    g.ellipse(r() * 1024, 140 + r() * 60, (30 + r() * 70) * 1.4, 30 + r() * 70, 0, 0, 7);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
/** Phones and low-end machines get plates at half size: a quarter of the texture memory, and still sharp at that screen size. */
function halfSize(img: HTMLImageElement) {
  const c = document.createElement('canvas');
  c.width = Math.round(img.width / 2);
  c.height = Math.round(img.height / 2);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return c;
}
/** Drawn in w×h units at `scale` pixels per unit: phones get labels at half size, a quarter of the memory. */
function textTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, scale = 1) {
  const c = document.createElement('canvas');
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const g = c.getContext('2d')!;
  g.scale(scale, scale);
  draw(g);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export async function createHall(container: HTMLElement, o: HallOptions): Promise<HallController> {
  const exhibits = o.rows.flat();
  const plan = layout(o.rows);
  const high = o.quality === 'high';
  const textScale = high ? 1 : 0.5;
  // The boot runs in a few tasks, not one: between steps the page can scroll and paint.
  const breathe = () => new Promise<void>(r => setTimeout(r, 0));
  // Declared before anything async: the plate loader's callbacks set it.
  let dirty = true;
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const renderer = new THREE.WebGLRenderer({ antialias: !high, powerPreference: 'high-performance' });
  // A software renderer (no GPU, a VM, some headless browsers) draws this room at a few frames a second.
  // Refuse it and let the page keep its poster. Browsers that mask the renderer name are let through.
  const gl = renderer.getContext();
  const gpu = gl.getExtension('WEBGL_debug_renderer_info');
  if (/swiftshader|llvmpipe|software/i.test(String(gl.getParameter(gpu ? gpu.UNMASKED_RENDERER_WEBGL : gl.RENDERER)))) {
    renderer.dispose();
    throw new Error('hall: software renderer');
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  // The sun and the room never move, so the shadow map is drawn once, not every frame.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8d8f8b);
  scene.fog = new THREE.FogExp2(0x8a8c88, 0.014);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = keep(pmrem.fromScene(room, 0.04).texture);
  room.dispose();
  pmrem.dispose();
  scene.environment = env;
  scene.environmentIntensity = 0.55;
  await breathe();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 90);

  // ——— architecture ———
  const cx = (plan.x0 + plan.x1) / 2,
    cz = (plan.z0 + plan.z1) / 2,
    W = plan.x1 - plan.x0,
    D = plan.z0 - plan.z1;
  const fm = floorMaps();
  const floor = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(W, D)),
    keep(
      new THREE.MeshPhysicalMaterial({
        color: 0x45433e,
        map: keep(fm.tint),
        roughness: 0.42,
        roughnessMap: keep(fm.rough),
        clearcoat: 0.16,
        clearcoatRoughness: 0.34,
        envMapIntensity: 0.7,
      }),
    ),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(cx, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const upper = new THREE.Group();
  scene.add(upper);
  const ceilMat = keep(new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.95 }));
  const ceil = new THREE.Mesh(keep(new THREE.PlaneGeometry(W, D)), ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(cx, plan.h, cz);
  upper.add(ceil);
  const trough = keep(new THREE.MeshBasicMaterial({ color: 0xf6eee0 }));
  const troughGeo = keep(new THREE.PlaneGeometry(0.14, D - 1.5));
  [-4.4, -1.45, 1.45, 4.4].forEach(x => {
    const m = new THREE.Mesh(troughGeo, trough);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, plan.h - 0.01, cz - 0.5);
    upper.add(m);
  });
  const beamGeo = keep(new THREE.BoxGeometry(W, 0.32, 0.26)),
    beamMat = keep(new THREE.MeshStandardMaterial({ color: 0x9d9a93, roughness: 0.9 }));
  for (let z = plan.z0 - 2; z > plan.z1; z -= 4.6) {
    const b = new THREE.Mesh(beamGeo, beamMat);
    b.position.set(cx, plan.h - 0.16, z);
    upper.add(b);
  }

  await breathe();
  const cm = concreteMaps();
  keep(cm.albedo);
  keep(cm.normal);
  await breathe();
  const wallAlbedo = cm.albedo.clone();
  wallAlbedo.repeat.set(8, 2);
  keep(wallAlbedo);
  const wallMat = keep(new THREE.MeshStandardMaterial({ color: 0x9c9b97, roughness: 0.95, map: wallAlbedo }));
  const rwall = new THREE.Mesh(keep(new THREE.PlaneGeometry(D, plan.h)), wallMat);
  rwall.rotation.y = -Math.PI / 2;
  rwall.position.set(plan.x1, plan.h / 2, cz);
  rwall.receiveShadow = true;
  scene.add(rwall);
  const bwall = new THREE.Mesh(keep(new THREE.PlaneGeometry(W, plan.h)), wallMat);
  bwall.position.set(cx, plan.h / 2, plan.z1);
  scene.add(bwall);
  // The front wall closes the room behind the entrance. It faces away from the sun, so a little
  // emissive lift keeps it reading as concrete rather than mud.
  const frontMat = keep(wallMat.clone());
  frontMat.emissive = new THREE.Color(0x6a6a6a);
  frontMat.emissiveMap = wallAlbedo;
  const fwall = new THREE.Mesh(keep(new THREE.PlaneGeometry(W, plan.h)), frontMat);
  fwall.rotation.y = Math.PI;
  fwall.position.set(cx, plan.h / 2, plan.z0);
  scene.add(fwall);
  // Paint on the walls (the row dates) fades with the roof as the crane rises: seen from above, the walls
  // are edge-on and their paint would sit around the plan as squashed slivers.
  const painted: THREE.MeshStandardMaterial[] = [];
  // Art on the end walls: stretched canvases of nested squares (walls.ts), 4 cm deep and a few
  // centimetres off the concrete. One large one closes the aisle; three hang by the door. The door wall
  // is in shade, so its canvases get the same lift as its concrete.
  const canvases: THREE.Mesh[] = [];
  const canvasEdge = keep(new THREE.MeshStandardMaterial({ color: 0xe9e2d4, roughness: 0.9 }));
  const hang = (colours: readonly string[], side: number, x: number, y: number, z: number, byDoor: boolean, seed: number) => {
    const n = (side > 2 ? 1024 : 512) / (high ? 1 : 2);
    const map = keep(textTexture(n, n, g => drawHomage(g, n, colours, seed)));
    const face = keep(new THREE.MeshStandardMaterial({ map, roughness: 0.85 }));
    if (byDoor) {
      face.emissive = frontMat.emissive;
      face.emissiveMap = map;
    }
    const art = new THREE.Mesh(keep(new THREE.BoxGeometry(side, side, 0.04)), [canvasEdge, canvasEdge, canvasEdge, canvasEdge, face, canvasEdge]);
    art.position.set(x, y, z);
    if (byDoor) art.rotation.y = Math.PI;
    scene.add(art);
    canvases.push(art);
  };
  hang(PAINTINGS.back, 2.6, cx, 2.05, plan.z1 + 0.05, false, 7);
  // By the door, left to right as you face it (+x is on your left when you turn round).
  hang(PAINTINGS.left, 1.2, cx + 1.75, 2.0, plan.z0 - 0.05, true, 11);
  hang(PAINTINGS.middle, 1.2, cx, 2.0, plan.z0 - 0.05, true, 13);
  hang(PAINTINGS.right, 1.2, cx - 1.75, 2.0, plan.z0 - 0.05, true, 17);

  const skyMat = keep(new THREE.MeshBasicMaterial({ map: keep(skyTexture()), fog: false }));
  const sky = new THREE.Mesh(keep(new THREE.PlaneGeometry(D + 20, 9)), skyMat);
  sky.rotation.y = Math.PI / 2;
  sky.position.set(plan.x0 - 3.5, 4.5, cz);
  scene.add(sky);
  const mullMat = keep(new THREE.MeshStandardMaterial({ color: 0x1e1f20, roughness: 0.6 }));
  const mullGeo = keep(new THREE.BoxGeometry(0.06, plan.h, 0.06));
  const mullZ: number[] = [];
  for (let z = plan.z0; z > plan.z1; z -= 1.9) mullZ.push(z);
  const mullions = new THREE.InstancedMesh(mullGeo, mullMat, mullZ.length);
  mullZ.forEach((z, i) => mullions.setMatrixAt(i, new THREE.Matrix4().makeTranslation(plan.x0, plan.h / 2, z)));
  mullions.castShadow = true;
  scene.add(mullions);
  const transom = new THREE.Mesh(keep(new THREE.BoxGeometry(0.1, 0.12, D)), mullMat);
  transom.position.set(plan.x0, 2.7, cz);
  transom.castShadow = true;
  scene.add(transom);
  const windowPane = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(D, plan.h)),
    keep(
      new THREE.MeshPhysicalMaterial({ color: 0xcfe2d8, transparent: true, opacity: 0.1, roughness: 0.02, envMapIntensity: 1.2, depthWrite: false }),
    ),
  );
  windowPane.rotation.y = Math.PI / 2;
  // Outside the mullions, not inside them: coplanar-ish surfaces z-fight into a shimmer.
  windowPane.position.set(plan.x0 - 0.08, plan.h / 2, cz);
  scene.add(windowPane);

  // Light: sky, the sun through the glass wall, a warm fill from the ceiling troughs.
  scene.add(new THREE.HemisphereLight(0xeef1ee, 0x4a4640, 0.85));
  const sun = new THREE.DirectionalLight(0xfff0d8, 3.63);
  sun.position.set(-16, 11, 2);
  sun.target.position.set(0, 0, -8);
  scene.add(sun, sun.target);
  sun.castShadow = true;
  keep(sun.shadow);
  sun.shadow.mapSize.set(high ? 4096 : 2048, high ? 4096 : 2048);
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.015;
  sun.shadow.radius = high ? 3 : 2;
  {
    // Fit the shadow frustum to the hall itself, so every texel lands on the room. A loose box
    // leaves the 6 cm mullions a pixel or two wide in the map, and their shadows stair-step.
    const cam = sun.shadow.camera;
    cam.position.copy(sun.position);
    cam.lookAt(sun.target.position);
    cam.updateMatrixWorld();
    const inv = cam.matrixWorldInverse,
      box = new THREE.Box3();
    for (const x of [plan.x0 - 0.5, plan.x1])
      for (const y of [0, plan.h]) for (const z of [plan.z0, plan.z1]) box.expandByPoint(V(x, y, z).applyMatrix4(inv));
    Object.assign(cam, {
      left: box.min.x - 0.5,
      right: box.max.x + 0.5,
      top: box.max.y + 0.5,
      bottom: box.min.y - 0.5,
      near: Math.max(0.1, -box.max.z - 1),
      far: -box.min.z + 1,
    });
    cam.updateProjectionMatrix();
  }
  const fill = new THREE.DirectionalLight(0xffe7c7, 0.42);
  fill.position.set(3, 10, 6);
  scene.add(fill);

  // ——— easels: a concrete block, a pane of glass, a wooden wedge, the work, and a label on the back ———
  const baseAlbedo = cm.albedo.clone();
  keep(baseAlbedo);
  const concMat = keep(
    new THREE.MeshStandardMaterial({
      color: 0x8c8a85,
      roughness: 0.96,
      map: baseAlbedo,
      normalMap: cm.normal,
      normalScale: new THREE.Vector2(0.9, 0.9),
    }),
  );
  const woodMat = keep(new THREE.MeshStandardMaterial({ color: 0x5b3b24, roughness: 0.72 }));
  const glassMat = keep(
    new THREE.MeshPhysicalMaterial({
      color: 0xd6ece3,
      transparent: true,
      opacity: 0.05,
      roughness: 0.03,
      clearcoat: 0.5,
      envMapIntensity: 1.0,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const edgeMat = keep(new THREE.MeshStandardMaterial({ color: 0x4f7466, roughness: 0.25, transparent: true, opacity: 0.55 }));
  const shadowMat = keep(new THREE.MeshBasicMaterial({ map: keep(contactShadow()), transparent: true, depthWrite: false, opacity: 0.85 }));
  const baseGeo = keep(new RoundedBoxGeometry(0.44, 0.44, 0.44, 2, 0.005)),
    glassGeo = keep(new THREE.BoxGeometry(1.08, 2.02, 0.012)),
    // A triangular prism lying along the slot, point down, like the oak wedges at MASP.
    wedgeGeo = keep(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 3).rotateZ(Math.PI / 2).rotateX(Math.PI / 6));
  const edgeV = keep(new THREE.BoxGeometry(0.014, 2.02, 0.014)),
    edgeH = keep(new THREE.BoxGeometry(1.08, 0.014, 0.014)),
    shadowGeo = keep(new THREE.PlaneGeometry(1.25, 1.25));
  // Glass and daylight shouldn't take ambient occlusion; they're hidden while AO reads depth and normals.
  const glassMeshes: THREE.Object3D[] = [windowPane, sky];
  const blank = new THREE.Color(0xe9e6df);
  // Works start on a 1×1 white stand-in, so their material is compiled with a map from the first
  // frame and each plate swaps in without a recompile.
  const standIn = keep(new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1));
  standIn.colorSpace = THREE.SRGBColorSpace;
  standIn.needsUpdate = true;
  // Every easel's block, pane, edges, wedge and contact shadow are identical, so each part is one
  // instanced draw for the whole room. Only the work, its back and its label are per easel.
  const n = plan.placed.length;
  const instanced = (geo: THREE.BufferGeometry, mat: THREE.Material, count: number) => {
    const m = new THREE.InstancedMesh(geo, mat, count);
    scene.add(m);
    return m;
  };
  const shadows = instanced(shadowGeo, shadowMat, n),
    bases = instanced(baseGeo, concMat, n),
    panes = instanced(glassGeo, glassMat, n),
    sides = instanced(edgeV, edgeMat, n * 2),
    rails = instanced(edgeH, edgeMat, n * 2),
    wedges = instanced(wedgeGeo, woodMat, n);
  bases.castShadow = bases.receiveShadow = true;
  wedges.castShadow = true;
  panes.renderOrder = 2;
  glassMeshes.push(panes, sides, rails);
  const part = new THREE.Object3D(),
    placed = new THREE.Matrix4();
  const put = (im: THREE.InstancedMesh, i: number, g: THREE.Object3D, x: number, y: number, z: number, rx = 0) => {
    part.position.set(x, y, z);
    part.rotation.set(rx, 0, 0);
    part.updateMatrix();
    im.setMatrixAt(i, placed.multiplyMatrices(g.matrix, part.matrix));
  };
  const easels: Easel[] = plan.placed.map((p, i) => {
    const e = exhibits.find(x => x.id === p.id)!;
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    group.rotation.y = p.yaw;
    scene.add(group);
    group.updateMatrix();
    const gy = 0.44 + 1.01 - 0.12;
    put(shadows, i, group, 0, 0.003, 0, -Math.PI / 2);
    put(bases, i, group, 0, 0.22, 0);
    put(panes, i, group, 0, gy, 0);
    put(sides, i * 2, group, -0.54, gy, 0);
    put(sides, i * 2 + 1, group, 0.54, gy, 0);
    put(rails, i * 2, group, 0, gy - 1.01, 0);
    put(rails, i * 2 + 1, group, 0, gy + 1.01, 0);
    put(wedges, i, group, 0, 0.465, 0.03, -0.3);
    const r = e.image.ratio,
      aw = r >= 1 ? 1.0 : 0.8,
      ah = aw / r,
      cy = 1.52;
    const artGeo = keep(new THREE.PlaneGeometry(aw, ah));
    const artMat = keep(
      new THREE.MeshStandardMaterial({
        color: blank,
        map: standIn,
        emissiveMap: standIn,
        roughness: 0.55,
        emissive: 0xffffff,
        emissiveIntensity: 0.0,
      }),
    );
    const art = new THREE.Mesh(artGeo, artMat);
    art.position.set(0, cy, 0.009);
    art.castShadow = true;
    art.userData.id = e.id;
    group.add(art);
    // The back of the print is its own plane turned round, not the art's back face: ambient occlusion
    // only draws front faces, and a back face left it seeing through to the easels beyond (streaks).
    const backMat = keep(new THREE.MeshStandardMaterial({ color: 0x8a847a, roughness: 0.95 }));
    const back = new THREE.Mesh(artGeo, backMat);
    back.rotation.y = Math.PI;
    back.position.set(0, cy, 0.008);
    group.add(back);
    const label = new THREE.Mesh(
      keep(new THREE.PlaneGeometry(0.36, 0.2)),
      keep(
        new THREE.MeshStandardMaterial({
          roughness: 0.8,
          map: keep(
            textTexture(
              680,
              380,
              g => {
                g.fillStyle = '#f3f1ea';
                g.fillRect(0, 0, 680, 380);
                g.fillStyle = '#1b1c1c';
                g.font = `650 40px ${o.font}`;
                let line = '',
                  y = 74;
                for (const w of e.title.split(' ')) {
                  const t = line ? `${line} ${w}` : w;
                  if (g.measureText(t).width > 600 && line) {
                    g.fillText(line, 40, y);
                    line = w;
                    y += 48;
                  } else line = t;
                }
                g.fillText(line, 40, y);
                g.font = `400 28px ${o.font}`;
                g.fillStyle = '#4d4a44';
                g.fillText(e.when, 40, y + 52);
                g.fillStyle = '#77736b';
                g.fillText(e.medium.length > 44 ? `${e.medium.slice(0, 42)}…` : e.medium, 40, y + 92);
              },
              textScale,
            ),
          ),
        }),
      ),
    );
    label.position.set(0, 0.9, -0.012);
    label.rotation.y = Math.PI;
    group.add(label);
    return { e, group, art, artMat, backMat, center: new THREE.Vector3(), top: cy + ah / 2 };
  });
  // The timeline runs along the solid wall at eye height: from the entrance, depth reads as time.
  o.rows.forEach((_, k) => {
    const d = new THREE.Mesh(
      keep(new THREE.PlaneGeometry(2.4, 0.5)),
      keep(
        new THREE.MeshStandardMaterial({
          transparent: true,
          depthWrite: false,
          roughness: 0.95,
          map: keep(
            textTexture(
              1100,
              230,
              g => {
                g.font = `600 108px ${o.font}`;
                g.fillStyle = 'rgba(38,37,35,.82)';
                g.textBaseline = 'middle';
                g.fillText(o.years[k], 8, 118);
              },
              textScale,
            ),
          ),
        }),
      ),
    );
    painted.push(d.material as THREE.MeshStandardMaterial);
    d.rotation.y = -Math.PI / 2;
    d.position.set(plan.x1 - 0.01, 2.3, -k * ROW + 0.6);
    scene.add(d);
  });
  [shadows, bases, panes, sides, rails, wedges].forEach(im => {
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
  });
  mullions.computeBoundingSphere();
  scene.updateMatrixWorld(true);
  easels.forEach(ez => ez.group.localToWorld(ez.center.set(0, 1.52, 0)));

  // Before the plates start loading: the first one can't land (and call ready) mid-boot.
  await breathe();
  // Works load front row first; the room is usable before the back wall arrives.
  const loader = new THREE.TextureLoader();
  let alive = true,
    frontIn = false,
    readyAt = 0;
  (async () => {
    for (let k = 0; k < o.rows.length && alive; k++) {
      await Promise.all(
        easels
          .filter(ez => o.rows[k].includes(ez.e))
          .map(
            ez =>
              new Promise<void>(res =>
                loader.load(
                  ez.e.image.src,
                  img => {
                    if (!alive) return (img.dispose(), res());
                    const t = keep(high ? img : new THREE.CanvasTexture(halfSize(img.image)));
                    t.colorSpace = THREE.SRGBColorSpace;
                    t.anisotropy = high ? 8 : 4;
                    ez.artMat.map = ez.artMat.emissiveMap = t;
                    ez.artMat.color.set(0xffffff);
                    ez.artMat.emissiveIntensity = 0.06;
                    dirty = true;
                    res();
                  },
                  undefined,
                  () => res(),
                ),
              ),
          ),
      );
      if (k === 0) {
        // Ready waits for the next frame to draw them (loop), not just for the files.
        frontIn = true;
        dirty = true;
      }
    }
  })();

  // ——— post-processing ———
  // Multisampled, or thin mullions and glass edges crawl: the composer bypasses the canvas's own antialiasing.
  let ao: GTAOPass | null = null;
  const composer = high ? new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })) : null;
  if (composer) {
    composer.addPass(new RenderPass(scene, camera));
    ao = new GTAOPass(scene, camera, 2, 2);
    ao.output = GTAOPass.OUTPUT.Default;
    ao.blendIntensity = 1;
    ao.updateGtaoMaterial({ radius: 0.55, distanceExponent: 1.4, thickness: 1.4, scale: 1.2, samples: 8 });
    // Glass shouldn't occlude anything: hide the panes while AO reads depth and normals.
    const aoRender = ao.render.bind(ao);
    ao.render = (...args: Parameters<typeof aoRender>) => {
      const was = glassMeshes.map(g => g.visible);
      glassMeshes.forEach(g => (g.visible = false));
      aoRender(...args);
      glassMeshes.forEach((g, k) => (g.visible = was[k]));
    };
    composer.addPass(ao);
    composer.addPass(new OutputPass());
  }

  // ——— the crane ———
  // The roof and the view outside lift off first, like the top of an architect's model. These turn
  // transparent only while the crane is up (the room itself stays opaque and sorted as it was), and
  // their see-through shaders are compiled now so the first scroll doesn't stall on a compile.
  const lifts = [ceilMat, trough, beamMat, skyMat];
  lifts.forEach(m => (m.transparent = true));
  renderer.setRenderTarget(composer ? composer.readBuffer : null);
  renderer.compile(scene, camera);
  renderer.setRenderTarget(null);
  lifts.forEach(m => ((m.transparent = false), (m.needsUpdate = true)));
  let lift = 0,
    liftTo = 0,
    lifted = false,
    lastPlace = 0;
  const FOG = (scene.fog as THREE.FogExp2).density;
  camera.rotation.order = 'YXZ';
  /** Straight down over the middle of the room, high enough that the floor fills planFrame's box. */
  function topView() {
    const w = renderer.domElement.clientWidth,
      h = renderer.domElement.clientHeight,
      f = planFrame(plan, w, h);
    const s = f.h / D;
    return {
      y: h / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * s),
      // A lens shift, not a move: the camera stays over the room and the picture slides to the box.
      dx: f.x + f.w / 2 - w / 2,
      dy: f.y + f.h / 2 - h / 2,
      w,
      h,
    };
  }
  function craneStep(now: number) {
    const dt = Math.min(0.05, (now - (lastPlace || now)) / 1000);
    lastPlace = now;
    if (lift !== liftTo) {
      lift += (liftTo - lift) * (1 - Math.exp(-dt * 14));
      if (Math.abs(liftTo - lift) < 1e-4) lift = liftTo;
    }
    const u = lift;
    if (u > 0 !== lifted) {
      lifted = u > 0;
      lifts.forEach(m => ((m.transparent = lifted), (m.needsUpdate = true)));
    }
    const roof = 1 - sstep(0.02, 0.2, u);
    lifts.forEach(m => (m.opacity = roof));
    painted.forEach(m => (m.opacity = roof));
    canvases.forEach(a => (a.visible = roof > 0.001));
    upper.visible = sky.visible = roof > 0.001;
    (scene.fog as THREE.FogExp2).density = FOG * (1 - sstep(0.1, 0.6, u));
  }

  // ——— camera choreography ———
  const cam: Pose = { pos: V(0, EYE, 6), look: V(0, 1.4, -8) };
  const ENTRY: Pose = o.mobile ? { pos: V(0.6, EYE, 5.4), look: V(-0.2, 1.45, -8) } : { pos: V(1.35, EYE, 5.1), look: V(-0.7, 1.42, -8) };
  const START: Pose = { pos: ENTRY.pos.clone().add(V(0.3, 0, 0.9)), look: ENTRY.look.clone().add(V(-0.1, 0, -0.5)) };
  const frontPose = (ez: Easel, dist = o.mobile ? 2.35 : 2.15): Pose => {
    const n = V(0, 0, 1).applyQuaternion(ez.group.quaternion);
    return {
      pos: ez.center
        .clone()
        .addScaledVector(n, dist)
        .setY(EYE - 0.05),
      // On a phone the caption and controls take the lower third, so the work sits higher in the frame.
      look: ez.center.clone().add(V(0, o.mobile ? -0.3 : 0, 0)),
    };
  };
  const turnPose = (ez: Easel, u: number, dist = 2.05): Pose => {
    const a = Math.PI * easeIO(u);
    const n = V(0, 0, 1).applyQuaternion(ez.group.quaternion),
      side = V(1, 0, 0).applyQuaternion(ez.group.quaternion);
    const off = n.multiplyScalar(Math.cos(a) * dist).addScaledVector(side, Math.sin(a) * dist * 0.85);
    return {
      pos: ez.center
        .clone()
        .add(off)
        .setY(EYE - 0.05 - 0.12 * Math.sin(a * 0.5) ** 2),
      look: ez.center.clone().setY(1.52 - 0.28 * sstep(0.4, 1, u)),
    };
  };
  function walkCurve(from: Pose, to: Pose) {
    const pts = [from.pos.clone()];
    if (Math.abs(from.pos.z - to.pos.z) > 0.6 || from.pos.y > EYE + 0.5) {
      pts.push(V(AISLE + 0.6, EYE, from.pos.z - 0.4), V(AISLE, EYE, (from.pos.z + to.pos.z) / 2), V(AISLE + 0.5, EYE, to.pos.z + 0.2));
    }
    pts.push(to.pos.clone());
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  }
  function walkPose(tw: Extract<Tween, { kind: 'walk' }>, u: number): Pose {
    const k = easeIO(u);
    const pos = tw.curve.getPointAt(k);
    const ahead = tw.curve.getPointAt(Math.min(1, k + 0.12)).setY(1.45);
    const look = tw.from.look
      .clone()
      .lerp(ahead.add(V(0.4, 0, -1.2)), sstep(0, 0.25, u))
      .lerp(tw.to.look, sstep(0.3, 0.75, u));
    return { pos, look };
  }

  let tween: Tween | null = null;
  /** The opening step, while it runs. */
  let opener: Tween | null = null;
  let at: Easel | null = null;
  let back = false;
  let hover: Easel | null = null;
  let paused = o.reduced || o.paused;
  /** Paused or reduced motion: every camera move becomes a cut. */
  const cut = () => paused || o.reduced;
  const byId = (id: string) => easels.find(ez => ez.e.id === id) ?? null;

  function finishTween() {
    if (!tween) return;
    const t = tween;
    tween = null;
    if (t === opener) settle();
    if (t.kind === 'turn') Object.assign(cam, turnPose(t.easel, t.dir > 0 ? 1 : 0));
    else Object.assign(cam, { pos: t.to.pos.clone(), look: t.to.look.clone() });
  }

  const ctl: HallController = {
    walkTo(id) {
      const ez = byId(id);
      if (!ez) return;
      finishTween();
      if (at === ez && !back) return;
      const from = { pos: cam.pos.clone(), look: cam.look.clone() },
        to = frontPose(ez);
      const curve = walkCurve(from, to);
      tween = { kind: 'walk', t0: performance.now(), dur: cut() ? 0.001 : clamp(curve.getLength() / 3.2, 1.2, 3.2), curve, from, to };
      at = ez;
      back = false;
      dirty = true;
      hoverAt(null);
      o.on.walk(id);
    },
    select(id) {
      const ez = byId(id);
      if (!ez) return;
      finishTween();
      Object.assign(cam, frontPose(ez));
      at = ez;
      back = false;
      dirty = true;
      o.on.arrive(id);
    },
    turn() {
      if (!at) return;
      finishTween();
      back = !back;
      tween = { kind: 'turn', t0: performance.now(), dur: cut() ? 0.001 : 1.6, easel: at, dir: back ? 1 : -1 };
      dirty = true;
    },
    entrance() {
      finishTween();
      at = null;
      back = false;
      const from = { pos: cam.pos.clone(), look: cam.look.clone() };
      const curve = route(from.pos, ENTRY.pos);
      tween = {
        kind: 'walk',
        t0: performance.now(),
        dur: cut() ? 0.001 : clamp(curve.getLength() / 3.2, 1, 3),
        curve,
        from,
        to: { pos: ENTRY.pos.clone(), look: ENTRY.look.clone() },
      };
      dirty = true;
    },
    setPaused(v) {
      paused = v || o.reduced;
      dirty = true;
    },
    crane(p) {
      liftTo = clamp(p);
      // Nothing drawn yet, or motion paused: go straight there.
      if (cut() || !lastPlace) lift = liftTo;
      if (liftTo > 0) {
        drag = null;
        keys.clear();
        ring.visible = false;
        hoverAt(null);
      }
      dirty = true;
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('pointerleave', onLeave);
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
      removeEventListener('blur', onBlur);
      composer?.passes.forEach(p => p.dispose());
      composer?.dispose();
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  // ——— picking ———
  const ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2(),
    arts = easels.map(ez => ez.art);
  const proj = new THREE.Vector3();
  function pick(ev: PointerEvent | MouseEvent) {
    const b = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - b.left) / b.width) * 2 - 1, -((ev.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(arts, false)[0];
    return h ? byId(h.object.userData.id as string) : null;
  }
  function hoverAt(ez: Easel | null) {
    if (ez === hover) return;
    if (hover) hover.artMat.emissiveIntensity = hover.artMat.map ? 0.06 : 0;
    hover = ez;
    if (hover) hover.artMat.emissiveIntensity = hover.artMat.map ? 0.2 : 0;
    dirty = true;
    report();
  }
  function report() {
    if (!hover || hover === at || tween) return o.on.hover(null, 0, 0);
    proj
      .copy(hover.center)
      .setY(hover.top + 0.08)
      .project(camera);
    const b = renderer.domElement.getBoundingClientRect();
    o.on.hover(proj.z < 1 ? hover.e.id : null, (proj.x * 0.5 + 0.5) * b.width, (-proj.y * 0.5 + 0.5) * b.height);
  }
  // ——— free movement: drag to look, click the floor to walk there, WASD or arrows ———
  const floorPlane = new THREE.Plane(V(0, 1, 0), 0);
  const ring = new THREE.Mesh(
    keep(new THREE.RingGeometry(0.2, 0.26, 48)),
    keep(new THREE.MeshBasicMaterial({ color: 0xf3f1ec, transparent: true, opacity: 0.7, depthWrite: false })),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.012;
  ring.visible = false;
  scene.add(ring);
  const keys = new Set<string>();
  let drag: { x: number; y: number; moved: boolean } | null = null;
  const view = () => {
    const d = cam.look.clone().sub(cam.pos);
    return { yaw: Math.atan2(d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)) };
  };
  const aim = (yaw: number, pitch: number) =>
    cam.look.set(cam.pos.x + Math.sin(yaw) * Math.cos(pitch) * 3, cam.pos.y + Math.sin(pitch) * 3, cam.pos.z - Math.cos(yaw) * Math.cos(pitch) * 3);
  /** Stops wherever the camera is, leaves the easel, and tells the page the visitor is walking on their own. */
  function leave() {
    tween = null;
    at = null;
    back = false;
    hoverAt(null);
    o.on.roam();
  }
  /** Keeps a point inside the walls and a step away from every easel. */
  function inRoom(p: THREE.Vector3) {
    p.x = clamp(p.x, plan.x0 + 0.6, plan.x1 - 0.6);
    p.z = clamp(p.z, plan.z1 + 0.8, plan.z0 - 0.6);
    for (const ez of easels) {
      const dx = p.x - ez.center.x,
        dz = p.z - ez.center.z,
        d = Math.hypot(dx, dz);
      if (d < 0.75 && d > 1e-4) {
        p.x = ez.center.x + (dx / d) * 0.75;
        p.z = ez.center.z + (dz / d) * 0.75;
      }
    }
    p.y = EYE;
    return p;
  }
  function floorAt(ev: PointerEvent) {
    const b = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - b.left) / b.width) * 2 - 1, -((ev.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.ray.intersectPlane(floorPlane, new THREE.Vector3());
    return hit && hit.x > plan.x0 && hit.x < plan.x1 && hit.z < plan.z0 && hit.z > plan.z1 && hit.distanceTo(cam.pos) < 30 ? hit : null;
  }
  /** A path from here to there that bends around easels instead of walking through their panes. */
  function route(a: THREE.Vector3, b: THREE.Vector3) {
    const pts = [a.clone()];
    for (let i = 1; i < 10; i++) {
      const q = a.clone().lerp(b, i / 10);
      for (const ez of easels) {
        const dx = q.x - ez.center.x,
          dz = q.z - ez.center.z,
          d = Math.hypot(dx, dz);
        if (d < 1 && d > 1e-4) {
          q.x = ez.center.x + (dx / d) * 1;
          q.z = ez.center.z + (dz / d) * 1;
        }
      }
      pts.push(q.setY(EYE));
    }
    pts.push(b.clone());
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  }
  function walkToFloor(p: THREE.Vector3) {
    const from = { pos: cam.pos.clone(), look: cam.look.clone() };
    leave();
    const to = inRoom(p.clone()),
      dist = Math.hypot(to.x - from.pos.x, to.z - from.pos.z);
    if (dist < 0.2) return;
    // Keep facing the way you were looking, as if you'd stepped there.
    const curve = route(from.pos, to);
    tween = {
      kind: 'walk',
      t0: performance.now(),
      dur: cut() ? 0.001 : clamp(curve.getLength() / 2.6, 0.5, 3),
      curve,
      from,
      to: { pos: to, look: to.clone().add(from.look.clone().sub(from.pos)) },
    };
    dirty = true;
  }
  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';
  // Focusable, so the keyboard walks only after the visitor has stepped into the room (click, drag or Tab).
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'The hall. Arrow keys or WASD walk; the catalogue below lists every work.');
  canvas.removeAttribute('aria-hidden');
  const onDown = (ev: PointerEvent) => {
    if (ev.button !== 0 || liftTo > 0) return;
    drag = { x: ev.clientX, y: ev.clientY, moved: false };
    canvas.focus({ preventScroll: true });
  };
  const onMove = (ev: PointerEvent) => {
    if (liftTo > 0) return;
    if (drag && ev.buttons & 1) {
      const dx = ev.clientX - drag.x,
        dy = ev.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      if (!drag.moved) {
        drag.moved = true;
        leave();
        canvas.style.cursor = 'grabbing';
        ring.visible = false;
      }
      const v = view();
      aim(v.yaw - dx * 0.0032, clamp(v.pitch + dy * 0.0024, -0.45, 0.3));
      drag.x = ev.clientX;
      drag.y = ev.clientY;
      dirty = true;
      return;
    }
    const ez = pick(ev);
    hoverAt(ez);
    const f = !ez && ev.pointerType === 'mouse' ? floorAt(ev) : null;
    ring.visible = !!f;
    if (f) ring.position.set(f.x, 0.012, f.z);
    canvas.style.cursor = ez ? 'pointer' : 'grab';
    dirty = true;
  };
  const onUp = (ev: PointerEvent) => {
    const d = drag;
    drag = null;
    canvas.style.cursor = 'grab';
    if (!d || d.moved) return;
    const ez = pick(ev);
    if (ez) {
      if (ez === at && !tween) ctl.turn();
      else ctl.walkTo(ez.e.id);
      return;
    }
    const f = floorAt(ev);
    if (f) walkToFloor(f);
  };
  const onCancel = () => (drag = null);
  const onLeave = () => {
    hoverAt(null);
    ring.visible = false;
    dirty = true;
  };
  const typing = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable]');
  const MOVE = new Set(['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
  const onKeyDown = (ev: KeyboardEvent) => {
    const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
    // WASD walk whenever the room fills the screen and nothing else has focus; the arrow keys scroll the
    // page until the visitor has clicked or tabbed into the room.
    const focused = document.activeElement === canvas || (k.length === 1 && (!document.activeElement || document.activeElement === document.body));
    if (!MOVE.has(k) || ev.metaKey || ev.ctrlKey || ev.altKey || typing(ev.target) || !visible || liftTo > 0 || !focused) return;
    ev.preventDefault();
    if (!keys.size) leave();
    keys.add(k);
    dirty = true;
  };
  const onKeyUp = (ev: KeyboardEvent) => keys.delete(ev.key.length === 1 ? ev.key.toLowerCase() : ev.key);
  const onBlur = () => keys.clear();
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onLeave);
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
  addEventListener('blur', onBlur);
  let lastStep = 0;
  function stepKeys(now: number) {
    const dt = Math.min(0.05, (now - (lastStep || now)) / 1000);
    lastStep = now;
    if (!keys.size) return;
    const has = (...ks: string[]) => (ks.some(k => keys.has(k)) ? 1 : 0);
    const fwd = has('w', 'ArrowUp') - has('s', 'ArrowDown'),
      side = has('d') - has('a'),
      turn = has('ArrowRight') - has('ArrowLeft');
    const v = view(),
      yaw = v.yaw + turn * 1.6 * dt,
      speed = 2.2 * dt;
    cam.pos.x += (Math.sin(yaw) * fwd + Math.cos(yaw) * side) * speed;
    cam.pos.z += (-Math.cos(yaw) * fwd + Math.sin(yaw) * side) * speed;
    inRoom(cam.pos);
    aim(yaw, v.pitch);
  }

  // ——— frame loop: renders only when something moves ———
  let raf = 0,
    visible = true,
    lastPose = '';
  function place(now: number) {
    stepKeys(now);
    if (tween) {
      const u = clamp((now - tween.t0) / 1000 / tween.dur);
      const p =
        tween.kind === 'walk'
          ? walkPose(tween, u)
          : tween.kind === 'turn'
            ? turnPose(tween.easel, tween.dir > 0 ? u : 1 - u)
            : { pos: tween.from.pos.clone().lerp(tween.to.pos, easeIO(u)), look: tween.from.look.clone().lerp(tween.to.look, easeIO(u)) };
      Object.assign(cam, p);
      if (u >= 1) {
        const done = tween;
        tween = null;
        if (done.kind === 'walk') o.on.arrive(at?.e.id ?? null);
        if (done.kind === 'turn') o.on.turned(done.easel.e.id, done.dir > 0);
        if (done.kind === 'go') o.on.arrive(null);
        if (done === opener) settle();
      }
    }
    const pos = cam.pos,
      look = cam.look;
    craneStep(now);
    // Angles with the roll pinned at zero, never lookAt: the horizon stays level all the way up.
    let yaw = Math.atan2(look.x - pos.x, -(look.z - pos.z)),
      pitch = Math.atan2(look.y - pos.y, Math.hypot(look.x - pos.x, look.z - pos.z));
    camera.position.copy(pos);
    if (lift > 0) {
      // The camera lands at 0.8 and holds still; the drawn plan dissolves in over it after that (Hall.module.css).
      const u = clamp(lift / 0.8),
        top = topView();
      // Face into the room while the view is still level, then tip it down: turning once the camera
      // looks at the floor would spin the picture. Height eases in log space so the zoom-out is even.
      yaw *= 1 - sstep(0, 0.32, u);
      pitch += (-Math.PI / 2 - pitch) * sstep(0.04, 0.9, u);
      const kxz = sstep(0.15, 1, u),
        ks = sstep(0.4, 1, u);
      camera.position.set(pos.x + (cx - pos.x) * kxz, pos.y * Math.pow(top.y / pos.y, easeIO(u)), pos.z + (cz - pos.z) * kxz);
      camera.setViewOffset(top.w, top.h, -top.dx * ks, -top.dy * ks, top.w, top.h);
    } else if (camera.view) camera.clearViewOffset();
    camera.rotation.set(pitch, -yaw, 0);
    const facing = Math.atan2(look.x - pos.x, -(look.z - pos.z));
    const key = `${pos.x.toFixed(2)},${pos.z.toFixed(2)},${facing.toFixed(2)}`;
    if (key !== lastPose) {
      lastPose = key;
      o.on.pose(pos.x, pos.z, facing);
    }
  }
  // ——— adaptive quality ———
  // Screen shape and core count don't say what the GPU can do, so watch it. Once the room is ready,
  // two windows in a row of slow moving frames drop one step: ambient occlusion first, then resolution.
  // The level is on the canvas as data-quality.
  let level = high ? 0 : 1,
    maxDpr = high ? 1.5 : 1.25,
    slowWindows = 0,
    lastFrame = 0;
  const frameTimes: number[] = [];
  renderer.domElement.dataset.quality = String(level);
  function stepDown() {
    level++;
    if (ao) ao.enabled = level < 1;
    if (level >= 2) maxDpr = 1;
    renderer.domElement.dataset.quality = String(level);
    resize();
  }
  function measure(now: number) {
    const dt = now - lastFrame;
    lastFrame = now;
    // Only back-to-back frames count; skip the first second after load (uploads, compiles) and tab switches.
    if (level >= 2 || !readyAt || now - readyAt < 1000 || dt > 250) return;
    frameTimes.push(dt);
    if (frameTimes.length < 60) return;
    const median = frameTimes.sort((a, b) => a - b)[30];
    frameTimes.length = 0;
    slowWindows = median > 24 ? slowWindows + 1 : 0;
    if (slowWindows === 2) {
      slowWindows = 0;
      stepDown();
    }
  }

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    // Nothing moving, nothing drawn: the room holds its last frame between interactions.
    if (!tween && !dirty && !keys.size && lift === liftTo) {
      lastFrame = 0;
      return;
    }
    measure(now);
    dirty = false;
    place(now);
    if (composer) composer.render();
    else renderer.render(scene, camera);
    if (frontIn && !readyAt) open(now);
    if (hover && !tween && !lift) report();
  }

  function resize() {
    const b = container.getBoundingClientRect();
    const w = Math.max(2, b.width),
      h = Math.max(2, b.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, maxDpr));
    renderer.setSize(w, h, false);
    composer?.setPixelRatio(renderer.getPixelRatio());
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 58 : 42;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) dirty = true;
  });
  io.observe(container);
  resize();

  // Opening: the room waits at START, where the poster was taken. Once the front row is drawn the poster
  // crossfades out (0.8 s, .poster in Hall.module.css), then the camera takes one step in. Arriving at
  // an easel from a hash, or with motion paused, there's no step.
  const first = o.start ? byId(o.start) : null;
  if (first) ctl.select(first.e.id);
  else Object.assign(cam, { pos: START.pos.clone(), look: START.look.clone() });
  function open(now: number) {
    readyAt = now;
    o.on.ready();
    if (first || paused) return o.on.opened();
    opener = tween = { kind: 'go', t0: now + 800, dur: 1.6, from: { pos: START.pos.clone(), look: START.look.clone() }, to: ENTRY };
  }
  function settle() {
    opener = null;
    o.on.opened();
  }
  raf = requestAnimationFrame(loop);
  return ctl;
}

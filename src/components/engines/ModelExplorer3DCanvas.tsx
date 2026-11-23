import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Maximize2, Minimize2 } from 'lucide-react';
import { createFloatingLabelSprite, getOrganicTissueTextures } from '../../three/proceduralTextures';
import { loadNormalizedGLB } from '../../three/glbLoader';
import { useFullscreen } from '../../hooks/useFullscreen';

export interface ModelExplorer3DCanvasProps {
  cutawayAmount: number;
  selectedLayer: 'all' | 'chambers' | 'vessels' | 'valves';
  flowPaused: boolean;
  reducedMotion: boolean;
  onSelectPart?: (partName: string, description: string) => void;
  onUserInteract?: () => void;
}

const PART_INFO: Record<string, { label: string; detail: string; pinPos: [number, number, number] }> = {
  rightAtrium: {
    label: 'Right Atrium (Upper Right Chamber)',
    detail:
      'Thin-walled upper chamber receiving deoxygenated blood from the Superior & Inferior Vena Cava (TN Class 10 Science p. 207, Fig. 14.11).',
    pinPos: [-0.72, 0.45, 0.55],
  },
  rightVentricle: {
    label: 'Right Ventricle (Pulmonary Pump)',
    detail:
      'Pumps deoxygenated blood past the tricuspid & pulmonary semilunar valves into the bifurcating pulmonary trunk toward both lungs (p. 208).',
    pinPos: [-0.36, -0.35, 0.78],
  },
  leftAtrium: {
    label: 'Left Atrium (Oxygenated Receiver)',
    detail:
      'Smaller upper chamber receiving freshly oxygenated blood from both lungs via four pulmonary veins (p. 207).',
    pinPos: [0.68, 0.52, 0.35],
  },
  leftVentricle: {
    label: 'Left Ventricle (Thick Systemic Pump)',
    detail:
      'Longer chamber with muscular walls ~3× thicker than the right ventricle to pump oxygenated blood through the aorta to the whole body (p. 208).',
    pinPos: [0.55, -0.45, 0.68],
  },
  aortaArch: {
    label: 'Aortic Arch & 3 Superior Branches',
    detail:
      'Largest systemic artery arching upward from the left ventricle with brachiocephalic, left common carotid, and left subclavian branches (Fig. 14.11–14.12).',
    pinPos: [0.08, 1.18, 0.2],
  },
  pulmonaryTrunk: {
    label: 'Pulmonary Trunk (Bifurcating Artery)',
    detail:
      'Arises from the right ventricle and bifurcates into Left and Right Pulmonary Arteries carrying deoxygenated blood to the lungs (p. 208).',
    pinPos: [0.22, 0.85, 0.52],
  },
  venaCava: {
    label: 'Superior & Inferior Vena Cava',
    detail:
      'Major systemic veins returning deoxygenated blood from the upper and lower body into the Right Atrium (p. 207).',
    pinPos: [-0.68, 0.98, 0.2],
  },
  pulmonaryVeins: {
    label: 'Pulmonary Veins (Left & Right)',
    detail:
      'Carry oxygen-rich blood back from both lungs directly into the Left Atrium (p. 207).',
    pinPos: [0.95, 0.48, 0.05],
  },
  septumWall: {
    label: 'Septum, Chordae Tendineae & One-Way Valves',
    detail:
      'Muscular interventricular septum prevents mixing of oxygenated & deoxygenated blood; tricuspid (3 flaps), bicuspid/mitral (2 flaps), and semilunar valves stop backflow (p. 208).',
    pinPos: [0.05, 0.02, 0.65],
  },
};

function buildSculptedHeartGeometry(
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  phiStart = 0,
  phiLength = Math.PI * 2,
): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = (t - 0.5) * 2.15 * scaleY;
    const r = Math.pow(Math.sin(t * Math.PI), 0.72) * (0.72 + 0.38 * Math.sin(t * Math.PI * 0.85)) * scaleX;
    pts.push(new THREE.Vector2(Math.max(0.015, r), y));
  }
  const geo = new THREE.LatheGeometry(pts, 44, phiStart, phiLength);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i) * (scaleZ / scaleX);
    const apexWeight = Math.max(0, 1 - (y + 1.05 * scaleY) / (1.8 * scaleY));
    x += apexWeight * apexWeight * 0.42 * scaleX;
    z += apexWeight * 0.14 * scaleZ;
    const groove = Math.exp(-Math.pow((x - 0.05) / 0.22, 2)) * 0.08;
    z *= 1 - groove;
    if (x > 0) x *= 1.08;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export default function ModelExplorer3DCanvas({
  cutawayAmount,
  selectedLayer,
  flowPaused,
  reducedMotion,
  onSelectPart,
  onUserInteract,
}: ModelExplorer3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [modelMode, setModelMode] = useState<'realistic_glb' | 'cutaway_chambers'>('realistic_glb');
  const [glbLoaded, setGlbLoaded] = useState(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'anterior' | 'cutaway' | 'superior'>('anterior');
  const [hoveredLabel, setHoveredLabel] = useState<string>(
    'Photorealistic 3D Human Heart (GLB) · Click any glowing pin or slide Cutaway past 50% to view internal chambers',
  );

  // Auto-switch into internal cutaway view only when user actively slides Anterior Cutaway past 60%
  useEffect(() => {
    if (cutawayAmount >= 60 && modelMode === 'realistic_glb') {
      setModelMode('cutaway_chambers');
    } else if (cutawayAmount <= 25 && glbLoaded && modelMode === 'cutaway_chambers') {
      setModelMode('realistic_glb');
    }
  }, [cutawayAmount, glbLoaded, modelMode]);

  const stateRef = useRef({
    cutawayAmount,
    selectedLayer,
    flowPaused,
    reducedMotion,
    modelMode,
    onSelectPart,
    onUserInteract,
    cameraTargetPos: null as THREE.Vector3 | null,
  });

  useEffect(() => {
    stateRef.current.cutawayAmount = cutawayAmount;
    stateRef.current.selectedLayer = selectedLayer;
    stateRef.current.flowPaused = flowPaused;
    stateRef.current.reducedMotion = reducedMotion;
    stateRef.current.modelMode = modelMode;
    stateRef.current.onSelectPart = onSelectPart;
    stateRef.current.onUserInteract = onUserInteract;
    requestRenderRef.current?.();
  }, [cutawayAmount, selectedLayer, flowPaused, reducedMotion, modelMode, onSelectPart, onUserInteract]);

  const requestRenderRef = useRef<(() => void) | null>(null);
  const applyPresetRef = useRef<((preset: 'anterior' | 'cutaway' | 'superior') => void) | null>(null);
  const nudgeCameraRef = useRef<((dx: number, dy: number, zoomFactor?: number) => void) | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const testCanvas = document.createElement('canvas');
    const testGl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!testGl) {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1222);
    scene.fog = new THREE.FogExp2(0x0b1222, 0.03);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.set(0.15, 1.35, 4.9);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    scene.add(new THREE.HemisphereLight(0xf1f5f9, 0x334155, 0.88));
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4.5, 6.5, 5.5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.95);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight(0xfda4af, 0.65);
    fillLight.position.set(0, -3, 4);
    scene.add(fillLight);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.5, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.4 }),
    );
    pedestal.position.y = -0.25;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const heartRoot = new THREE.Group();
    heartRoot.position.set(0, 1.1, 0);
    scene.add(heartRoot);

    const interactables: THREE.Object3D[] = [];

    // 1. REAL PHOTOREALISTIC TEXTURED ANATOMICAL HEART (.GLB from GitHub MIT yihalem123/Human-Organ3D!)
    const glbHeartContainer = new THREE.Group();
    heartRoot.add(glbHeartContainer);

    let disposed = false;
    loadNormalizedGLB('/models/heart.glb', 2.75, { envMapIntensity: 1.35 })
      .then(({ root }) => {
        if (disposed) return;
        glbHeartContainer.add(root);
        // Add interactive clickable glowing anatomical pins over the real textured GLB heart!
        Object.entries(PART_INFO).forEach(([key, info]) => {
          const pin = new THREE.Mesh(
            new THREE.SphereGeometry(0.085, 16, 16),
            new THREE.MeshBasicMaterial({
              color: key.includes('right') || key.includes('vena') || key.includes('pulmonaryT') ? 0x38bdf8 : 0xfbbf24,
            }),
          );
          pin.position.set(...info.pinPos);
          pin.userData = { partKey: key };
          const halo = new THREE.Mesh(
            new THREE.RingGeometry(0.1, 0.14, 20),
            new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 }),
          );
          halo.position.copy(pin.position);
          glbHeartContainer.add(pin, halo);
          interactables.push(pin);
        });
        const badge = createFloatingLabelSprite('Real 3D Human Heart', 'Click glowing pins to inspect', '#fda4af');
        badge.position.set(0, 1.62, 0);
        badge.scale.set(1.5, 0.48, 1);
        glbHeartContainer.add(badge);
        setGlbLoaded(true);
        requestRender();
      })
      .catch(() => {
        if (!disposed) setModelMode('cutaway_chambers');
      });

    // 2. INTERNAL 4-CHAMBER CUTAWAY & VALVES GROUP (Shown when Cutaway mode is active or GLB unavailable!)
    const cutawayGroup = new THREE.Group();
    cutawayGroup.visible = false;
    heartRoot.add(cutawayGroup);

    const redMuscleTex = getOrganicTissueTextures('cardiac_red');
    const blueMuscleTex = getOrganicTissueTextures('cardiac_blue');
    const matMyo = new THREE.MeshPhysicalMaterial({
      color: 0xc23b4b,
      map: redMuscleTex.map,
      bumpMap: redMuscleTex.bumpMap,
      bumpScale: 0.05,
      roughness: 0.34,
      clearcoat: 0.6,
      side: THREE.DoubleSide,
    });
    const matRed = new THREE.MeshPhysicalMaterial({
      color: 0xc81e34,
      map: redMuscleTex.map,
      bumpMap: redMuscleTex.bumpMap,
      bumpScale: 0.04,
      roughness: 0.34,
      clearcoat: 0.58,
      side: THREE.DoubleSide,
    });
    const matBlue = new THREE.MeshPhysicalMaterial({
      color: 0x2563a8,
      map: blueMuscleTex.map,
      bumpMap: blueMuscleTex.bumpMap,
      bumpScale: 0.04,
      roughness: 0.34,
      clearcoat: 0.58,
      side: THREE.DoubleSide,
    });
    const matValve = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.22, clearcoat: 0.75, side: THREE.DoubleSide });

    const backShell = new THREE.Mesh(
      buildSculptedHeartGeometry(1.02, 1.08, 0.84, Math.PI * 0.68, Math.PI * 0.64),
      new THREE.MeshPhysicalMaterial({
        color: 0x881337,
        roughness: 0.55,
        transparent: true,
        opacity: 0.24,
        side: THREE.BackSide,
      }),
    );
    backShell.position.z = -0.22;
    const rv = new THREE.Mesh(buildSculptedHeartGeometry(0.44, 0.58, 0.42), matBlue);
    rv.position.set(-0.34, -0.24, 0.08);
    rv.rotation.z = -0.18;
    rv.userData = { partKey: 'rightVentricle' };

    const lv = new THREE.Mesh(buildSculptedHeartGeometry(0.46, 0.68, 0.44), matRed);
    lv.position.set(0.36, -0.26, 0.02);
    lv.rotation.z = 0.22;
    lv.userData = { partKey: 'leftVentricle' };

    const ra = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 20), matBlue);
    ra.position.set(-0.54, 0.55, 0.04);
    ra.userData = { partKey: 'rightAtrium' };

    const la = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 20), matRed);
    la.position.set(0.52, 0.55, -0.05);
    la.userData = { partKey: 'leftAtrium' };

    const septum = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([new THREE.Vector3(-0.04, 0.6, 0.06), new THREE.Vector3(0, 0.05, 0.08), new THREE.Vector3(0.18, -0.78, 0.08)]),
        20,
        0.13,
        12,
        false,
      ),
      new THREE.MeshPhysicalMaterial({ color: 0xf08c8c, roughness: 0.4 }),
    );
    septum.scale.set(0.75, 1, 2.1);
    septum.userData = { partKey: 'septumWall' };

    const aorta = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.22, 0.45, 0.04),
          new THREE.Vector3(0.28, 1.05, 0.02),
          new THREE.Vector3(0.06, 1.38, -0.06),
          new THREE.Vector3(-0.24, 1.24, -0.18),
        ]),
        28,
        0.18,
        16,
        false,
      ),
      matRed,
    );
    aorta.userData = { partKey: 'aortaArch' };

    const pulm = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([new THREE.Vector3(-0.26, 0.34, 0.24), new THREE.Vector3(-0.06, 0.88, 0.24), new THREE.Vector3(0.65, 1.02, 0.06)]),
        22,
        0.14,
        14,
        false,
      ),
      matBlue,
    );
    pulm.userData = { partKey: 'pulmonaryTrunk' };

    const vc = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 1.55, 18), matBlue);
    vc.position.set(-0.68, 0.65, -0.08);
    vc.userData = { partKey: 'venaCava' };

    const triRing = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 10, 22), matValve);
    triRing.rotation.x = Math.PI / 2;
    triRing.position.set(-0.4, 0.22, 0.14);
    const mitRing = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 10, 22), matValve);
    mitRing.rotation.x = Math.PI / 2;
    mitRing.position.set(0.4, 0.24, 0.1);

    cutawayGroup.add(backShell, rv, lv, ra, la, septum, aorta, pulm, vc, triRing, mitRing);
    interactables.push(rv, lv, ra, la, septum, aorta, pulm, vc);

    // Animated Oxygenated & Deoxygenated Blood Corpuscles inside Cutaway
    const deoxyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.68, 1.3, -0.04),
      new THREE.Vector3(-0.54, 0.55, 0.08),
      new THREE.Vector3(-0.34, -0.25, 0.16),
      new THREE.Vector3(-0.08, 0.82, 0.26),
      new THREE.Vector3(0.65, 1.02, 0.06),
    ]);
    const oxyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.95, 0.58, -0.04),
      new THREE.Vector3(0.52, 0.55, 0.02),
      new THREE.Vector3(0.36, -0.32, 0.1),
      new THREE.Vector3(0.24, 0.96, 0.04),
      new THREE.Vector3(-0.18, 1.3, -0.14),
    ]);
    const corpuscles = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.055, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }),
      24,
    );
    cutawayGroup.add(corpuscles);
    const dummyM = new THREE.Matrix4();
    const dummyP = new THREE.Vector3();
    const oxyC = new THREE.Color(0xfbbf24);
    const deoxyC = new THREE.Color(0x38bdf8);

    const updateBlood = (phase: number) => {
      for (let i = 0; i < 24; i++) {
        const oxy = i >= 12;
        const t = ((oxy ? i - 12 : i) / 12 + phase) % 1;
        (oxy ? oxyCurve : deoxyCurve).getPointAt(t, dummyP);
        corpuscles.setColorAt(i, oxy ? oxyC : deoxyC);
        dummyM.makeTranslation(dummyP.x, dummyP.y, dummyP.z);
        corpuscles.setMatrixAt(i, dummyM);
      }
      corpuscles.instanceMatrix.needsUpdate = true;
      if (corpuscles.instanceColor) corpuscles.instanceColor.needsUpdate = true;
    };
    updateBlood(0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.4;
    controls.maxDistance = 9.0;

    controls.addEventListener('start', () => {
      stateRef.current.cameraTargetPos = null;
      stateRef.current.onUserInteract?.();
    });

    let frameId = 0;
    let flowPhase = 0;
    let beatClock = 0;
    const clock = new THREE.Clock();

    function requestRender() {
      cancelAnimationFrame(frameId);
      const tick = () => {
        frameId = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.1);
        const st = stateRef.current;

        const showGlb = st.modelMode === 'realistic_glb' && glbHeartContainer.children.length > 0;
        glbHeartContainer.visible = showGlb;
        cutawayGroup.visible = !showGlb;

        if (st.cameraTargetPos) {
          camera.position.lerp(st.cameraTargetPos, 1 - Math.exp(-6 * dt));
          if (camera.position.distanceTo(st.cameraTargetPos) < 0.03) {
            st.cameraTargetPos = null;
          }
        }

        if (!st.flowPaused && !st.reducedMotion) {
          flowPhase = (flowPhase + dt * 0.25) % 1;
          beatClock = (beatClock + dt * 1.25) % 1;
          const lub = Math.exp(-Math.pow((beatClock - 0.18) / 0.055, 2)) * 0.042;
          const dub = Math.exp(-Math.pow((beatClock - 0.38) / 0.065, 2)) * 0.025;
          const s = 1 + lub + dub;
          heartRoot.scale.set(s, 1 - lub * 0.35, s);
          if (!showGlb) updateBlood(flowPhase);
        } else {
          heartRoot.scale.set(1, 1, 1);
        }

        controls.update();
        renderer.render(scene, camera);
      };
      tick();
    }
    requestRenderRef.current = requestRender;
    requestRender();

    applyPresetRef.current = (preset) => {
      stateRef.current.cameraTargetPos =
        preset === 'anterior'
          ? new THREE.Vector3(0.15, 1.35, 4.9)
          : preset === 'cutaway'
            ? new THREE.Vector3(2.3, 1.3, 3.8)
            : new THREE.Vector3(0.1, 4.3, 2.2);
      stateRef.current.onUserInteract?.();
    };

    nudgeCameraRef.current = (dx, dy, zoomFactor = 1) => {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), dx);
      offset.y = THREE.MathUtils.clamp(offset.y + dy, 0.2, 5.0);
      offset.multiplyScalar(zoomFactor);
      offset.clampLength(2.4, 8.6);
      camera.position.copy(controls.target).add(offset);
      camera.lookAt(controls.target);
      stateRef.current.onUserInteract?.();
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactables, false);
      if (hits.length > 0) {
        const partKey = hits[0].object.userData.partKey as string;
        const info = PART_INFO[partKey];
        if (info) {
          setHoveredLabel(`${info.label} — ${info.detail}`);
          stateRef.current.onSelectPart?.(info.label, info.detail);
          stateRef.current.onUserInteract?.();
        }
      }
    };
    renderer.domElement.addEventListener('click', onPointerDown);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onPointerDown);
      controls.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="p-6 rounded-[20px] border border-[var(--line)] bg-[var(--viewer-bg)] text-center space-y-3">
        <p className="text-base font-extrabold text-[var(--ink)]">
          3D graphics unavailable — showing 2D cutaway diagram
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 overflow-hidden'
          : 'relative w-full h-[400px] sm:h-[440px] rounded-[20px] overflow-hidden border border-[var(--line)] bg-slate-950'
      }
    >
      <div
        ref={canvasMountRef}
        data-testid="threejs-model-canvas"
        className="w-full h-full cursor-grab"
        aria-label="Photorealistic 3D Human Heart & Cutaway Explorer"
      />

      <div className="absolute top-3 left-3 max-w-md bg-slate-950/88 text-white px-3.5 py-2 rounded-xl border border-white/15 text-xs shadow-sm pointer-events-none backdrop-blur-xs">
        <span className="font-extrabold text-rose-300">Selected: </span>
        <span>{hoveredLabel}</span>
      </div>

      {/* Top-right Mode Switcher (Real GLB Heart vs Internal Cutaway) + Fullscreen */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {glbLoaded && (
          <div className="inline-flex p-0.5 rounded-xl bg-slate-950/90 border border-white/20 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setModelMode('realistic_glb')}
              className={`px-2.5 py-1.5 rounded-lg ${modelMode === 'realistic_glb' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
            >
              Real 3D Heart
            </button>
            <button
              type="button"
              onClick={() => setModelMode('cutaway_chambers')}
              className={`px-2.5 py-1.5 rounded-lg ${modelMode === 'cutaway_chambers' ? 'bg-[#4255D4] text-white' : 'text-slate-300 hover:text-white'
                }`}
            >
              Internal Cutaway
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen 3D heart' : 'Fullscreen 3D heart'}
          className="px-3 py-1.5 min-h-[34px] rounded-xl bg-slate-950/90 hover:bg-slate-900 text-white border border-white/20 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
      </div>

      {/* Collapsible Bottom Control Dock */}
      <div
        style={{ bottom: '12px', left: '50%', transform: 'translateX(-50%)', maxWidth: 'min(920px, 95%)' }}
        className="absolute w-full flex flex-col items-center z-10"
      >
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="px-3.5 py-1 min-h-[28px] rounded-t-xl bg-slate-900/95 text-white text-xs font-bold border border-b-0 border-white/15"
        >
          {dockCollapsed ? '▴ Show controls' : '▾ Hide controls'}
        </button>

        {!dockCollapsed && (
          <div className="w-full bg-slate-950/92 text-white border border-white/15 rounded-xl px-3.5 py-2 shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs backdrop-blur-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'anterior', label: 'Front' },
                  { id: 'cutaway', label: 'Side' },
                  { id: 'superior', label: 'Top Vessels' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setActiveCameraPreset(preset.id);
                    applyPresetRef.current?.(preset.id);
                  }}
                  className={`px-2.5 py-1 min-h-[32px] rounded-lg font-semibold ${activeCameraPreset === preset.id ? 'bg-[#4255D4] text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                >
                  {preset.label}
                </button>
              ))}
              <button type="button" onClick={() => nudgeCameraRef.current?.(-0.35, 0, 1)} className="px-2 py-1 min-h-[32px] rounded-lg bg-white/10 hover:bg-white/20 font-semibold">↺</button>
              <button type="button" onClick={() => nudgeCameraRef.current?.(0.35, 0, 1)} className="px-2 py-1 min-h-[32px] rounded-lg bg-white/10 hover:bg-white/20 font-semibold">↻</button>
              <button type="button" onClick={() => nudgeCameraRef.current?.(0, 0, 0.85)} className="px-2 py-1 min-h-[32px] rounded-lg bg-white/10 hover:bg-white/20 font-semibold">+</button>
              <button type="button" onClick={() => nudgeCameraRef.current?.(0, 0, 1.15)} className="px-2 py-1 min-h-[32px] rounded-lg bg-white/10 hover:bg-white/20 font-semibold">−</button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ['leftVentricle', 'Left Ventricle'],
                  ['rightVentricle', 'Right Ventricle'],
                  ['venaCava', 'Vena Cava'],
                  ['aortaArch', 'Aortic Arch'],
                  ['pulmonaryTrunk', 'Pulm. Trunk'],
                  ['septumWall', 'Valves & Septum'],
                ] as const
              ).map(([key, short]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const info = PART_INFO[key];
                    if (info) {
                      setHoveredLabel(`${info.label} — ${info.detail}`);
                      onSelectPart?.(info.label, info.detail);
                      onUserInteract?.();
                    }
                  }}
                  className="px-2.5 py-1 min-h-[32px] rounded-lg bg-teal-500/20 text-teal-200 border border-teal-400/30 font-bold hover:bg-teal-600 hover:text-white transition-colors"
                >
                  {short}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

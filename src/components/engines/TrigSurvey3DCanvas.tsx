import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import type { ClinometerMode } from '../../utils/mathSimulations';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createSkyDomeMesh,
  getGrassTerrainTextures,
  getLighthouseStripeTexture,
  getOceanWaveTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

interface TrigSurvey3DCanvasProps {
  mode: ClinometerMode;
  distanceM: number;
  angleDeg: number;
  verticalDeltaM: number;
  observerEyeM: number;
  valid: boolean;
  reducedMotion: boolean;
}

export default function TrigSurvey3DCanvas({
  mode,
  distanceM,
  angleDeg,
  verticalDeltaM,
  observerEyeM,
  valid,
  reducedMotion,
}: TrigSurvey3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const beaconBeamRef = useRef<THREE.Mesh | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.16 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the labelled 2D right-triangle diagram below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 330;

    scene.add(createSkyDomeMesh(0x0f172a, 0x38bdf8, 0x0c4a6e, 36));

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(1.2, 2.8, 6.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.2;
    controls.maxDistance = 12;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!reducedMotionRef.current && beaconBeamRef.current) {
        beaconBeamRef.current.rotation.y += 0.03;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 600;
      const ch = container.clientHeight || 330;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      controls.dispose();
      disposeStudio();
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) group.remove(group.children[0]);
    beaconBeamRef.current = null;

    const grassTex = getGrassTerrainTextures();
    const seaTex = getOceanWaveTextures('deep_blue');
    const stripeTex = getLighthouseStripeTexture();

    // Coastal meadow + sea horizon base
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.28, 3.8),
      new THREE.MeshStandardMaterial({
        map: mode === 'depression' ? seaTex.map : grassTex.map,
        bumpMap: mode === 'depression' ? seaTex.bumpMap : grassTex.bumpMap,
        bumpScale: 0.1,
        roughness: mode === 'depression' ? 0.25 : 0.84,
      }),
    );
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    group.add(ground);

    const dUnits = 1.4 + ((Math.min(90, Math.max(10, distanceM)) - 10) / 80) * 3.0;
    const hUnits = valid
      ? Math.min(3.1, Math.max(0.35, (verticalDeltaM / 45) * 2.2))
      : angleDeg === 0
      ? 0.25
      : 3.1;
    const eyeUnits = Math.min(0.45, (observerEyeM / 3) * 0.35);

    const obsX = -dUnits / 2;
    const towerX = dUnits / 2;
    const baseY = -1.06;

    // Red-and-White Masonry Striped Lighthouse Tower
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.36, hUnits, 28),
      new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.45 }),
    );
    tower.position.set(towerX, baseY + hUnits / 2, 0);
    tower.castShadow = true;

    const gallery = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.28, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 }),
    );
    gallery.position.set(towerX, baseY + hUnits + 0.04, 0);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.95,
      }),
    );
    beacon.position.set(towerX, baseY + hUnits + 0.2, 0);

    // Sweeping translucent lighthouse spotlight cone
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.65, 2.2, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    beam.rotation.z = Math.PI / 2;
    beam.position.set(towerX, baseY + hUnits + 0.2, 0);
    beaconBeamRef.current = beam;

    group.add(tower, gallery, beacon, beam);

    // Observer Figure / Target Boat
    const obsFig = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.55 + eyeUnits, 18),
      new THREE.MeshStandardMaterial({ color: 0x4255d4, roughness: 0.32, metalness: 0.2 }),
    );
    obsFig.position.set(obsX, baseY + (0.55 + eyeUnits) / 2, 0);
    obsFig.castShadow = true;
    group.add(obsFig);

    // Ground Distance Bar (d)
    const distBar = new THREE.Mesh(
      new THREE.BoxGeometry(dUnits, 0.06, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 }),
    );
    distBar.position.set(0, baseY + 0.04, 0.35);
    group.add(distBar);

    // Glowing Laser Line of Sight (Hypotenuse)
    const pStart = new THREE.Vector3(
      mode === 'elevation' ? obsX : towerX,
      mode === 'elevation' ? baseY + 0.5 + eyeUnits : baseY + hUnits + 0.2,
      0,
    );
    const pEnd = new THREE.Vector3(
      mode === 'elevation' ? towerX : obsX,
      mode === 'elevation' ? baseY + hUnits + 0.2 : baseY + 0.12,
      0,
    );
    const losDir = new THREE.Vector3().subVectors(pEnd, pStart);
    const losTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, losDir.length(), 14),
      new THREE.MeshStandardMaterial({
        color: valid ? 0x38bdf8 : 0xf87171,
        emissive: valid ? 0x0284c7 : 0xdc2626,
        emissiveIntensity: 0.85,
      }),
    );
    losTube.position.copy(pStart).add(pEnd).multiplyScalar(0.5);
    losTube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), losDir.normalize());
    group.add(losTube);

    const horizLine = new THREE.Mesh(
      new THREE.BoxGeometry(dUnits, 0.025, 0.025),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }),
    );
    horizLine.position.set(0, pStart.y, 0);
    group.add(horizLine);
  }, [mode, distanceM, angleDeg, verticalDeltaM, observerEyeM, valid]);

  if (webglError) {
    return (
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs text-[var(--text)]">
        {webglError}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col gap-3' : 'space-y-2'}
    >
      <div className={`relative ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
        <div
          ref={mountRef}
          className={`w-full ${
            isFullscreen ? 'h-full' : 'h-[330px]'
          } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden cursor-grab`}
          aria-label="Interactive 3D Trigonometry Lighthouse Survey Diorama"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-sky-300 border border-sky-400/40 text-[11px] font-bold">
          3D Survey Diorama · {mode === 'elevation' ? 'Elevation ↑' : 'Depression ↓'} · θ = {angleDeg}° · d = {distanceM} m
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 px-3 py-1.5 min-h-[34px] rounded-lg bg-slate-950/85 hover:bg-slate-900 text-white border border-white/20 text-xs font-bold inline-flex items-center gap-1.5"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={isFullscreen ? 'text-slate-300' : 'text-[var(--text-muted)]'}>
          Drag to orbit the 3D striped lighthouse &amp; laser sightline
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => groupRef.current && (groupRef.current.rotation.y -= 0.45)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Left</span>
          </button>
          <button
            type="button"
            onClick={() => groupRef.current && (groupRef.current.rotation.y += 0.45)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Right</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(0.86)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom +</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(1.16)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span>Zoom −</span>
          </button>
        </div>
      </div>
    </div>
  );
}

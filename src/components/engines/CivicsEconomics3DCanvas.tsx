import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createFloatingLabelSprite,
  createSkyDomeMesh,
  getOceanWaveTextures,
  getRockTerrainTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type Social3DKind =
  | 'civics_constitution'
  | 'civics_diplomacy'
  | 'econ_gdp'
  | 'econ_trade_clusters';

export interface CivicsEconomics3DCanvasProps {
  kind: Social3DKind;
  activePillar?: number;
  gdpValues?: [number, number, number];
  reducedMotion: boolean;
}

export default function CivicsEconomics3DCanvas({
  kind,
  activePillar = 0,
  gdpValues = [18, 28, 54],
  reducedMotion,
}: CivicsEconomics3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const spinRef = useRef<THREE.Object3D | null>(null);

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.2 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the interactive cards below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 330;

    scene.add(createSkyDomeMesh(0x1c1917, 0x78350f, 0x090d1a, 34));

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0.3, 3.0, 6.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.15, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.8;
    controls.maxDistance = 12;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!reducedMotionRef.current && spinRef.current) {
        spinRef.current.rotation.y += 0.0055;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 620;
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
    spinRef.current = null;

    const stone = getRockTerrainTextures('sandstone');

    if (kind === 'civics_constitution') {
      // 3D INDIAN PARLIAMENT & THREE-PILLAR CONSTITUTIONAL DEMOCRACY DOME!
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(2.75, 2.95, 0.35, 36),
        new THREE.MeshStandardMaterial({ map: stone.map, roughness: 0.7 }),
      );
      base.position.y = -1.1;
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.75, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshPhysicalMaterial({ map: stone.map, color: 0xfde68a, roughness: 0.45, clearcoat: 0.3 }),
      );
      dome.position.y = 0.9;
      const finial = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 }),
      );
      finial.position.y = 2.85;
      group.add(base, dome, finial);

      const pillars = [
        { name: 'Legislature (Parliament / Assembly)', x: -1.6, z: 0.9, col: 0x38bdf8 },
        { name: 'Executive (President / PM / CM)', x: 0, z: -1.5, col: 0x10b981 },
        { name: 'Judiciary (Supreme & High Courts)', x: 1.6, z: 0.9, col: 0xfbbf24 },
      ];
      pillars.forEach((p, idx) => {
        const isSel = activePillar === idx;
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.32, 0.38, 1.95, 22),
          new THREE.MeshPhysicalMaterial({
            color: p.col,
            roughness: 0.3,
            clearcoat: 0.65,
            emissive: isSel ? p.col : 0x000000,
            emissiveIntensity: isSel ? 0.48 : 0,
          }),
        );
        cyl.position.set(p.x, -0.05, p.z);
        const cap = createFloatingLabelSprite(p.name, isSel ? 'Active Constitutional Pillar' : 'Click buttons to inspect', '#fbbf24');
        cap.position.set(p.x, 1.15, p.z);
        group.add(cyl, cap);
      });
      spinRef.current = group;
    } else if (kind === 'civics_diplomacy' || kind === 'econ_trade_clusters') {
      const globeGroup = new THREE.Group();
      const texLoader = new THREE.TextureLoader();
      const earthMap = texLoader.load('/textures/earth/earth-color-4k.jpg');
      earthMap.colorSpace = THREE.SRGBColorSpace;
      const elevMap = texLoader.load('/textures/earth/earth-elev-4k.jpg');
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.65, 64, 48),
        new THREE.MeshPhongMaterial({
          map: earthMap,
          bumpMap: elevMap,
          bumpScale: 0.04,
          shininess: 18,
        }),
      );
      globeGroup.add(globe);

      const hubs: [number, number, number, number][] = [
        [0.45, 0.42, 1.55, 0xfbbf24], // India / Tamil Nadu Hub!
        [-1.1, 0.85, 0.95, 0x38bdf8], // Europe / West
        [1.35, 0.52, 0.72, 0x34d399], // ASEAN / Japan
        [0.15, -0.85, 1.4, 0xf43f5e], // Indian Ocean Rim / Africa
      ];
      const origin = new THREE.Vector3(hubs[0][0], hubs[0][1], hubs[0][2]);
      hubs.forEach(([x, y, z, col], i) => {
        const pin = new THREE.Mesh(
          new THREE.SphereGeometry(i === 0 ? 0.18 : 0.12, 14, 14),
          new THREE.MeshBasicMaterial({ color: col }),
        );
        pin.position.set(x, y, z);
        globeGroup.add(pin);
        if (i > 0) {
          const dest = new THREE.Vector3(x, y, z);
          const mid = origin.clone().add(dest).multiplyScalar(0.5).normalize().multiplyScalar(2.35);
          const arc = new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3([origin, mid, dest]), 24, 0.03, 8, false),
            new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8 }),
          );
          globeGroup.add(arc);
        }
      });

      const lbl = createFloatingLabelSprite(
        kind === 'civics_diplomacy' ? 'India’s Foreign Policy & Global Network' : 'Global Trade & TN Industrial Clusters',
        kind === 'civics_diplomacy' ? 'Panchsheel · NAM · SAARC · BRICS · UN' : 'Chennai Auto/IT · Coimbatore Textiles · Tiruppur · Sivakasi',
        '#38bdf8',
      );
      lbl.position.set(0, 2.2, 0);
      globeGroup.add(lbl);
      group.add(globeGroup);
      spinRef.current = globeGroup;
    } else {
      // 3D RISING GDP SECTOR TOWERS!
      const [agri, ind, serv] = gdpValues;
      const total = Math.max(1, agri + ind + serv);
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 0.22, 2.4),
        new THREE.MeshStandardMaterial({ map: stone.map, roughness: 0.7 }),
      );
      base.position.y = -1.15;
      group.add(base);

      const specs = [
        { label: `Primary (Agri): ${Math.round((agri / total) * 100)}%`, val: agri, x: -1.7, col: 0x10b981 },
        { label: `Secondary (Industry): ${Math.round((ind / total) * 100)}%`, val: ind, x: 0, col: 0xf59e0b },
        { label: `Tertiary (Services): ${Math.round((serv / total) * 100)}%`, val: serv, x: 1.7, col: 0x38bdf8 },
      ];
      for (const s of specs) {
        const h = Math.max(0.35, (s.val / 100) * 2.8);
        const tower = new THREE.Mesh(
          new THREE.BoxGeometry(1.05, h, 1.05),
          new THREE.MeshPhysicalMaterial({ color: s.col, roughness: 0.25, clearcoat: 0.78 }),
        );
        tower.position.set(s.x, -1.04 + h / 2, 0);
        const cap = createFloatingLabelSprite(s.label, `₹${s.val}L Cr`, '#f8fafc');
        cap.position.set(s.x, -1.04 + h + 0.55, 0);
        group.add(tower, cap);
      }
    }
  }, [kind, activePillar, gdpValues]);

  const nudge = (axis: 'rot' | 'zoom', delta: number) => {
    if (axis === 'rot' && groupRef.current) groupRef.current.rotation.y += delta;
    if (axis === 'zoom' && cameraRef.current) {
      cameraRef.current.position.z = Math.max(3.0, Math.min(11.5, cameraRef.current.position.z + delta));
    }
  };

  if (webglError) {
    return (
      <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)]">
        {webglError}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`space-y-2.5 ${isFullscreen ? 'bg-slate-950 p-4 rounded-none' : ''}`}>
      <div className="relative rounded-[18px] overflow-hidden border border-[var(--line)] bg-slate-950 shadow-inner">
        <div ref={mountRef} className={`w-full ${isFullscreen ? 'h-[82vh]' : 'h-[310px] sm:h-[340px]'} cursor-grab active:cursor-grabbing`} />
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-[11px] font-bold text-white inline-flex items-center gap-1"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[var(--text-muted)]">Drag to orbit 360° · Inspect pillars, trade routes, and growth towers</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => nudge('rot', -0.45)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => nudge('rot', 0.45)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Right
          </button>
          <button type="button" onClick={() => nudge('zoom', -0.8)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" /> Zoom In
          </button>
          <button type="button" onClick={() => nudge('zoom', 0.8)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import { createSkyDomeMesh, getOrganicTissueTextures } from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type PlantSpecimen = 'dicot_root' | 'chloroplast';

interface PlantAnatomy3DCanvasProps {
  specimen: PlantSpecimen;
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  reducedMotion: boolean;
}

export default function PlantAnatomy3DCanvas({
  specimen,
  selectedPartId,
  onSelectPart,
  reducedMotion,
}: PlantAnatomy3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const pickMapRef = useRef<Map<THREE.Object3D, string>>(new Map());
  const onSelectRef = useRef(onSelectPart);
  onSelectRef.current = onSelectPart;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.15 });
    if (!studio) {
      setWebglError('WebGL unavailable. Switch to the labelled 2D Plant Cross-Section below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 350;

    scene.add(createSkyDomeMesh(0x064e3b, 0x0f172a, 0x022c22, 32));

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 3.2, 5.1);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.6;
    controls.maxDistance = 11;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handleClick = (ev: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(Array.from(pickMapRef.current.keys()), false);
      if (hits.length > 0) {
        const id = pickMapRef.current.get(hits[0].object);
        if (id) onSelectRef.current(id);
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!reducedMotionRef.current && groupRef.current) {
        groupRef.current.rotation.y += 0.0045;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 600;
      const ch = container.clientHeight || 350;
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
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      disposeStudio();
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) group.remove(group.children[0]);
    pickMapRef.current.clear();

    const cellTex = getOrganicTissueTextures('botanical');
    const makeMat = (hex: number, id: string, opacity = 1, textured = true) =>
      new THREE.MeshPhysicalMaterial({
        color: hex,
        map: textured ? cellTex.map : undefined,
        bumpMap: textured ? cellTex.bumpMap : undefined,
        bumpScale: 0.055,
        roughness: 0.34,
        metalness: 0.05,
        clearcoat: 0.35,
        transparent: opacity < 1,
        opacity,
        side: THREE.DoubleSide,
        emissive: selectedPartId === id ? new THREE.Color(0xfbbf24) : new THREE.Color(0x000000),
        emissiveIntensity: selectedPartId === id ? 0.42 : 0,
      });

    if (specimen === 'dicot_root') {
      const epiblema = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 2.1, 1.3, 48, 1, true, 0, Math.PI * 1.65),
        makeMat(0x84cc16, 'epiblema'),
      );
      group.add(epiblema);
      pickMapRef.current.set(epiblema, 'epiblema');

      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 1.55 + 0.1;
        const hair = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.058, 0.78, 10),
          makeMat(0xa3e635, 'epiblema', 1, false),
        );
        hair.position.set(Math.sin(ang) * 2.44, i % 2 === 0 ? 0.25 : -0.25, Math.cos(ang) * 2.44);
        hair.rotation.z = -Math.sin(ang) * (Math.PI / 2);
        hair.rotation.x = Math.cos(ang) * (Math.PI / 2);
        group.add(hair);
        pickMapRef.current.set(hair, 'epiblema');
      }

      const cortex = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 1.9, 1.45, 48, 1, false, 0, Math.PI * 1.65),
        makeMat(0xd9f99d, 'cortex'),
      );
      group.add(cortex);
      pickMapRef.current.set(cortex, 'cortex');

      const endodermis = new THREE.Mesh(
        new THREE.CylinderGeometry(1.18, 1.18, 1.68, 40),
        makeMat(0xd97706, 'endodermis'),
      );
      group.add(endodermis);
      pickMapRef.current.set(endodermis, 'endodermis');

      const pericycle = new THREE.Mesh(
        new THREE.CylinderGeometry(1.02, 1.02, 1.82, 36),
        makeMat(0x22c55e, 'pericycle'),
      );
      group.add(pericycle);
      pickMapRef.current.set(pericycle, 'pericycle');

      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2;
        const xylemArm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.16, 2.15, 18),
          makeMat(0xdc2626, 'xylem', 1, false),
        );
        xylemArm.position.set(Math.cos(ang) * 0.42, 0.08, Math.sin(ang) * 0.42);
        group.add(xylemArm);
        pickMapRef.current.set(xylemArm, 'xylem');
      }
      const centerXylem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 2.15, 18),
        makeMat(0xb91c1c, 'xylem', 1, false),
      );
      centerXylem.position.y = 0.08;
      group.add(centerXylem);
      pickMapRef.current.set(centerXylem, 'xylem');

      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2 + Math.PI / 4;
        const phloemPatch = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 2.04, 16),
          makeMat(0x2563eb, 'phloem', 1, false),
        );
        phloemPatch.position.set(Math.cos(ang) * 0.62, 0.05, Math.sin(ang) * 0.62);
        group.add(phloemPatch);
        pickMapRef.current.set(phloemPatch, 'phloem');
      }
    } else {
      const outerEnv = new THREE.Mesh(
        new THREE.SphereGeometry(2.15, 44, 28, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58),
        makeMat(0x15803d, 'envelope'),
      );
      outerEnv.scale.set(1.25, 0.72, 0.92);
      group.add(outerEnv);
      pickMapRef.current.set(outerEnv, 'envelope');

      const stromaFloor = new THREE.Mesh(
        new THREE.CylinderGeometry(2.02, 1.95, 0.16, 40),
        makeMat(0x86efac, 'stroma', 0.9),
      );
      stromaFloor.scale.set(1.22, 1, 0.88);
      stromaFloor.position.y = -0.22;
      group.add(stromaFloor);
      pickMapRef.current.set(stromaFloor, 'stroma');

      const granumCoords: [number, number][] = [
        [-1.15, -0.35],
        [-0.2, 0.52],
        [0.85, -0.3],
        [0.25, -0.78],
      ];
      for (const [gx, gz] of granumCoords) {
        for (let layer = 0; layer < 5; layer++) {
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.38, 0.38, 0.11, 24),
            makeMat(0x166534, 'grana'),
          );
          disc.position.set(gx, -0.04 + layer * 0.14, gz);
          group.add(disc);
          pickMapRef.current.set(disc, 'grana');
        }
      }

      const links: [number, number][] = [
        [0, 1],
        [1, 2],
        [0, 3],
        [3, 2],
      ];
      for (const [i, j] of links) {
        const p1 = new THREE.Vector3(granumCoords[i][0], 0.22, granumCoords[i][1]);
        const p2 = new THREE.Vector3(granumCoords[j][0], 0.22, granumCoords[j][1]);
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const bridge = new THREE.Mesh(
          new THREE.BoxGeometry(dir.length(), 0.06, 0.14),
          makeMat(0x4ade80, 'lamellae', 1, false),
        );
        bridge.position.copy(p1).add(p2).multiplyScalar(0.5);
        bridge.rotation.y = -Math.atan2(dir.z, dir.x);
        group.add(bridge);
        pickMapRef.current.set(bridge, 'lamellae');
      }
    }
  }, [specimen, selectedPartId]);

  if (webglError) {
    return (
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--text)]">
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
          className={`w-full ${isFullscreen ? 'h-full' : 'h-[350px]'
            } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden cursor-grab`}
          aria-label={`Interactive 3D plant anatomy cutaway: ${specimen === 'dicot_root' ? 'Dicot Root Transverse Section' : 'Chloroplast Organelle'}`}
        />
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
          Click any 3D cellular tissue layer or organelle to inspect · Drag to orbit
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
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(0.85)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom +</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(1.18)}
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

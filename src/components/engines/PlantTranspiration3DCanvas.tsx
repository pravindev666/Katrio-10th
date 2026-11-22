import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createSkyDomeMesh,
  getGrassTerrainTextures,
  getOrganicTissueTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

interface PlantTranspiration3DCanvasProps {
  mode: 'osmosis' | 'transpiration';
  externalSolutePct?: number; // 0..100 for osmosis vacuole/protoplasm swelling or plasmolysis
  stomataOpen?: boolean;
  pathway?: 'apoplast' | 'symplast';
  reducedMotion: boolean;
}

export default function PlantTranspiration3DCanvas({
  mode,
  externalSolutePct = 20,
  stomataOpen = true,
  reducedMotion,
}: PlantTranspiration3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  const animRef = useRef<{
    reducedMotion: boolean;
    mode: 'osmosis' | 'transpiration';
    solutePct: number;
    stomataOpen: boolean;
    waterDroplets: THREE.Mesh[];
    vaporPuffs: THREE.Mesh[];
    vacuole?: THREE.Mesh;
    protoplasm?: THREE.Mesh;
    leftGuard?: THREE.Mesh;
    rightGuard?: THREE.Mesh;
  }>({
    reducedMotion,
    mode,
    solutePct: externalSolutePct,
    stomataOpen,
    waterDroplets: [],
    vaporPuffs: [],
  });

  useEffect(() => {
    animRef.current.reducedMotion = reducedMotion;
    animRef.current.mode = mode;
    animRef.current.solutePct = externalSolutePct;
    animRef.current.stomataOpen = stomataOpen;
  }, [reducedMotion, mode, externalSolutePct, stomataOpen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.18 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the interactive 2D biology view below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 310;

    scene.add(createSkyDomeMesh(0x064e3b, 0x0f172a, 0x022c22, 34));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0.3, 2.3, 5.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.6;
    controls.maxDistance = 11;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let animId = 0;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const st = animRef.current;
      t += 0.03;

      // Smooth vacuole & protoplasm turgid <-> plasmolysed deformation
      if (st.vacuole && st.protoplasm) {
        const targetVac = THREE.MathUtils.clamp(1.12 - (st.solutePct / 100) * 0.68, 0.38, 1.12);
        const targetProto = THREE.MathUtils.clamp(0.98 - (st.solutePct / 100) * 0.4, 0.56, 0.98);
        st.vacuole.scale.lerp(new THREE.Vector3(targetVac, targetVac, targetVac), 0.08);
        st.protoplasm.scale.lerp(new THREE.Vector3(targetProto, targetProto, targetProto), 0.08);
      }

      // Smooth 3D Guard Cell bow opening / closing!
      if (st.leftGuard && st.rightGuard) {
        const targetX = st.stomataOpen ? 0.42 : 0.2;
        st.leftGuard.position.x += (-targetX - st.leftGuard.position.x) * 0.08;
        st.rightGuard.position.x += (targetX - st.rightGuard.position.x) * 0.08;
      }

      if (!st.reducedMotion) {
        if (st.mode === 'osmosis') {
          const dir = st.solutePct < 38 ? -1 : st.solutePct > 62 ? 1 : 0; // -1 = inward, +1 = outward
          for (let i = 0; i < st.waterDroplets.length; i++) {
            const d = st.waterDroplets[i];
            const baseAng = (i / st.waterDroplets.length) * Math.PI * 2;
            const phase = ((t * 0.45) + (i % 4) * 0.25) % 1;
            const rad =
              dir === -1
                ? THREE.MathUtils.lerp(2.4, 0.85, phase)
                : dir === 1
                ? THREE.MathUtils.lerp(0.85, 2.4, phase)
                : 1.55 + Math.sin(t * 2 + i) * 0.35;
            d.position.set(Math.cos(baseAng) * rad, Math.sin(i * 1.7) * 0.55, Math.sin(baseAng) * rad);
          }
        } else {
          // Rising Xylem water beads + escaping transpiration water vapour mist!
          for (let i = 0; i < st.waterDroplets.length; i++) {
            const d = st.waterDroplets[i];
            d.position.y += st.stomataOpen ? 0.025 : 0.004;
            if (d.position.y > 0.35) d.position.y = -1.65;
          }
          for (let i = 0; i < st.vaporPuffs.length; i++) {
            const v = st.vaporPuffs[i];
            v.visible = st.stomataOpen;
            v.position.y += 0.022;
            v.scale.setScalar(0.7 + ((v.position.y - 0.5) / 1.8) * 0.9);
            if (v.position.y > 2.2) {
              v.position.y = 0.55;
              v.scale.setScalar(0.6);
            }
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 620;
      const ch = container.clientHeight || 310;
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
    animRef.current.waterDroplets = [];
    animRef.current.vaporPuffs = [];
    animRef.current.vacuole = undefined;
    animRef.current.protoplasm = undefined;
    animRef.current.leftGuard = undefined;
    animRef.current.rightGuard = undefined;

    const botTex = getOrganicTissueTextures('botanical');
    const grassTex = getGrassTerrainTextures();

    if (mode === 'osmosis') {
      // 3D Cutaway Plant Cell showing Rigid Cell Wall + Swelling/Shrinking Protoplasm + Blue Central Vacuole
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 1.8, 2.0),
        new THREE.MeshPhysicalMaterial({
          color: 0x16a34a,
          map: botTex.map,
          bumpMap: botTex.bumpMap,
          bumpScale: 0.06,
          roughness: 0.45,
          transparent: true,
          opacity: 0.34,
          side: THREE.DoubleSide,
        }),
      );
      const wallFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2.62, 1.82, 2.02)),
        new THREE.LineBasicMaterial({ color: 0x4ade80 }),
      );
      const protoplasm = new THREE.Mesh(
        new THREE.SphereGeometry(0.95, 28, 22),
        new THREE.MeshPhysicalMaterial({
          color: 0x86efac,
          roughness: 0.35,
          transparent: true,
          opacity: 0.45,
        }),
      );
      protoplasm.scale.set(1.15, 0.85, 0.9);

      const vacuole = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 28, 22),
        new THREE.MeshPhysicalMaterial({
          color: 0x0284c7,
          roughness: 0.14,
          clearcoat: 1,
          transparent: true,
          opacity: 0.85,
        }),
      );
      vacuole.scale.set(1.1, 0.8, 0.85);
      group.add(wall, wallFrame, protoplasm, vacuole);
      animRef.current.vacuole = vacuole;
      animRef.current.protoplasm = protoplasm;

      // 18 Orbiting/Crossing 3D Water Droplets
      const dropMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.1, clearcoat: 1 });
      for (let i = 0; i < 18; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), dropMat);
        group.add(drop);
        animRef.current.waterDroplets.push(drop);
      }
    } else {
      // 3D Transpiration Xylem Column + Textured Leaf Surface + 3D Opening/Closing Stomatal Guard Cells!
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.72, 2.2, 28, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x15803d,
          map: botTex.map,
          bumpMap: botTex.bumpMap,
          bumpScale: 0.06,
          roughness: 0.65,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        }),
      );
      stem.position.y = -0.65;
      group.add(stem);

      // 3 Inner Red Xylem Capillaries carrying water UPWARD
      const xylemMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45, transparent: true, opacity: 0.55 });
      for (const [xx, xz] of [[-0.22, 0], [0.22, 0], [0, 0.22]]) {
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.15, 14), xylemMat);
        tube.position.set(xx, -0.65, xz);
        group.add(tube);
      }

      // Broad Textured Green Leaf Disc at top of stem
      const leafDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(2.3, 2.3, 0.14, 42),
        new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          map: grassTex.map,
          bumpMap: grassTex.bumpMap,
          bumpScale: 0.08,
          roughness: 0.6,
        }),
      );
      leafDisc.position.y = 0.48;
      leafDisc.receiveShadow = true;
      group.add(leafDisc);

      // 3D Bean-Shaped Guard Cell Pair crowning the leaf stoma!
      const guardMat = new THREE.MeshPhysicalMaterial({
        color: 0x16a34a,
        map: botTex.map,
        roughness: 0.3,
        clearcoat: 0.65,
      });
      const leftGuard = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.16, 16, 28, Math.PI), guardMat);
      leftGuard.rotation.x = Math.PI / 2;
      leftGuard.rotation.z = Math.PI / 2;
      leftGuard.position.set(-0.42, 0.64, 0);

      const rightGuard = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.16, 16, 28, Math.PI), guardMat);
      rightGuard.rotation.x = Math.PI / 2;
      rightGuard.rotation.z = -Math.PI / 2;
      rightGuard.position.set(0.42, 0.64, 0);
      group.add(leftGuard, rightGuard);
      animRef.current.leftGuard = leftGuard;
      animRef.current.rightGuard = rightGuard;

      // Rising Xylem Water Droplets
      const waterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let i = 0; i < 12; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), waterMat);
        drop.position.set((i % 3 - 1) * 0.22, -1.6 + i * 0.16, i % 3 === 2 ? 0.22 : 0);
        group.add(drop);
        animRef.current.waterDroplets.push(drop);
      }

      // Shimmering 3D Transpiration Water Vapour Mist escaping Stoma!
      const vaporMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.42 });
      for (let i = 0; i < 14; i++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), vaporMat);
        puff.position.set(Math.sin(i * 1.9) * 0.24, 0.65 + (i * 0.12), Math.cos(i * 1.7) * 0.24);
        group.add(puff);
        animRef.current.vaporPuffs.push(puff);
      }
    }
  }, [mode]);

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
            isFullscreen ? 'h-full' : 'h-[300px]'
          } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden cursor-grab`}
          aria-label={`Interactive 3D Plant ${mode === 'osmosis' ? 'Osmosis Cell' : 'Transpiration & Stomata'} Model`}
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold">
          {mode === 'osmosis'
            ? '3D Plant Cell Osmosis & Plasmolysis Cutaway'
            : `3D Xylem Pull & Stomatal Guard Cells (${stomataOpen ? 'OPEN · Transpiring ↑' : 'CLOSED'})`}
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
          Drag to orbit 3D plant model · Adjust controls to watch live cellular response
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => groupRef.current && (groupRef.current.rotation.y -= 0.45)} className="px-2.5 py-1 min-h-[32px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => groupRef.current && (groupRef.current.rotation.y += 0.45)} className="px-2.5 py-1 min-h-[32px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Right
          </button>
          <button type="button" onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(0.86)} className="px-2.5 py-1 min-h-[32px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" /> +
          </button>
          <button type="button" onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(1.16)} className="px-2.5 py-1 min-h-[32px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1">
            <ZoomOut className="w-3.5 h-3.5" /> −
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createFloatingLabelSprite,
  createSkyDomeMesh,
  getWoodBenchTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type ChemNuc3DKind = 'nuclear' | 'periodic' | 'solubility';

export interface ChemistryNuclear3DCanvasProps {
  kind: ChemNuc3DKind;
  // Nuclear
  controlRodPct?: number;
  // Periodic
  elementSymbol?: string;
  atomicNumber?: number;
  atomicRadiusPm?: number;
  shells?: number[];
  // Solubility
  spoons?: number;
  tempC?: number;
  excessCrystals?: number;
  reducedMotion: boolean;
}

export default function ChemistryNuclear3DCanvas(props: ChemistryNuclear3DCanvasProps) {
  const { kind, reducedMotion } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const animRef = useRef<{
    neutrons: { mesh: THREE.Mesh; vel: THREE.Vector3 }[];
    electronGroups: { grp: THREE.Group; speed: number }[];
    dissolvedOrbs: { mesh: THREE.Mesh; phase: number; r: number }[];
    flameMesh?: THREE.Mesh;
    coreGlow?: THREE.PointLight;
  }>({ neutrons: [], electronGroups: [], dissolvedOrbs: [] });

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.24 });
    if (!studio) {
      setWebglError('WebGL unavailable. Use the interactive controls below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 340;

    scene.add(createSkyDomeMesh(0x090d1a, 0x164e63, 0x050814, 34));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0.25, 1.85, 5.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.05, 0);
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
      t += 0.032;
      if (!reducedMotionRef.current) {
        for (const n of animRef.current.neutrons) {
          n.mesh.position.add(n.vel);
          if (n.mesh.position.length() > 1.35) {
            n.mesh.position.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
          }
        }
        for (const eg of animRef.current.electronGroups) {
          eg.grp.rotation.y += eg.speed;
          eg.grp.rotation.z += eg.speed * 0.35;
        }
        for (const d of animRef.current.dissolvedOrbs) {
          const ang = t * 1.1 + d.phase;
          d.mesh.position.x = Math.cos(ang) * d.r;
          d.mesh.position.z = Math.sin(ang) * d.r;
          d.mesh.position.y = -0.35 + Math.sin(t * 1.8 + d.phase) * 0.32;
        }
        if (animRef.current.flameMesh) {
          animRef.current.flameMesh.scale.y = 0.88 + Math.sin(t * 14) * 0.18;
        }
        if (animRef.current.coreGlow) {
          animRef.current.coreGlow.intensity = 2.4 + Math.sin(t * 6) * 0.6;
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 620;
      const ch = container.clientHeight || 340;
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
    animRef.current = { neutrons: [], electronGroups: [], dissolvedOrbs: [] };

    if (kind === 'nuclear') {
      // REAL 3D PRESSURIZED NUCLEAR REACTOR VESSEL WITH CHERENKOV BLUE GLOW + MOVING BORON CONTROL RODS!
      const rodPct = props.controlRodPct ?? 60;
      const activeFactor = Math.max(0.08, 1 - rodPct / 100);

      const floor = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.6, 0.25, 36),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.4 }),
      );
      floor.position.y = -1.35;

      // Translucent borosilicate containment dome filled with glowing Cherenkov heavy-water moderator
      const vessel = new THREE.Mesh(
        new THREE.CylinderGeometry(1.55, 1.55, 2.4, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.22,
          roughness: 0.08,
          transmission: 0.65,
          clearcoat: 1,
          side: THREE.DoubleSide,
        }),
      );
      vessel.position.y = -0.05;

      // Uranium-235 Fuel Assembly Rods glowing orange-amber based on reactivity!
      const fuelMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.35 + activeFactor * 1.4,
        metalness: 0.5,
        roughness: 0.25,
      });
      for (const [fx, fz] of [
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.55],
        [0.55, 0.55],
        [0, 0],
      ]) {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.75, 16), fuelMat);
        rod.position.set(fx, -0.35, fz);
        group.add(rod);
      }

      // Sliding Boron/Cadmium Control Rods — physically slide DOWN into the core as rodPct increases!
      const ctrlMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
      const rodY = 1.35 - (rodPct / 100) * 1.55;
      for (const [cx, cz] of [
        [-0.35, 0],
        [0.35, 0],
        [0, -0.35],
        [0, 0.35],
      ]) {
        const cRod = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 1.6, 14), ctrlMat);
        cRod.position.set(cx, rodY, cz);
        group.add(cRod);
      }

      // Cherenkov core light
      const coreLight = new THREE.PointLight(rodPct < 35 ? 0xf97316 : 0x38bdf8, 2.8, 7);
      coreLight.position.set(0, 0.1, 0);
      animRef.current.coreGlow = coreLight;

      // Flying 3D Fission Neutrons (speed & count scale dynamically with control rod withdrawal!)
      const nCount = Math.round(4 + activeFactor * 26);
      const nMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      for (let i = 0; i < nCount; i++) {
        const nMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), nMat);
        nMesh.position.set((Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.4);
        const speed = 0.018 + activeFactor * 0.048;
        const vel = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(speed);
        group.add(nMesh);
        animRef.current.neutrons.push({ mesh: nMesh, vel });
      }

      const lbl = createFloatingLabelSprite(
        `3D Nuclear Reactor Core · Rods ${rodPct}% Inserted`,
        rodPct >= 75 ? 'Sub-Critical (Safe Shutdown)' : rodPct >= 40 ? 'Steady Controlled Fission' : 'Super-Critical Surge!',
        rodPct < 35 ? '#fb7185' : '#38bdf8',
      );
      lbl.position.set(0, 1.95, 0);
      group.add(floor, vessel, coreLight, lbl);
    } else if (kind === 'periodic') {
      // REAL 3D BOHR ATOMIC ORBITAL SHELLS — VISUALLY SHOWS ATOMIC RADIUS SHRINK/GROW!
      const sym = props.elementSymbol ?? 'Na';
      const zNum = props.atomicNumber ?? 11;
      const radiusPm = props.atomicRadiusPm ?? 186;
      const shells = props.shells ?? [2, 8, 1];
      const maxOuterR = Math.max(0.95, Math.min(2.15, (radiusPm / 227) * 2.1));

      // Clustered 3D Protons (red) & Neutrons (silver) in nucleus
      const nucGroup = new THREE.Group();
      const pMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.25, clearcoat: 0.8 });
      const nMat = new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, roughness: 0.3, clearcoat: 0.7 });
      const drawNucleons = Math.min(18, Math.max(6, zNum));
      for (let i = 0; i < drawNucleons; i++) {
        const phi = Math.acos(-1 + (2 * i) / drawNucleons);
        const theta = Math.sqrt(drawNucleons * Math.PI) * phi;
        const r = 0.22;
        const sp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 12), i % 2 === 0 ? pMat : nMat);
        sp.position.set(Math.cos(theta) * Math.sin(phi) * r, Math.sin(theta) * Math.sin(phi) * r, Math.cos(phi) * r);
        nucGroup.add(sp);
      }
      group.add(nucGroup);

      // 3D Electron Shells (K, L, M, N) scaled directly to real atomic radius!
      const ringColors = [0x38bdf8, 0x34d399, 0xfbbf24, 0xc084fc];
      shells.forEach((eCount, sIdx) => {
        const r = 0.65 + ((sIdx + 1) / shells.length) * (maxOuterR - 0.55);
        const orbitGrp = new THREE.Group();
        orbitGrp.rotation.x = sIdx * 0.48 + 0.25;
        orbitGrp.rotation.y = sIdx * 0.6;

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.018, 10, 64),
          new THREE.MeshBasicMaterial({ color: ringColors[sIdx % ringColors.length], transparent: true, opacity: 0.65 }),
        );
        ring.rotation.x = Math.PI / 2;
        orbitGrp.add(ring);

        for (let e = 0; e < eCount; e++) {
          const ang = (e / eCount) * Math.PI * 2;
          const elec = new THREE.Mesh(
            new THREE.SphereGeometry(0.085, 14, 14),
            new THREE.MeshBasicMaterial({ color: ringColors[sIdx % ringColors.length] }),
          );
          elec.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r);
          orbitGrp.add(elec);
        }

        group.add(orbitGrp);
        animRef.current.electronGroups.push({ grp: orbitGrp, speed: 0.022 / (sIdx + 1) });
      });

      const lbl = createFloatingLabelSprite(
        `3D Atom: ${sym} (Z = ${zNum}) · Radius = ${radiusPm} pm`,
        `Shells: [${shells.join(', ')}] · Notice 3D size shift across Period vs Group!`,
        '#38bdf8',
      );
      lbl.position.set(0, 2.25, 0);
      group.add(lbl);
    } else {
      // REAL 3D GLASS SOLUBILITY BEAKER ON GLOWING BUNSEN BURNER WITH DISSOLVING & PRECIPITATING 3D CRYSTALS!
      const spoons = props.spoons ?? 3;
      const tempC = props.tempC ?? 25;
      const excess = props.excessCrystals ?? 0;
      const dissolved = Math.max(0, spoons - excess);

      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.22, 3.0),
        new THREE.MeshStandardMaterial({ map: getWoodBenchTextures().map, roughness: 0.72 }),
      );
      bench.position.y = -1.45;
      group.add(bench);

      // Metal Tripod Stand + Wire Gauze
      const standMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      const ringTop = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.045, 10, 32), standMat);
      ringTop.rotation.x = Math.PI / 2;
      ringTop.position.y = -0.82;
      group.add(ringTop);
      for (let i = 0; i < 3; i++) {
        const ang = (i / 3) * Math.PI * 2 + 0.5;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.65, 8), standMat);
        leg.position.set(Math.cos(ang) * 0.96, -1.12, Math.sin(ang) * 0.96);
        group.add(leg);
      }

      // Bunsen Burner & Live Scaling Flame when heated (> 30°C)!
      const burnerTube = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.36, 14), standMat);
      burnerTube.position.set(0, -1.24, 0);
      group.add(burnerTube);

      if (tempC > 30) {
        const flameH = 0.22 + ((tempC - 30) / 60) * 0.38;
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.14, flameH, 16),
          new THREE.MeshBasicMaterial({ color: tempC > 60 ? 0x38bdf8 : 0xf97316, transparent: true, opacity: 0.88 }),
        );
        flame.position.set(0, -1.04 + flameH / 2, 0);
        const fLight = new THREE.PointLight(0xf97316, 2.4, 4.5);
        fLight.position.set(0, -0.9, 0);
        group.add(flame, fLight);
        animRef.current.flameMesh = flame;
      }

      // Translucent Glass Beaker + Shimmering Solution Liquid!
      const beaker = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.0, 2.05, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.25,
          roughness: 0.06,
          clearcoat: 1,
          side: THREE.DoubleSide,
        }),
      );
      beaker.position.y = 0.22;
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.98, 0.95, 1.38, 32),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color().setHSL(0.55, 0.85, Math.max(0.32, 0.68 - dissolved * 0.04)),
          transparent: true,
          opacity: 0.52,
          roughness: 0.15,
          clearcoat: 0.9,
        }),
      );
      liquid.position.y = -0.08;
      group.add(beaker, liquid);

      // Floating Dissolved 3D Solute Ions strictly inside the liquid!
      const ionMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
      for (let i = 0; i < Math.min(28, dissolved * 4); i++) {
        const ion = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), ionMat);
        const r = 0.18 + (i % 5) * 0.14;
        const phase = i * 1.17;
        ion.position.set(Math.cos(phase) * r, -0.35, Math.sin(phase) * r);
        group.add(ion);
        animRef.current.dissolvedOrbs.push({ mesh: ion, phase, r });
      }

      // Undissolved Gleaming 3D Cubic Crystals settling on the beaker floor when supersaturated!
      const crystalMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15, clearcoat: 0.95 });
      for (let c = 0; c < Math.min(32, excess * 6); c++) {
        const ang = c * 1.9;
        const rad = Math.min(0.75, 0.12 + (c % 6) * 0.11);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), crystalMat);
        cube.position.set(Math.cos(ang) * rad, -0.7 + Math.floor(c / 10) * 0.12, Math.sin(ang) * rad);
        cube.rotation.set(c * 0.4, c * 0.7, 0);
        group.add(cube);
      }

      const lbl = createFloatingLabelSprite(
        `3D Solubility Lab · ${spoons} spoons at ${tempC}°C`,
        excess > 0 ? `Supersaturated! ${excess} spoon(s) crystallized at bottom` : 'Fully Dissolved Solution',
        excess > 0 ? '#fbbf24' : '#38bdf8',
      );
      lbl.position.set(0, 1.85, 0);
      group.add(lbl);
    }
  }, [kind, props.controlRodPct, props.elementSymbol, props.atomicNumber, props.atomicRadiusPm, props.shells, props.spoons, props.tempC, props.excessCrystals]);

  const nudge = (axis: 'rot' | 'zoom', delta: number) => {
    if (axis === 'rot' && groupRef.current) groupRef.current.rotation.y += delta;
    if (axis === 'zoom' && cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.6, Math.min(10.5, cameraRef.current.position.z + delta));
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
        <span className="text-[var(--text-muted)]">Drag to orbit 360° · Adjust controls to test real-time 3D physics &amp; chemistry</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => nudge('rot', -0.45)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => nudge('rot', 0.45)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Right
          </button>
          <button type="button" onClick={() => nudge('zoom', -0.8)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" /> Zoom +
          </button>
          <button type="button" onClick={() => nudge('zoom', 0.8)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomOut className="w-3.5 h-3.5" /> Zoom −
          </button>
        </div>
      </div>
    </div>
  );
}

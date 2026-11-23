import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createFloatingLabelSprite,
  createSkyDomeMesh,
  getOrganicTissueTextures,
} from '../../three/proceduralTextures';
import { loadNormalizedGLB } from '../../three/glbLoader';
import { useFullscreen } from '../../hooks/useFullscreen';

export type Biology3DKind =
  | 'gametogenesis'
  | 'neuron'
  | 'brain'
  | 'animal_cell'
  | 'kidney'
  | 'flower'
  | 'plant_foliage'
  | 'dna'
  | 'immune'
  | 'camera_optics'
  | 'gears';

export interface BiologyCell3DCanvasProps {
  kind: Biology3DKind;
  selectedPart?: string;
  onSelectPart?: (partId: string) => void;
  reducedMotion: boolean;
}

export default function BiologyCell3DCanvas({
  kind,
  selectedPart,
  onSelectPart,
  reducedMotion,
}: BiologyCell3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const pickMapRef = useRef<Map<THREE.Object3D, string>>(new Map());
  const onSelectRef = useRef(onSelectPart);
  onSelectRef.current = onSelectPart;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const animRef = useRef<{
    tailSegments: THREE.Mesh[];
    impulseSpark?: THREE.Mesh;
    spinGroup?: THREE.Group;
  }>({ tailSegments: [] });

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.24 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the interactive cards below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 340;

    scene.add(createSkyDomeMesh(0x0b1222, 0x164e63, 0x090e1a, 34));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 1.15, 5.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.2;
    controls.maxDistance = 11;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onClick = (ev: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(Array.from(pickMapRef.current.keys()), false);
      if (hits.length > 0) {
        const id = pickMapRef.current.get(hits[0].object);
        if (id && onSelectRef.current) onSelectRef.current(id);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    let animId = 0;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.036;
      if (!reducedMotionRef.current) {
        if (animRef.current.impulseSpark) {
          const p = (t * 0.28) % 1;
          animRef.current.impulseSpark.position.x = THREE.MathUtils.lerp(-1.9, 2.0, p);
          animRef.current.impulseSpark.position.y = Math.sin(p * Math.PI * 2) * 0.25;
        }
        if (animRef.current.spinGroup) {
          animRef.current.spinGroup.rotation.y += 0.004;
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
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      disposeStudio();
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) group.remove(group.children[0]);
    pickMapRef.current.clear();
    animRef.current = { tailSegments: [] };
    let cancelled = false;

    const hlMat = (hex: number, id: string, opacity = 1) =>
      new THREE.MeshPhysicalMaterial({
        color: hex,
        roughness: 0.24,
        metalness: 0.08,
        clearcoat: 0.72,
        transparent: opacity < 1,
        opacity,
        emissive: selectedPart === id ? new THREE.Color(0xfbbf24) : new THREE.Color(0x000000),
        emissiveIntensity: selectedPart === id ? 0.48 : 0,
      });

    if (kind === 'brain') {
      const spin = new THREE.Group();
      const tissue = getOrganicTissueTextures('cardiac_red');
      const brainMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4a7b9,
        map: tissue.map,
        bumpMap: tissue.bumpMap,
        bumpScale: 0.03,
        roughness: 0.36,
        metalness: 0.04,
        clearcoat: 0.55,
      });
      loadNormalizedGLB('/models/brain.glb', 3.4, { overrideMaterial: brainMat })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const labels: [string, string, [number, number, number], string][] = [
            ['Forebrain (Cerebrum)', 'Memory, Thinking & Voluntary Control', [-1.25, 1.45, 0.55], '#38bdf8'],
            ['Cerebellum (Hindbrain)', 'Posture & Balance (p. 221)', [1.25, -0.85, -0.55], '#fbbf24'],
            ['Medulla Oblongata', 'Heartbeat & Breathing Reflexes', [0.35, -1.55, 0.45], '#34d399'],
          ];
          for (const [t1, t2, pos, hex] of labels) {
            const sp = createFloatingLabelSprite(t1, t2, hex);
            sp.position.set(pos[0], pos[1], pos[2]);
            spin.add(sp);
          }
        })
        .catch(() => {});
      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'kidney') {
      const spin = new THREE.Group();
      const tissue = getOrganicTissueTextures('cardiac_red');
      const kidneyMat = new THREE.MeshPhysicalMaterial({
        color: 0xb91c1c,
        map: tissue.map,
        bumpMap: tissue.bumpMap,
        bumpScale: 0.04,
        roughness: 0.34,
        clearcoat: 0.5,
      });
      loadNormalizedGLB('/models/kidney.glb', 3.2, { overrideMaterial: kidneyMat })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl1 = createFloatingLabelSprite('Renal Cortex & Medulla', 'Nephrons filter blood (Unit 13)', '#fb7185');
          lbl1.position.set(-1.35, 1.4, 0.4);
          const lbl2 = createFloatingLabelSprite('Renal Pelvis & Ureter', 'Carries urine to bladder', '#38bdf8');
          lbl2.position.set(1.25, -1.25, 0.4);
          spin.add(lbl1, lbl2);
        })
        .catch(() => {});
      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'flower') {
      const spin = new THREE.Group();
      loadNormalizedGLB('/models/flower.glb', 3.2, { envMapIntensity: 1.4 })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl1 = createFloatingLabelSprite('Androecium (Stamens)', 'Anther produces pollen grains (p. 246)', '#fbbf24');
          lbl1.position.set(-1.35, 1.35, 0.4);
          const lbl2 = createFloatingLabelSprite('Gynoecium (Carpel)', 'Stigma, Style & Ovule fertilization', '#34d399');
          lbl2.position.set(1.3, -1.0, 0.4);
          spin.add(lbl1, lbl2);
        })
        .catch(() => {});
      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'plant_foliage') {
      const spin = new THREE.Group();
      loadNormalizedGLB('/models/plant-foliage.glb', 3.5, { envMapIntensity: 1.45 })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl = createFloatingLabelSprite('Photosynthetic Leaf Canopy', 'Chlorophyll absorbs sunlight (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂)', '#4ade80');
          lbl.position.set(0, 1.85, 0);
          spin.add(lbl);
        })
        .catch(() => {});
      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'camera_optics') {
      const spin = new THREE.Group();
      loadNormalizedGLB('/models/camera-optics.glb', 3.3, { envMapIntensity: 1.55 })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl = createFloatingLabelSprite('Optical Camera & Visual Media', 'Convex lens focuses real inverted image on sensor', '#38bdf8');
          lbl.position.set(0, 1.75, 0);
          spin.add(lbl);
        })
        .catch(() => {});
      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'gears') {
      const spin = new THREE.Group();
      loadNormalizedGLB('/models/gears.glb', 3.2, { envMapIntensity: 1.55 })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl = createFloatingLabelSprite('Torque & Mechanical Advantage', 'τ = F × d · Interlocking Gear Transmission', '#fbbf24');
          lbl.position.set(0, 1.7, 0);
          spin.add(lbl);
        })
        .catch(() => {});
      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'neuron') {
      const spin = new THREE.Group();
      const tissue = getOrganicTissueTextures('cardiac_blue');
      const neuronMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        map: tissue.map,
        bumpMap: tissue.bumpMap,
        bumpScale: 0.04,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.85,
        emissive: 0x0369a1,
        emissiveIntensity: 0.25,
      });

      loadNormalizedGLB('/models/neuron-nih.glb', 4.1, { overrideMaterial: neuronMat })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl1 = createFloatingLabelSprite('Dendrites & Cyton', 'Receives nerve impulse (US NIH 3D)', '#38bdf8');
          lbl1.position.set(-1.45, 1.35, 0.4);
          const lbl2 = createFloatingLabelSprite('Axon & Synaptic Knobs', 'Transmits action potential (p. 219)', '#fbbf24');
          lbl2.position.set(1.45, -1.1, 0.4);
          spin.add(lbl1, lbl2);
        })
        .catch(() => {});

      const spark = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfef08a }),
      );
      spark.add(new THREE.PointLight(0xfde047, 2.6, 3.6));
      spark.position.set(-1.6, 0, 0.35);
      spin.add(spark);
      animRef.current.impulseSpark = spark;
      animRef.current.spinGroup = spin;
      group.add(spin);
    } else if (kind === 'animal_cell') {
      const spin = new THREE.Group();
      const tissue = getOrganicTissueTextures('cardiac_red');
      const cellMat = new THREE.MeshPhysicalMaterial({
        color: 0x2dd4bf,
        map: tissue.map,
        bumpMap: tissue.bumpMap,
        bumpScale: 0.04,
        roughness: 0.28,
        metalness: 0.08,
        clearcoat: 0.72,
      });

      loadNormalizedGLB('/models/animal-cell-nih.glb', 3.5, { overrideMaterial: cellMat })
        .then(({ root }) => {
          if (cancelled) return;
          spin.add(root);
          const lbl = createFloatingLabelSprite('3D Animal Cell & Organelles', 'US NIH 3D Structural Organisation', '#2dd4bf');
          lbl.position.set(0, 1.85, 0);
          spin.add(lbl);
        })
        .catch(() => {});

      group.add(spin);
      animRef.current.spinGroup = spin;
    } else if (kind === 'gametogenesis') {
      // Calm, matte, neutral-palette static educational reference model (primary view is calm 2D medical SVG)
      const calmMat = (hex: number, id: string, opacity = 1) =>
        new THREE.MeshStandardMaterial({
          color: hex,
          roughness: 0.72,
          metalness: 0.02,
          transparent: opacity < 1,
          opacity,
          emissive: selectedPart === id ? new THREE.Color(0x94a3b8) : new THREE.Color(0x000000),
          emissiveIntensity: selectedPart === id ? 0.25 : 0,
        });

      const spermGroup = new THREE.Group();
      spermGroup.position.set(-1.45, 0.15, 0);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 20), calmMat(0x93c5fd, 'head'));
      head.scale.set(1.35, 0.88, 0.75);
      head.position.set(-0.65, 0, 0);
      pickMapRef.current.set(head, 'head');

      const acrosome = new THREE.Mesh(
        new THREE.SphereGeometry(0.43, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.44),
        calmMat(0xfde68a, 'acrosome'),
      );
      acrosome.rotation.z = Math.PI / 2;
      acrosome.scale.set(0.88, 1.38, 0.76);
      acrosome.position.set(-0.68, 0, 0);
      pickMapRef.current.set(acrosome, 'acrosome');

      const midPiece = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.12, 0.72, 18),
        calmMat(0xa7f3d0, 'middle_piece'),
      );
      midPiece.rotation.z = Math.PI / 2;
      midPiece.position.set(0.18, 0, 0);
      pickMapRef.current.set(midPiece, 'middle_piece');

      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.55, 0, 0),
        new THREE.Vector3(1.3, 0.03, 0),
        new THREE.Vector3(2.2, -0.02, 0),
      ]);
      const tailMesh = new THREE.Mesh(
        new THREE.TubeGeometry(tailCurve, 24, 0.045, 10, false),
        calmMat(0xcbd5e1, 'tail'),
      );
      pickMapRef.current.set(tailMesh, 'tail');

      const spermLbl = createFloatingLabelSprite('Human Sperm (Fig. 17.15)', 'Calm Schematic · Not to Relative Scale', '#cbd5e1');
      spermLbl.position.set(0.3, 1.05, 0);
      spermGroup.add(head, acrosome, midPiece, tailMesh, spermLbl);
      group.add(spermGroup);

      const ovumGroup = new THREE.Group();
      ovumGroup.position.set(2.05, 0.05, 0);
      const zona = new THREE.Mesh(new THREE.SphereGeometry(1.02, 28, 22), calmMat(0xfbcfe8, 'zona', 0.32));
      const cytoplasm = new THREE.Mesh(new THREE.SphereGeometry(0.82, 26, 20), calmMat(0xfed7aa, 'ovum', 0.58));
      const ovumNucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 22, 18), calmMat(0x93c5fd, 'ovum'));
      pickMapRef.current.set(zona, 'zona');
      pickMapRef.current.set(cytoplasm, 'ovum');
      pickMapRef.current.set(ovumNucleus, 'ovum');

      const ovumLbl = createFloatingLabelSprite('Human Ovum (Fig. 17.16)', 'Corona Radiata · Zona Pellucida · Nucleus', '#fbcfe8');
      ovumLbl.position.set(0, 1.55, 0);
      ovumGroup.add(zona, cytoplasm, ovumNucleus, ovumLbl);
      group.add(ovumGroup);
    } else if (kind === 'dna') {
      const helixGroup = new THREE.Group();
      const s1: THREE.Vector3[] = [];
      const s2: THREE.Vector3[] = [];
      const baseColors = [
        [0x38bdf8, 0xfbbf24],
        [0x34d399, 0xf43f5e],
      ];

      for (let i = 0; i <= 28; i++) {
        const u = i / 28;
        const y = -1.9 + u * 3.8;
        const ang = u * Math.PI * 3.5;
        const p1 = new THREE.Vector3(Math.cos(ang) * 0.82, y, Math.sin(ang) * 0.82);
        const p2 = new THREE.Vector3(Math.cos(ang + Math.PI) * 0.82, y, Math.sin(ang + Math.PI) * 0.82);
        s1.push(p1);
        s2.push(p2);

        if (i % 2 === 0 && i > 0 && i < 28) {
          const pair = baseColors[(i / 2) % 2];
          const mid = p1.clone().add(p2).multiplyScalar(0.5);
          for (const [start, end, col] of [
            [p1, mid, pair[0]],
            [mid, p2, pair[1]],
          ] as [THREE.Vector3, THREE.Vector3, number][]) {
            const dir = end.clone().sub(start);
            const rung = new THREE.Mesh(
              new THREE.CylinderGeometry(0.055, 0.055, dir.length(), 10),
              new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.25, clearcoat: 0.7 }),
            );
            rung.position.copy(start).add(end).multiplyScalar(0.5);
            rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
            helixGroup.add(rung);
          }
        }
      }

      const b1 = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(s1), 72, 0.095, 12, false),
        new THREE.MeshPhysicalMaterial({ color: 0x6366f1, roughness: 0.25, clearcoat: 0.8 }),
      );
      const b2 = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(s2), 72, 0.095, 12, false),
        new THREE.MeshPhysicalMaterial({ color: 0xec4899, roughness: 0.25, clearcoat: 0.8 }),
      );
      helixGroup.add(b1, b2);
      const dnaLbl = createFloatingLabelSprite('DNA Double Helix (Watson & Crick)', 'A=T & G≡C Complementary Base Pairs (Unit 18)', '#a855f7');
      dnaLbl.position.set(0, 2.3, 0);
      helixGroup.add(dnaLbl);
      group.add(helixGroup);
      animRef.current.spinGroup = helixGroup;
    } else {
      const immuneGroup = new THREE.Group();
      const tissue = getOrganicTissueTextures('cardiac_red');
      const wallMat = new THREE.MeshPhysicalMaterial({
        color: 0xf43f5e,
        map: tissue.map,
        bumpMap: tissue.bumpMap,
        bumpScale: 0.05,
        roughness: 0.32,
        clearcoat: 0.65,
      });

      loadNormalizedGLB('/models/bacteria-wall-nih.glb', 3.4, { overrideMaterial: wallMat })
        .then(({ root }) => {
          if (cancelled) return;
          immuneGroup.add(root);
          const lbl = createFloatingLabelSprite('Bacterial Cell Wall & Immunity', 'US NIH 3D · Antigen Recognition & Defense', '#fb7185');
          lbl.position.set(0, 1.85, 0);
          immuneGroup.add(lbl);
        })
        .catch(() => {});

      group.add(immuneGroup);
      animRef.current.spinGroup = immuneGroup;
    }

    return () => {
      cancelled = true;
    };
  }, [kind, selectedPart]);

  const nudge = (axis: 'rot' | 'zoom', delta: number) => {
    if (axis === 'rot' && groupRef.current) groupRef.current.rotation.y += delta;
    if (axis === 'zoom' && cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.4, Math.min(10, cameraRef.current.position.z + delta));
    }
  };

  if (webglError) {
    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)]">
        {webglError}
      </div>
    );
  }

  const badgeTitle: Record<Biology3DKind, string> = {
    gametogenesis: '3D Human Gametogenesis (Fig. 17.15 Sperm & Fig. 17.16 Ovum)',
    neuron: 'Real US NIH 3D Anatomical Neuron & Impulse',
    brain: 'Real 3D Human Brain Atlas (Z-Anatomy Open Source)',
    animal_cell: 'Real US NIH 3D Animal Cell Structure',
    kidney: 'Real 3D Anatomical Human Kidney (MIT Open Source)',
    flower: '3D Angiosperm Flower & Pollination Anatomy',
    plant_foliage: 'Phototextured 3D Photosynthetic Foliage (Khronos CC0)',
    dna: '3D DNA Double Helix & Base Pairing',
    immune: 'Real US NIH 3D Bacterial Cell Wall & Immune Defense',
    camera_optics: 'Phototextured 3D Optical Camera & Visual Media',
    gears: '3D Mechanical Torque & Interlocking Gears',
  };

  return (
    <div ref={wrapperRef} className={`space-y-2.5 ${isFullscreen ? 'bg-slate-950 p-4 rounded-none' : ''}`}>
      <div className="relative rounded-[18px] overflow-hidden border border-[var(--line)] bg-slate-950 shadow-inner">
        <div ref={mountRef} className={`w-full ${isFullscreen ? 'h-[82vh]' : 'h-[320px] sm:h-[360px]'} cursor-grab active:cursor-grabbing`} />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/85 border border-white/15 text-[11px] font-bold text-teal-200 pointer-events-none">
          {badgeTitle[kind]}
        </div>
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
        <span className="text-[var(--text-muted)]">Drag to orbit 360° · Scroll to zoom · Click highlighted parts</span>
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

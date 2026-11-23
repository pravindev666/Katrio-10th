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

export type Maths3DKind = 'functions' | 'sequences' | 'algebra' | 'geometry' | 'coordinate' | 'probability';

export interface MathsChapter3DCanvasProps {
  kind: Maths3DKind;
  // Functions
  funcSlope?: number;
  funcShift?: number;
  // Sequences (AP / GP)
  seqType?: 'AP' | 'GP';
  seqStart?: number;
  seqStep?: number;
  // Algebra (Quadratic ax^2 + bx + c)
  quadA?: number;
  quadB?: number;
  quadC?: number;
  // Geometry (Thales BPT split ratio 0.25..0.8)
  splitRatio?: number;
  // Coordinate Geometry (Points A, B)
  ptAx?: number;
  ptAy?: number;
  ptBx?: number;
  ptBy?: number;
  // Probability (6 die face counts + last roll)
  dieCounts?: number[];
  lastRoll?: number | null;
  reducedMotion: boolean;
}

export default function MathsChapter3DCanvas(props: MathsChapter3DCanvasProps) {
  const { kind, reducedMotion } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const animRef = useRef<{
    spinObj?: THREE.Object3D;
    rollingDie?: THREE.Mesh;
    flowOrbs: { mesh: THREE.Mesh; t: number; curve: THREE.CatmullRomCurve3 }[];
  }>({ flowOrbs: [] });

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.2 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the interactive mathematical controls below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 340;

    scene.add(createSkyDomeMesh(0x0f172a, 0x312e81, 0x090d1a, 34));

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0.3, 3.2, 6.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.15, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.8;
    controls.maxDistance = 13;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let animId = 0;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.028;
      if (!reducedMotionRef.current) {
        if (animRef.current.spinObj) animRef.current.spinObj.rotation.y += 0.004;
        if (animRef.current.rollingDie) {
          animRef.current.rollingDie.rotation.x += 0.022;
          animRef.current.rollingDie.rotation.y += 0.028;
          animRef.current.rollingDie.position.y = 1.65 + Math.sin(t * 2.6) * 0.12;
        }
        for (const orb of animRef.current.flowOrbs) {
          orb.t = (orb.t + 0.008) % 1;
          orb.mesh.position.copy(orb.curve.getPoint(orb.t));
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
    animRef.current = { flowOrbs: [] };

    const gridFloor = new THREE.GridHelper(9, 18, 0x6366f1, 0x1e293b);
    gridFloor.position.y = -1.25;
    group.add(gridFloor);

    if (kind === 'functions') {
      const m = props.funcSlope ?? 2;
      const c = props.funcShift ?? 1;
      const machine = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 1.35, 1.25),
        new THREE.MeshPhysicalMaterial({ color: 0x6366f1, metalness: 0.45, roughness: 0.25, clearcoat: 0.7 }),
      );
      machine.position.set(0, 0.05, 0);
      const lbl = createFloatingLabelSprite(`Function Machine f(x) = ${m}x ${c >= 0 ? '+' : ''}${c}`, 'Domain A → Codomain B Mapping', '#a5b4fc');
      lbl.position.set(0, 1.4, 0);
      group.add(machine, lbl);

      const inputs = [-1, 0, 1, 2];
      inputs.forEach((xVal, i) => {
        const yVal = m * xVal + c;
        const z = -1.15 + i * 0.78;
        const inNode = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 16, 16),
          new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.25, clearcoat: 0.8 }),
        );
        inNode.position.set(-2.5, 0.1, z);
        const outNode = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 16, 16),
          new THREE.MeshPhysicalMaterial({ color: 0x34d399, roughness: 0.25, clearcoat: 0.8 }),
        );
        outNode.position.set(2.5, Math.max(-0.9, Math.min(1.4, yVal * 0.18)), z);

        const curve = new THREE.CatmullRomCurve3([
          inNode.position.clone(),
          new THREE.Vector3(0, 0.15 + (i - 1.5) * 0.12, z * 0.35),
          outNode.position.clone(),
        ]);
        const pipe = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 24, 0.035, 8, false),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6 }),
        );
        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.085, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xfef08a }),
        );
        animRef.current.flowOrbs.push({ mesh: orb, t: i * 0.22, curve });
        group.add(inNode, outNode, pipe, orb);
      });
    } else if (kind === 'sequences') {
      const seqType = props.seqType ?? 'AP';
      const a = props.seqStart ?? 2;
      const step = props.seqStep ?? 2;
      const terms: number[] = [];
      for (let n = 0; n < 6; n++) {
        terms.push(seqType === 'AP' ? a + n * step : a * Math.pow(step, n));
      }
      const maxTerm = Math.max(...terms.map((v) => Math.abs(v)), 1);

      terms.forEach((val, idx) => {
        const h = Math.max(0.25, (Math.abs(val) / maxTerm) * 2.55);
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.56, h, 0.68),
          new THREE.MeshPhysicalMaterial({
            color: seqType === 'AP' ? 0x38bdf8 : 0xa855f7,
            roughness: 0.24,
            metalness: 0.2,
            clearcoat: 0.75,
          }),
        );
        bar.position.set(-2.2 + idx * 0.88, -1.25 + h / 2, 0);
        bar.castShadow = true;
        group.add(bar);
      });

      const lbl = createFloatingLabelSprite(
        seqType === 'AP' ? `3D Arithmetic Progression (a=${a}, d=${step})` : `3D Geometric Progression (a=${a}, r=${step})`,
        `Terms: ${terms.map((v) => Number(v.toFixed(1))).join(', ')}`,
        '#fbbf24',
      );
      lbl.position.set(0, 2.05, 0);
      group.add(lbl);
    } else if (kind === 'algebra') {
      const a = props.quadA ?? 1;
      const b = props.quadB ?? -2;
      const c = props.quadC ?? -3;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 48; i++) {
        const x = -3.4 + (i / 48) * 6.8;
        const yRaw = a * x * x + b * x + c;
        const y = Math.max(-1.2, Math.min(2.6, yRaw * 0.28));
        pts.push(new THREE.Vector3(x, y, 0));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const parabola = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.085, 14, false),
        new THREE.MeshPhysicalMaterial({ color: 0xa855f7, emissive: 0x6b21a8, emissiveIntensity: 0.35, roughness: 0.22, clearcoat: 0.8 }),
      );
      // X-axis glowing rod
      const xAxis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 7.2, 10),
        new THREE.MeshBasicMaterial({ color: 0x94a3b8 }),
      );
      xAxis.rotation.z = Math.PI / 2;
      group.add(parabola, xAxis);

      // Highlight real roots on x-axis!
      const disc = b * b - 4 * a * c;
      if (a !== 0 && disc >= 0) {
        const roots = [(-b + Math.sqrt(disc)) / (2 * a), (-b - Math.sqrt(disc)) / (2 * a)];
        for (const r of roots) {
          if (Math.abs(r) <= 3.5) {
            const rootSphere = new THREE.Mesh(
              new THREE.SphereGeometry(0.16, 18, 18),
              new THREE.MeshBasicMaterial({ color: 0x34d399 }),
            );
            rootSphere.position.set(r, 0, 0);
            group.add(rootSphere);
          }
        }
      }
      const lbl = createFloatingLabelSprite(
        `3D Parabola: y = ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`,
        `Discriminant Δ = ${disc} (${disc > 0 ? '2 Real Roots' : disc === 0 ? '1 Equal Root' : 'No Real Roots'})`,
        '#c084fc',
      );
      lbl.position.set(0, 2.35, 0);
      group.add(lbl);
    } else if (kind === 'geometry') {
      // 3D Thales Basic Proportionality Theorem (Triangle ABC with parallel cut DE!)
      const ratio = props.splitRatio ?? 0.55;
      const A = new THREE.Vector3(0, 1.85, 0);
      const B = new THREE.Vector3(-2.2, -1.1, 0);
      const C = new THREE.Vector3(2.2, -1.1, 0);
      const D = A.clone().lerp(B, ratio);
      const E = A.clone().lerp(C, ratio);

      const addRod = (p1: THREE.Vector3, p2: THREE.Vector3, col: number, rad = 0.06) => {
        const dir = p2.clone().sub(p1);
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(rad, rad, dir.length(), 14),
          new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.25, clearcoat: 0.7 }),
        );
        mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        group.add(mesh);
      };

      addRod(A, B, 0x38bdf8);
      addRod(A, C, 0x38bdf8);
      addRod(B, C, 0x10b981, 0.08);
      addRod(D, E, 0xfbbf24, 0.085); // Parallel cut DE || BC!

      const vertexSpecs: [THREE.Vector3, string, [number, number, number], string][] = [
        [A, 'Vertex A', [0, 0.42, 0], '#38bdf8'],
        [B, 'Vertex B', [-0.45, -0.32, 0], '#34d399'],
        [C, 'Vertex C', [0.45, -0.32, 0], '#34d399'],
        [D, 'Point D', [-0.52, 0.08, 0], '#fbbf24'],
        [E, 'Point E', [0.52, 0.08, 0], '#fbbf24'],
      ];
      for (const [p, vLabel, offset, hex] of vertexSpecs) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
        dot.position.copy(p);
        const vSprite = createFloatingLabelSprite(vLabel, '', hex);
        vSprite.scale.set(1.15, 0.36, 1);
        vSprite.position.set(p.x + offset[0], p.y + offset[1], p.z + offset[2]);
        group.add(dot, vSprite);
      }
      const lbl = createFloatingLabelSprite(
        'Thales Theorem (BPT): DE ∥ BC',
        `AD/DB = AE/EC = ${(ratio / (1 - ratio)).toFixed(2)}`,
        '#fbbf24',
      );
      lbl.position.set(0, 2.35, 0);
      group.add(lbl);
    } else if (kind === 'coordinate') {
      const ax = (props.ptAx ?? -2) * 0.55;
      const ay = (props.ptAy ?? 1) * 0.45;
      const bx = (props.ptBx ?? 3) * 0.55;
      const by = (props.ptBy ?? 4) * 0.45;

      const pA = new THREE.Vector3(ax, ay - 0.5, 0);
      const pB = new THREE.Vector3(bx, by - 0.5, 0);
      const pC = new THREE.Vector3(bx, ay - 0.5, 0); // Right-angle leg for distance formula!

      const addLine = (u: THREE.Vector3, v: THREE.Vector3, col: number) => {
        const d = v.clone().sub(u);
        if (d.length() < 0.01) return;
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.048, 0.048, d.length(), 12),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.25 }),
        );
        rod.position.copy(u).add(v).multiplyScalar(0.5);
        rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
        group.add(rod);
      };

      addLine(pA, pB, 0xfbbf24);
      addLine(pA, pC, 0x38bdf8);
      addLine(pC, pB, 0x34d399);

      for (const [pos, col] of [
        [pA, 0x38bdf8],
        [pB, 0xf43f5e],
      ] as [THREE.Vector3, number][]) {
        const pin = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 18, 18),
          new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.2, clearcoat: 0.85 }),
        );
        pin.position.copy(pos);
        group.add(pin);
      }

      const dist = Math.hypot((props.ptBx ?? 3) - (props.ptAx ?? -2), (props.ptBy ?? 4) - (props.ptAy ?? 1));
      const lbl = createFloatingLabelSprite(
        `3D Coordinate Segment AB · d = ${dist.toFixed(2)}`,
        `A(${props.ptAx ?? -2}, ${props.ptAy ?? 1}) → B(${props.ptBx ?? 3}, ${props.ptBy ?? 4})`,
        '#38bdf8',
      );
      lbl.position.set(0, 2.2, 0);
      group.add(lbl);
    } else {
      // PROBABILITY — 3D ROLLING TEXTURED DIE + 6 RISING EMPIRICAL FREQUENCY TOWERS!
      const counts = props.dieCounts ?? [1, 1, 1, 1, 1, 1];
      const total = Math.max(1, counts.reduce((s, v) => s + v, 0));

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 0.2, 2.2),
        new THREE.MeshStandardMaterial({ map: getWoodBenchTextures().map, roughness: 0.65 }),
      );
      base.position.set(0, -1.15, 0);
      group.add(base);

      counts.forEach((c, idx) => {
        const pct = c / total;
        const h = Math.max(0.18, pct * 4.2);
        const isLast = props.lastRoll === idx + 1;
        const tower = new THREE.Mesh(
          new THREE.BoxGeometry(0.62, h, 0.62),
          new THREE.MeshPhysicalMaterial({
            color: isLast ? 0xfbbf24 : 0x8b5cf6,
            emissive: isLast ? 0xd97706 : 0x000000,
            emissiveIntensity: isLast ? 0.45 : 0,
            roughness: 0.25,
            clearcoat: 0.75,
          }),
        );
        tower.position.set(-2.25 + idx * 0.9, -1.05 + h / 2, 0);
        group.add(tower);
      });

      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.18, clearcoat: 0.9 }),
      );
      die.position.set(0, 1.65, 0.2);
      group.add(die);
      animRef.current.rollingDie = die;

      const lbl = createFloatingLabelSprite(
        '3D Probability Convergence Arena',
        `Last Face: ${props.lastRoll ?? 'Roll!'} · Theoretical P(E) = 1/6 ≈ 16.7%`,
        '#fbbf24',
      );
      lbl.position.set(0, 2.55, 0);
      group.add(lbl);
    }
  }, [
    kind,
    props.funcSlope,
    props.funcShift,
    props.seqType,
    props.seqStart,
    props.seqStep,
    props.quadA,
    props.quadB,
    props.quadC,
    props.splitRatio,
    props.ptAx,
    props.ptAy,
    props.ptBx,
    props.ptBy,
    props.dieCounts,
    props.lastRoll,
  ]);

  const nudge = (axis: 'rot' | 'zoom', delta: number) => {
    if (axis === 'rot' && groupRef.current) groupRef.current.rotation.y += delta;
    if (axis === 'zoom' && cameraRef.current) {
      cameraRef.current.position.z = Math.max(3.0, Math.min(12.5, cameraRef.current.position.z + delta));
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
        <span className="text-[var(--text-muted)]">Drag to orbit 3D model · Adjust sliders to transform live</span>
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

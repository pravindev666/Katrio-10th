import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createSkyDomeMesh,
  getOceanWaveTextures,
  getRockTerrainTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type Tamil3DVariant = 'translation_bridge' | 'grammar_pillars';

interface Tamil3DStageCanvasProps {
  variant: Tamil3DVariant;
  selectedPillar: string;
  onSelectPillar: (pillarId: string) => void;
  reducedMotion: boolean;
}

export default function Tamil3DStageCanvas({
  variant,
  selectedPillar,
  onSelectPillar,
  reducedMotion,
}: Tamil3DStageCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const pickMapRef = useRef<Map<THREE.Object3D, string>>(new Map());
  const onSelectRef = useRef(onSelectPillar);
  onSelectRef.current = onSelectPillar;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const riverTexRef = useRef<THREE.CanvasTexture | null>(null);

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.15 });
    if (!studio) {
      setWebglError('WebGL unavailable. Use the native Tamil interactive exercises below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 320;

    scene.add(createSkyDomeMesh(0x451a03, 0xb45309, 0x0f172a, 34));

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 3.1, 6.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.0;
    controls.maxDistance = 12;

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
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.024;
      if (!reducedMotionRef.current) {
        if (groupRef.current) groupRef.current.rotation.y += 0.0032;
        if (riverTexRef.current) {
          riverTexRef.current.offset.y = (t * 0.03) % 1;
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 600;
      const ch = container.clientHeight || 320;
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

    const stoneTex = getRockTerrainTextures('sandstone');
    const riverTex = getOceanWaveTextures('deep_blue');
    riverTexRef.current = riverTex.map;

    const makeMat = (hex: number, id: string) =>
      new THREE.MeshStandardMaterial({
        color: hex,
        map: stoneTex.map,
        bumpMap: stoneTex.bumpMap,
        bumpScale: 0.06,
        roughness: 0.48,
        metalness: 0.14,
        emissive: selectedPillar === id ? new THREE.Color(0xfbbf24) : new THREE.Color(0x000000),
        emissiveIntensity: selectedPillar === id ? 0.45 : 0,
      });

    if (variant === 'grammar_pillars') {
      const uyarBase = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.34, 2.2),
        new THREE.MeshStandardMaterial({ map: stoneTex.map, color: 0x6366f1, roughness: 0.58 }),
      );
      uyarBase.position.set(-1.35, -0.85, 0);
      uyarBase.receiveShadow = true;
      group.add(uyarBase);

      const ahriBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.34, 2.2),
        new THREE.MeshStandardMaterial({ map: stoneTex.map, color: 0xc2410c, roughness: 0.58 }),
      );
      ahriBase.position.set(1.95, -0.85, 0);
      ahriBase.receiveShadow = true;
      group.add(ahriBase);

      const pillars: { id: string; x: number; h: number; color: number }[] = [
        { id: 'ஆண்பால்', x: -2.4, h: 1.85, color: 0x6366f1 },
        { id: 'பெண்பால்', x: -1.35, h: 1.85, color: 0x14b8a6 },
        { id: 'பலர்பால்', x: -0.3, h: 2.15, color: 0x22c55e },
        { id: 'ஒன்றன்பால்', x: 1.4, h: 1.35, color: 0xf59e0b },
        { id: 'பலவின்பால்', x: 2.5, h: 1.65, color: 0xf43f5e },
      ];

      for (const p of pillars) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, p.h, 24), makeMat(p.color, p.id));
        cyl.position.set(p.x, -0.7 + p.h / 2, 0);
        cyl.castShadow = true;
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), makeMat(p.color, p.id));
        cap.position.set(p.x, -0.7 + p.h + 0.16, 0);
        group.add(cyl, cap);
        pickMapRef.current.set(cyl, p.id);
        pickMapRef.current.set(cap, p.id);
      }

      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.35, 1.35, 0),
        new THREE.Vector3(0.3, 2.15, 0),
        new THREE.Vector3(1.95, 1.1, 0),
      ]);
      group.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(archCurve, 28, 0.065, 12, false),
          new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            emissive: 0xd97706,
            emissiveIntensity: 0.55,
            metalness: 0.7,
            roughness: 0.2,
          }),
        ),
      );
    } else {
      const river = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.24, 3.8),
        new THREE.MeshStandardMaterial({
          map: riverTex.map,
          bumpMap: riverTex.bumpMap,
          bumpScale: 0.12,
          roughness: 0.22,
          metalness: 0.24,
        }),
      );
      river.position.y = -1.1;
      group.add(river);

      const leftBank = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.85, 2.8), makeMat(0x64748b, 'source'));
      leftBank.position.set(-2.4, -0.68, 0);
      const rightBank = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.85, 2.8), makeMat(0xd97706, 'tamil'));
      rightBank.position.set(2.4, -0.68, 0);
      group.add(leftBank, rightBank);
      pickMapRef.current.set(leftBank, 'source');
      pickMapRef.current.set(rightBank, 'tamil');

      const bridgeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.6, -0.25, 0),
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(1.6, -0.25, 0),
      ]);
      const bridge = new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 32, 0.17, 14, false), makeMat(0x14b8a6, 'bridge'));
      bridge.castShadow = true;
      group.add(bridge);
      pickMapRef.current.set(bridge, 'bridge');

      // Tiered Chola Gopuram-inspired monument for Tamil heritage (மணற்கேணி)
      const shrine = new THREE.Mesh(new THREE.ConeGeometry(0.66, 1.55, 4), makeMat(0xf59e0b, 'tamil'));
      shrine.position.set(2.4, 0.5, 0);
      shrine.castShadow = true;
      const bookCube = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.96, 0.56), makeMat(0x6366f1, 'source'));
      bookCube.position.set(-2.4, 0.26, 0);
      bookCube.castShadow = true;
      group.add(shrine, bookCube);
      pickMapRef.current.set(shrine, 'tamil');
      pickMapRef.current.set(bookCube, 'source');
    }
  }, [variant, selectedPillar]);

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
          className={`w-full ${isFullscreen ? 'h-full' : 'h-[320px]'
            } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden cursor-grab`}
          aria-label="தமிழ் இயல் 4 முப்பரிமாணக் காட்சி அரங்கு"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-amber-300 border border-amber-400/40 text-[11px] font-bold font-tamil">
          {variant === 'grammar_pillars'
            ? '3D ஐம்பால் தூண்கள் (உயர்திணை 3 + அஃறிணை 2)'
            : '3D மொழிபெயர்ப்புப் பாலம் · இயல் 4 மணற்கேணி'}
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 px-3 py-1.5 min-h-[34px] rounded-lg bg-slate-950/85 hover:bg-slate-900 text-white border border-white/20 text-xs font-bold inline-flex items-center gap-1.5"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'வெளியேறு' : 'முழுத்திரை'}</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`${isFullscreen ? 'text-slate-300' : 'text-[var(--text-muted)]'} font-tamil`}>
          3D தூண்களைத் தொட்டு ஆராயுங்கள் · சுழற்றிப் பார்க்கலாம்
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => groupRef.current && (groupRef.current.rotation.y -= 0.45)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>இடது</span>
          </button>
          <button
            type="button"
            onClick={() => groupRef.current && (groupRef.current.rotation.y += 0.45)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>வலது</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(0.86)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>பெரிதாக்கு</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(1.16)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span>சிறிதாக்கு</span>
          </button>
        </div>
      </div>
    </div>
  );
}

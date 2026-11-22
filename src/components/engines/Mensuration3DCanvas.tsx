import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import type { SolidKind } from '../../utils/mensurationSimulations';
import { createStudioRenderer } from '../../three/sceneSetup';
import { createSkyDomeMesh, getBrushedMetalTextures } from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

interface Mensuration3DCanvasProps {
  kind: SolidKind;
  radius: number;
  outerRadius: number;
  height: number;
  cutaway: boolean;
  wireframe: boolean;
  reducedMotion: boolean;
}

export default function Mensuration3DCanvas({
  kind,
  radius,
  outerRadius,
  height,
  cutaway,
  wireframe,
  reducedMotion,
}: Mensuration3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.16 });
    if (!studio) {
      setWebglError('WebGL unavailable on this device. Switch to the 2D Net & Formula view below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 360;

    scene.add(createSkyDomeMesh(0x0f172a, 0x1e293b, 0x0b1120, 32));

    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(4.1, 3.0, 5.1);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.4;
    controls.maxDistance = 12;
    controlsRef.current = controls;

    // Studio drafting plinth + glowing blueprint grid
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(3.4, 3.6, 0.14, 48),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.35 }),
    );
    plinth.position.y = -1.92;
    plinth.receiveShadow = true;
    scene.add(plinth);

    const grid = new THREE.GridHelper(6.2, 14, 0x38bdf8, 0x334155);
    grid.position.y = -1.84;
    scene.add(grid);

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

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

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      disposeStudio();
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
    }

    const maxDim = Math.max(radius, outerRadius, height, 6);
    const scale = 2.2 / maxDim;
    const r = Math.max(0.35, radius * scale);
    const R = Math.max(r + 0.25, outerRadius * scale);
    const h = Math.max(0.5, height * scale);

    const phiLength = cutaway ? Math.PI * 1.45 : Math.PI * 2;
    const blueMetal = getBrushedMetalTextures('#4255d4');
    const cyanMetal = getBrushedMetalTextures('#0ea5e9');
    const goldMetal = getBrushedMetalTextures('#f59e0b');

    const mainMat = new THREE.MeshPhysicalMaterial({
      map: blueMetal.map,
      bumpMap: blueMetal.bumpMap,
      bumpScale: 0.025,
      roughness: 0.26,
      metalness: 0.42,
      clearcoat: 0.55,
      wireframe,
      side: THREE.DoubleSide,
    });
    const innerMat = new THREE.MeshPhysicalMaterial({
      map: cyanMetal.map,
      bumpMap: cyanMetal.bumpMap,
      bumpScale: 0.025,
      roughness: 0.3,
      metalness: 0.35,
      wireframe,
      side: THREE.DoubleSide,
    });
    const capMat = new THREE.MeshPhysicalMaterial({
      map: goldMetal.map,
      bumpMap: goldMetal.bumpMap,
      bumpScale: 0.025,
      roughness: 0.28,
      metalness: 0.5,
      clearcoat: 0.4,
      wireframe,
      side: THREE.DoubleSide,
    });

    const addCast = (m: THREE.Mesh) => {
      m.castShadow = true;
      m.receiveShadow = true;
      group.add(m);
    };

    if (kind === 'cylinder') {
      addCast(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 56, 1, cutaway, 0, phiLength), mainMat));
      if (cutaway) {
        addCast(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, h + 0.45, 16), capMat));
      }
    } else if (kind === 'hollow_cylinder') {
      addCast(new THREE.Mesh(new THREE.CylinderGeometry(R, R, h, 56, 1, true, 0, phiLength), mainMat));
      addCast(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 56, 1, true, 0, phiLength), innerMat));
      const ringGeo = new THREE.RingGeometry(r, R, 56, 1, 0, phiLength);
      const topRing = new THREE.Mesh(ringGeo, capMat);
      topRing.rotation.x = -Math.PI / 2;
      topRing.position.y = h / 2;
      const botRing = new THREE.Mesh(ringGeo.clone(), capMat);
      botRing.rotation.x = Math.PI / 2;
      botRing.position.y = -h / 2;
      addCast(topRing);
      addCast(botRing);
    } else if (kind === 'cone') {
      addCast(new THREE.Mesh(new THREE.ConeGeometry(r, h, 56, 1, cutaway, 0, phiLength), mainMat));
      if (cutaway) {
        addCast(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, h, 16), capMat));
      }
    } else if (kind === 'sphere') {
      addCast(new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 56, 36, 0, phiLength), mainMat));
      if (cutaway) {
        addCast(new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), capMat));
      }
    } else if (kind === 'hemisphere') {
      addCast(new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 56, 28, 0, phiLength, 0, Math.PI / 2), mainMat));
      const flatBase = new THREE.Mesh(new THREE.CircleGeometry(r * 1.15, 56, 0, phiLength), capMat);
      flatBase.rotation.x = Math.PI / 2;
      addCast(flatBase);
    } else if (kind === 'frustum') {
      addCast(new THREE.Mesh(new THREE.CylinderGeometry(r, R, h, 56, 1, cutaway, 0, phiLength), mainMat));
      const topCap = new THREE.Mesh(new THREE.CircleGeometry(r, 56, 0, phiLength), capMat);
      topCap.rotation.x = -Math.PI / 2;
      topCap.position.y = h / 2;
      const botCap = new THREE.Mesh(new THREE.CircleGeometry(R, 56, 0, phiLength), innerMat);
      botCap.rotation.x = Math.PI / 2;
      botCap.position.y = -h / 2;
      addCast(topCap);
      addCast(botCap);
    } else if (kind === 'combined_capsule') {
      addCast(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r * 0.85, h * 0.9, 56, 1, true, 0, phiLength), mainMat));
      const topDome = new THREE.Mesh(
        new THREE.SphereGeometry(r * 0.85, 48, 24, 0, phiLength, 0, Math.PI / 2),
        capMat,
      );
      topDome.position.y = (h * 0.9) / 2;
      const botDome = new THREE.Mesh(
        new THREE.SphereGeometry(r * 0.85, 48, 24, 0, phiLength, Math.PI / 2, Math.PI / 2),
        capMat,
      );
      botDome.position.y = -(h * 0.9) / 2;
      addCast(topDome);
      addCast(botDome);
    }
  }, [kind, radius, outerRadius, height, cutaway, wireframe]);

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
          className={`w-full ${
            isFullscreen ? 'h-full' : 'h-[350px]'
          } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden cursor-grab`}
          aria-label={`Interactive 3D solid model of ${kind.replace('_', ' ')}`}
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
          Drag to orbit · Scroll to zoom · Toggle cutaway to inspect interior height &amp; radius
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

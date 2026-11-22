import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import {
  TABLE_7_1_ATOMIC_MASS,
  type AtomNode3D,
  type MoleculeSpec3D,
} from '../../utils/moleculeSimulations';
import { createStudioRenderer } from '../../three/sceneSetup';
import { createSkyDomeMesh } from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

interface MoleculeBuilder3DCanvasProps {
  molecule: MoleculeSpec3D;
  selectedAtomId: string | null;
  onSelectAtom: (atom: AtomNode3D) => void;
  reducedMotion: boolean;
}

function addBondCylinder(
  parent: THREE.Group,
  start: THREE.Vector3,
  end: THREE.Vector3,
  offsetVec: THREE.Vector3,
  radius: number,
  material: THREE.Material,
) {
  const p1 = start.clone().add(offsetVec);
  const p2 = end.clone().add(offsetVec);
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, 20);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
}

export default function MoleculeBuilder3DCanvas({
  molecule,
  selectedAtomId,
  onSelectAtom,
  reducedMotion,
}: MoleculeBuilder3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const atomMeshesRef = useRef<Map<THREE.Object3D, AtomNode3D>>(new Map());
  const onSelectRef = useRef(onSelectAtom);
  onSelectRef.current = onSelectAtom;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.2 });
    if (!studio) {
      setWebglError('WebGL is unavailable. Use the 2D Structural Formula & Mass Breakdown below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 350;

    scene.add(createSkyDomeMesh(0x090e21, 0x1e1b4b, 0x0f172a, 32));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 1.4, 5.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.4;
    controls.maxDistance = 11;

    // Subtle floating quantum starfield particles in studio background
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      starPos[i * 3] = (Math.sin(i * 12.7) * 9);
      starPos[i * 3 + 1] = (Math.cos(i * 7.3) * 6);
      starPos[i * 3 + 2] = -3 - (i % 8);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x818cf8, size: 0.07, transparent: true, opacity: 0.55 })));

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
      const hits = raycaster.intersectObjects(Array.from(atomMeshesRef.current.keys()), false);
      if (hits.length > 0) {
        const atom = atomMeshesRef.current.get(hits[0].object);
        if (atom) onSelectRef.current(atom);
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!reducedMotionRef.current && groupRef.current) {
        groupRef.current.rotation.y += 0.0055;
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
    atomMeshesRef.current.clear();

    const posMap = new Map<string, THREE.Vector3>();
    for (const atom of molecule.atoms) {
      const meta = TABLE_7_1_ATOMIC_MASS[atom.element];
      const pos = new THREE.Vector3(...atom.position);
      posMap.set(atom.id, pos);

      const isSelected = atom.id === selectedAtomId;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(meta.radius * (isSelected ? 1.18 : 1), 36, 28),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(meta.color),
          roughness: 0.14,
          metalness: 0.22,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          emissive: isSelected ? new THREE.Color(0x6366f1) : new THREE.Color(0x000000),
          emissiveIntensity: isSelected ? 0.45 : 0,
        }),
      );
      sphere.position.copy(pos);
      sphere.castShadow = true;
      group.add(sphere);
      atomMeshesRef.current.set(sphere, atom);
    }

    const bondMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.22,
      metalness: 0.65,
      clearcoat: 0.6,
    });

    for (const bond of molecule.bonds) {
      const p1 = posMap.get(bond.from);
      const p2 = posMap.get(bond.to);
      if (!p1 || !p2) continue;

      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const refAxis = Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const perp = new THREE.Vector3().crossVectors(dir, refAxis).normalize();

      if (bond.order === 1) {
        addBondCylinder(group, p1, p2, new THREE.Vector3(0, 0, 0), 0.088, bondMat);
      } else if (bond.order === 2) {
        addBondCylinder(group, p1, p2, perp.clone().multiplyScalar(0.11), 0.068, bondMat);
        addBondCylinder(group, p1, p2, perp.clone().multiplyScalar(-0.11), 0.068, bondMat);
      } else if (bond.order === 3) {
        addBondCylinder(group, p1, p2, new THREE.Vector3(0, 0, 0), 0.06, bondMat);
        addBondCylinder(group, p1, p2, perp.clone().multiplyScalar(0.14), 0.056, bondMat);
        addBondCylinder(group, p1, p2, perp.clone().multiplyScalar(-0.14), 0.056, bondMat);
      }
    }
  }, [molecule, selectedAtomId]);

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
          aria-label={`Interactive 3D ball-and-stick model of ${molecule.name} (${molecule.formula})`}
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
          Click any glossy atom to inspect its atomic mass · Drag to orbit
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

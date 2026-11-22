import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import { createFloatingLabelSprite, createSkyDomeMesh } from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type IndiaDivisionId =
  | 'himalayas'
  | 'northern_plains'
  | 'peninsular_plateau'
  | 'coastal_plains'
  | 'islands';

interface IndiaRelief3DCanvasProps {
  selectedDivision: IndiaDivisionId;
  showRivers: boolean;
  showMonsoon?: boolean;
  region?: 'india' | 'tamil_nadu';
  onSelectDivision: (division: IndiaDivisionId) => void;
  reducedMotion: boolean;
}

const TERRAIN_SIZE = 6.2;

/** Maps exact GPS (lat, lon) onto the 6.2 × 6.2 NASA Satellite 3D Terrain Mesh! */
function gpsToTerrainXZ(
  lat: number,
  lon: number,
  bounds: { lonMin: number; lonMax: number; latMin: number; latMax: number },
): [number, number] {
  const u = (lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin);
  const v = (bounds.latMax - lat) / (bounds.latMax - bounds.latMin);
  return [(u - 0.5) * TERRAIN_SIZE, (v - 0.5) * TERRAIN_SIZE];
}

const INDIA_BOUNDS = { lonMin: 65.0, lonMax: 99.0, latMin: 5.0, latMax: 39.0 };
const TN_BOUNDS = { lonMin: 74.5, lonMax: 82.0, latMin: 7.2, latMax: 14.7 };

const INDIA_PINS: { id: IndiaDivisionId; label: string; sub: string; lat: number; lon: number; yLift: number; color: number }[] = [
  { id: 'himalayas', label: 'Himalayas', sub: 'Himadri & Mt. Everest', lat: 30.2, lon: 81.5, yLift: 0.92, color: 0xf8fafc },
  { id: 'northern_plains', label: 'Northern Plains', sub: 'Ganga–Indus Alluvium', lat: 26.5, lon: 81.0, yLift: 0.34, color: 0x22c55e },
  { id: 'peninsular_plateau', label: 'Deccan Plateau', sub: 'Western & Eastern Ghats', lat: 17.8, lon: 77.2, yLift: 0.44, color: 0xf59e0b },
  { id: 'coastal_plains', label: 'Coromandel & Malabar', sub: '6,100 km Coastline', lat: 12.6, lon: 80.2, yLift: 0.24, color: 0x38bdf8 },
  { id: 'islands', label: 'Andaman & Lakshadweep', sub: 'Volcanic & Coral Islands', lat: 11.6, lon: 92.7, yLift: 0.25, color: 0x2dd4bf },
];

const TN_PINS: { id: IndiaDivisionId; label: string; sub: string; lat: number; lon: number; yLift: number; color: number }[] = [
  { id: 'himalayas', label: 'Western Ghats · Doddabetta', sub: '2,637 m (Nilgiris Peak)', lat: 11.4, lon: 76.73, yLift: 0.78, color: 0x22c55e },
  { id: 'northern_plains', label: 'Kaveri Delta (Thanjavur)', sub: 'Rice Bowl of Tamil Nadu', lat: 10.79, lon: 79.13, yLift: 0.3, color: 0x4ade80 },
  { id: 'peninsular_plateau', label: 'Coimbatore & Madurai Plateau', sub: 'Eastern Ghats & Kongu Uplands', lat: 11.01, lon: 77.35, yLift: 0.46, color: 0xf59e0b },
  { id: 'coastal_plains', label: 'Chennai · Coromandel Coast', sub: 'Marina Beach & Major Ports', lat: 13.08, lon: 80.27, yLift: 0.28, color: 0x38bdf8 },
  { id: 'islands', label: 'Gulf of Mannar & Kanyakumari', sub: 'Marine Biosphere & 3 Seas', lat: 8.09, lon: 77.55, yLift: 0.26, color: 0x2dd4bf },
];

const INDIA_RIVERS: [number, number][][] = [
  // Ganga
  [[30.9, 78.9], [28.6, 78.2], [25.4, 81.8], [25.6, 85.1], [23.5, 88.4], [21.8, 89.2]],
  // Indus
  [[34.1, 77.6], [35.4, 74.5], [32.0, 71.2], [27.5, 68.5], [24.0, 67.5]],
  // Brahmaputra
  [[29.3, 88.8], [28.2, 95.3], [26.2, 91.7], [25.0, 89.7]],
  // Godavari
  [[19.9, 73.5], [18.8, 77.5], [17.0, 81.7], [16.5, 82.3]],
  // Kaveri
  [[12.3, 75.5], [11.8, 77.8], [10.8, 78.7], [11.1, 79.85]],
];

const TN_RIVERS: [number, number][][] = [
  // Kaveri through Mettur -> Trichy -> Poompuhar
  [[12.2, 76.5], [11.8, 77.8], [11.0, 78.1], [10.82, 78.7], [10.95, 79.35], [11.14, 79.85]],
  // Vaigai through Madurai -> Palk Bay
  [[9.85, 77.35], [10.0, 77.65], [9.92, 78.12], [9.35, 78.95]],
  // Thamirabarani (Pothigai -> Gulf of Mannar)
  [[8.65, 77.25], [8.73, 77.72], [8.64, 78.12]],
];

export default function IndiaRelief3DCanvas({
  selectedDivision,
  showRivers,
  showMonsoon = true,
  region = 'india',
  onSelectDivision,
  reducedMotion,
}: IndiaRelief3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const worldGroupRef = useRef<THREE.Group | null>(null);
  const overlayGroupRef = useRef<THREE.Group | null>(null);
  const monsoonOrbsRef = useRef<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; t: number }[]>([]);
  const pickMapRef = useRef<Map<THREE.Object3D, IndiaDivisionId>>(new Map());
  const onSelectRef = useRef(onSelectDivision);
  onSelectRef.current = onSelectDivision;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Build base studio & real NASA Satellite + SRTM 3D Displacement Terrain Mesh!
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.24 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the structured 2D Geography Atlas below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 360;

    scene.add(createSkyDomeMesh(0x0c1930, 0x0369a1, 0x071226, 38));

    // Dramatic low-angle sunlight casts rich realistic shadows across the 3D displaced mountain ridges!
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 2.35);
    dirLight.position.set(5.5, 6.2, 4.2);
    dirLight.castShadow = true;
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xbae6fd, 0.72));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0.15, 5.1, 5.5);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.12, 0.15);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.8;
    controls.maxDistance = 11.5;
    controls.maxPolarAngle = Math.PI * 0.46;

    const worldGroup = new THREE.Group();
    worldGroupRef.current = worldGroup;
    scene.add(worldGroup);

    // Sleek dark tabletop diorama pedestal framing the satellite relief block
    const pedestal = new THREE.Mesh(
      new THREE.BoxGeometry(TERRAIN_SIZE + 0.24, 0.36, TERRAIN_SIZE + 0.24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.4 }),
    );
    pedestal.position.y = -0.2;
    pedestal.receiveShadow = true;
    worldGroup.add(pedestal);

    // REAL NASA SATELLITE PHOTOGRAPHY + REAL SRTM 3D ELEVATION DISPLACEMENT MESH (180x180 segments = 64,800 triangles!)
    const texLoader = new THREE.TextureLoader();
    const colorPath = region === 'tamil_nadu' ? '/textures/earth/tamilnadu-color.jpg' : '/textures/earth/india-color.jpg';
    const heightPath = region === 'tamil_nadu' ? '/textures/earth/tamilnadu-height.png' : '/textures/earth/india-height.png';

    const satColor = texLoader.load(colorPath);
    satColor.colorSpace = THREE.SRGBColorSpace;
    satColor.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const heightMap = texLoader.load(heightPath);

    const terrainGeo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, 180, 180);
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMat = new THREE.MeshStandardMaterial({
      map: satColor,
      displacementMap: heightMap,
      displacementScale: region === 'tamil_nadu' ? 0.78 : 0.92,
      bumpMap: heightMap,
      bumpScale: 0.06,
      roughness: 0.68,
      metalness: 0.08,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.castShadow = true;
    terrainMesh.receiveShadow = true;
    worldGroup.add(terrainMesh);

    const overlayGroup = new THREE.Group();
    overlayGroupRef.current = overlayGroup;
    worldGroup.add(overlayGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onClick = (ev: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(Array.from(pickMapRef.current.keys()), false);
      if (hits.length > 0) {
        const divId = pickMapRef.current.get(hits[0].object);
        if (divId) onSelectRef.current(divId);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!reducedMotionRef.current) {
        for (const item of monsoonOrbsRef.current) {
          item.t = (item.t + 0.0085) % 1;
          item.mesh.position.copy(item.curve.getPoint(item.t));
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 620;
      const ch = container.clientHeight || 360;
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
      satColor.dispose();
      heightMap.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      controls.dispose();
      disposeStudio();
    };
  }, [region]);

  // Overlay exact GPS Rivers, Volumetric Monsoon Wind Streams, and Clickable 3D Beacons
  useEffect(() => {
    const ov = overlayGroupRef.current;
    if (!ov) return;
    while (ov.children.length > 0) ov.remove(ov.children[0]);
    pickMapRef.current.clear();
    monsoonOrbsRef.current = [];

    const bounds = region === 'tamil_nadu' ? TN_BOUNDS : INDIA_BOUNDS;
    const pins = region === 'tamil_nadu' ? TN_PINS : INDIA_PINS;
    const rivers = region === 'tamil_nadu' ? TN_RIVERS : INDIA_RIVERS;

    // 1. Exact GPS Glowing 3D Rivers
    if (showRivers) {
      const riverMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.92 });
      for (const path of rivers) {
        const pts = path.map(([lat, lon], idx) => {
          const [x, z] = gpsToTerrainXZ(lat, lon, bounds);
          const elev = idx === 0 ? 0.55 : Math.max(0.18, 0.44 - idx * 0.06);
          return new THREE.Vector3(x, elev, z);
        });
        ov.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, 0.032, 8, false), riverMat));
      }
    }

    // 2. Animated 3D Monsoon Wind Streams (SW Monsoon for India / NE & SW Monsoon for Tamil Nadu)
    if (showMonsoon) {
      const windPaths =
        region === 'tamil_nadu'
          ? [
              // NE Monsoon curving from Bay of Bengal onto Coromandel Coast!
              [new THREE.Vector3(2.8, 0.85, -2.1), new THREE.Vector3(1.5, 0.92, -0.8), new THREE.Vector3(0.4, 0.72, 0.2)],
              [new THREE.Vector3(2.7, 0.8, -0.5), new THREE.Vector3(1.4, 0.85, 0.4), new THREE.Vector3(0.2, 0.68, 1.1)],
            ]
          : [
              // SW Monsoon sweeping from Arabian Sea & Bay of Bengal!
              [new THREE.Vector3(-2.6, 0.78, 2.2), new THREE.Vector3(-1.0, 0.95, 0.7), new THREE.Vector3(0.1, 1.15, -0.8)],
              [new THREE.Vector3(1.4, 0.78, 2.2), new THREE.Vector3(1.8, 0.95, 0.2), new THREE.Vector3(0.4, 1.15, -1.2)],
            ];

      const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.55 });
      const orbMat = new THREE.MeshBasicMaterial({ color: 0xe9d5ff });

      for (const pts of windPaths) {
        const curve = new THREE.CatmullRomCurve3(pts);
        ov.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.028, 8, false), ribbonMat));
        for (let k = 0; k < 3; k++) {
          const orb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), orbMat);
          ov.add(orb);
          monsoonOrbsRef.current.push({ mesh: orb, curve, t: k / 3 });
        }
      }
    }

    // 3. Clickable 3D GPS Location Beacons + Floating Labels
    for (const p of pins) {
      const [x, z] = gpsToTerrainXZ(p.lat, p.lon, bounds);
      const isSel = p.id === selectedDivision;
      const stalkH = isSel ? 0.65 : 0.42;

      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.045, stalkH, 12),
        new THREE.MeshStandardMaterial({
          color: isSel ? 0xfef08a : p.color,
          emissive: isSel ? 0xf59e0b : p.color,
          emissiveIntensity: isSel ? 0.85 : 0.3,
        }),
      );
      stalk.position.set(x, p.yLift + stalkH / 2, z);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(isSel ? 0.12 : 0.085, 16, 16),
        new THREE.MeshBasicMaterial({ color: isSel ? 0xfde047 : p.color }),
      );
      head.position.set(x, p.yLift + stalkH, z);

      pickMapRef.current.set(stalk, p.id);
      pickMapRef.current.set(head, p.id);
      ov.add(stalk, head);

      if (isSel) {
        const lbl = createFloatingLabelSprite(p.label, p.sub, '#fde047');
        lbl.scale.set(1.75, 0.48, 1);
        lbl.position.set(x, p.yLift + stalkH + 0.45, z);
        ov.add(lbl);
      }
    }
  }, [region, selectedDivision, showRivers, showMonsoon]);

  const nudge = (axis: 'rot' | 'zoom', delta: number) => {
    if (axis === 'rot' && worldGroupRef.current) worldGroupRef.current.rotation.y += delta;
    if (axis === 'zoom' && cameraRef.current) {
      const len = cameraRef.current.position.length();
      cameraRef.current.position.setLength(Math.max(3.0, Math.min(11.0, len + delta)));
    }
  };

  if (webglError) {
    return (
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)]">
        {webglError}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`space-y-2.5 ${isFullscreen ? 'bg-slate-950 p-4 rounded-none' : ''}`}>
      <div className="relative rounded-[18px] overflow-hidden border border-[var(--line)] bg-slate-950 shadow-inner">
        <div
          ref={mountRef}
          className={`w-full ${isFullscreen ? 'h-[82vh]' : 'h-[330px] sm:h-[370px]'} cursor-grab active:cursor-grabbing`}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 border border-white/15 text-[11px] font-bold text-emerald-200 pointer-events-none">
          {region === 'tamil_nadu'
            ? 'Real NASA Satellite + SRTM 3D Relief · Tamil Nadu & Western Ghats'
            : 'Real NASA Satellite + SRTM 3D Relief · India Physiography & Rivers'}
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-800 border border-white/15 text-[11px] font-bold text-white inline-flex items-center gap-1"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[var(--text-muted)]">Real NASA Satellite + 3D SRTM Elevation · Drag to orbit mountains · Click GPS beacons</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => nudge('rot', -0.4)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => nudge('rot', 0.4)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
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

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import { createFloatingLabelSprite } from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type HistoryHotspotId = 'berlin' | 'sarajevo' | 'paris' | 'petrograd' | 'madras' | 'versailles';

export interface GlobePinSpec {
  id: string;
  label: string;
  sub: string;
  lat: number;
  lon: number;
  color: number;
  bloc?: 'allies' | 'central';
}

interface HistoryTheatre3DCanvasProps {
  activeHotspot: string;
  showAllies: boolean;
  showCentral: boolean;
  onSelectHotspot: (id: HistoryHotspotId) => void;
  onSelectCustomPin?: (id: string) => void;
  customPins?: GlobePinSpec[];
  badgeTitle?: string;
  reducedMotion: boolean;
}

const EARTH_RADIUS = 2.05;

/** Converts real-world GPS latitude & longitude (degrees) into exact 3D sphere coordinates aligned with Three.js equirectangular UV mapping! */
export function latLonToSphereVec(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lonDeg + 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

const DEFAULT_WWI_PINS: GlobePinSpec[] = [
  { id: 'berlin', label: 'Berlin', sub: 'Triple Alliance (1882)', lat: 52.52, lon: 13.4, color: 0xf59e0b, bloc: 'central' },
  { id: 'sarajevo', label: 'Sarajevo', sub: '28 June 1914 Spark', lat: 43.86, lon: 18.41, color: 0xef4444, bloc: 'central' },
  { id: 'paris', label: 'Paris / Marne', sub: 'Western Front (1914–16)', lat: 48.86, lon: 2.35, color: 0x38bdf8, bloc: 'allies' },
  { id: 'versailles', label: 'Versailles', sub: '1919 Peace Treaty', lat: 48.8, lon: 2.13, color: 0x10b981, bloc: 'allies' },
  { id: 'petrograd', label: 'Petrograd', sub: '1917 Russian Revolution', lat: 59.93, lon: 30.34, color: 0x60a5fa, bloc: 'allies' },
  { id: 'madras', label: 'Madras (Chennai)', sub: 'Emden & Global Impact', lat: 13.08, lon: 80.27, color: 0xfbbf24, bloc: 'allies' },
];

export default function HistoryTheatre3DCanvas({
  activeHotspot,
  showAllies,
  showCentral,
  onSelectHotspot,
  onSelectCustomPin,
  customPins,
  badgeTitle,
  reducedMotion,
}: HistoryTheatre3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const pickMapRef = useRef<Map<THREE.Object3D, string>>(new Map());
  const pulseRef = useRef<THREE.Mesh | null>(null);

  const onSelectRef = useRef(onSelectHotspot);
  onSelectRef.current = onSelectHotspot;
  const onCustomSelectRef = useRef(onSelectCustomPin);
  onCustomSelectRef.current = onSelectCustomPin;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  const activePins = customPins && customPins.length > 0 ? customPins : DEFAULT_WWI_PINS;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.22 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the 2D Historical Schematic Map & Timeline below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    scene.background = new THREE.Color(0x030712);

    const w = container.clientWidth || 620;
    const h = container.clientHeight || 350;

    // Deep space starfield backdrop
    const starCount = 700;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 24 + Math.random() * 18;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.cos(ph);
      starPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.09, transparent: true, opacity: 0.85 })));

    // Crisp orbital sun lighting
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    sunLight.position.set(8, 6, 8);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x93c5fd, 0.72));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 120);
    // Start facing Europe / Eurasia / India cleanly!
    const initFocus = latLonToSphereVec(38, 28, 4.9);
    camera.position.copy(initFocus);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.65;
    controls.maxDistance = 8.2;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Cancel camera fly-to if user drags manually
    const onControlStart = () => {
      targetCamPosRef.current = null;
    };
    controls.addEventListener('start', onControlStart);

    // REAL 4K NASA BLUE MARBLE SATELLITE EARTH + ELEVATION BUMP + OCEAN SPECULAR + CLOUDS!
    const texLoader = new THREE.TextureLoader();
    const colorMap = texLoader.load('/textures/earth/earth-color-4k.jpg');
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const elevMap = texLoader.load('/textures/earth/earth-elev-4k.jpg');
    const specMap = texLoader.load('/textures/earth/earth-specular.jpg');
    const cloudMap = texLoader.load('/textures/earth/earth-clouds.png');

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 96, 64),
      new THREE.MeshPhongMaterial({
        map: colorMap,
        bumpMap: elevMap,
        bumpScale: 0.055,
        specularMap: specMap,
        specular: new THREE.Color(0x38bdf8),
        shininess: 22,
      }),
    );
    scene.add(earthMesh);

    // Semi-transparent drifting NASA Cloud Sphere
    const cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.012, 64, 48),
      new THREE.MeshLambertMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    );
    scene.add(cloudMesh);
    cloudsRef.current = cloudMesh;

    // Subtle atmospheric blue rim halo (Google Earth orbital atmosphere feel!)
    const atmoMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.055, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.13,
        side: THREE.BackSide,
      }),
    );
    scene.add(atmoMesh);

    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    scene.add(pinsGroup);

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
        if (id) {
          if (onCustomSelectRef.current) onCustomSelectRef.current(id);
          else onSelectRef.current(id as HistoryHotspotId);
        }
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    let animId = 0;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.032;

      if (!reducedMotionRef.current) {
        if (cloudsRef.current) cloudsRef.current.rotation.y += 0.00045;
        if (pulseRef.current) {
          const s = 1 + Math.sin(t * 4) * 0.25;
          pulseRef.current.scale.set(s, s, s);
        }
      }

      // Smooth orbital camera glide to the active historical city/region!
      if (targetCamPosRef.current) {
        camera.position.lerp(targetCamPosRef.current, reducedMotionRef.current ? 0.5 : 0.065);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
          targetCamPosRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 620;
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
      controls.removeEventListener('start', onControlStart);
      renderer.domElement.removeEventListener('click', onClick);
      colorMap.dispose();
      elevMap.dispose();
      specMap.dispose();
      cloudMap.dispose();
      controls.dispose();
      disposeStudio();
    };
  }, []);

  // Place exact GPS 3D beacons, labels, and glowing geodesic arcs + fly camera smoothly to active city!
  useEffect(() => {
    const group = pinsGroupRef.current;
    if (!group) return;
    while (group.children.length > 0) group.remove(group.children[0]);
    pickMapRef.current.clear();
    pulseRef.current = null;

    const visiblePins = activePins.filter((p) => {
      if (!p.bloc) return true;
      return p.bloc === 'allies' ? showAllies : showCentral;
    });

    const pinVecs: THREE.Vector3[] = [];
    let activePin: GlobePinSpec | undefined;

    for (const pin of visiblePins) {
      const isAct = pin.id === activeHotspot;
      if (isAct) activePin = pin;

      const surfacePos = latLonToSphereVec(pin.lat, pin.lon, EARTH_RADIUS * 1.005);
      const normal = surfacePos.clone().normalize();
      pinVecs.push(surfacePos);

      // Glowing 3D beacon needle + orb pointing radially outward from Earth surface
      const pinH = isAct ? 0.28 : 0.17;
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(surfacePos);
      pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.028, pinH, 12),
        new THREE.MeshStandardMaterial({
          color: isAct ? 0xfef08a : pin.color,
          emissive: isAct ? 0xf59e0b : pin.color,
          emissiveIntensity: isAct ? 0.9 : 0.35,
        }),
      );
      stalk.position.y = pinH / 2;

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(isAct ? 0.065 : 0.045, 14, 14),
        new THREE.MeshBasicMaterial({ color: isAct ? 0xfef08a : pin.color }),
      );
      orb.position.y = pinH;
      pinGroup.add(stalk, orb);

      pickMapRef.current.set(stalk, pin.id);
      pickMapRef.current.set(orb, pin.id);

      if (isAct) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.06, 0.11, 24),
          new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.015;
        pinGroup.add(ring);
        pulseRef.current = ring;

        const lbl = createFloatingLabelSprite(pin.label, pin.sub, '#fde047');
        lbl.scale.set(1.15, 0.32, 1);
        lbl.position.copy(normal.clone().multiplyScalar(EARTH_RADIUS + 0.48));
        group.add(lbl);
      }

      group.add(pinGroup);
    }

    // Glowing 3D Geodesic Great-Circle Arcs connecting historical sites!
    for (let i = 0; i < pinVecs.length - 1; i++) {
      const a = pinVecs[i];
      const b = pinVecs[i + 1];
      const dist = a.distanceTo(b);
      if (dist < 0.05) continue;
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(EARTH_RADIUS + Math.min(0.68, dist * 0.24));
      const arcCurve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const arc = new THREE.Mesh(
        new THREE.TubeGeometry(arcCurve, 32, 0.012, 8, false),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 }),
      );
      group.add(arc);
    }

    // Smoothly rotate/fly camera over the active GPS location!
    const focus = activePin ?? visiblePins[0];
    if (focus) {
      // Closer orbital altitude when pins are clustered inside Tamil Nadu / India!
      const isRegional = customPins && customPins.length > 0 && Math.abs(visiblePins[0].lon - visiblePins[visiblePins.length - 1].lon) < 12;
      const camDist = isRegional ? 3.55 : 4.55;
      targetCamPosRef.current = latLonToSphereVec(focus.lat + 3, focus.lon - 2, camDist);
    }
  }, [activeHotspot, showAllies, showCentral, activePins, customPins]);

  const zoomCam = (delta: number) => {
    if (!cameraRef.current) return;
    targetCamPosRef.current = null;
    const len = cameraRef.current.position.length();
    const next = Math.max(2.65, Math.min(8.0, len + delta));
    cameraRef.current.position.setLength(next);
  };

  const rotateCam = (rad: number) => {
    if (!cameraRef.current) return;
    targetCamPosRef.current = null;
    cameraRef.current.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rad);
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
      <div className="relative rounded-[18px] overflow-hidden border border-[var(--line)] bg-[#030712] shadow-inner">
        <div
          ref={mountRef}
          className={`w-full ${isFullscreen ? 'h-[82vh]' : 'h-[320px] sm:h-[360px]'} cursor-grab active:cursor-grabbing`}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 border border-white/15 text-[11px] font-bold text-amber-200 pointer-events-none">
          {badgeTitle ?? 'Real 4K NASA Satellite 3D Earth · Click GPS Beacons to Fly'}
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
        <span className="text-[var(--text-muted)]">Real NASA Blue Marble 4K Globe · Drag to orbit · Click any glowing city pin</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => rotateCam(-0.4)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => rotateCam(0.4)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Right
          </button>
          <button type="button" onClick={() => zoomCam(-0.65)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" /> Zoom +
          </button>
          <button type="button" onClick={() => zoomCam(0.65)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomOut className="w-3.5 h-3.5" /> Zoom −
          </button>
        </div>
      </div>
    </div>
  );
}

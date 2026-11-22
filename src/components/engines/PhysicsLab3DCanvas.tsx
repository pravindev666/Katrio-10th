import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createSkyDomeMesh,
  getRockTerrainTextures,
  getWoodBenchTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export type Physics3DKind = 'acoustics' | 'optics' | 'electricity' | 'resistivity' | 'thermal' | 'motion';

export interface PhysicsLab3DCanvasProps {
  kind: Physics3DKind;
  // Acoustics params
  wallDistM?: number;
  incidentAngleDeg?: number;
  // Optics params
  lensType?: 'convex' | 'concave';
  objectDistCm?: number;
  focalCm?: number;
  imageDistCm?: number | null;
  magnification?: number | null;
  // Electricity params
  topology?: 'series' | 'parallel';
  currentAmp?: number;
  brightnessPct?: number;
  // Resistivity params (R = rho * L / A)
  wireLengthM?: number;
  wireAreaMm2?: number;
  materialKind?: 'copper' | 'nichrome' | 'rubber';
  // Thermal params
  tempK?: number;
  volumeL?: number;
  // Motion params
  forceN?: number;
  massKg?: number;
  reducedMotion: boolean;
}

export default function PhysicsLab3DCanvas({
  kind,
  wallDistM = 22,
  incidentAngleDeg = 35,
  lensType = 'convex',
  objectDistCm = 30,
  imageDistCm = 30,
  magnification = -1,
  topology = 'series',
  currentAmp = 1.2,
  brightnessPct = 40,
  wireLengthM = 4,
  wireAreaMm2 = 2,
  materialKind = 'copper',
  tempK = 320,
  volumeL = 2.5,
  forceN = 24,
  massKg = 6,
  reducedMotion,
}: PhysicsLab3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  const animRef = useRef<{
    reducedMotion: boolean;
    kind: Physics3DKind;
    waveRings: THREE.Mesh[];
    wallX: number;
    angleRad: number;
    electrons: { mesh: THREE.Mesh; path: THREE.Curve<THREE.Vector3>; offset: number }[];
    currentSpeed: number;
    gasMols: { mesh: THREE.Mesh; vx: number; vy: number; vz: number }[];
    pistonY: number;
    gasSpeed: number;
    cart?: THREE.Group;
    accel: number;
  }>({
    reducedMotion,
    kind,
    waveRings: [],
    wallX: 2.0,
    angleRad: 0.6,
    electrons: [],
    currentSpeed: 0.01,
    gasMols: [],
    pistonY: 0.8,
    gasSpeed: 0.025,
    accel: 4,
  });

  useEffect(() => {
    animRef.current.reducedMotion = reducedMotion;
    animRef.current.kind = kind;
    animRef.current.currentSpeed = 0.004 + Math.min(0.03, currentAmp * 0.0045);
    animRef.current.gasSpeed = 0.014 + (tempK / 600) * 0.035;
    animRef.current.accel = forceN / Math.max(1, massKg);
  }, [reducedMotion, kind, currentAmp, tempK, forceN, massKg]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, { exposure: 1.18 });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the interactive 2D simulator below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 620;
    const h = container.clientHeight || 320;

    scene.add(createSkyDomeMesh(0x0b1120, 0x1e293b, 0x090e1a, 34));

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0.35, 2.0, 5.1);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -0.32, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.8;
    controls.maxDistance = 12;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let animId = 0;
    let t = 0;
    const tmpV = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const st = animRef.current;
      t += 0.025;

      if (!st.reducedMotion) {
        // 1. Acoustics 3D expanding incident & reflected wave rings!
        if (st.kind === 'acoustics' && st.waveRings.length > 0) {
          const span = st.wallX + 2.35;
          for (let i = 0; i < st.waveRings.length; i++) {
            const ring = st.waveRings[i];
            const phase = ((t * 0.55) + i / st.waveRings.length) % 2;
            const returning = phase >= 1;
            const frac = returning ? phase - 1 : phase;
            const x = returning ? st.wallX - frac * span : -2.35 + frac * span;
            const zShift = Math.tan(st.angleRad) * (returning ? -frac : frac - 1) * 0.85;
            ring.position.set(x, 0.15, returning ? zShift : -zShift);
            const scale = 0.45 + (returning ? 0.65 - frac * 0.35 : frac * 0.65);
            ring.scale.setScalar(scale);
            const mat = ring.material as THREE.MeshBasicMaterial;
            mat.color.setHex(returning ? 0x34d399 : 0x38bdf8);
          }
        }

        // 2. Electricity / Resistivity 3D flowing electron orbs
        if (st.kind === 'electricity' || st.kind === 'resistivity') {
          for (const e of st.electrons) {
            e.offset = (e.offset + st.currentSpeed) % 1;
            e.path.getPointAt(e.offset, tmpV);
            e.mesh.position.copy(tmpV);
          }
        }

        // 3. Thermal 3D colliding gas molecules inside cylinder
        if (st.kind === 'thermal') {
          for (const gm of st.gasMols) {
            gm.mesh.position.x += gm.vx * st.gasSpeed;
            gm.mesh.position.y += gm.vy * st.gasSpeed;
            gm.mesh.position.z += gm.vz * st.gasSpeed;
            const r = Math.hypot(gm.mesh.position.x, gm.mesh.position.z);
            if (r > 0.82) {
              gm.vx *= -1;
              gm.vz *= -1;
            }
            if (gm.mesh.position.y < -0.82 || gm.mesh.position.y > st.pistonY - 0.15) {
              gm.vy *= -1;
              gm.mesh.position.y = THREE.MathUtils.clamp(gm.mesh.position.y, -0.8, st.pistonY - 0.16);
            }
          }
        }

        // 4. Motion 3D accelerating sled cart
        if (st.kind === 'motion' && st.cart) {
          const speed = Math.max(0.01, st.accel * 0.012);
          st.cart.position.x += speed;
          if (st.cart.position.x > 2.6) st.cart.position.x = -2.6;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 620;
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
      controls.dispose();
      disposeStudio();
    };
  }, []);

  // Build scene geometry per Physics topic
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) group.remove(group.children[0]);
    animRef.current.waveRings = [];
    animRef.current.electrons = [];
    animRef.current.gasMols = [];
    animRef.current.cart = undefined;

    const woodTex = getWoodBenchTextures();
    const rockTex = getRockTerrainTextures('cliff');

    // Textured Laboratory Workbench Base
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.28, 4.2),
      new THREE.MeshStandardMaterial({ map: woodTex.map, bumpMap: woodTex.bumpMap, bumpScale: 0.04, roughness: 0.65 }),
    );
    bench.position.y = -1.1;
    bench.receiveShadow = true;
    group.add(bench);

    if (kind === 'acoustics') {
      // 3D Sound Reflection & Echo Chamber (Matches TN Textbook Fig. 5.3 & 5.4!)
      const wallX = -0.3 + ((Math.min(50, Math.max(5, wallDistM)) - 5) / 45) * 3.1;
      const angleRad = THREE.MathUtils.degToRad(Math.min(60, Math.max(0, incidentAngleDeg)));
      animRef.current.wallX = wallX;
      animRef.current.angleRad = angleRad;

      // Rigid Textured Brick/Stone Reflecting Wall
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 2.4, 3.2),
        new THREE.MeshStandardMaterial({
          map: rockTex.map,
          bumpMap: rockTex.bumpMap,
          bumpScale: 0.14,
          color: 0xb45309,
          roughness: 0.82,
        }),
      );
      wall.position.set(wallX + 0.22, 0.22, 0);
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);

      // 3D Wooden Acoustic Speaker Cabinet on Left
      const speakerZ = -Math.tan(angleRad) * 1.1;
      const speaker = new THREE.Group();
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1.05, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.3 }),
      );
      const cone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.14, 0.16, 24),
        new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.35 }),
      );
      cone.rotation.z = Math.PI / 2;
      cone.position.set(0.32, 0.12, 0);
      speaker.add(box, cone);
      speaker.position.set(-2.65, -0.42, speakerZ);
      speaker.rotation.y = -angleRad * 0.5;
      group.add(speaker);

      // Perpendicular Normal Line (White Dashed Guide) + Incident (Cyan) & Reflected (Emerald) 3D Rays!
      const normalBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2.8, 8),
        new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.65 }),
      );
      normalBar.rotation.z = Math.PI / 2;
      normalBar.position.set(wallX - 1.4, 0.15, 0);
      group.add(normalBar);

      const addRay = (start: THREE.Vector3, end: THREE.Vector3, hex: number) => {
        const dir = new THREE.Vector3().subVectors(end, start);
        const ray = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.032, dir.length(), 10),
          new THREE.MeshBasicMaterial({ color: hex }),
        );
        ray.position.copy(start).add(end).multiplyScalar(0.5);
        ray.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        group.add(ray);
      };
      const hitPoint = new THREE.Vector3(wallX, 0.15, 0);
      addRay(new THREE.Vector3(-2.35, 0.15, speakerZ), hitPoint, 0x38bdf8);
      addRay(hitPoint, new THREE.Vector3(-2.35, 0.15, -speakerZ), 0x34d399);

      // 6 Animated 3D Propagating Wavefront Torus Rings
      for (let i = 0; i < 6; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.52, 0.035, 12, 32),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78 }),
        );
        ring.rotation.y = Math.PI / 2;
        group.add(ring);
        animRef.current.waveRings.push(ring);
      }
    } else if (kind === 'optics') {
      // 3D Optical Laser Rail Bench
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.14, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.72, roughness: 0.25 }),
      );
      rail.position.y = -0.88;
      group.add(rail);

      // Refractive Glass Convex / Concave Lens in Brass Mount
      const lensGlass = new THREE.Mesh(
        lensType === 'convex'
          ? new THREE.SphereGeometry(0.95, 32, 24)
          : new THREE.CylinderGeometry(0.88, 0.88, 0.18, 32),
        new THREE.MeshPhysicalMaterial({
          color: 0xbae6fd,
          roughness: 0.06,
          transmission: 0.68,
          clearcoat: 1,
          transparent: true,
          opacity: 0.62,
        }),
      );
      if (lensType === 'convex') {
        lensGlass.scale.set(0.28, 1.0, 1.0);
      } else {
        lensGlass.rotation.z = Math.PI / 2;
      }
      lensGlass.position.y = 0.2;
      const lensRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.92, 0.055, 14, 36),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.75, roughness: 0.28 }),
      );
      lensRing.rotation.y = Math.PI / 2;
      lensRing.position.y = 0.2;
      group.add(lensGlass, lensRing);

      // Glowing 3D Candle Object on Left
      const objX = -Math.min(3.1, Math.max(0.65, objectDistCm * 0.062));
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.1, 0.72, 16),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 }),
      );
      candle.position.set(objX, -0.45, 0);
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.28, 12),
        new THREE.MeshBasicMaterial({ color: 0xfde047 }),
      );
      tip.position.set(objX, 0.06, 0);
      group.add(candle, tip);

      // Principal 3D Laser Rays & Formed Image Screen
      if (imageDistCm !== null && magnification !== null) {
        const imgX = THREE.MathUtils.clamp(imageDistCm * 0.062, -3.1, 3.1);
        const imgH = THREE.MathUtils.clamp(0.82 * magnification, -1.1, 1.1);
        const addRay = (a: THREE.Vector3, b: THREE.Vector3, hex: number) => {
          const dir = new THREE.Vector3().subVectors(b, a);
          const m = new THREE.Mesh(
            new THREE.CylinderGeometry(0.022, 0.022, dir.length(), 8),
            new THREE.MeshBasicMaterial({ color: hex }),
          );
          m.position.copy(a).add(b).multiplyScalar(0.5);
          m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
          group.add(m);
        };
        const objTop = new THREE.Vector3(objX, 0.18, 0);
        const lensTop = new THREE.Vector3(0, 0.18, 0);
        const imgTop = new THREE.Vector3(imgX, -0.62 + imgH, 0);
        addRay(objTop, lensTop, 0xfde047);
        addRay(lensTop, imgTop, 0xfde047);
        addRay(objTop, imgTop, 0x34d399);

        // Frosted Viewing Screen + Formed Image Flame
        const screen = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 1.85, 1.4),
          new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, roughness: 0.65, transparent: true, opacity: 0.55 }),
        );
        screen.position.set(imgX, 0.15, 0);
        const imgArrow = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.07, Math.abs(imgH), 14),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
        );
        imgArrow.position.set(imgX, -0.62 + imgH / 2, 0);
        group.add(screen, imgArrow);
      }
    } else if (kind === 'electricity') {
      // 3D Circuit Board: Battery Pack + Copper Loop + 2 Glowing Filament Bulbs + Flowing Electrons!
      const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
      const pts = [
        new THREE.Vector3(-2.4, -0.82, -1.1),
        new THREE.Vector3(2.4, -0.82, -1.1),
        new THREE.Vector3(2.4, -0.82, 1.1),
        new THREE.Vector3(-2.4, -0.82, 1.1),
      ];
      const mainLoop = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.08);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(mainLoop, 64, 0.045, 10, true), copperMat));

      if (topology === 'parallel') {
        const branchCurve = new THREE.LineCurve3(new THREE.Vector3(-0.9, -0.82, -1.1), new THREE.Vector3(-0.9, -0.82, 1.1));
        group.add(new THREE.Mesh(new THREE.TubeGeometry(branchCurve, 12, 0.04, 10, false), copperMat));
      }

      // 3D Battery Pack on Left
      const battery = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 0.55, 0.95),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.4 }),
      );
      battery.position.set(-2.4, -0.62, 0);
      group.add(battery);

      // 2 Glowing 3D Glass Filament Bulbs scaling with brightnessPct!
      const glowLevel = Math.max(0.15, brightnessPct / 100);
      const bulbCoords: [number, number][] =
        topology === 'series' ? [[-0.5, -1.1], [1.2, -1.1]] : [[0.7, -1.1], [0.7, 1.1]];
      for (const [bx, bz] of bulbCoords) {
        const socket = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.28, 0.24, 20),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.75, roughness: 0.3 }),
        );
        socket.position.set(bx, -0.82, bz);
        const bulbGlass = new THREE.Mesh(
          new THREE.SphereGeometry(0.36, 24, 20),
          new THREE.MeshPhysicalMaterial({
            color: 0xfef08a,
            emissive: 0xf59e0b,
            emissiveIntensity: glowLevel * 2.2,
            roughness: 0.1,
            clearcoat: 1,
            transparent: true,
            opacity: 0.85,
          }),
        );
        bulbGlass.position.set(bx, -0.42, bz);
        const bulbLight = new THREE.PointLight(0xfde047, glowLevel * 4.5, 6);
        bulbLight.position.set(bx, -0.3, bz);
        group.add(socket, bulbGlass, bulbLight);
      }

      // Animated Electron Spheres racing along 3D Copper Loop
      const eMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let i = 0; i < 18; i++) {
        const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), eMat);
        group.add(eMesh);
        animRef.current.electrons.push({ mesh: eMesh, path: mainLoop, offset: i / 18 });
      }
    } else if (kind === 'resistivity') {
      // 3D Electrical Resistivity Wire Chamber (R = rho * L / A, Class 10 Science 4.6.1 p. 46!)
      const lenUnits = 1.6 + ((wireLengthM - 1) / 9) * 3.6;
      const radUnits = 0.18 + ((wireAreaMm2 - 0.5) / 4.5) * 0.36;
      const matMeta =
        materialKind === 'copper'
          ? { color: 0xd97706, emissive: 0x78350f, ei: 0.12, opacity: 0.45, latticeHex: 0xf59e0b }
          : materialKind === 'nichrome'
            ? { color: 0xef4444, emissive: 0xea580c, ei: 0.65, opacity: 0.52, latticeHex: 0xfb923c }
            : { color: 0x334155, emissive: 0x000000, ei: 0, opacity: 0.72, latticeHex: 0x94a3b8 };

      // Ceramic Insulator End Posts
      const postMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.55, roughness: 0.35 });
      for (const side of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.95, 18), postMat);
        post.position.set(side * (lenUnits / 2 + 0.15), -0.5, 0);
        group.add(post);
      }

      // Translucent Conductor Wire Cylinder scaling dynamically with Length (L) & Area (A)!
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(radUnits, radUnits, lenUnits, 36),
        new THREE.MeshPhysicalMaterial({
          color: matMeta.color,
          emissive: matMeta.emissive,
          emissiveIntensity: matMeta.ei,
          roughness: 0.22,
          metalness: materialKind === 'rubber' ? 0.05 : 0.72,
          transparent: true,
          opacity: matMeta.opacity,
          clearcoat: 0.8,
        }),
      );
      wire.rotation.z = Math.PI / 2;
      wire.position.set(0, -0.08, 0);
      group.add(wire);

      // Crystal Lattice Obstacle Ions inside the wire (denser in Nichrome/Rubber!)
      const ionCount = materialKind === 'copper' ? 8 : materialKind === 'nichrome' ? 18 : 28;
      const ionMat = new THREE.MeshStandardMaterial({ color: matMeta.latticeHex, roughness: 0.3, metalness: 0.5 });
      for (let i = 0; i < ionCount; i++) {
        const ix = -lenUnits * 0.42 + ((i + 0.5) / ionCount) * (lenUnits * 0.84);
        const ang = i * 2.399;
        const r = radUnits * 0.45;
        const ion = new THREE.Mesh(new THREE.OctahedronGeometry(0.065), ionMat);
        ion.position.set(ix, -0.08 + Math.sin(ang) * r, Math.cos(ang) * r);
        group.add(ion);
      }

      // Drifting 3D Conduction Electrons along the wire!
      const eMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let i = 0; i < 14; i++) {
        const yOff = Math.sin(i * 1.9) * radUnits * 0.42;
        const zOff = Math.cos(i * 1.9) * radUnits * 0.42;
        const path = new THREE.LineCurve3(
          new THREE.Vector3(-lenUnits / 2, -0.08 + yOff, zOff),
          new THREE.Vector3(lenUnits / 2, -0.08 + yOff, zOff),
        );
        const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), eMat);
        group.add(eMesh);
        animRef.current.electrons.push({ mesh: eMesh, path, offset: i / 14 });
      }
    } else if (kind === 'thermal') {
      // 3D Glass Pressure Cylinder + Movable Metallic Piston + Colliding 3D Gas Molecules!
      const pY = THREE.MathUtils.clamp(-0.3 + (volumeL / 6) * 1.5, -0.2, 1.25);
      animRef.current.pistonY = pY;

      const glassCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 2.3, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0xe2e8f0,
          roughness: 0.08,
          clearcoat: 1,
          transparent: true,
          opacity: 0.36,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      glassCyl.position.y = 0.25;
      const piston = new THREE.Mesh(
        new THREE.CylinderGeometry(0.92, 0.92, 0.16, 36),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.82, roughness: 0.22 }),
      );
      piston.position.y = pY;
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.25 }),
      );
      rod.position.y = pY + 0.65;
      group.add(glassCyl, piston, rod);

      const molMat = new THREE.MeshStandardMaterial({
        color: tempK > 420 ? 0xfb923c : 0x38bdf8,
        emissive: tempK > 420 ? 0xea580c : 0x0284c7,
        emissiveIntensity: 0.5,
      });
      for (let i = 0; i < 32; i++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), molMat);
        m.position.set(Math.sin(i * 1.9) * 0.65, -0.75 + (i % 5) * 0.14, Math.cos(i * 2.3) * 0.65);
        group.add(m);
        animRef.current.gasMols.push({
          mesh: m,
          vx: Math.cos(i * 1.3),
          vy: Math.sin(i * 2.1),
          vz: Math.sin(i * 0.9),
        });
      }

      if (tempK > 340) {
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.32, 0.65, 18),
          new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.88 }),
        );
        flame.position.y = -0.78;
        group.add(flame);
      }
    } else {
      // 'motion' — 3D Newton's Laws Rocket-Cart on Track with Live 3D Force Vector Arrow!
      const track = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.12, 1.15),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.4 }),
      );
      track.position.y = -0.9;
      group.add(track);

      const cart = new THREE.Group();
      const bodyW = 0.8 + (massKg / 20) * 0.85;
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(bodyW, 0.55, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.35, metalness: 0.3 }),
      );
      body.position.y = -0.42;
      body.castShadow = true;
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
      for (const wx of [-bodyW * 0.35, bodyW * 0.35]) {
        for (const wz of [-0.38, 0.38]) {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 18), wheelMat);
          w.rotation.x = Math.PI / 2;
          w.position.set(wx, -0.72, wz);
          cart.add(w);
        }
      }
      // Glowing 3D Force Vector Arrow ahead of cart
      if (forceN > 0) {
        const len = 0.4 + (forceN / 60) * 1.5;
        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, len, 12),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
        );
        shaft.rotation.z = -Math.PI / 2;
        shaft.position.set(bodyW / 2 + len / 2, -0.42, 0);
        const head = new THREE.Mesh(
          new THREE.ConeGeometry(0.14, 0.32, 12),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
        );
        head.rotation.z = -Math.PI / 2;
        head.position.set(bodyW / 2 + len + 0.15, -0.42, 0);
        cart.add(shaft, head);
      }
      cart.add(body);
      cart.position.x = -1.2;
      group.add(cart);
      animRef.current.cart = cart;
    }
  }, [kind, wallDistM, incidentAngleDeg, lensType, objectDistCm, imageDistCm, magnification, topology, brightnessPct, wireLengthM, wireAreaMm2, materialKind, tempK, volumeL, forceN, massKg]);

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
          className={`w-full ${isFullscreen ? 'h-full' : 'h-[310px] sm:h-[335px]'
            } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden cursor-grab`}
          aria-label={`Interactive 3D Physics Studio (${kind})`}
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-sky-300 border border-sky-400/40 text-[11px] font-bold">
          {kind === 'acoustics'
            ? `3D Sound Reflection & Echo Studio · ∠i = ∠r = ${incidentAngleDeg}° · d = ${wallDistM} m`
            : kind === 'optics'
              ? `3D Optical Laser Lens Bench (${lensType})`
              : kind === 'electricity'
                ? `3D Circuit Bench (${topology} · ${currentAmp} A)`
                : kind === 'resistivity'
                  ? `3D Resistivity Wire (${materialKind} · L=${wireLengthM} m · A=${wireAreaMm2} mm²)`
                  : kind === 'thermal'
                    ? `3D Gas Piston Chamber (${tempK} K)`
                    : `3D Newton's Laws Track (F = ${forceN} N, m = ${massKg} kg)`}
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
          Drag to orbit 3D physics bench · Adjust controls below to watch live response
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => groupRef.current && (groupRef.current.rotation.y -= 0.4)} className="px-2.5 py-1 min-h-[32px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => groupRef.current && (groupRef.current.rotation.y += 0.4)} className="px-2.5 py-1 min-h-[32px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1">
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

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createFloatingLabelSprite,
  createSkyDomeMesh,
  getGrassTerrainTextures,
  getOceanWaveTextures,
  getRockTerrainTextures,
  getWoodBenchTextures,
} from '../../three/proceduralTextures';
import { loadNormalizedGLB } from '../../three/glbLoader';
import { useFullscreen } from '../../hooks/useFullscreen';

export type English3DVariant =
  | 'flight'
  | 'life'
  | 'tempest'
  | 'ghost'
  | 'zigzag'
  | 'navigating'
  | 'attic'
  | 'tech'
  | 'lastlesson'
  | 'detective';

interface EnglishStory3DCanvasProps {
  variant: English3DVariant;
  beatIndex: number; // 0..4 story beat animating birds / ship / globe / gears!
  reducedMotion: boolean;
}

export default function EnglishStory3DCanvas({
  variant,
  beatIndex,
  reducedMotion,
}: EnglishStory3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);

  const animRef = useRef<{
    reducedMotion: boolean;
    beatIndex: number;
    variant: English3DVariant;
    actor?: THREE.Object3D;
    baseActorPos: THREE.Vector3;
    mixers: THREE.AnimationMixer[];
    spinObjects: THREE.Object3D[];
    oceanTex?: THREE.CanvasTexture;
    oceanBump?: THREE.CanvasTexture;
    magicParticles?: THREE.Points;
    lightningLight?: THREE.PointLight;
    clouds: THREE.Group[];
  }>({
    reducedMotion,
    beatIndex,
    variant,
    baseActorPos: new THREE.Vector3(),
    mixers: [],
    spinObjects: [],
    clouds: [],
  });

  useEffect(() => {
    animRef.current.reducedMotion = reducedMotion;
    animRef.current.beatIndex = beatIndex;
    animRef.current.variant = variant;
  }, [reducedMotion, beatIndex, variant]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, {
      exposure: 1.18,
      fogColor: 0x0c1930,
      fogDensity: 0.018,
    });
    if (!studio) {
      setWebglError('WebGL unavailable. Explore the structured 2D Scene & Perspective cards below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0.8, 3.0, 6.6);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.15, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.0;
    controls.maxDistance = 13;
    controls.maxPolarAngle = Math.PI * 0.49;

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let animId = 0;
    const clock = new THREE.Clock();
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const st = animRef.current;
      t += 0.026;

      if (!st.reducedMotion) {
        for (const m of st.mixers) m.update(dt);
        for (const sp of st.spinObjects) sp.rotation.y += 0.008;

        if (st.oceanTex && st.oceanBump) {
          st.oceanTex.offset.x = (t * 0.03) % 1;
          st.oceanTex.offset.y = (t * 0.015) % 1;
          st.oceanBump.offset.x = (t * 0.038) % 1;
          st.oceanBump.offset.y = -(t * 0.018) % 1;
        }

        if (st.actor) {
          const stormFactor = st.variant === 'tempest' && st.beatIndex === 0 ? 2.4 : 1.0;
          st.actor.position.y = st.baseActorPos.y + Math.sin(t * 2.3 * stormFactor) * 0.08 * stormFactor;
          if (st.variant === 'tempest' || st.variant === 'navigating') {
            st.actor.rotation.z = Math.sin(t * 1.9 * stormFactor) * 0.06 * stormFactor;
            st.actor.rotation.x = Math.cos(t * 1.5 * stormFactor) * 0.03 * stormFactor;
          }
        }

        if (st.magicParticles) {
          st.magicParticles.rotation.y = t * (st.beatIndex === 0 ? 0.9 : 0.42);
        }

        if (st.lightningLight) {
          st.lightningLight.intensity =
            st.variant === 'tempest' && st.beatIndex === 0 && Math.sin(t * 11) > 0.92 ? 9.0 : 0.2;
        }

        for (let i = 0; i < st.clouds.length; i++) {
          st.clouds[i].position.x += 0.004 * (i % 2 === 0 ? 1 : 0.7);
          if (st.clouds[i].position.x > 6.5) st.clouds[i].position.x = -6.5;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 640;
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
      controls.dispose();
      disposeStudio();
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) group.remove(group.children[0]);
    animRef.current.mixers = [];
    animRef.current.spinObjects = [];
    animRef.current.clouds = [];
    animRef.current.actor = undefined;
    animRef.current.magicParticles = undefined;
    animRef.current.lightningLight = undefined;
    animRef.current.oceanTex = undefined;
    animRef.current.oceanBump = undefined;
    let cancelled = false;

    const addCloud = (x: number, y: number, z: number, dark = false) => {
      const c = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: dark ? 0x475569 : 0xf8fafc,
        roughness: 0.9,
        transparent: true,
        opacity: dark ? 0.85 : 0.92,
      });
      for (const [px, py, pz, r] of [
        [0, 0, 0, 0.55],
        [-0.45, -0.08, 0.08, 0.42],
        [0.48, -0.06, -0.05, 0.44],
        [0.12, 0.24, 0, 0.38],
      ] as [number, number, number, number][]) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 12), mat);
        puff.position.set(px, py, pz);
        c.add(puff);
      }
      c.position.set(x, y, z);
      group.add(c);
      animRef.current.clouds.push(c);
    };

    const addPalmTree = (x: number, y: number, z: number, lean = 0.22) => {
      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ map: getWoodBenchTextures().map, roughness: 0.85 });
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(lean * 0.4, 0.5, 0),
        new THREE.Vector3(lean, 1.05, 0.08),
      ]);
      const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.075, 8, false), trunkMat);
      trunk.castShadow = true;
      tree.add(trunk);
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65, side: THREE.DoubleSide });
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.72, 5), frondMat);
        frond.position.set(lean + Math.cos(ang) * 0.28, 1.06, 0.08 + Math.sin(ang) * 0.28);
        frond.rotation.z = -Math.cos(ang) * 1.15;
        frond.rotation.x = Math.sin(ang) * 1.15;
        tree.add(frond);
      }
      tree.position.set(x, y, z);
      group.add(tree);
    };

    if (variant === 'flight') {
      // REAL ANIMATED 3D FLAPPING-WING SEABIRDS (/models/seabird-animated.glb) OVER CLIFF & EMERALD SEA!
      group.add(createSkyDomeMesh(0x0284c7, 0xbae6fd, 0x0f766e, 36));
      addCloud(-2.4, 3.3, -3.5);
      addCloud(2.6, 3.0, -4.0);

      const seaTex = getOceanWaveTextures('emerald');
      animRef.current.oceanTex = seaTex.map;
      animRef.current.oceanBump = seaTex.bumpMap;
      const sea = new THREE.Mesh(
        new THREE.CylinderGeometry(7.2, 7.2, 0.35, 64),
        new THREE.MeshStandardMaterial({
          map: seaTex.map,
          bumpMap: seaTex.bumpMap,
          bumpScale: 0.12,
          roughness: 0.22,
          metalness: 0.22,
        }),
      );
      sea.position.y = -1.42;
      sea.receiveShadow = true;
      group.add(sea);

      const cliffTex = getRockTerrainTextures('cliff');
      const cliffMat = new THREE.MeshStandardMaterial({
        map: cliffTex.map,
        bumpMap: cliffTex.bumpMap,
        bumpScale: 0.16,
        roughness: 0.88,
      });
      const grassMat = new THREE.MeshStandardMaterial({ map: getGrassTerrainTextures().map, roughness: 0.85 });

      const cliff = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.7, 3.4), cliffMat);
      cliff.position.set(-2.55, -0.08, 0);
      cliff.castShadow = true;
      cliff.receiveShadow = true;
      const cliffCap = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.18, 3.45), grassMat);
      cliffCap.position.set(-2.55, 1.28, 0);
      group.add(cliff, cliffCap);

      const plateau = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.1, 2.8), cliffMat);
      plateau.position.set(3.25, -0.38, -0.25);
      const plateauCap = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.16, 2.85), grassMat);
      plateauCap.position.set(3.25, 0.7, -0.25);
      group.add(plateau, plateauCap);

      // Load REAL animated morph-target flapping seabird (Mother Seagull carrying fish!)
      const motherAnchor = new THREE.Group();
      motherAnchor.position.set(beatIndex >= 2 ? 0.55 : 2.5, 1.85, -0.15);
      group.add(motherAnchor);

      loadNormalizedGLB('/models/seabird-animated.glb', 1.65)
        .then(({ root, sceneRoot, animations }) => {
          if (cancelled) return;
          root.rotation.y = -Math.PI / 2; // Facing left toward the cliff!
          motherAnchor.add(root);
          const fish = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.12),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.65, roughness: 0.2 }),
          );
          fish.position.set(-0.78, -0.05, 0);
          motherAnchor.add(fish);
          const mLbl = createFloatingLabelSprite('Mother Seagull', 'Holding Mackerel Fish (p. 3)', '#fbbf24');
          mLbl.position.set(0, 0.75, 0);
          motherAnchor.add(mLbl);
          if (animations.length > 0) {
            const mixer = new THREE.AnimationMixer(sceneRoot);
            const act = mixer.clipAction(animations[0]);
            act.timeScale = 1.15;
            act.play();
            animRef.current.mixers.push(mixer);
          }
        })
        .catch(() => {});

      // Load REAL animated morph-target flapping Young Seagull moving across all 5 beats!
      const beatStates: [number, number, number, number][] = [
        [-2.75, 1.68, 0.1, 0.25], // 0: Retreating nervously on cliff ledge
        [-1.55, 1.68, 0.1, 0.45], // 1: Alone at brink
        [-1.08, 1.72, 0.1, 0.9], // 2: Leaning eagerly toward mother's fish
        [0.45, 1.25, 0.25, 1.55], // 3: Soaring with wide flapping wings!
        [1.15, -0.95, 0.35, 0.35], // 4: Floating safely on the emerald green sea!
      ];
      const [bx, by, bz, flapRate] = beatStates[Math.min(4, Math.max(0, beatIndex))];
      const youngAnchor = new THREE.Group();
      youngAnchor.position.set(bx, by, bz);
      group.add(youngAnchor);
      animRef.current.actor = youngAnchor;
      animRef.current.baseActorPos.set(bx, by, bz);

      loadNormalizedGLB('/models/seabird-animated.glb', 1.45)
        .then(({ root, sceneRoot, animations }) => {
          if (cancelled) return;
          root.rotation.y = Math.PI / 2; // Facing right toward the open sea!
          youngAnchor.add(root);
          const badge = createFloatingLabelSprite(
            beatIndex === 3 ? 'First Flight — Soaring!' : beatIndex === 4 ? 'Floating on Green Sea' : 'Young Seagull',
            `Beat ${beatIndex + 1} of 5 · Real Animated 3D Wings`,
            '#38bdf8',
          );
          badge.position.set(0, 0.85, 0);
          youngAnchor.add(badge);
          if (animations.length > 0) {
            const mixer = new THREE.AnimationMixer(sceneRoot);
            const act = mixer.clipAction(animations[0]);
            act.timeScale = flapRate;
            act.play();
            animRef.current.mixers.push(mixer);
          }
        })
        .catch(() => {});
    } else if (variant === 'tempest') {
      const isStorm = beatIndex === 0;
      const isSunrise = beatIndex === 4;
      group.add(
        createSkyDomeMesh(
          isStorm ? 0x090d1a : isSunrise ? 0x1d4ed8 : 0x0f172a,
          isStorm ? 0x334155 : isSunrise ? 0xf59e0b : 0x0369a1,
          0x082f49,
          36,
        ),
      );
      addCloud(-3.2, 3.1, -3.5, isStorm);
      addCloud(1.8, 3.4, -4.2, isStorm);

      const oceanTex = getOceanWaveTextures('deep_blue');
      animRef.current.oceanTex = oceanTex.map;
      animRef.current.oceanBump = oceanTex.bumpMap;
      const ocean = new THREE.Mesh(
        new THREE.CylinderGeometry(7.2, 7.2, 0.35, 64),
        new THREE.MeshStandardMaterial({
          map: oceanTex.map,
          bumpMap: oceanTex.bumpMap,
          bumpScale: 0.14,
          roughness: 0.22,
          metalness: 0.28,
        }),
      );
      ocean.position.y = -1.2;
      group.add(ocean);

      const rockTex = getRockTerrainTextures('island');
      const sandBeach = new THREE.Mesh(
        new THREE.CylinderGeometry(2.15, 2.55, 0.24, 32),
        new THREE.MeshStandardMaterial({ color: 0xe6c280, roughness: 0.88 }),
      );
      sandBeach.position.set(-1.45, -0.95, -0.1);
      const rockMat = new THREE.MeshStandardMaterial({ map: rockTex.map, bumpMap: rockTex.bumpMap, bumpScale: 0.16, roughness: 0.84 });
      const islandBase = new THREE.Mesh(new THREE.DodecahedronGeometry(1.55, 2), rockMat);
      islandBase.scale.set(1.25, 0.65, 1.05);
      islandBase.position.set(-1.45, -0.35, -0.15);
      const islandPeak = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 2), rockMat);
      islandPeak.scale.set(0.95, 1.32, 0.9);
      islandPeak.position.set(-1.7, 0.52, -0.32);
      group.add(sandBeach, islandBase, islandPeak);
      addPalmTree(-2.55, -0.78, 0.55, -0.25);
      addPalmTree(-0.62, -0.78, -0.95, 0.25);

      const islandBadge = createFloatingLabelSprite("Prospero's Cell", 'Enchanted Island', '#fbbf24');
      islandBadge.position.set(-1.55, 2.15, -0.2);
      group.add(islandBadge);

      const pCount = 160;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const ang = (i / pCount) * Math.PI * 8;
        const rad = 0.65 + (i / pCount) * 1.45;
        pPos[i * 3] = Math.cos(ang) * rad;
        pPos[i * 3 + 1] = 0.75 + Math.sin(ang * 1.4) * 0.42 + (i / pCount) * 0.65;
        pPos[i * 3 + 2] = Math.sin(ang) * rad;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const vortex = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ color: isStorm ? 0x38bdf8 : 0xfde047, size: 0.11, transparent: true, opacity: 0.9 }),
      );
      vortex.position.set(-0.35, 0.35, 0);
      group.add(vortex);
      animRef.current.magicParticles = vortex;

      const lightning = new THREE.PointLight(0xe0f2fe, 0, 18);
      lightning.position.set(1.2, 4.5, 1.5);
      group.add(lightning);
      animRef.current.lightningLight = lightning;

      const ship = new THREE.Group();
      const woodMat = new THREE.MeshStandardMaterial({ map: getWoodBenchTextures().map, roughness: 0.72 });
      const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.78 });
      const sailMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.72, side: THREE.DoubleSide });
      const hull = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.44, 0.68), woodMat);
      const prow = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.65, 4), woodMat);
      prow.rotation.z = Math.PI / 2;
      prow.rotation.x = Math.PI / 4;
      prow.position.set(-1.12, 0.04, 0);
      const mainMast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.75, 10), darkWoodMat);
      mainMast.position.set(-0.08, 0.92, 0);
      const mainSail = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.92, 16, 1, true, -0.7, 1.4), sailMat);
      mainSail.rotation.y = Math.PI / 2;
      mainSail.position.set(-0.18, 1.08, 0);
      const shipBadge = createFloatingLabelSprite(
        isStorm ? 'Royal Ship in Storm' : 'King Alonso’s Ship',
        isSunrise ? 'Safe for Milan Voyage' : 'Safe in Hidden Harbour',
        '#38bdf8',
      );
      shipBadge.position.set(0, 2.2, 0);
      ship.add(hull, prow, mainMast, mainSail, shipBadge);
      const shipPositions: [number, number, number][] = [
        [2.7, -0.82, 0.65],
        [1.95, -0.85, 0.55],
        [1.45, -0.85, 0.48],
        [1.15, -0.85, 0.42],
        [2.1, -0.85, 0.2],
      ];
      const [sx, sy, sz] = shipPositions[Math.min(4, Math.max(0, beatIndex))];
      ship.position.set(sx, sy, sz);
      ship.rotation.y = beatIndex === 4 ? Math.PI : 0.15;
      group.add(ship);
      animRef.current.actor = ship;
      animRef.current.baseActorPos.set(sx, sy, sz);
    } else if (variant === 'zigzag') {
      // UNIT 2 SUPPLEMENTARY — ZIGZAG: REAL ANIMATED 3D PARROT IN DR. KRISHNAN'S CLINIC!
      group.add(createSkyDomeMesh(0x1e1b4b, 0x312e81, 0x0f172a, 36));
      const floor = new THREE.Mesh(
        new THREE.CylinderGeometry(4.2, 4.2, 0.2, 48),
        new THREE.MeshStandardMaterial({ map: getWoodBenchTextures().map, roughness: 0.7 }),
      );
      floor.position.y = -1.2;
      const perchPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 1.8, 14),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }),
      );
      perchPost.position.set(0, -0.3, 0);
      const perchBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }),
      );
      perchBar.rotation.z = Math.PI / 2;
      perchBar.position.set(0, 0.55, 0);
      group.add(floor, perchPost, perchBar);

      const birdAnchor = new THREE.Group();
      birdAnchor.position.set(beatIndex >= 3 ? 0.8 : 0, beatIndex === 1 ? 1.45 : 0.85, 0);
      group.add(birdAnchor);
      animRef.current.actor = birdAnchor;
      animRef.current.baseActorPos.copy(birdAnchor.position);

      loadNormalizedGLB('/models/parrot-animated.glb', 2.0)
        .then(({ root, sceneRoot, animations }) => {
          if (cancelled) return;
          birdAnchor.add(root);
          const lbl = createFloatingLabelSprite(
            'Zigzag the Multilingual Bird',
            beatIndex >= 3 ? 'Calm & Brilliant in Dr. Krishnan’s Clinic!' : 'Snoring / Chaos at Home!',
            '#34d399',
          );
          lbl.position.set(0, 1.15, 0);
          birdAnchor.add(lbl);
          if (animations.length > 0) {
            const mixer = new THREE.AnimationMixer(sceneRoot);
            const act = mixer.clipAction(animations[0]);
            act.timeScale = beatIndex === 1 ? 1.7 : 0.75;
            act.play();
            animRef.current.mixers.push(mixer);
          }
        })
        .catch(() => {});
    } else if (variant === 'navigating') {
      // UNIT 3 — EMPOWERED WOMEN NAVIGATING THE WORLD: INSV TARINI SAILING AROUND 3D EARTH GLOBE!
      group.add(createSkyDomeMesh(0x020617, 0x0c4a6e, 0x0f172a, 36));
      const globeGroup = new THREE.Group();
      const texLoader = new THREE.TextureLoader();
      const earthMap = texLoader.load('/textures/earth/earth-color-4k.jpg');
      earthMap.colorSpace = THREE.SRGBColorSpace;
      const elevMap = texLoader.load('/textures/earth/earth-elev-4k.jpg');
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.75, 64, 48),
        new THREE.MeshPhongMaterial({
          map: earthMap,
          bumpMap: elevMap,
          bumpScale: 0.045,
          shininess: 18,
        }),
      );
      const eqRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.88, 0.03, 12, 64),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      );
      eqRing.rotation.x = Math.PI / 2;
      globeGroup.add(globe, eqRing);

      // Glowing INSV Tarini boat orbiting the globe based on beatIndex!
      const ang = (beatIndex / 4) * Math.PI * 1.8;
      const boat = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.52, 4),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.6 }),
      );
      boat.position.set(Math.cos(ang) * 1.98, 0.22, Math.sin(ang) * 1.98);
      boat.rotation.z = -Math.PI / 2;
      const lbl = createFloatingLabelSprite('INSV Tarini · Navika Sagar Parikrama', '254-Day All-Women Circumnavigation (p. 60)', '#fbbf24');
      lbl.position.set(0, 2.35, 0);
      globeGroup.add(boat, lbl);
      group.add(globeGroup);
      animRef.current.spinObjects.push(globeGroup);
    } else if (variant === 'tech') {
      // UNIT 5 — TECH BLOOMERS & SECRET OF THE MACHINES: REAL 3D INTERLOCKING GEARS (/models/gears.glb)!
      group.add(createSkyDomeMesh(0x020617, 0x1e3a8a, 0x0f172a, 36));
      const gearAnchor = new THREE.Group();
      group.add(gearAnchor);
      animRef.current.spinObjects.push(gearAnchor);
      loadNormalizedGLB('/models/gears.glb', 3.4, { envMapIntensity: 1.6 })
        .then(({ root }) => {
          if (cancelled) return;
          gearAnchor.add(root);
          const lbl = createFloatingLabelSprite('Assistive Tech & Precision Machines', 'Dragon Dictate · Eye-Gaze · Modern Engineering (Unit 5)', '#38bdf8');
          lbl.position.set(0, 1.9, 0);
          gearAnchor.add(lbl);
        })
        .catch(() => {});
    } else if (variant === 'ghost' || variant === 'attic' || variant === 'lastlesson' || variant === 'detective') {
      // RICH THEMED 3D ROOM / STUDY / ATTIC / SCHOOLROOM DIORAMAS FOR UNITS 2, 4, 6, 7!
      const themes: Record<string, { skyTop: number; skyMid: number; label: string; sub: string; accent: number }> = {
        ghost: { skyTop: 0x090d1a, skyMid: 0x1e293b, label: 'Dining Room & Midnight Staircase', sub: 'The Night the Ghost Got In (Unit 2)', accent: 0x38bdf8 },
        attic: { skyTop: 0x1c1917, skyMid: 0x78350f, label: 'Sanyal’s Attic & Antique Silver Medal', sub: 'The Attic — Honesty & Redemption (Unit 4)', accent: 0xfbbf24 },
        lastlesson: { skyTop: 0x1e3a8a, skyMid: 0x3b82f6, label: 'M. Hamel’s Alsace Classroom', sub: '“Vive La France!” — Mother Tongue Heritage (Unit 6)', accent: 0x60a5fa },
        detective: { skyTop: 0x0f172a, skyMid: 0x334155, label: '221B Baker Street Study & Ivory Box', sub: 'The Dying Detective — Holmes’s Clever Trap (Unit 7)', accent: 0xf59e0b },
      };
      const cfg = themes[variant];
      group.add(createSkyDomeMesh(cfg.skyTop, cfg.skyMid, 0x090d1a, 36));

      const stage = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.28, 3.6),
        new THREE.MeshStandardMaterial({ map: getWoodBenchTextures().map, roughness: 0.72 }),
      );
      stage.position.y = -1.1;
      stage.receiveShadow = true;

      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 2.8, 0.22),
        new THREE.MeshStandardMaterial({ map: getRockTerrainTextures('sandstone').map, roughness: 0.85 }),
      );
      backWall.position.set(0, 0.3, -1.7);

      // Centerpiece hero prop illuminated by warm spotlight
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.78, 0.65, 24),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.35 }),
      );
      pedestal.position.set(0, -0.64, 0);

      const heroProp = new THREE.Mesh(
        variant === 'attic'
          ? new THREE.CylinderGeometry(0.45, 0.45, 0.1, 32)
          : variant === 'detective'
            ? new THREE.TorusGeometry(0.44, 0.08, 14, 32)
            : new THREE.BoxGeometry(0.95, 0.72, 0.52),
        new THREE.MeshPhysicalMaterial({
          color: cfg.accent,
          metalness: 0.65,
          roughness: 0.22,
          clearcoat: 0.85,
          emissive: cfg.accent,
          emissiveIntensity: 0.25 + beatIndex * 0.08,
        }),
      );
      heroProp.position.set(0, 0.35, 0);
      if (variant === 'attic') heroProp.rotation.x = Math.PI / 2;

      const warmLamp = new THREE.PointLight(cfg.accent, 3.2, 7.5);
      warmLamp.position.set(0, 1.4, 0.8);

      const lbl = createFloatingLabelSprite(cfg.label, `${cfg.sub} · Beat ${beatIndex + 1}/5`, '#fbbf24');
      lbl.position.set(0, 1.75, 0);

      group.add(stage, backWall, pedestal, heroProp, warmLamp, lbl);
      animRef.current.spinObjects.push(heroProp);
    } else {
      // 'life' — Henry Van Dyke's Sonnet 'Life': Sunlit Mountain, Winding Road & Golden Summit
      group.add(createSkyDomeMesh(0x1e3a8a, 0xfdba74, 0x1e293b, 36));
      addCloud(-2.8, 3.2, -3.5);
      addCloud(2.5, 3.5, -3.0);

      const grassTex = getGrassTerrainTextures();
      const hill = new THREE.Mesh(
        new THREE.ConeGeometry(3.8, 2.5, 42),
        new THREE.MeshStandardMaterial({ map: grassTex.map, bumpMap: grassTex.bumpMap, bumpScale: 0.12, roughness: 0.84 }),
      );
      hill.position.y = -0.45;
      group.add(hill);

      const crown = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.1, 14, 32),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.7, metalness: 0.78, roughness: 0.2 }),
      );
      crown.rotation.x = Math.PI / 2;
      crown.position.y = 1.05;
      group.add(crown, new THREE.PointLight(0xfde047, 3, 6));

      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 6; i++) {
        const ang = i * 0.92;
        const rad = 2.85 - i * 0.48;
        pts.push(new THREE.Vector3(Math.cos(ang) * rad, -1.35 + i * 0.46, Math.sin(ang) * rad));
      }
      group.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 44, 0.12, 10, false),
          new THREE.MeshStandardMaterial({ map: getRockTerrainTextures('sandstone').map, roughness: 0.7 }),
        ),
      );
      const tPos = pts[Math.min(5, beatIndex + 1)];
      const traveller = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.14, 0.34, 8, 14),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }),
      );
      traveller.position.set(tPos.x, tPos.y + 0.34, tPos.z);
      const tLbl = createFloatingLabelSprite('Optimistic Traveller', `Stanza Beat ${beatIndex + 1} of 5`, '#fde047');
      tLbl.position.set(0, 0.65, 0);
      traveller.add(tLbl);
      group.add(traveller);
      animRef.current.actor = traveller;
      animRef.current.baseActorPos.copy(traveller.position);
    }

    return () => {
      cancelled = true;
    };
  }, [variant, beatIndex]);

  const nudge = (axis: 'rot' | 'zoom', delta: number) => {
    if (axis === 'rot' && groupRef.current) groupRef.current.rotation.y += delta;
    if (axis === 'zoom' && cameraRef.current) {
      cameraRef.current.position.z = Math.max(3.2, Math.min(12.5, cameraRef.current.position.z + delta));
    }
  };

  if (webglError) {
    return (
      <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] text-sm text-[var(--ink)]">
        {webglError}
      </div>
    );
  }

  const labelMap: Record<English3DVariant, string> = {
    flight: 'Real Animated 3D Soaring Seabirds · His First Flight',
    life: '3D Sunlit Mountain Road · Life (Sonnet)',
    tempest: '3D Enchanted Island & Ship · The Tempest',
    ghost: '3D Moonlit Staircase · The Night the Ghost Got In',
    zigzag: 'Real Animated 3D Parrot · Zigzag',
    navigating: '3D Earth Globe & INSV Tarini · Empowered Women',
    attic: '3D Heritage Attic & Medal · The Attic',
    tech: 'Real 3D Mechanical Gears · Tech Bloomers & Machines',
    lastlesson: '3D Alsace Classroom · The Last Lesson',
    detective: '3D Baker Street Study · The Dying Detective',
  };

  return (
    <div ref={wrapperRef} className={`space-y-2.5 ${isFullscreen ? 'bg-slate-950 p-4 rounded-none' : ''}`}>
      <div className="relative rounded-[18px] overflow-hidden border border-[var(--line)] bg-[#091224] shadow-inner">
        <div
          ref={mountRef}
          className={`w-full ${isFullscreen ? 'h-[82vh]' : 'h-[320px] sm:h-[360px]'} cursor-grab active:cursor-grabbing`}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/85 border border-white/15 text-[11px] font-bold text-amber-200 pointer-events-none">
          {labelMap[variant]}
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
        <span className="text-[var(--text-muted)]">Drag to orbit 360° · Step through story beats below to animate the 3D world</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => nudge('rot', -0.45)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Left
          </button>
          <button type="button" onClick={() => nudge('rot', 0.45)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Right
          </button>
          <button type="button" onClick={() => nudge('zoom', -0.9)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" /> Zoom In
          </button>
          <button type="button" onClick={() => nudge('zoom', 0.9)} className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] font-semibold text-[var(--ink)] inline-flex items-center gap-1">
            <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { createStudioRenderer } from '../../three/sceneSetup';
import {
  createBeakerGraduationTexture,
  createFloatingLabelSprite,
  createSkyDomeMesh,
  getLabTileTextures,
  getWoodBenchTextures,
} from '../../three/proceduralTextures';
import { useFullscreen } from '../../hooks/useFullscreen';

export interface Chemistry3DCanvasProps {
  reagentALabel: string;
  reagentAColor: string;
  reagentBLabel: string;
  reagentBColor: string;
  isMixed: boolean;
  visualEffect: 'bright_solid' | 'gas_release' | 'yellow_precipitate' | 'neutral_clear' | 'flame_heat' | 'no_change';
  liquidColorHex: string;
  reducedMotion: boolean;
  onClickPour?: () => void;
}

export default function ChemistryMixingLab3DCanvas({
  reagentALabel,
  reagentAColor,
  reagentBLabel,
  reagentBColor,
  isMixed,
  visualEffect,
  liquidColorHex,
  reducedMotion,
  onClickPour,
}: Chemistry3DCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const labRootRef = useRef<THREE.Group | null>(null);
  const clickableBeakersRef = useRef<THREE.Object3D[]>([]);
  const onClickPourRef = useRef(onClickPour);
  onClickPourRef.current = onClickPour;

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [hoveredBeaker, setHoveredBeaker] = useState(false);

  const animStateRef = useRef<{
    isMixed: boolean;
    reducedMotion: boolean;
    visualEffect: Chemistry3DCanvasProps['visualEffect'];
    targetLiquidColor: THREE.Color;
    pourProgress: number;
    leftBeaker?: THREE.Group;
    rightBeaker?: THREE.Group;
    leftLiquid?: THREE.Mesh;
    rightLiquid?: THREE.Mesh;
    flaskLiquid?: THREE.Mesh;
    flaskLiquidMat?: THREE.MeshPhysicalMaterial;
    streamLeft?: THREE.Mesh;
    streamRight?: THREE.Mesh;
    bubbles: THREE.Mesh[];
    precipitates: THREE.Mesh[];
    steamPuffs: THREE.Mesh[];
    flameOuter?: THREE.Mesh;
    flameInner?: THREE.Mesh;
    flameLight?: THREE.PointLight;
    thermoBar?: THREE.Mesh;
  }>({
    isMixed,
    reducedMotion,
    visualEffect,
    targetLiquidColor: new THREE.Color(liquidColorHex),
    pourProgress: isMixed ? 1 : 0,
    bubbles: [],
    precipitates: [],
    steamPuffs: [],
  });

  useEffect(() => {
    animStateRef.current.isMixed = isMixed;
    animStateRef.current.reducedMotion = reducedMotion;
    animStateRef.current.visualEffect = visualEffect;
    animStateRef.current.targetLiquidColor = new THREE.Color(isMixed ? liquidColorHex : '#cbd5e1');
    if (!isMixed) {
      animStateRef.current.pourProgress = 0;
    }
  }, [isMixed, reducedMotion, visualEffect, liquidColorHex]);

  // Core studio WebGL lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const studio = createStudioRenderer(container, {
      exposure: 1.18,
      fogColor: 0x0f172a,
      fogDensity: 0.028,
    });
    if (!studio) {
      setWebglError('WebGL unavailable on this device. Use the interactive 2D reaction controls below.');
      return;
    }

    const { renderer, scene, disposeStudio } = studio;
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 380;

    // Warm scientific lab studio dome
    scene.add(createSkyDomeMesh(0x0b1120, 0x1e293b, 0x0f172a, 34));

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 2.35, 6.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.15, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.0;
    controls.maxDistance = 11.5;
    controls.maxPolarAngle = Math.PI * 0.48;
    controlsRef.current = controls;

    // Warm overhead bench lamp
    const overheadLamp = new THREE.PointLight(0xfff7ed, 3.2, 16);
    overheadLamp.position.set(0, 4.4, 2.2);
    scene.add(overheadLamp);

    const labRoot = new THREE.Group();
    labRootRef.current = labRoot;
    scene.add(labRoot);

    // Raycasting so learners can click/tap 3D beakers directly to pick up & pour!
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointer = (ev: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (ev: MouseEvent) => {
      updatePointer(ev);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableBeakersRef.current, true);
      setHoveredBeaker(hits.length > 0);
    };

    const onClick = (ev: MouseEvent) => {
      updatePointer(ev);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableBeakersRef.current, true);
      if (hits.length > 0 && onClickPourRef.current) {
        onClickPourRef.current();
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    let animId = 0;
    let t = 0;
    const baseLiquidColor = new THREE.Color('#cbd5e1');

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const st = animStateRef.current;
      t += 0.028;

      // Smooth multi-stage physics animation for picking up & pouring beakers!
      const targetPour = st.isMixed ? 1 : 0;
      if (st.reducedMotion) {
        st.pourProgress = targetPour;
      } else {
        st.pourProgress += (targetPour - st.pourProgress) * 0.065;
        if (Math.abs(targetPour - st.pourProgress) < 0.002) st.pourProgress = targetPour;
      }

      const p = st.pourProgress;
      const liftPhase = Math.min(1, p * 2.1); // 0..0.48: lift & glide over flask
      const tiltPhase = Math.max(0, Math.min(1, (p - 0.35) / 0.45)); // 0.35..0.80: tilt & pour
      const pourActive = p > 0.42 && p < 0.94;

      if (st.leftBeaker && st.rightBeaker) {
        const hoverBob = !st.isMixed && !st.reducedMotion ? Math.sin(t * 2.2) * 0.025 : 0;
        st.leftBeaker.position.set(
          THREE.MathUtils.lerp(-2.2, -1.06, liftPhase),
          THREE.MathUtils.lerp(-0.48 + hoverBob, 1.48, Math.sin(liftPhase * Math.PI * 0.5)),
          0,
        );
        st.leftBeaker.rotation.z = THREE.MathUtils.lerp(0, -0.82, tiltPhase);

        st.rightBeaker.position.set(
          THREE.MathUtils.lerp(2.2, 1.06, liftPhase),
          THREE.MathUtils.lerp(-0.48 - hoverBob, 1.48, Math.sin(liftPhase * Math.PI * 0.5)),
          0,
        );
        st.rightBeaker.rotation.z = THREE.MathUtils.lerp(0, 0.82, tiltPhase);
      }

      if (st.leftLiquid && st.rightLiquid) {
        const remainScale = THREE.MathUtils.lerp(1, 0.36, tiltPhase);
        st.leftLiquid.scale.y = remainScale;
        st.leftLiquid.position.y = -0.45 + 0.32 * remainScale;
        st.rightLiquid.scale.y = remainScale;
        st.rightLiquid.position.y = -0.45 + 0.32 * remainScale;
      }

      if (st.streamLeft && st.streamRight) {
        st.streamLeft.visible = pourActive;
        st.streamRight.visible = pourActive;
      }

      // Flask liquid rises and smoothly color-lerps as reagents combine
      if (st.flaskLiquid && st.flaskLiquidMat) {
        const fillFactor = THREE.MathUtils.lerp(0.28, 1.0, tiltPhase);
        st.flaskLiquid.scale.y = fillFactor;
        st.flaskLiquid.position.y = -0.94 + 0.38 * fillFactor;
        st.flaskLiquidMat.color.lerp(
          tiltPhase > 0.25 ? st.targetLiquidColor : baseLiquidColor,
          st.reducedMotion ? 1 : 0.08,
        );
        st.flaskLiquidMat.opacity = THREE.MathUtils.lerp(0.32, 0.88, tiltPhase);
      }

      // Live thermometer mercury climb on exothermic / heated reactions
      if (st.thermoBar) {
        const hot =
          st.isMixed &&
          (st.visualEffect === 'flame_heat' ||
            st.visualEffect === 'neutral_clear' ||
            st.visualEffect === 'gas_release');
        const targetH = hot ? 1.0 : 0.35;
        st.thermoBar.scale.y += (targetH - st.thermoBar.scale.y) * 0.06;
        st.thermoBar.position.y = -0.82 + 0.42 * st.thermoBar.scale.y;
      }

      if (!st.reducedMotion) {
        // Exact Erlenmeyer conical wall inner radius containment so ZERO particles EVER float outside the glass!
        const getFlaskInnerR = (y: number) => {
          if (y >= 0.44) return 0.22; // Narrow neck
          const frac = Math.max(0, Math.min(1, (y - -0.92) / (0.44 - -0.92)));
          return THREE.MathUtils.lerp(0.86, 0.24, frac);
        };

        // Rising effervescent bubbles strictly contained inside liquid + narrow flask neck!
        for (let i = 0; i < st.bubbles.length; i++) {
          const b = st.bubbles[i];
          b.visible = tiltPhase > 0.45;
          b.position.y += 0.018 + (i % 4) * 0.004;
          if (b.position.y > -0.22) {
            b.position.y = -0.88;
            const ang = i * 2.399 + t * 0.5;
            const spawnR = 0.1 + ((i % 7) / 7) * 0.58;
            b.position.x = Math.cos(ang) * spawnR;
            b.position.z = Math.sin(ang) * spawnR;
          }
          // Strictly clamp radial distance inside conical wall at current Y
          const maxR = Math.max(0.08, getFlaskInnerR(b.position.y) - 0.08);
          const curR = Math.hypot(b.position.x, b.position.z);
          if (curR > maxR) {
            b.position.x *= maxR / curR;
            b.position.z *= maxR / curR;
          }
        }

        // Shimmering settling yellow precipitate crystals strictly inside lower flask liquid!
        for (let i = 0; i < st.precipitates.length; i++) {
          const c = st.precipitates[i];
          c.visible = tiltPhase > 0.4;
          const floorY = -0.88 + (i % 3) * 0.045;
          if (c.position.y > floorY) {
            c.position.y -= 0.005 + (i % 3) * 0.0018;
          }
          const maxR = Math.max(0.1, getFlaskInnerR(c.position.y) - 0.1);
          const curR = Math.hypot(c.position.x, c.position.z);
          if (curR > maxR) {
            c.position.x *= maxR / curR;
            c.position.z *= maxR / curR;
          }
          c.rotation.y += 0.025;
          c.rotation.x += 0.015;
        }

        // Rising steam wisps when heated
        for (let i = 0; i < st.steamPuffs.length; i++) {
          const s = st.steamPuffs[i];
          s.visible = tiltPhase > 0.4;
          s.position.y += 0.016;
          s.scale.setScalar(0.8 + ((s.position.y - 1.0) / 1.4) * 0.8);
          if (s.position.y > 2.3) {
            s.position.y = 1.08;
            s.scale.setScalar(0.6);
          }
        }

        // Flickering Bunsen burner flame
        if (st.flameOuter && st.flameInner) {
          st.flameOuter.scale.y = 0.92 + Math.sin(t * 7.5) * 0.16;
          st.flameOuter.scale.x = 0.94 + Math.cos(t * 6.2) * 0.08;
          st.flameInner.scale.y = 0.95 + Math.sin(t * 9.5 + 1) * 0.12;
          if (st.flameLight) {
            st.flameLight.intensity = 2.6 + Math.sin(t * 8) * 0.5;
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 640;
      const ch = container.clientHeight || 380;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      disposeStudio();
    };
  }, []);

  // Build textured lab props, graduated glassware & reaction particle systems
  useEffect(() => {
    const labRoot = labRootRef.current;
    if (!labRoot) return;
    while (labRoot.children.length > 0) labRoot.remove(labRoot.children[0]);
    clickableBeakersRef.current = [];
    animStateRef.current.bubbles = [];
    animStateRef.current.precipitates = [];
    animStateRef.current.steamPuffs = [];
    animStateRef.current.flameOuter = undefined;
    animStateRef.current.flameInner = undefined;
    animStateRef.current.flameLight = undefined;

    const woodTex = getWoodBenchTextures();
    const tileTex = getLabTileTextures();

    // 1. Textured Oak Laboratory Bench + Protective Slate Mat + Ceramic Backsplash
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.34, 4.4),
      new THREE.MeshStandardMaterial({
        map: woodTex.map,
        bumpMap: woodTex.bumpMap,
        bumpScale: 0.04,
        roughnessMap: woodTex.roughnessMap,
        roughness: 0.65,
        metalness: 0.06,
      }),
    );
    bench.position.set(0, -1.18, 0);
    bench.receiveShadow = true;
    labRoot.add(bench);

    const rubberMat = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.03, 2.75),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, metalness: 0.05 }),
    );
    rubberMat.position.set(0, -0.995, 0.05);
    rubberMat.receiveShadow = true;
    labRoot.add(rubberMat);

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(11.5, 5.4),
      new THREE.MeshStandardMaterial({
        map: tileTex.map,
        bumpMap: tileTex.bumpMap,
        bumpScale: 0.03,
        roughness: 0.42,
        metalness: 0.12,
      }),
    );
    backWall.position.set(0, 1.5, -2.15);
    backWall.receiveShadow = true;
    labRoot.add(backWall);

    // 2. Background Lab Props: Steel Retort Stand & Wooden Test-Tube Rack for realism
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.82, roughness: 0.24 });
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.75), steelMat);
    standBase.position.set(-3.1, -0.97, -1.15);
    standBase.castShadow = true;
    const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.9, 16), steelMat);
    standRod.position.set(-3.4, 0.48, -1.35);
    standRod.castShadow = true;
    const standRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 10, 24), steelMat);
    standRing.rotation.x = Math.PI / 2;
    standRing.position.set(-3.0, 0.78, -1.15);
    labRoot.add(standBase, standRod, standRing);

    // Wooden test-tube rack on right background
    const rackGroup = new THREE.Group();
    const rackWood = new THREE.MeshStandardMaterial({ map: woodTex.map, roughness: 0.7 });
    const rackBot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 0.42), rackWood);
    rackBot.position.y = -0.96;
    const rackTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.42), rackWood);
    rackTop.position.y = -0.42;
    rackGroup.add(rackBot, rackTop);
    const tubeColors = [0x38bdf8, 0x22c55e, 0xf59e0b, 0xf43f5e];
    for (let i = 0; i < 4; i++) {
      const tx = -0.48 + i * 0.32;
      const tGlass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.92, 16),
        new THREE.MeshPhysicalMaterial({
          color: 0xf1f5f9,
          roughness: 0.08,
          transmission: 0.55,
          transparent: true,
          opacity: 0.48,
        }),
      );
      tGlass.position.set(tx, -0.48, 0);
      const tLiq = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.068, 0.36, 14),
        new THREE.MeshStandardMaterial({ color: tubeColors[i], roughness: 0.2 }),
      );
      tLiq.position.set(tx, -0.74, 0);
      rackGroup.add(tGlass, tLiq);
    }
    rackGroup.position.set(3.05, 0, -1.15);
    rackGroup.rotation.y = -0.35;
    labRoot.add(rackGroup);

    // Digital Thermometer Stand next to central flask
    const thermoPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 1.15, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.4 }),
    );
    thermoPost.position.set(1.38, -0.4, -0.68);
    const thermoBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.85, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.65,
      }),
    );
    thermoBar.position.set(1.38, -0.65, -0.6);
    thermoBar.scale.y = 0.35;
    labRoot.add(thermoPost, thermoBar);
    animStateRef.current.thermoBar = thermoBar;

    // 3. Refractive Borosilicate Glass Material
    const makeGlassMat = (labelText?: string) => {
      const gradTex = labelText !== undefined ? createBeakerGraduationTexture(labelText) : undefined;
      return new THREE.MeshPhysicalMaterial({
        color: 0xf1f5f9,
        map: gradTex,
        roughness: 0.08,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        transparent: true,
        opacity: labelText !== undefined ? 0.56 : 0.34,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
    };

    // 4. Central Conical Erlenmeyer Reaction Flask
    const flaskGroup = new THREE.Group();
    const flaskWallMat = makeGlassMat('FLASK');
    const flaskCone = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 1.08, 1.48, 42, 1, true), flaskWallMat);
    flaskCone.position.y = -0.23;
    flaskCone.renderOrder = 3;
    const flaskNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.62, 32, 1, true), makeGlassMat());
    flaskNeck.position.y = 0.82;
    flaskNeck.renderOrder = 3;
    const flaskRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.37, 0.042, 14, 36),
      new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, roughness: 0.12, clearcoat: 1 }),
    );
    flaskRim.rotation.x = Math.PI / 2;
    flaskRim.position.y = 1.13;
    const flaskBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.08, 1.08, 0.05, 42),
      new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, roughness: 0.15, transparent: true, opacity: 0.45 }),
    );
    flaskBase.position.y = -0.95;
    flaskGroup.add(flaskCone, flaskNeck, flaskRim, flaskBase);

    const flaskLiquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isMixed ? liquidColorHex : '#cbd5e1'),
      roughness: 0.14,
      metalness: 0.04,
      clearcoat: 0.9,
      transparent: true,
      opacity: isMixed ? 0.86 : 0.34,
      emissive: visualEffect === 'neutral_clear' && isMixed ? new THREE.Color(0x10b981) : new THREE.Color(0x000000),
      emissiveIntensity: visualEffect === 'neutral_clear' && isMixed ? 0.3 : 0,
    });
    const flaskLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 1.01, 0.76, 40), flaskLiquidMat);
    flaskLiquid.position.y = -0.58;
    flaskLiquid.scale.y = isMixed ? 1 : 0.28;
    flaskGroup.add(flaskLiquid);
    labRoot.add(flaskGroup);
    animStateRef.current.flaskLiquid = flaskLiquid;
    animStateRef.current.flaskLiquidMat = flaskLiquidMat;

    // 5. Clickable Beaker A (Left) & Beaker B (Right) with volumetric markings & 3D billboard labels
    const buildBeaker = (label: string, colorHex: string, side: -1 | 1) => {
      const bGroup = new THREE.Group();
      const bWall = new THREE.Mesh(
        new THREE.CylinderGeometry(0.47, 0.46, 0.98, 32, 1, true),
        makeGlassMat(label),
      );
      bWall.renderOrder = 4;
      const bRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.47, 0.032, 12, 32),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, roughness: 0.1, clearcoat: 1 }),
      );
      bRim.rotation.x = Math.PI / 2;
      bRim.position.y = 0.49;
      const bBottom = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.46, 0.04, 32),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, roughness: 0.12, transparent: true, opacity: 0.5 }),
      );
      bBottom.position.y = -0.47;

      const liq = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.41, 0.64, 28),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(colorHex),
          roughness: 0.16,
          clearcoat: 0.85,
          transparent: true,
          opacity: 0.9,
        }),
      );
      liq.position.y = -0.13;

      const badge = createFloatingLabelSprite(label, side === -1 ? 'Click to Pour A' : 'Click to Pour B', colorHex);
      badge.position.set(0, 1.05, 0);
      badge.scale.set(1.25, 0.42, 1);

      bGroup.add(bWall, bRim, bBottom, liq, badge);
      bGroup.position.set(side * 2.2, -0.48, 0);
      clickableBeakersRef.current.push(bGroup);
      return { bGroup, liq };
    };

    const left = buildBeaker(reagentALabel, reagentAColor, -1);
    const right = buildBeaker(reagentBLabel, reagentBColor, 1);
    labRoot.add(left.bGroup, right.bGroup);
    animStateRef.current.leftBeaker = left.bGroup;
    animStateRef.current.rightBeaker = right.bGroup;
    animStateRef.current.leftLiquid = left.liq;
    animStateRef.current.rightLiquid = right.liq;

    // 6. Curved Liquid Pour Streams (TubeGeometry cascading from tilted beaker lips into flask!)
    const makeStream = (side: -1 | 1, colorHex: string) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.62, 1.56, 0),
        new THREE.Vector3(side * 0.24, 1.24, 0),
        new THREE.Vector3(side * 0.08, 0.45, 0),
        new THREE.Vector3(side * 0.04, -0.45, 0),
      ]);
      const stream = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.055, 10, false),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(colorHex),
          emissive: new THREE.Color(colorHex),
          emissiveIntensity: 0.25,
          roughness: 0.1,
          transparent: true,
          opacity: 0.86,
        }),
      );
      stream.visible = false;
      return stream;
    };
    const streamLeft = makeStream(-1, reagentAColor);
    const streamRight = makeStream(1, reagentBColor);
    labRoot.add(streamLeft, streamRight);
    animStateRef.current.streamLeft = streamLeft;
    animStateRef.current.streamRight = streamRight;

    // 7. Rich Dynamic Reaction Effects strictly contained inside Erlenmeyer cone interior
    const innerRAtY = (y: number) => {
      const frac = Math.max(0, Math.min(1, (y - -0.92) / (0.44 - -0.92)));
      return THREE.MathUtils.lerp(0.82, 0.22, frac);
    };

    if (visualEffect === 'gas_release' || visualEffect === 'flame_heat') {
      const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        clearcoat: 1,
        transparent: true,
        opacity: 0.82,
      });
      for (let i = 0; i < 32; i++) {
        const by = -0.86 + ((i * 0.04) % 0.62);
        const maxR = Math.max(0.08, innerRAtY(by) - 0.1);
        const ang = i * 2.399;
        const r = ((i % 6) / 6) * maxR;
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.026 + (i % 3) * 0.011, 10, 10), bubbleMat);
        b.position.set(Math.cos(ang) * r, by, Math.sin(ang) * r);
        b.visible = isMixed;
        labRoot.add(b);
        animStateRef.current.bubbles.push(b);
      }
    }

    if (visualEffect === 'yellow_precipitate') {
      const pptMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(liquidColorHex === '#B45309' ? '#D97706' : '#FACC15'),
        roughness: 0.35,
        metalness: 0.15,
        emissive: new THREE.Color(0xca8a04),
        emissiveIntensity: 0.35,
      });
      for (let i = 0; i < 48; i++) {
        const cy = -0.82 + (i % 5) * 0.11;
        const maxR = Math.max(0.1, innerRAtY(cy) - 0.12);
        const ang = i * 2.399;
        const r = ((i % 7) / 7) * maxR;
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.046 + (i % 3) * 0.012), pptMat);
        crystal.position.set(Math.cos(ang) * r, cy, Math.sin(ang) * r);
        crystal.visible = isMixed;
        labRoot.add(crystal);
        animStateRef.current.precipitates.push(crystal);
      }
    }

    if (visualEffect === 'flame_heat' && isMixed) {
      // Brass Bunsen burner + twin-cone animated blue/orange flame + steam
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.78, roughness: 0.28 });
      const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.16, 24), brassMat);
      burnerBase.position.set(0, -0.92, 1.18);
      const burnerTube = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.52, 20), steelMat);
      burnerTube.position.set(0, -0.62, 1.18);
      const flameOuter = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.74, 20),
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.78 }),
      );
      flameOuter.position.set(0, -0.04, 1.18);
      const flameInner = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.42, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.92 }),
      );
      flameInner.position.set(0, -0.18, 1.18);
      const flameLight = new THREE.PointLight(0xfb923c, 2.8, 7);
      flameLight.position.set(0, 0.15, 1.18);
      labRoot.add(burnerBase, burnerTube, flameOuter, flameInner, flameLight);
      animStateRef.current.flameOuter = flameOuter;
      animStateRef.current.flameInner = flameInner;
      animStateRef.current.flameLight = flameLight;

      const steamMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.26 });
      for (let i = 0; i < 12; i++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), steamMat);
        puff.position.set(Math.sin(i * 1.5) * 0.18, 1.1 + i * 0.11, Math.cos(i) * 0.15);
        labRoot.add(puff);
        animStateRef.current.steamPuffs.push(puff);
      }
    }

    if (visualEffect === 'no_change' && isMixed) {
      const copperMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.32, metalness: 0.72 });
      for (let i = 0; i < 7; i++) {
        const chunk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11), copperMat);
        chunk.position.set(-0.42 + i * 0.14, -0.86, i % 2 === 0 ? 0.18 : -0.18);
        chunk.rotation.set(i, i * 0.7, 0);
        labRoot.add(chunk);
      }
    }
  }, [reagentALabel, reagentAColor, reagentBLabel, reagentBColor, isMixed, visualEffect, liquidColorHex]);

  if (webglError) {
    return (
      <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs text-[var(--text)]">
        {webglError}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col gap-3'
          : 'space-y-2'
      }
    >
      <div className={`relative ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
        <div
          ref={mountRef}
          className={`w-full ${isFullscreen ? 'h-full' : 'h-[350px] sm:h-[380px]'
            } rounded-2xl border border-[var(--line)] bg-slate-950 overflow-hidden ${hoveredBeaker ? 'cursor-pointer' : 'cursor-grab'
            }`}
          aria-label="Interactive 3D Virtual Chemistry Mixing Lab Bench"
        />
        <span className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/85 text-emerald-300 border border-emerald-400/40 text-xs font-bold backdrop-blur-xs">
          {isMixed
            ? 'Reaction Active · Orbit to inspect flask · Click beakers to mix again'
            : 'Click Beaker A or B directly to pick up & pour!'}
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen 3D lab' : 'Enter fullscreen 3D lab'}
          className="absolute top-3 right-3 px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-950/85 hover:bg-slate-900 text-white border border-white/20 text-xs font-bold inline-flex items-center gap-1.5 backdrop-blur-xs"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={isFullscreen ? 'text-slate-300' : 'text-[var(--text-muted)]'}>
          Drag to orbit · Scroll to zoom · Click beakers directly to pour
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => labRootRef.current && (labRootRef.current.rotation.y -= 0.4)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Left</span>
          </button>
          <button
            type="button"
            onClick={() => labRootRef.current && (labRootRef.current.rotation.y += 0.4)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Right</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(0.86)}
            className="px-2.5 py-1.5 min-h-[34px] rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-semibold inline-flex items-center gap-1"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom +</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.position.multiplyScalar(1.16)}
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

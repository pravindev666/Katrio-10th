import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type ChemicalProcess3DKind =
  | 'hall_heroult_al'
  | 'copper_smelting'
  | 'rusting_galvanization'
  | 'thermal_reaction_flow'
  | 'esterification_bath';

interface ChemicalProcess3DCanvasProps {
  kind: ChemicalProcess3DKind;
  stageIndex: number; // 0, 1, 2
  heatOn: boolean;
  protectedCoat?: boolean; // For galvanization/anodizing on iron
  reducedMotion?: boolean;
}

/**
 * Interactive 3D PBR Chemical Process & Metallurgy Flow Studio:
 * Renders real glass beakers, molten electrolytic tanks, animated Bunsen/furnace heat flame,
 * graphite electrodes, rising O₂/SO₂/CO₂ gas bubbles, and molten metal / precipitate flow!
 */
export default function ChemicalProcess3DCanvas({
  kind,
  stageIndex,
  heatOn,
  protectedCoat = false,
  reducedMotion = false,
}: ChemicalProcess3DCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = 310;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#09101d');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.1, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxDistance = 12;
    controls.minDistance = 4;
    controls.maxPolarAngle = Math.PI * 0.49;

    // Lab Lighting
    scene.add(new THREE.AmbientLight('#94a3b8', 0.9));
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.45);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(heatOn ? '#f97316' : '#38bdf8', heatOn ? 2.6 : 1.1, 16);
    rimLight.position.set(0, -0.8, 2.2);
    scene.add(rimLight);

    // Ceramic Lab Bench Base
    const bench = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 4.0, 0.28, 36),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.65, metalness: 0.25 }),
    );
    bench.position.y = -1.65;
    scene.add(bench);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#e0f2fe',
      transparent: true,
      opacity: 0.26,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.55,
      side: THREE.DoubleSide,
    });

    const bubbles: { mesh: THREE.Mesh; speed: number; baseX: number; baseZ: number }[] = [];
    let flameGroup: THREE.Group | null = null;
    let liquidMesh: THREE.Mesh | null = null;
    let metalPoolMesh: THREE.Mesh | null = null;

    const addBubbles = (count: number, colorHex: string, minY: number, radiusMax: number) => {
      const bGeo = new THREE.SphereGeometry(0.065, 10, 10);
      const bMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85,
      });
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * radiusMax;
        const m = new THREE.Mesh(bGeo, bMat);
        m.position.set(Math.cos(ang) * r, minY + Math.random() * 1.5, Math.sin(ang) * r);
        scene.add(m);
        bubbles.push({ mesh: m, speed: 0.012 + Math.random() * 0.018, baseX: m.position.x, baseZ: m.position.z });
      }
    };

    const addBunsenBurner = (xPos: number) => {
      const g = new THREE.Group();
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, 0.72, 16),
        new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.75, roughness: 0.3 }),
      );
      tube.position.set(xPos, -1.16, 0);
      g.add(tube);

      if (heatOn) {
        const outerFlame = new THREE.Mesh(
          new THREE.ConeGeometry(0.28, 0.75, 16),
          new THREE.MeshBasicMaterial({ color: '#f97316', transparent: true, opacity: 0.82 }),
        );
        outerFlame.position.set(xPos, -0.52, 0);
        const innerFlame = new THREE.Mesh(
          new THREE.ConeGeometry(0.15, 0.48, 14),
          new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.92 }),
        );
        innerFlame.position.set(xPos, -0.62, 0);
        g.add(outerFlame, innerFlame);
        flameGroup = new THREE.Group();
        flameGroup.add(outerFlame, innerFlame);
        scene.add(flameGroup);
      }
      scene.add(g);
    };

    if (kind === 'hall_heroult_al') {
      // Steel/Iron Cathode Tank lined with Carbon Graphite (Fig. 8.10, p. 115)
      const tankWall = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 2.0, 2.2),
        new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.65, roughness: 0.4, transparent: true, opacity: 0.38 }),
      );
      tankWall.position.y = 0.05;
      scene.add(tankWall);

      // Carbon cathode inner base
      const cathodeLining = new THREE.Mesh(
        new THREE.BoxGeometry(3.35, 0.25, 2.0),
        new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.85 }),
      );
      cathodeLining.position.y = -0.82;
      scene.add(cathodeLining);

      // Molten Cryolite + Alumina Bath (glows bright orange-gold at 900–950 °C)
      const bathColor = stageIndex === 0 ? '#a16207' : heatOn ? '#f97316' : '#64748b';
      liquidMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.25, 1.15, 1.9),
        new THREE.MeshStandardMaterial({
          color: bathColor,
          emissive: heatOn ? '#ea580c' : '#000000',
          emissiveIntensity: heatOn ? 0.55 : 0,
          transparent: true,
          opacity: 0.78,
          roughness: 0.25,
        }),
      );
      liquidMesh.position.y = 0.02;
      scene.add(liquidMesh);

      // Molten Silver Aluminium pooling at cathode bottom (stage >= 1)
      metalPoolMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, stageIndex >= 1 ? 0.34 : 0.08, 1.85),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.95, roughness: 0.12 }),
      );
      metalPoolMesh.position.y = -0.56;
      scene.add(metalPoolMesh);

      // Bus bar + 4 Carbon Graphite Anode Rods dipping into electrolyte
      const busBar = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.14, 0.24),
        new THREE.MeshStandardMaterial({ color: '#b45309', metalness: 0.85, roughness: 0.25 }),
      );
      busBar.position.y = 1.68;
      scene.add(busBar);

      [-1.1, -0.37, 0.37, 1.1].forEach((ax) => {
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 1.55, 16),
          new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7, metalness: 0.3 }),
        );
        rod.position.set(ax, 0.88, 0);
        scene.add(rod);
      });

      addBunsenBurner(0);
      if (heatOn) addBubbles(22, '#38bdf8', -0.2, 1.3); // O₂ / CO₂ bubbles rising from anodes
    } else if (kind === 'copper_smelting') {
      // Twin-stage Copper Extraction: Froth/Roasting Furnace -> Electrolytic Refining Bath
      const beaker = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.35, 2.3, 32, 1, true), glassMat);
      beaker.position.y = 0.15;
      scene.add(beaker);

      const bathColor = stageIndex === 0 ? '#ca8a04' : stageIndex === 1 ? '#ea580c' : '#0284c7';
      liquidMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.36, 1.3, 1.45, 32),
        new THREE.MeshStandardMaterial({
          color: bathColor,
          emissive: stageIndex === 1 && heatOn ? '#c2410c' : '#0369a1',
          emissiveIntensity: stageIndex === 1 && heatOn ? 0.65 : 0.2,
          transparent: true,
          opacity: 0.8,
        }),
      );
      liquidMesh.position.y = -0.22;
      scene.add(liquidMesh);

      if (stageIndex === 2) {
        // Pure Copper Cathode & Impure Anode in CuSO₄ blue bath
        const anode = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 1.6, 0.9),
          new THREE.MeshStandardMaterial({ color: '#92400e', metalness: 0.7, roughness: 0.55 }),
        );
        anode.position.set(-0.62, 0.35, 0);
        const cathode = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 1.6, 0.9),
          new THREE.MeshStandardMaterial({ color: '#f97316', metalness: 0.92, roughness: 0.18 }),
        );
        cathode.position.set(0.62, 0.35, 0);
        scene.add(anode, cathode);
      }

      addBunsenBurner(0);
      if (heatOn || stageIndex === 0) addBubbles(18, stageIndex === 2 ? '#fb923c' : '#fde047', -0.6, 1.0);
    } else if (kind === 'rusting_galvanization') {
      // Iron Plate + Protective Zinc Coat (optional) + Water Droplet + Rust Oxide Crystal Layer
      const ironPlate = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.55, 2.2),
        new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.82, roughness: 0.35 }),
      );
      ironPlate.position.y = -0.65;
      scene.add(ironPlate);

      if (protectedCoat) {
        const zincLayer = new THREE.Mesh(
          new THREE.BoxGeometry(3.68, 0.14, 2.28),
          new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.94, roughness: 0.14 }),
        );
        zincLayer.position.y = -0.32;
        scene.add(zincLayer);
      } else {
        // Reddish-brown Hydrated Ferric Oxide Fe₂O₃·xH₂O crust!
        const rustCrust = new THREE.Mesh(
          new THREE.CylinderGeometry(1.15, 1.35, 0.22, 24),
          new THREE.MeshStandardMaterial({ color: '#9a3412', roughness: 0.95, metalness: 0.1 }),
        );
        rustCrust.position.y = -0.29;
        scene.add(rustCrust);
      }

      // Translucent Water Droplet sitting on metal surface (Fig. 8.12, p. 120)
      const droplet = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.52),
        new THREE.MeshPhysicalMaterial({
          color: '#38bdf8',
          transparent: true,
          opacity: 0.45,
          roughness: 0.08,
        }),
      );
      droplet.position.y = -0.26;
      scene.add(droplet);
      addBubbles(14, protectedCoat ? '#34d399' : '#fb923c', -0.2, 0.75);
    } else {
      // Dual-Beaker Chemical Reaction / Esterification Water-Bath Flow Studio
      const leftBeaker = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.9, 1.9, 28, 1, true), glassMat);
      leftBeaker.position.set(-1.35, 0.15, 0);
      const rightBeaker = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.1, 2.1, 28, 1, true), glassMat);
      rightBeaker.position.set(1.05, 0.1, 0);
      scene.add(leftBeaker, rightBeaker);

      const leftLiquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.88, 0.84, 1.05, 24),
        new THREE.MeshStandardMaterial({ color: '#38bdf8', transparent: true, opacity: 0.78 }),
      );
      leftLiquid.position.set(-1.35, -0.25, 0);
      scene.add(leftLiquid);

      const reactColors =
        kind === 'esterification_bath'
          ? ['#fbbf24', '#f59e0b', '#ec4899']
          : ['#22c55e', '#f59e0b', '#a855f7'];
      liquidMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.08, 1.04, 1.25, 24),
        new THREE.MeshStandardMaterial({
          color: reactColors[stageIndex % 3],
          emissive: heatOn ? reactColors[stageIndex % 3] : '#000000',
          emissiveIntensity: heatOn ? 0.32 : 0,
          transparent: true,
          opacity: 0.82,
        }),
      );
      liquidMesh.position.set(1.05, -0.28, 0);
      scene.add(liquidMesh);

      // Connecting glass delivery/pouring tube
      const tube = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.08, 12, 24, Math.PI),
        glassMat,
      );
      tube.position.set(-0.15, 0.95, 0);
      scene.add(tube);

      addBunsenBurner(1.05);
      addBubbles(heatOn ? 20 : 10, '#f8fafc', -0.65, 0.85);
      bubbles.forEach((b) => {
        b.baseX += 1.05;
        b.mesh.position.x = b.baseX;
      });
    }

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!reducedMotion) {
        bubbles.forEach((b, i) => {
          b.mesh.position.y += b.speed * (heatOn ? 1.5 : 0.65);
          b.mesh.position.x = b.baseX + Math.sin(t * 2.5 + i) * 0.04;
          if (b.mesh.position.y > 0.95) {
            b.mesh.position.y = -0.55;
          }
        });
        if (flameGroup) {
          flameGroup.scale.y = 0.92 + Math.sin(t * 14) * 0.1;
          flameGroup.scale.x = 0.96 + Math.cos(t * 12) * 0.06;
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [kind, stageIndex, heatOn, protectedCoat, reducedMotion]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] bg-slate-950">
      <div
        ref={hostRef}
        className="w-full h-[310px]"
        role="img"
        aria-label={`Interactive 3D chemical process flow visualization (${kind})`}
      />
      <div className="absolute top-2.5 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 border border-white/15 text-[10px] font-extrabold text-amber-300">
        3D Chemical Process Flow · Drag to Orbit · {heatOn ? 'Burner / Furnace Heat ON' : 'Ambient Temp'}
      </div>
    </div>
  );
}

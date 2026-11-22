import * as THREE from 'three';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap?: THREE.CanvasTexture;
}

const textureCache = new Map<string, PBRTextureSet>();

function seededRand(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function configureTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1,
  isColor = true,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

/**
 * Realistic laboratory dark oak / slate wood grain bench texture with bump + roughness.
 */
export function getWoodBenchTextures(): PBRTextureSet {
  const cached = textureCache.get('wood_bench');
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);
  const [roughC, rctx] = makeCanvas(512, 512);
  const rand = seededRand(4201);

  // Warm walnut / slate lab timber base
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#5c3d28');
  grad.addColorStop(0.35, '#6b472f');
  grad.addColorStop(0.7, '#543622');
  grad.addColorStop(1, '#613f28');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);
  rctx.fillStyle = '#999999';
  rctx.fillRect(0, 0, 512, 512);

  // Plank seams
  for (let y = 0; y < 512; y += 128) {
    ctx.fillStyle = 'rgba(28, 16, 8, 0.55)';
    ctx.fillRect(0, y, 512, 3);
    bctx.fillStyle = '#202020';
    bctx.fillRect(0, y, 512, 3);
    rctx.fillStyle = '#dddddd';
    rctx.fillRect(0, y, 512, 4);
  }

  // Flowing wood grain fibers
  for (let i = 0; i < 420; i++) {
    const y = rand() * 512;
    const amp = 2 + rand() * 8;
    const freq = 0.008 + rand() * 0.015;
    const phase = rand() * Math.PI * 2;
    const dark = rand() > 0.45;
    ctx.strokeStyle = dark ? 'rgba(36, 20, 10, 0.22)' : 'rgba(148, 106, 70, 0.16)';
    ctx.lineWidth = 0.8 + rand() * 2.2;
    ctx.beginPath();
    bctx.strokeStyle = dark ? 'rgba(90,90,90,0.35)' : 'rgba(175,175,175,0.28)';
    bctx.lineWidth = ctx.lineWidth;
    bctx.beginPath();

    for (let x = 0; x <= 512; x += 16) {
      const py = y + Math.sin(x * freq + phase) * amp;
      if (x === 0) {
        ctx.moveTo(x, py);
        bctx.moveTo(x, py);
      } else {
        ctx.lineTo(x, py);
        bctx.lineTo(x, py);
      }
    }
    ctx.stroke();
    bctx.stroke();
  }

  // Subtle knots
  for (let k = 0; k < 4; k++) {
    const kx = 60 + rand() * 390;
    const ky = 40 + rand() * 430;
    const kr = 10 + rand() * 14;
    const kg = ctx.createRadialGradient(kx, ky, 2, kx, ky, kr);
    kg.addColorStop(0, 'rgba(30,15,7,0.65)');
    kg.addColorStop(0.6, 'rgba(65,38,20,0.35)');
    kg.addColorStop(1, 'rgba(65,38,20,0)');
    ctx.fillStyle = kg;
    ctx.beginPath();
    ctx.ellipse(kx, ky, kr * 1.8, kr * 0.7, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 2, 1, true),
    bumpMap: configureTexture(bumpC, 2, 1, false),
    roughnessMap: configureTexture(roughC, 2, 1, false),
  };
  textureCache.set('wood_bench', set);
  return set;
}

/**
 * Crisp ceramic laboratory backsplash tile texture.
 */
export function getLabTileTextures(): PBRTextureSet {
  const cached = textureCache.get('lab_tiles');
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#262626';
  bctx.fillRect(0, 0, 512, 512);

  const tileW = 128;
  const tileH = 64;
  for (let row = 0; row < 8; row++) {
    const offset = (row % 2) * (tileW / 2);
    for (let col = -1; col < 5; col++) {
      const x = col * tileW + offset;
      const y = row * tileH;
      const g = ctx.createLinearGradient(x, y, x, y + tileH);
      g.addColorStop(0, '#334155');
      g.addColorStop(1, '#263348');
      ctx.fillStyle = g;
      ctx.fillRect(x + 3, y + 3, tileW - 6, tileH - 6);

      // Subtle glossy highlight
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.fillRect(x + 5, y + 5, tileW - 10, 6);

      bctx.fillStyle = '#dcdcdc';
      bctx.fillRect(x + 3, y + 3, tileW - 6, tileH - 6);
    }
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 3, 2, true),
    bumpMap: configureTexture(bumpC, 3, 2, false),
  };
  textureCache.set('lab_tiles', set);
  return set;
}

/**
 * Multi-layered stratified cliff / volcanic rock / mossy terrain texture.
 */
export function getRockTerrainTextures(palette: 'cliff' | 'island' | 'plateau' | 'sandstone' = 'cliff'): PBRTextureSet {
  const key = `rock_${palette}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);
  const rand = seededRand(palette === 'island' ? 911 : palette === 'sandstone' ? 303 : 707);

  const bases: Record<typeof palette, [string, string, string]> = {
    cliff: ['#57534e', '#78716c', '#44403c'],
    island: ['#4b5548', '#647058', '#3f3a34'],
    plateau: ['#92400e', '#b45309', '#78350f'],
    sandstone: ['#b87333', '#d49a5a', '#8c5320'],
  };
  const [c1, c2, c3] = bases[palette];

  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, c2);
  bg.addColorStop(0.5, c1);
  bg.addColorStop(1, c3);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  // Horizontal sedimentary rock strata
  for (let y = 0; y < 512; y += 14) {
    const h = 6 + rand() * 14;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.16)';
    ctx.fillRect(0, y, 512, h);
    bctx.fillStyle = rand() > 0.5 ? 'rgba(220,220,220,0.35)' : 'rgba(40,40,40,0.35)';
    bctx.fillRect(0, y, 512, h * 0.7);
  }

  // Craggy facets & mineral speckles
  for (let i = 0; i < 650; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 4 + rand() * 24;
    const shade = rand();
    ctx.fillStyle =
      palette === 'island' && y < 220 && shade > 0.6
        ? 'rgba(74, 124, 58, 0.35)'
        : shade > 0.5
        ? 'rgba(245, 240, 230, 0.11)'
        : 'rgba(18, 16, 14, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.4 + rand() * 0.6), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    bctx.fillStyle = shade > 0.5 ? 'rgba(215,215,215,0.28)' : 'rgba(45,45,45,0.32)';
    bctx.beginPath();
    bctx.arc(x, y, r * 0.75, 0, Math.PI * 2);
    bctx.fill();
  }

  // Sharp fractures
  for (let f = 0; f < 36; f++) {
    let fx = rand() * 512;
    let fy = rand() * 512;
    ctx.strokeStyle = 'rgba(15, 12, 10, 0.35)';
    ctx.lineWidth = 1 + rand() * 1.5;
    bctx.strokeStyle = 'rgba(20, 20, 20, 0.65)';
    bctx.lineWidth = 2;
    ctx.beginPath();
    bctx.beginPath();
    ctx.moveTo(fx, fy);
    bctx.moveTo(fx, fy);
    for (let s = 0; s < 5; s++) {
      fx += (rand() - 0.5) * 44;
      fy += 10 + rand() * 26;
      ctx.lineTo(fx, fy);
      bctx.lineTo(fx, fy);
    }
    ctx.stroke();
    bctx.stroke();
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 2, 2, true),
    bumpMap: configureTexture(bumpC, 2, 2, false),
  };
  textureCache.set(key, set);
  return set;
}

/**
 * Animated-ready ocean wave albedo + bump map with sparkling seafoam streaks.
 */
export function getOceanWaveTextures(tint: 'emerald' | 'deep_blue' = 'deep_blue'): PBRTextureSet {
  const key = `ocean_${tint}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);
  const rand = seededRand(tint === 'emerald' ? 515 : 818);

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  if (tint === 'emerald') {
    grad.addColorStop(0, '#0f766e');
    grad.addColorStop(0.5, '#0d9488');
    grad.addColorStop(1, '#115e59');
  } else {
    grad.addColorStop(0, '#0c4a6e');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(1, '#082f49');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  // Rolling wave crests + specular ridges
  for (let i = 0; i < 240; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const w = 36 + rand() * 88;
    const h = 4 + rand() * 10;

    ctx.fillStyle = rand() > 0.7 ? 'rgba(224, 242, 254, 0.24)' : 'rgba(6, 30, 52, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, -0.12 + rand() * 0.24, 0, Math.PI * 2);
    ctx.fill();

    const bg = bctx.createRadialGradient(x, y, 1, x, y, w);
    bg.addColorStop(0, 'rgba(240,240,240,0.45)');
    bg.addColorStop(0.6, 'rgba(130,130,130,0.1)');
    bg.addColorStop(1, 'rgba(50,50,50,0)');
    bctx.fillStyle = bg;
    bctx.beginPath();
    bctx.ellipse(x, y, w, h * 1.4, 0, 0, Math.PI * 2);
    bctx.fill();
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 3, 3, true),
    bumpMap: configureTexture(bumpC, 3, 3, false),
  };
  textureCache.set(key, set);
  return set;
}

/**
 * Lush terraced grass & meadow texture for landscapes, lighthouse hills, and northern plains.
 */
export function getGrassTerrainTextures(): PBRTextureSet {
  const cached = textureCache.get('grass');
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);
  const rand = seededRand(1212);

  ctx.fillStyle = '#1e7b40';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 1400; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 3 + rand() * 16;
    const pick = rand();
    ctx.fillStyle =
      pick > 0.65
        ? 'rgba(74, 222, 128, 0.22)'
        : pick > 0.3
        ? 'rgba(22, 101, 52, 0.28)'
        : 'rgba(163, 230, 53, 0.16)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    bctx.fillStyle = pick > 0.5 ? 'rgba(205,205,205,0.28)' : 'rgba(55,55,55,0.28)';
    bctx.fillRect(x, y, 2, 6 + rand() * 8);
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 3, 3, true),
    bumpMap: configureTexture(bumpC, 3, 3, false),
  };
  textureCache.set('grass', set);
  return set;
}

/**
 * Organic striated cardiac muscle / botanical tissue texture for Biology 3D models.
 */
export function getOrganicTissueTextures(kind: 'cardiac_red' | 'cardiac_blue' | 'botanical'): PBRTextureSet {
  const key = `organic_${kind}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);
  const rand = seededRand(kind === 'botanical' ? 404 : 606);

  ctx.fillStyle =
    kind === 'cardiac_red' ? '#b92e3d' : kind === 'cardiac_blue' ? '#245ea1' : '#3a8c4a';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  if (kind === 'botanical') {
    // Hexagonal/cellular parenchyma pattern
    const step = 32;
    for (let y = 0; y < 512 + step; y += step) {
      for (let x = 0; x < 512 + step; x += step) {
        const cx = x + ((y / step) % 2) * (step / 2);
        const cy = y;
        ctx.strokeStyle = 'rgba(220, 252, 231, 0.34)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, step * 0.44, 0, Math.PI * 2);
        ctx.stroke();

        bctx.strokeStyle = 'rgba(235, 235, 235, 0.55)';
        bctx.lineWidth = 3;
        bctx.beginPath();
        bctx.arc(cx, cy, step * 0.44, 0, Math.PI * 2);
        bctx.stroke();
      }
    }
  } else {
    // Striated muscle fibers + delicate coronary capillaries
    for (let i = 0; i < 320; i++) {
      const y = rand() * 512;
      ctx.strokeStyle =
        rand() > 0.5 ? 'rgba(255, 220, 220, 0.14)' : 'rgba(30, 8, 18, 0.22)';
      ctx.lineWidth = 1.2 + rand() * 2.4;
      bctx.strokeStyle = rand() > 0.5 ? 'rgba(210,210,210,0.32)' : 'rgba(60,60,60,0.32)';
      bctx.lineWidth = ctx.lineWidth;
      ctx.beginPath();
      bctx.beginPath();
      for (let x = 0; x <= 512; x += 24) {
        const py = y + Math.sin(x * 0.02 + i) * 7;
        if (x === 0) {
          ctx.moveTo(x, py);
          bctx.moveTo(x, py);
        } else {
          ctx.lineTo(x, py);
          bctx.lineTo(x, py);
        }
      }
      ctx.stroke();
      bctx.stroke();
    }
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 2, 2, true),
    bumpMap: configureTexture(bumpC, 2, 2, false),
  };
  textureCache.set(key, set);
  return set;
}

/**
 * Brushed anodized metallic / geometric ruler pattern for Mensuration 3D solids & molecules.
 */
export function getBrushedMetalTextures(baseHex = '#4255d4'): PBRTextureSet {
  const key = `metal_${baseHex}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const [albedoC, ctx] = makeCanvas(512, 512);
  const [bumpC, bctx] = makeCanvas(512, 512);
  const rand = seededRand(909);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  // Subtle metallic brushed horizontal streaks
  for (let i = 0; i < 600; i++) {
    const y = rand() * 512;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, y, 512, 1 + rand() * 1.5);
    bctx.fillStyle = rand() > 0.5 ? 'rgba(175,175,175,0.2)' : 'rgba(95,95,95,0.2)';
    bctx.fillRect(0, y, 512, 1);
  }

  // Subtle architectural grid measurement lines for mathematical scale perception
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  for (let p = 0; p < 512; p += 64) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(512, p);
    ctx.stroke();
  }

  const set: PBRTextureSet = {
    map: configureTexture(albedoC, 2, 1, true),
    bumpMap: configureTexture(bumpC, 2, 1, false),
  };
  textureCache.set(key, set);
  return set;
}

/**
 * Woven canvas texture for ships' sails (The Tempest) + red-white lighthouse stripes (Trig Survey).
 */
export function getLighthouseStripeTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 512);
  const bands = 6;
  const bh = 512 / bands;
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
    ctx.fillRect(0, i * bh, 256, bh);
    // Masonry brick seams
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
    ctx.lineWidth = 1;
    for (let y = i * bh; y < (i + 1) * bh; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  }
  return configureTexture(c, 1, 1, true);
}

/**
 * Transparent volumetric graduation markings texture for 3D glass beakers & flasks.
 */
export function createBeakerGraduationTexture(labelText: string): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256);
  ctx.clearRect(0, 0, 512, 256);

  // Subtle glass frost sheen
  const g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, 'rgba(226, 232, 240, 0.08)');
  g.addColorStop(0.25, 'rgba(255, 255, 255, 0.22)');
  g.addColorStop(0.5, 'rgba(226, 232, 240, 0.05)');
  g.addColorStop(0.8, 'rgba(255, 255, 255, 0.18)');
  g.addColorStop(1, 'rgba(226, 232, 240, 0.08)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);

  // White Pyrex-style graduation ticks
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.88)';
  ctx.fillStyle = 'rgba(248, 250, 252, 0.92)';
  ctx.font = 'bold 20px monospace';
  const marks = [
    { y: 60, txt: '250 mL' },
    { y: 112, txt: '150 mL' },
    { y: 164, txt: '100 mL' },
    { y: 212, txt: '50 mL' },
  ];
  for (const m of marks) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(190, m.y);
    ctx.lineTo(250, m.y);
    ctx.stroke();
    ctx.fillText(m.txt, 260, m.y + 7);
  }
  // Half ticks
  ctx.lineWidth = 2;
  for (let y = 86; y <= 200; y += 52) {
    ctx.beginPath();
    ctx.moveTo(205, y);
    ctx.lineTo(240, y);
    ctx.stroke();
  }

  // Printed chemical label plaque on front of glassware
  if (labelText) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(42, 92, 134, 62, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, 109, 124, 120);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Crisp 3D billboard badge sprite floating over beakers, landmarks, or structures.
 */
export function createFloatingLabelSprite(
  title: string,
  subtitle?: string,
  accentHex = '#38bdf8',
): THREE.Sprite {
  const [c, ctx] = makeCanvas(384, 128);
  ctx.clearRect(0, 0, 384, 128);

  ctx.fillStyle = 'rgba(10, 18, 36, 0.88)';
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(12, 12, 360, 104, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 192, subtitle ? 48 : 64, 336);

  if (subtitle) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText(subtitle, 192, 86, 336);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.45, 0.48, 1);
  return sprite;
}

/**
 * Atmospheric GLSL gradient sky dome so no 3D scene floats in a flat empty void.
 */
export function createSkyDomeMesh(
  topHex: number,
  horizonHex: number,
  bottomHex: number,
  radius = 42,
): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 32, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(topHex) },
      horizonColor: { value: new THREE.Color(horizonHex) },
      bottomColor: { value: new THREE.Color(bottomHex) },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y;
        vec3 col = h >= 0.0
          ? mix(horizonColor, topColor, pow(clamp(h, 0.0, 1.0), 0.58))
          : mix(horizonColor, bottomColor, pow(clamp(-h, 0.0, 1.0), 0.7));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  return new THREE.Mesh(geo, mat);
}

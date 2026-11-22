import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface StudioRendererBundle {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  isSoftwareGl: boolean;
  disposeStudio: () => void;
}

export function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

/**
 * Shared studio-grade Three.js WebGL + PBR IBL (RoomEnvironment + ACESFilmicToneMapping + PCFSoftShadowMap) setup.
 * Gives every 3D Katrio lab crisp reflections on glass, water, metal, and organic tissues.
 */
export function createStudioRenderer(
  container: HTMLElement,
  opts: {
    width?: number;
    height?: number;
    exposure?: number;
    fogColor?: number;
    fogDensity?: number;
    background?: number;
  } = {},
): StudioRendererBundle | null {
  const isSoftwareGl = detectSoftwareWebGL();
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: opts.background === undefined,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  const w = opts.width ?? (container.clientWidth || 640);
  const h = opts.height ?? (container.clientHeight || 360);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.15;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  if (opts.background !== undefined) {
    scene.background = new THREE.Color(opts.background);
  }
  if (opts.fogColor !== undefined) {
    scene.fog = new THREE.FogExp2(opts.fogColor, opts.fogDensity ?? 0.025);
  }

  // Image-Based Studio Environment Lighting (makes glass, water, brass, atoms & wood look rich!)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  pmrem.dispose();

  // Warm key + sky hemisphere + cool rim studio three-point lighting
  const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.72);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.85);
  keyLight.position.set(6, 10, 7);
  keyLight.castShadow = !isSoftwareGl;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 26;
  const d = 6.5;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  keyLight.shadow.bias = -0.0006;
  keyLight.shadow.normalBias = 0.025;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.7);
  rimLight.position.set(-7, 4, -5);
  scene.add(rimLight);

  const disposeStudio = () => {
    envTarget.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { renderer, scene, isSoftwareGl, disposeStudio };
}

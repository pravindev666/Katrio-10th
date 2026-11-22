import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export interface LoadedGLBModel {
  root: THREE.Group;
  sceneRoot: THREE.Object3D;
  size: THREE.Vector3;
  animations: THREE.AnimationClip[];
}

/**
 * Loads a binary glTF 2.0 (.glb) model from /models/ (supporting both plain and Draco-compressed meshes
 * via local /draco/ WASM decoders), centers it on the origin, normalizes its largest dimension to `targetSize`,
 * enables shadows, and returns embedded animation clips for AnimationMixer playback.
 */
export function loadNormalizedGLB(
  url: string,
  targetSize = 2.8,
  opts?: {
    overrideMaterial?: THREE.Material;
    envMapIntensity?: number;
  },
): Promise<LoadedGLBModel> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const wrapper = new THREE.Group();
        const scene = gltf.scene;

        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (opts?.overrideMaterial) {
              mesh.material = opts.overrideMaterial;
            } else if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              for (const m of mats) {
                if ('envMapIntensity' in m) {
                  (m as THREE.MeshStandardMaterial).envMapIntensity = opts?.envMapIntensity ?? 1.25;
                }
              }
            }
          }
        });

        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = targetSize / maxDim;
        scene.scale.setScalar(scale);
        scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        wrapper.add(scene);
        resolve({
          root: wrapper,
          sceneRoot: scene,
          size: size.multiplyScalar(scale),
          animations: gltf.animations ?? [],
        });
      },
      undefined,
      (err) => reject(err),
    );
  });
}

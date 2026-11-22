# Katrio Open-Source 3D Model Provenance (`public/models/`)

Every binary glTF 2.0 (`.glb`) asset bundled in this directory is permissively licensed for educational, static web distribution (under Cloudflare Pages' 25 MB per-file limit), lazy-loaded on demand, and paired with interactive 2D SVG / keyboard-accessible equivalents. Local Draco WASM decoders (`public/draco/`) are copied directly from the installed `three` package (`MIT License`) so decoding works 100% offline with zero external CDN requests.

| File | Size | License | Upstream Open-Source Repository | Used In |
| :--- | :---: | :--- | :--- | :--- |
| `heart.glb` | 7.21 MB | MIT | `yihalem123/Human-Organ3D` (`models/heart.glb`) | Science Unit 14 (`14.15 Structure of Human Heart`) |
| `brain.glb` | 4.44 MB | Apache 2.0 (Z-Anatomy) | `itayinbarr/brainproject` (`brain-atlas/models/brain.glb`) | Science Unit 15 (`Nervous System & Human Brain`) |
| `kidney.glb` | 7.70 MB | MIT | `yihalem123/Human-Organ3D` (`models/kidney.glb`) | Science Unit 13 (`Structural Organisation of Animals`) |
| `neuron-nih.glb` | 2.75 MB | MIT / US NIH 3D Public Domain | `codeaashu/cell-architecture-studio` (`public/models/neuron-nih.glb`) | Science `13.1.9` & Unit 15 (`Nervous System`) |
| `animal-cell-nih.glb` | 1.46 MB | MIT / US NIH 3D Public Domain | `codeaashu/cell-architecture-studio` (`public/models/animal-cell-nih.glb`) | Science Unit 13 (`Animal Organisation`) |
| `bacteria-wall-nih.glb` | 0.46 MB | MIT / US NIH 3D Public Domain | `codeaashu/cell-architecture-studio` (`public/models/bacteria-wall-nih.glb`) | Science Units 21–22 (`Health, Immunity & Microbes`) |
| `plant-foliage.glb` | 5.49 MB | CC0 1.0 Universal | `KhronosGroup/glTF-Sample-Assets` (`DiffuseTransmissionPlant.glb`) | Science Units 12 & 14 (`Plant Physiology & Photosynthesis`) |
| `flower.glb` | 5 KB | MIT | `mrdoob/three.js` (`examples/models/gltf/Flower/Flower.glb`) | Science Unit 17 (`Plant Reproduction`) |
| `seabird-animated.glb` | 76 KB | MIT | `mrdoob/three.js` (`examples/models/gltf/Stork.glb`) | English Unit 1 (`His First Flight` soaring seabirds) |
| `parrot-animated.glb` | 97 KB | MIT | `mrdoob/three.js` (`examples/models/gltf/Parrot.glb`) | English Unit 2 (`Zigzag`) |
| `gears.glb` | 78 KB | MIT | `mrdoob/three.js` (`examples/models/gltf/gears.glb`) | Science Unit 1 & English Unit 5 (`The Secret of the Machines`) |
| `boombox.glb` | 2.16 MB | MIT / CC0 | `mrdoob/three.js` (`examples/models/gltf/BoomBox.glb`) | Science Unit 5 (`Acoustics`) |
| `camera-optics.glb` | 3.76 MB | MIT | `mrdoob/three.js` (`examples/models/gltf/steampunk_camera.glb`) | Science Unit 2 (`Optics`) & Unit 23 (`Visual Communication`) |

## NASA Satellite & SRTM Elevation Textures (`public/textures/earth/`)

| File | Resolution | License | Upstream Open-Source / Public Domain Source | Used In |
| :--- | :---: | :--- | :--- | :--- |
| `earth-color-4k.jpg` | 4096×2048 | Public Domain (NASA Blue Marble) | `turban/webgl-earth` (NASA Visible Earth) | History Units 1–10 3D Globe, Civics Diplomacy, Economics Trade, English Unit 3 |
| `earth-elev-4k.jpg` | 4096×2048 | Public Domain (NASA Topography) | `turban/webgl-earth` (NASA SRTM/ETOPO) | 3D Planetary Relief Bump Map |
| `earth-specular.jpg` | 2048×1024 | MIT / NASA Public Domain | `mrdoob/three.js` (`examples/textures/planets/`) | Realistic Ocean Sunlight Specular Reflection |
| `earth-clouds.png` | 1024×512 | MIT / NASA Public Domain | `mrdoob/three.js` (`examples/textures/planets/`) | Animated Drifting Atmospheric Cloud Layer |
| `india-color.jpg` & `india-height.png` | 1024×1024 | Public Domain (NASA GIBS + AWS SRTM Terrarium) | NASA GIBS `BlueMarble_ShadedRelief_Bathymetry` + Mapzen/AWS SRTM DEM | Geography Units 1–5 Real 3D Satellite Elevation Terrain of India |
| `tamilnadu-color.jpg` & `tamilnadu-height.png` | 1024×1024 | Public Domain (NASA GIBS Zoom-7 + AWS SRTM) | NASA GIBS 500m Satellite + SRTM DEM | Geography Units 6–7 Real 3D Satellite Elevation Terrain of Tamil Nadu & Western Ghats |

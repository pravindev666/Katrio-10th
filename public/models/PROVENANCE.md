# Katrio Open-Source 3D Model Provenance (`public/models/`)

Every binary glTF 2.0 (`.glb`) asset bundled in this directory is permissively licensed for educational, static web distribution, lazy-loaded on demand, and paired with interactive 2D SVG / keyboard-accessible equivalents. Local Draco WASM decoders (`public/draco/`) are copied directly from the installed `three` package (`MIT License`) so decoding works 100% offline with zero external CDN requests.

## Active Retained Open-Source 3D Models (7 Files)

| File | Size | License | Upstream Open-Source Repository | Used In |
| :--- | :---: | :--- | :--- | :--- |
| `heart.glb` | 7.21 MB | MIT | `yihalem123/Human-Organ3D` (`models/heart.glb`) | Science Unit 14 (`14.15 Structure of Human Heart` — paired with 2D Double Circulation) |
| `brain.glb` | 4.44 MB | Apache 2.0 (Z-Anatomy) | `itayinbarr/brainproject` (`brain-atlas/models/brain.glb`) | Science Unit 15 (`Nervous System & Human Brain` — paired with 2D lobe map) |
| `neuron-nih.glb` | 2.75 MB | MIT / US NIH 3D Public Domain | `codeaashu/cell-architecture-studio` (`public/models/neuron-nih.glb`) | Science Unit 15 (`15.1–15.2 Neuron & Synapse`) |
| `animal-cell-nih.glb` | 1.46 MB | MIT / US NIH 3D Public Domain | `codeaashu/cell-architecture-studio` (`public/models/animal-cell-nih.glb`) | Science Cell/Organelle Reference (scoped; never used for whole-organism zoology) |
| `bacteria-wall-nih.glb` | 0.46 MB | MIT / US NIH 3D Public Domain | `codeaashu/cell-architecture-studio` (`public/models/bacteria-wall-nih.glb`) | Science Unit 20 Microbial / Plasmid Context (scoped) |
| `plant-foliage.glb` | 5.49 MB | CC0 1.0 Universal | `KhronosGroup/glTF-Sample-Assets` (`DiffuseTransmissionPlant.glb`) | Science Units 12 & 14 (`Plant Physiology & Transpiration Canopy`) |
| `gears.glb` | 78 KB | MIT | `mrdoob/three.js` (`examples/models/gltf/gears.glb`) | Physics Mechanical Advantage Context (retired from English poetry) |

## Retired / Removed Models (Gate 2/3 Cleanup — Saved 13.80 MB)

- `boombox.glb` (2.16 MB) — removed (0 code references; decorative).
- `kidney.glb` (7.70 MB) — removed (TN Class 10 Unit 13 covers Leech & Rabbit, not human kidney).
- `camera-optics.glb` (3.76 MB) — removed (decorative steampunk camera; Unit 23 upgraded to 2D Scratch sandbox).
- `flower.glb` (5 KB) — removed (replaced by clinical 2D angiosperm ovule/embryo-sac lab).
- `seabird-animated.glb` (76 KB, upstream `Stork.glb`) & `parrot-animated.glb` (97 KB) — removed from English lessons (replaced by illustrated 2D Story Studio).

## NASA Satellite & SRTM Elevation Textures (`public/textures/earth/`)

| File | Resolution | License | Upstream Open-Source / Public Domain Source | Used In |
| :--- | :---: | :--- | :--- | :--- |
| `earth-color-4k.jpg` | 4096×2048 | Public Domain (NASA Blue Marble) | `turban/webgl-earth` (NASA Visible Earth) | Dated 2D Historical Maps (`AccurateGeoMaps2D`) |
| `earth-elev-4k.jpg` | 4096×2048 | Public Domain (NASA Topography) | `turban/webgl-earth` (NASA SRTM/ETOPO) | Planetary Relief Reference |
| `earth-specular.jpg` | 2048×1024 | MIT / NASA Public Domain | `mrdoob/three.js` (`examples/textures/planets/`) | Ocean Specular Layer |
| `earth-clouds.png` | 1024×512 | MIT / NASA Public Domain | `mrdoob/three.js` (`examples/textures/planets/`) | Atmospheric Layer |
| `india-color.jpg` & `india-height.png` | 1024×1024 | Public Domain (NASA GIBS + AWS SRTM Terrarium) | NASA GIBS `BlueMarble_ShadedRelief_Bathymetry` + Mapzen/AWS SRTM DEM | Geography Units 1–5 Accurate 2D Maps + Optional 3D SRTM Relief |
| `tamilnadu-color.jpg` & `tamilnadu-height.png` | 1024×1024 | Public Domain (NASA GIBS Zoom-7 + AWS SRTM) | NASA GIBS 500m Satellite + SRTM DEM | Geography Units 6–7 Accurate 2D Maps + Optional 3D SRTM Relief |

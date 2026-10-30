import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Cache for loaded raw models to prevent redundant network fetches
let cachedGltfScene = null;
let gltfLoadingPromise = null;

let cachedStlGeometry = null;
let stlLoadingPromise = null;

let cachedDriftGltfScene = null;
let driftGltfLoadingPromise = null;

let cachedRidgeGltfScene = null;
let ridgeGltfLoadingPromise = null;

// The 4 Distinct Shoe Models & Categories
export const SHOE_MODELS = [
  {
    id: 'shoe-01',
    name: 'LoopStep Terra',
    tagline: 'The Everyday Urban Keeper',
    category: 'Lifestyle & Urban',
    basePrice: 2499,
    description: '100% recycled ocean-plastic knit upper with natural rubber cage and precision twist-lock receiver. (Original Dior luxury silhouette).',
    nodeRange: [0, 20],
    defaultColor: '#C8161D', // LoopStep Red
    defaultOverlay: '#1A1A1A',
    defaultAccent: '#C6F135',
    thumbnail: '/images/shoe-terra.jpg',
    defaultSoleCategory: 'standard'
  },
  {
    id: 'shoe-02',
    name: 'LoopStep Drift',
    tagline: 'High-Performance Outdoor Trail & Sport',
    category: 'Performance Running',
    basePrice: 2899,
    description: 'Authentic Adidas Terrex 3D sports shoe chassis with aggressive multi-terrain lugs, engineered breathable ripstop upper, and abrasion-resistant toe guard.',
    nodeRange: [20, 40],
    defaultColor: '#FFFFFF', // Default pure white to showcase authentic Terrex diffuse textures without tint
    defaultOverlay: '#1A1A1A',
    defaultAccent: '#00F0FF',
    thumbnail: '/images/shoe-drift.jpg',
    defaultSoleCategory: 'sports',
    modelAsset: 'Terrex.obj (adidas-terrex.zip)'
  },
  {
    id: 'shoe-03',
    name: 'LoopStep Ridge',
    tagline: 'Trail-Ready, Adventure-Proof',
    category: 'Outdoor & Hiking',
    basePrice: 2999,
    description: 'Authentic rugged ECCO Trail hiking shoe chassis with aggressive multi-surface rock rand, high-traction mud lugs, and reinforced padded ankle collar.',
    nodeRange: [40, 60],
    defaultColor: '#FFFFFF', // Default pure white to showcase authentic ECCO photogrammetry texture without tint
    defaultOverlay: '#1E2522',
    defaultAccent: '#E7A93B',
    thumbnail: '/images/shoe-ridge.jpg',
    defaultSoleCategory: 'trail',
    modelAsset: 'eccoblender.obj (worn-hiking-shoes.zip)'
  },
  {
    id: 'shoe-04',
    name: 'LoopStep Vanguard',
    tagline: 'Aero Carbon Street High-Top',
    category: 'Aerodynamic Urban',
    basePrice: 3199,
    description: 'Futuristic architectural high-top with sculpted carbon-fiber torsion wings, rear aerodynamic heel spoiler, and modern asymmetric shroud.',
    nodeRange: [60, 80],
    defaultColor: '#1E40AF', // Deep Cobalt
    defaultOverlay: '#141416',
    defaultAccent: '#C6F135',
    thumbnail: '/images/shoe-terra.jpg',
    defaultSoleCategory: 'sports'
  }
];

// The 3 Distinct Sole Categories & Models
export const SOLE_CATEGORIES = [
  {
    id: 'standard',
    name: 'Standard Edition',
    subtitle: 'Everyday Comfort & City Pavement',
    basePrice: 200,
    thickness: '8 mm',
    durometer: '50-55 Shore A',
    weight: '145g',
    description: 'Low-profile compression molded EVA with flexible wave flex roll channels for natural city walking.',
    variants: [
      {
        id: 'sole-std-01',
        name: 'Standard Wave-Flex',
        desc: 'Natural wave groove flex channels for smooth heel-to-toe roll.',
        source: 'existing-standard',
        defaultColor: '#1A1A1A',
        defaultMidsole: '#F4F4F4',
        defaultAccent: '#C6F135',
        tread: 'wave',
        price: 200
      },
      {
        id: 'sole-std-02',
        name: 'Standard City-Commute',
        desc: 'Ultra-lightweight 8mm commuter sole with micro-siped wet grip.',
        source: 'existing-standard',
        defaultColor: '#2C312E',
        defaultMidsole: '#DFD8CE',
        defaultAccent: '#C6F135',
        tread: 'wave',
        price: 240
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports Edition',
    subtitle: 'Active Performance & Kinetic Rebound',
    basePrice: 500,
    thickness: '12 mm',
    durometer: '60 Shore A',
    weight: '190g',
    description: 'Sculpted 12mm dual-density rocker sole with kinetic rebound flex windows, lateral stability outrigger, and hexagonal sprint traction pods.',
    variants: [
      {
        id: 'sole-spr-01',
        name: 'Sports Kinetic-Hex',
        desc: 'Multi-directional hex traction cleats for explosive lateral sprint cuts.',
        source: 'sports-kinetic',
        defaultColor: '#141416',
        defaultMidsole: '#F4F4F4',
        defaultAccent: '#00F0FF',
        tread: 'hex',
        price: 500
      },
      {
        id: 'sole-spr-02',
        name: 'Sports Kinetic Rebound Pro',
        desc: 'Supercritical EVA core with carbon rubber traction pods.',
        source: 'sports-kinetic',
        defaultColor: '#1A1A1A',
        defaultMidsole: '#C6F135',
        defaultAccent: '#FF5E1E',
        tread: 'hex',
        price: 560
      }
    ]
  },
  {
    id: 'trail',
    name: 'Trail Edition',
    subtitle: 'Rough Terrain & Rock Protection',
    basePrice: 700,
    thickness: '15 mm',
    durometer: '68 Shore A',
    weight: '240g',
    description: '15mm mountain chassis with deep 5mm multi-angle chevron cleats, self-cleaning mud channels, and embedded ballistic rock plate.',
    variants: [
      {
        id: 'sole-trl-01',
        name: 'Trail Deep-Lug Mountain',
        desc: 'Aggressive 5mm multi-angle lugs with mud-shedding evacuation channels.',
        source: 'trail-mountain',
        defaultColor: '#4A6141',
        defaultMidsole: '#2C312E',
        defaultAccent: '#E7A93B',
        tread: 'lug',
        price: 700
      },
      {
        id: 'sole-trl-02',
        name: 'Trail Rock-Plate MudClaw',
        desc: 'Ballistic rock shield with wet-grip compound for shale & steep slopes.',
        source: 'trail-mountain',
        defaultColor: '#2C312E',
        defaultMidsole: '#1A1A1A',
        defaultAccent: '#C8161D',
        tread: 'lug',
        price: 750
      },
      {
        id: 'sole-trl-cad',
        name: 'Engineered PA66 CAD Sole',
        desc: 'Precision 3D CAD model with physical radial bayonet locking teeth.',
        source: 'stl-cad',
        defaultColor: '#141416',
        defaultMidsole: '#38BDF8',
        defaultAccent: '#C6F135',
        tread: 'cad-precision',
        price: 850
      }
    ]
  }
];

// Color palette options
export const COLOR_OPTIONS = [
  { name: 'LoopStep Red', hex: '#C8161D' },
  { name: 'Ink Black', hex: '#141416' },
  { name: 'Chalk White', hex: '#F4F4F4' },
  { name: 'Deep Cobalt', hex: '#1E40AF' },
  { name: 'Signal Lime', hex: '#C6F135' },
  { name: 'Solar Amber', hex: '#E7A93B' },
  { name: 'Deep Moss', hex: '#4A6141' },
  { name: 'Graphite Grey', hex: '#374151' },
  { name: 'Raw Terracotta', hex: '#C2593F' },
  { name: 'Cyber Mint', hex: '#3DF1A8' }
];

// Upper material finishes
export const UPPER_MATERIALS = [
  { id: 'recycled-knit', name: 'Recycled Ocean Knit', desc: 'Breathable, lightweight 100% recycled PET weave' },
  { id: 'ripstop', name: 'Ripstop DWR', desc: 'Water-repellent, tear-resistant reinforced weave' },
  { id: 'leather-mesh', name: 'Technical Leather-Mesh', desc: 'Durable structured hybrid with perforated zones' },
  { id: 'stealth-matte', name: 'Aero Matte Composite', desc: 'Seamless high-tensile athletic skin' }
];

// Load GLTF model once
export function loadSneakerGLTF() {
  if (cachedGltfScene) return Promise.resolve(cachedGltfScene);
  if (gltfLoadingPromise) return gltfLoadingPromise;

  gltfLoadingPromise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/sneaker.glb',
      (gltf) => {
        cachedGltfScene = gltf.scene;
        resolve(cachedGltfScene);
      },
      undefined,
      (err) => {
        console.warn('Could not load sneaker.glb:', err);
        reject(err);
      }
    );
  });

  return gltfLoadingPromise;
}

// Dedicated Sports Shoe (Drift) GLTF Loader
// Dedicated Sports Shoe (Drift - Adidas Terrex) GLTF Loader with Reconstructed PBR Textures
export function loadDriftGLTF() {
  if (cachedDriftGltfScene) return Promise.resolve(cachedDriftGltfScene);
  if (driftGltfLoadingPromise) return driftGltfLoadingPromise;

  driftGltfLoadingPromise = new Promise((resolve) => {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    // Reconstruct all texture channels from adidas-terrex.zip
    const diffuseMap = textureLoader.load('/models/drift/textures/Terrex_D.jpg');
    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    const normalMap = textureLoader.load('/models/drift/textures/Terrex_N.jpg');
    const roughnessMap = textureLoader.load('/models/drift/textures/Terrex_R.jpg');
    const aoMap = textureLoader.load('/models/drift/textures/Terrex_AO.jpg');

    gltfLoader.load(
      '/models/drift/terrex_drift.glb',
      (gltf) => {
        const scene = gltf.scene;
        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Apply reconstructed PBR material with all supplied texture channels
            const pbrMat = new THREE.MeshStandardMaterial({
              name: 'Terrex_Reconstructed_PBR',
              map: diffuseMap,
              normalMap: normalMap,
              normalScale: new THREE.Vector2(1.0, 1.0),
              roughnessMap: roughnessMap,
              roughness: 0.85,
              metalness: 0.15,
              aoMap: aoMap,
              aoMapIntensity: 1.0
            });
            child.material = pbrMat;

            // Ensure UV2 channel for AO map
            if (child.geometry && !child.geometry.attributes.uv2 && child.geometry.attributes.uv) {
              child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
            }
          }
        });

        cachedDriftGltfScene = scene;
        resolve(cachedDriftGltfScene);
      },
      undefined,
      (err) => {
        console.warn('Could not load terrex_drift.glb, trying sports_shoe_drift.glb:', err);
        gltfLoader.load(
          '/models/sports_shoe_drift.glb',
          (fallbackGltf) => {
            cachedDriftGltfScene = fallbackGltf.scene;
            resolve(cachedDriftGltfScene);
          },
          undefined,
          () => resolve(null)
        );
      }
    );
  });

  return driftGltfLoadingPromise;
}

// Dedicated Trail Shoe (Ridge - ECCO Trail) GLTF Loader with Reconstructed PBR Textures
export function loadRidgeGLTF() {
  if (cachedRidgeGltfScene) return Promise.resolve(cachedRidgeGltfScene);
  if (ridgeGltfLoadingPromise) return ridgeGltfLoadingPromise;

  ridgeGltfLoadingPromise = new Promise((resolve) => {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    // Reconstruct texture channel from worn-hiking-shoes.zip (eccometashape.jpg)
    const diffuseMap = textureLoader.load('/models/ridge/textures/eccometashape.jpg');
    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    gltfLoader.load(
      '/models/ridge/ridge_trail.glb',
      (gltf) => {
        const scene = gltf.scene;
        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Apply reconstructed PBR material with supplied texture
            const pbrMat = new THREE.MeshStandardMaterial({
              name: 'Ridge_Trail_Reconstructed_PBR',
              map: diffuseMap,
              roughness: 0.82,
              metalness: 0.12,
              color: 0xffffff
            });
            child.material = pbrMat;

            // Ensure UV2 channel is present for ambient occlusion or lighting calculations
            if (child.geometry && !child.geometry.attributes.uv2 && child.geometry.attributes.uv) {
              child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
            }
          }
        });

        cachedRidgeGltfScene = scene;
        resolve(cachedRidgeGltfScene);
      },
      undefined,
      (err) => {
        console.warn('Could not load ridge_trail.glb, trying trail_shoe_ridge.glb fallback:', err);
        gltfLoader.load(
          '/models/trail_shoe_ridge.glb',
          (fallbackGltf) => {
            const scene = fallbackGltf.scene;
            scene.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                  name: 'Ridge_Trail_Reconstructed_PBR',
                  map: diffuseMap,
                  roughness: 0.82,
                  metalness: 0.12,
                  color: 0xffffff
                });
              }
            });
            cachedRidgeGltfScene = scene;
            resolve(cachedRidgeGltfScene);
          },
          undefined,
          () => resolve(null)
        );
      }
    );
  });

  return ridgeGltfLoadingPromise;
}


// Load CAD STL model once
export function loadSoleSTL() {
  if (cachedStlGeometry) return Promise.resolve(cachedStlGeometry);
  if (stlLoadingPromise) return stlLoadingPromise;

  stlLoadingPromise = new Promise((resolve, reject) => {
    const loader = new STLLoader();
    loader.load(
      '/models/sole_optimized.stl',
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();
        cachedStlGeometry = geometry;
        resolve(cachedStlGeometry);
      },
      undefined,
      (err) => {
        console.warn('Could not load sole_optimized.stl:', err);
        reject(err);
      }
    );
  });

  return stlLoadingPromise;
}

// =====================================================================
// SHOE MODEL BUILDERS
// =====================================================================

// Shoe Model 1: LoopStep Terra (Preserve Original Model Exactly)
function buildTerraUpper(gltfScene) {
  const upperGroup = new THREE.Group();
  upperGroup.name = 'ShoeUpper_Terra';

  const collectedMeshes = [];
  const upperBox = new THREE.Box3();

  // Nodes 0 to 20 in sneaker.glb
  for (let i = 0; i < 20; i++) {
    const node = gltfScene.children[i];
    if (!node) continue;
    const name = (node.name || '').toLowerCase();

    // Exclude plane nodes and sole/basement nodes
    if (name.startsWith('plane.')) continue;
    if (name.includes('basement')) continue;

    const clone = node.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
      }
    });

    upperGroup.add(clone);
    collectedMeshes.push(clone);
    upperBox.union(new THREE.Box3().setFromObject(clone));
  }

  // Center offset
  const center = upperBox.getCenter(new THREE.Vector3());
  collectedMeshes.forEach((mesh) => {
    mesh.position.x -= center.x;
    mesh.position.z -= center.z;
  });

  return upperGroup;
}

// Shoe Model 2: LoopStep Drift (Distinct Aerodynamic Performance Runner - Reference: Sports Shoe – Test by schindelar3d)
function buildDriftUpper(driftGltfScene = null) {
  const upperGroup = new THREE.Group();
  upperGroup.name = 'ShoeUpper_Drift';

  // If the authorized GLTF / GLB model is loaded
  if (driftGltfScene) {
    const importedClone = driftGltfScene.clone(true);
    importedClone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
      }
    });

    const bbox = new THREE.Box3().setFromObject(importedClone);
    const size = bbox.getSize(new THREE.Vector3());

    // Scale to standard shoe dimensions (length ~ 1.40m) if not already pre-scaled
    if (Math.abs(size.x - 1.40) > 0.05 && size.x > 0) {
      const targetLength = 1.40;
      const scaleFactor = targetLength / size.x;
      importedClone.scale.setScalar(scaleFactor);

      // Recompute bbox after scaling
      const scaledBbox = new THREE.Box3().setFromObject(importedClone);
      const scaledCenter = scaledBbox.getCenter(new THREE.Vector3());
      const scaledMin = scaledBbox.min;

      // Center X & Z, and align sole connection plane exactly at datum Y = 0.012m
      importedClone.position.x = -scaledCenter.x;
      importedClone.position.z = -scaledCenter.z;
      importedClone.position.y = 0.012 - scaledMin.y;
    }

    upperGroup.add(importedClone);
    return upperGroup;
  }

  // High-precision Sports Runner Geometry (Modelled directly after Sports Shoe - Test reference)
  // 1. Aerodynamic Runner Vamp with pronounced toe spring curve
  const runnerShape = new THREE.Shape();
  runnerShape.moveTo(-0.72, 0.02);
  runnerShape.bezierCurveTo(-0.76, 0.16, -0.55, 0.44, -0.18, 0.50);
  runnerShape.bezierCurveTo(0.18, 0.52, 0.48, 0.32, 0.68, 0.10);
  runnerShape.bezierCurveTo(0.72, 0.04, 0.68, 0.01, 0.58, 0.01);
  runnerShape.bezierCurveTo(0.18, 0.01, -0.38, 0.01, -0.72, 0.02);

  const extrudeSettings = {
    steps: 6,
    depth: 0.52,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4
  };
  const runnerGeo = new THREE.ExtrudeGeometry(runnerShape, extrudeSettings);
  runnerGeo.center();

  const mainMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.65,
    metalness: 0.15,
    name: 'Drift_Main_Mesh'
  });
  const runnerMesh = new THREE.Mesh(runnerGeo, mainMat);
  runnerMesh.position.set(0, 0.28, 0);
  runnerMesh.castShadow = true;
  runnerMesh.receiveShadow = true;
  upperGroup.add(runnerMesh);

  // 2. Anatomical Low-Cut Achilles Collar
  const collarGeo = new THREE.TorusGeometry(0.13, 0.032, 16, 32);
  collarGeo.rotateX(Math.PI / 2);
  const collarMat = new THREE.MeshStandardMaterial({ color: 0x222a33, roughness: 0.8, name: 'Drift_Collar' });
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.position.set(-0.16, 0.48, 0);
  upperGroup.add(collarMesh);

  // 3. Padded Sports Tongue
  const tongueGeo = new THREE.BoxGeometry(0.28, 0.025, 0.15);
  tongueGeo.rotateZ(0.48);
  const tongueMat = new THREE.MeshStandardMaterial({ color: 0x1f252d, roughness: 0.8, name: 'Drift_Tongue' });
  const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
  tongueMesh.position.set(0.04, 0.44, 0);
  upperGroup.add(tongueMesh);

  // 4. Criss-Cross Sports Laces (4 pairs across athletic instep)
  const laceMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.5, metalness: 0.2, name: 'Drift_Laces' });
  const lacePositions = [-0.08, 0.02, 0.12, 0.22];
  lacePositions.forEach((x, idx) => {
    const y = 0.40 - idx * 0.04;
    // Cross 1
    const l1Geo = new THREE.CylinderGeometry(0.007, 0.007, 0.17, 8);
    l1Geo.rotateX(0.7);
    l1Geo.rotateZ(0.2);
    const l1 = new THREE.Mesh(l1Geo, laceMat);
    l1.position.set(x, y + 0.05, 0);
    upperGroup.add(l1);

    // Cross 2
    const l2Geo = new THREE.CylinderGeometry(0.007, 0.007, 0.17, 8);
    l2Geo.rotateX(-0.7);
    l2Geo.rotateZ(0.2);
    const l2 = new THREE.Mesh(l2Geo, laceMat);
    l2.position.set(x, y + 0.05, 0);
    upperGroup.add(l2);
  });

  // 5. Lateral TPU Sprint Stabilizer Cage Ribs (3 dynamic diagonal stabilizing struts)
  const cageMat = new THREE.MeshStandardMaterial({
    color: 0x2a3440,
    roughness: 0.3,
    metalness: 0.4,
    name: 'Drift_Sprint_Cage'
  });

  [-0.14, 0.02, 0.18].forEach((xOffset) => {
    const ribGeo = new THREE.CylinderGeometry(0.014, 0.018, 0.32, 16);
    ribGeo.rotateZ(0.35);

    // Lateral side
    const ribLeft = new THREE.Mesh(ribGeo, cageMat);
    ribLeft.position.set(xOffset, 0.28, 0.27);
    upperGroup.add(ribLeft);

    // Medial side
    const ribRight = new THREE.Mesh(ribGeo, cageMat);
    ribRight.position.set(xOffset, 0.28, -0.27);
    upperGroup.add(ribRight);
  });

  // 6. External TPU Heel Counter Cup
  const heelCupGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.16, 24, 1, true, -Math.PI / 2, Math.PI);
  const heelCup = new THREE.Mesh(heelCupGeo, cageMat);
  heelCup.position.set(-0.52, 0.22, 0);
  heelCup.rotation.y = -Math.PI / 2;
  upperGroup.add(heelCup);

  // 7. Heel Pull Tab with cyber neon accent
  const tabGeo = new THREE.BoxGeometry(0.02, 0.12, 0.06);
  const tabMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.3, name: 'Drift_Accent_Tab' });
  const tab = new THREE.Mesh(tabGeo, tabMat);
  tab.position.set(-0.68, 0.48, 0);
  upperGroup.add(tab);

  return upperGroup;
}

// Shoe Model 3: LoopStep Ridge (Authentic Rugged Trail Shoe - Reference: eccoblender.obj from worn-hiking-shoes.zip)
function buildRidgeUpper(ridgeGltfScene = null) {
  const upperGroup = new THREE.Group();
  upperGroup.name = 'ShoeUpper_Ridge';

  // If the authorized GLTF / GLB model is loaded
  if (ridgeGltfScene) {
    const importedClone = ridgeGltfScene.clone(true);
    importedClone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
      }
    });

    const bbox = new THREE.Box3().setFromObject(importedClone);
    const size = bbox.getSize(new THREE.Vector3());

    // Scale to standard shoe dimensions (length ~ 1.40m) if not already pre-scaled
    if (Math.abs(size.x - 1.40) > 0.05 && size.x > 0) {
      const targetLength = 1.40;
      const scaleFactor = targetLength / size.x;
      importedClone.scale.setScalar(scaleFactor);

      // Recompute bbox after scaling
      const scaledBbox = new THREE.Box3().setFromObject(importedClone);
      const scaledCenter = scaledBbox.getCenter(new THREE.Vector3());
      const scaledMin = scaledBbox.min;

      // Center X & Z, and align sole connection plane exactly at datum Y = 0.012m
      importedClone.position.x = -scaledCenter.x;
      importedClone.position.z = -scaledCenter.z;
      importedClone.position.y = 0.012 - scaledMin.y;
    }

    upperGroup.add(importedClone);
    return upperGroup;
  }

  // 1. Mid-Cut Protective Trail Chassis
  const trailShape = new THREE.Shape();
  trailShape.moveTo(-0.74, 0.02);
  trailShape.bezierCurveTo(-0.80, 0.28, -0.62, 0.64, -0.20, 0.66);
  trailShape.bezierCurveTo(0.14, 0.66, 0.44, 0.40, 0.68, 0.14);
  trailShape.bezierCurveTo(0.74, 0.06, 0.70, 0.01, 0.60, 0.01);
  trailShape.bezierCurveTo(0.20, 0.01, -0.38, 0.01, -0.74, 0.02);

  const extrudeSettings = {
    steps: 6,
    depth: 0.56,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4
  };
  const trailGeo = new THREE.ExtrudeGeometry(trailShape, extrudeSettings);
  trailGeo.center();

  const mainMat = new THREE.MeshStandardMaterial({
    color: 0x4a6141,
    roughness: 0.8,
    metalness: 0.1,
    name: 'Ridge_Ripstop_Mesh'
  });
  const trailMesh = new THREE.Mesh(trailGeo, mainMat);
  trailMesh.position.set(0, 0.34, 0);
  trailMesh.castShadow = true;
  trailMesh.receiveShadow = true;
  upperGroup.add(trailMesh);

  // 2. Heavy-Duty Wraparound Rubber Rock Rand & Toe Cap
  const randGeo = new THREE.CylinderGeometry(0.28, 0.31, 0.10, 32);
  randGeo.scale(1.85, 1.0, 0.98);
  const randMat = new THREE.MeshStandardMaterial({
    color: 0x1e2522,
    roughness: 0.9,
    metalness: 0.05,
    name: 'Ridge_Rock_Rand'
  });
  const randMesh = new THREE.Mesh(randGeo, randMat);
  randMesh.position.set(0, 0.08, 0);
  upperGroup.add(randMesh);

  // 3. Elevated Padded Ankle Collar & Gusset
  const cuffGeo = new THREE.TorusGeometry(0.16, 0.045, 16, 32);
  cuffGeo.rotateX(Math.PI / 2);
  const cuffMat = new THREE.MeshStandardMaterial({ color: 0x181e1b, roughness: 0.9 });
  const cuffMesh = new THREE.Mesh(cuffGeo, cuffMat);
  cuffMesh.position.set(-0.20, 0.64, 0);
  upperGroup.add(cuffMesh);

  // 4. Metal D-Ring Hardware Lace Anchors (4 pairs)
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xe7a93b, roughness: 0.25, metalness: 0.85 });
  [-0.10, 0.05, 0.20, 0.35].forEach((x) => {
    const dRingGeo = new THREE.TorusGeometry(0.016, 0.005, 8, 16);
    dRingGeo.rotateY(Math.PI / 2);

    const left = new THREE.Mesh(dRingGeo, ringMat);
    left.position.set(x, 0.42, 0.22);
    upperGroup.add(left);

    const right = new THREE.Mesh(dRingGeo, ringMat);
    right.position.set(x, 0.42, -0.22);
    upperGroup.add(right);
  });

  return upperGroup;
}

// Shoe Model 4: LoopStep Vanguard (Distinct Aero Carbon High-Top)
function buildVanguardUpper() {
  const upperGroup = new THREE.Group();
  upperGroup.name = 'ShoeUpper_Vanguard';

  // 1. Faceted Architectural High-Top Shell
  const highShape = new THREE.Shape();
  highShape.moveTo(-0.72, 0.02);
  highShape.bezierCurveTo(-0.82, 0.35, -0.65, 0.76, -0.25, 0.78);
  highShape.bezierCurveTo(0.15, 0.78, 0.45, 0.45, 0.70, 0.16);
  highShape.bezierCurveTo(0.76, 0.06, 0.70, 0.01, 0.60, 0.01);
  highShape.bezierCurveTo(0.20, 0.01, -0.38, 0.01, -0.72, 0.02);

  const extrudeSettings = {
    steps: 6,
    depth: 0.54,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 3
  };
  const highGeo = new THREE.ExtrudeGeometry(highShape, extrudeSettings);
  highGeo.center();

  const shellMat = new THREE.MeshStandardMaterial({
    color: 0x1e40af,
    roughness: 0.5,
    metalness: 0.3,
    name: 'Vanguard_Aero_Shell'
  });
  const highMesh = new THREE.Mesh(highGeo, shellMat);
  highMesh.position.set(0, 0.40, 0);
  highMesh.castShadow = true;
  highMesh.receiveShadow = true;
  upperGroup.add(highMesh);

  // 2. Sculpted Carbon-Fiber Torsion Stabilizer Wings
  const wingGeo = new THREE.BoxGeometry(0.36, 0.22, 0.04);
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.25,
    metalness: 0.75,
    name: 'Vanguard_Carbon_Wings'
  });

  const wingLeft = new THREE.Mesh(wingGeo, carbonMat);
  wingLeft.position.set(-0.05, 0.32, 0.28);
  wingLeft.rotation.z = 0.25;
  wingLeft.rotation.y = 0.15;
  upperGroup.add(wingLeft);

  const wingRight = new THREE.Mesh(wingGeo, carbonMat);
  wingRight.position.set(-0.05, 0.32, -0.28);
  wingRight.rotation.z = 0.25;
  wingRight.rotation.y = -0.15;
  upperGroup.add(wingRight);

  // 3. Aerodynamic Rear Heel Spoiler / Diffuser Blade
  const spoilerGeo = new THREE.BoxGeometry(0.18, 0.08, 0.36);
  const spoilerMat = new THREE.MeshStandardMaterial({ color: 0x0c1014, roughness: 0.3, metalness: 0.6 });
  const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
  spoiler.position.set(-0.74, 0.38, 0);
  spoiler.rotation.z = -0.35;
  upperGroup.add(spoiler);

  // 4. Neon Cyber Accent Blade
  const neonGeo = new THREE.BoxGeometry(0.04, 0.25, 0.02);
  const neonMat = new THREE.MeshStandardMaterial({ color: 0xc6f135, emissive: 0xc6f135, emissiveIntensity: 0.6 });
  const neonBlade = new THREE.Mesh(neonGeo, neonMat);
  neonBlade.position.set(-0.76, 0.45, 0);
  upperGroup.add(neonBlade);

  return upperGroup;
}

// Master Shoe Upper Dispatcher
export function createShoeUpper(gltfScene, shoeIndex = 0, driftGltfScene = null, ridgeGltfScene = null) {
  let upper = null;
  const shoeDef = SHOE_MODELS[shoeIndex] || SHOE_MODELS[0];

  switch (shoeDef.id) {
    case 'shoe-01':
      upper = buildTerraUpper(gltfScene);
      break;
    case 'shoe-02':
      upper = buildDriftUpper(driftGltfScene);
      break;
    case 'shoe-03':
      upper = buildRidgeUpper(ridgeGltfScene);
      break;
    case 'shoe-04':
      upper = buildVanguardUpper();
      break;
    default:
      upper = buildTerraUpper(gltfScene);
      break;
  }

  upper.userData = {
    modelId: shoeDef.id,
    modelName: shoeDef.name,
    category: shoeDef.category,
    basePrice: shoeDef.basePrice
  };

  return upper;
}

// =====================================================================
// SOLE MODEL BUILDERS
// =====================================================================

// Sole Model 1: Standard Wave-Flex (Preserve Original GLB Sole Exactly)
function buildStandardSole(gltfScene) {
  const soleGroup = new THREE.Group();
  soleGroup.name = 'Sole_Standard';

  const collectedMeshes = [];
  const soleBox = new THREE.Box3();

  // Nodes 0 to 20 basement
  for (let i = 0; i < 20; i++) {
    const node = gltfScene.children[i];
    if (!node) continue;
    const name = (node.name || '').toLowerCase();

    if (!name.includes('basement')) continue;

    const clone = node.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
      }
    });

    soleGroup.add(clone);
    collectedMeshes.push(clone);
    soleBox.union(new THREE.Box3().setFromObject(clone));
  }

  const center = soleBox.getCenter(new THREE.Vector3());
  collectedMeshes.forEach((mesh) => {
    mesh.position.x -= center.x;
    mesh.position.z -= center.z;
  });

  return soleGroup;
}

// Sole Model 2: Sports Kinetic-Hex (Distinct 12mm Rocker & Hexagonal Cleats)
function buildSportsSole() {
  const soleGroup = new THREE.Group();
  soleGroup.name = 'Sole_Sports';

  // 1. Dual-Density Rocker Midsole (12mm stack with curved forward rocker)
  const rockerShape = new THREE.Shape();
  rockerShape.moveTo(-0.76, 0.0);
  rockerShape.bezierCurveTo(-0.80, 0.08, -0.45, 0.14, 0.0, 0.14);
  rockerShape.bezierCurveTo(0.45, 0.14, 0.74, 0.10, 0.78, 0.04);
  rockerShape.bezierCurveTo(0.74, -0.06, 0.45, -0.10, 0.0, -0.10);
  rockerShape.bezierCurveTo(-0.45, -0.10, -0.74, -0.06, -0.76, 0.0);

  const extrudeSettings = {
    steps: 6,
    depth: 0.58,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 4
  };
  const rockerGeo = new THREE.ExtrudeGeometry(rockerShape, extrudeSettings);
  rockerGeo.center();

  const midMat = new THREE.MeshStandardMaterial({
    color: 0xf4f4f4,
    roughness: 0.65,
    metalness: 0.1,
    name: 'Sports_EVA_Midsole'
  });
  const midMesh = new THREE.Mesh(rockerGeo, midMat);
  midMesh.position.set(0, 0.07, 0);
  midMesh.castShadow = true;
  midMesh.receiveShadow = true;
  soleGroup.add(midMesh);

  // 2. Outsole Base Plate with Rocker Contour
  const outGeo = new THREE.BoxGeometry(1.54, 0.032, 0.58);
  const outMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.8,
    metalness: 0.1,
    name: 'Sports_Outsole_Tread'
  });
  const outMesh = new THREE.Mesh(outGeo, outMat);
  outMesh.position.set(0, 0.016, 0);
  soleGroup.add(outMesh);

  // 3. Prominent Raised Hexagonal Traction Pods (Forefoot & Heel Zones)
  const hexMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    roughness: 0.7,
    metalness: 0.2,
    name: 'Sports_Hex_Pods'
  });

  const hexPositions = [
    [-0.50, 0.0, -0.16], [-0.50, 0.0, 0.16], [-0.36, 0.0, 0.0],
    [0.22, 0.0, -0.18], [0.22, 0.0, 0.18], [0.38, 0.0, -0.14],
    [0.38, 0.0, 0.14], [0.52, 0.0, 0.0]
  ];

  hexPositions.forEach(([x, y, z]) => {
    const hexGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.016, 6);
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    hexMesh.position.set(x, 0.008, z);
    soleGroup.add(hexMesh);
  });

  // 4. Kinetic Rebound Flex Windows on Sidewalls
  const winMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.2 });
  [-0.25, 0.0, 0.25].forEach((x) => {
    const winGeo = new THREE.BoxGeometry(0.12, 0.04, 0.02);
    const winL = new THREE.Mesh(winGeo, winMat);
    winL.position.set(x, 0.08, 0.30);
    soleGroup.add(winL);

    const winR = new THREE.Mesh(winGeo, winMat);
    winR.position.set(x, 0.08, -0.30);
    soleGroup.add(winR);
  });

  return soleGroup;
}

// Sole Model 3: Trail Deep-Lug Mountain (Distinct 15mm Stack & 5mm Chevron Cleats)
function buildTrailSole(stlGeometry, useCad = false) {
  const soleGroup = new THREE.Group();
  soleGroup.name = 'Sole_Trail';

  if (useCad && stlGeometry) {
    const cadMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.45,
      metalness: 0.4,
      name: 'Trail_CAD_Tread'
    });
    const cadMesh = new THREE.Mesh(stlGeometry, cadMat);
    cadMesh.rotation.x = -Math.PI / 2;
    cadMesh.rotation.z = Math.PI / 2;
    cadMesh.scale.setScalar(0.0068);
    cadMesh.position.set(0, 0.05, 0);
    soleGroup.add(cadMesh);
    return soleGroup;
  }

  // 1. Heavy-Duty 15mm Mountain Midsole with Rock Plate
  const trailShape = new THREE.Shape();
  trailShape.moveTo(-0.78, 0.0);
  trailShape.bezierCurveTo(-0.82, 0.10, -0.45, 0.16, 0.0, 0.16);
  trailShape.bezierCurveTo(0.45, 0.16, 0.76, 0.12, 0.80, 0.04);
  trailShape.bezierCurveTo(0.76, -0.06, 0.45, -0.10, 0.0, -0.10);
  trailShape.bezierCurveTo(-0.45, -0.10, -0.76, -0.06, -0.78, 0.0);

  const extrudeSettings = {
    steps: 6,
    depth: 0.60,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4
  };
  const trailGeo = new THREE.ExtrudeGeometry(trailShape, extrudeSettings);
  trailGeo.center();

  const midMat = new THREE.MeshStandardMaterial({
    color: 0x2c312e,
    roughness: 0.8,
    metalness: 0.15,
    name: 'Trail_EVA_Midsole'
  });
  const midMesh = new THREE.Mesh(trailGeo, midMat);
  midMesh.position.set(0, 0.08, 0);
  midMesh.castShadow = true;
  midMesh.receiveShadow = true;
  soleGroup.add(midMesh);

  // 2. High-Traction Outsole Chassis
  const outGeo = new THREE.BoxGeometry(1.58, 0.04, 0.62);
  const outMat = new THREE.MeshStandardMaterial({
    color: 0x4a6141,
    roughness: 0.85,
    metalness: 0.1,
    name: 'Trail_Rubber_Outsole'
  });
  const outMesh = new THREE.Mesh(outGeo, outMat);
  outMesh.position.set(0, 0.02, 0);
  soleGroup.add(outMesh);

  // 3. Aggressive 5mm Chevron Lugs & Mud Cleats
  const lugMat = new THREE.MeshStandardMaterial({
    color: 0xe7a93b,
    roughness: 0.75,
    metalness: 0.2,
    name: 'Trail_Chevron_Cleats'
  });

  for (let x = -0.62; x <= 0.62; x += 0.14) {
    [-0.20, 0.0, 0.20].forEach((z) => {
      const lugGeo = new THREE.ConeGeometry(0.038, 0.03, 4);
      lugGeo.rotateY(Math.PI / 4);
      const lug = new THREE.Mesh(lugGeo, lugMat);
      lug.position.set(x, 0.005, z);
      soleGroup.add(lug);
    });
  }

  // 4. Toe Climbing Teeth Wrap
  const toeTeethGeo = new THREE.BoxGeometry(0.08, 0.08, 0.28);
  const toeTeeth = new THREE.Mesh(toeTeethGeo, outMat);
  toeTeeth.position.set(0.78, 0.08, 0);
  soleGroup.add(toeTeeth);

  return soleGroup;
}

// Master Sole Model Dispatcher
export function createSoleModel(gltfScene, stlGeometry, variantId = 'sole-std-01') {
  let soleGroup = null;

  // Find variant definition
  let foundVariant = null;
  let categoryId = 'standard';
  for (const cat of SOLE_CATEGORIES) {
    const v = cat.variants.find((item) => item.id === variantId);
    if (v) {
      foundVariant = v;
      categoryId = cat.id;
      break;
    }
  }

  if (!foundVariant) {
    foundVariant = SOLE_CATEGORIES[0].variants[0];
  }

  switch (categoryId) {
    case 'standard':
      soleGroup = buildStandardSole(gltfScene);
      break;
    case 'sports':
      soleGroup = buildSportsSole();
      break;
    case 'trail':
      soleGroup = buildTrailSole(stlGeometry, foundVariant.source === 'stl-cad');
      break;
    default:
      soleGroup = buildStandardSole(gltfScene);
      break;
  }

  // Add the standardized PA66-GF30 Twist-Lock Adapter Ring on the sole upper face
  const ringGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.014, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(foundVariant.defaultAccent),
    roughness: 0.3,
    metalness: 0.85,
    name: 'Sole_PA66_Ring'
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.name = 'TwistLock_Ring_Mesh';
  ringMesh.position.set(0, 0.08, 0);

  // 4 radial bayonet locking lugs
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const lugGeo = new THREE.BoxGeometry(0.045, 0.012, 0.02);
    const lug = new THREE.Mesh(lugGeo, ringMat);
    lug.position.set(Math.cos(angle) * 0.16, 0.005, Math.sin(angle) * 0.16);
    lug.rotation.y = angle;
    ringMesh.add(lug);
  }
  soleGroup.add(ringMesh);

  soleGroup.userData = {
    variantId: foundVariant.id,
    variantName: foundVariant.name,
    categoryId,
    basePrice: foundVariant.price
  };

  return soleGroup;
}

// =====================================================================
// DYNAMIC 2D CANVAS TEXTURE GENERATOR FOR 3D PERSONALIZATION
// =====================================================================
export function createPersonalizationTexture(text, bgColor = '#181e24', textColor = '#c6f135', defaultLabel = 'LOOPSTEP') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Background badge
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 128);

  // Border accents
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 112);

  // Subtle diagonal tech hatching
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let i = -100; i < 600; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 80, 128);
    ctx.stroke();
  }

  // Text
  const displayText = (text && text.trim().length > 0) ? text.trim().toUpperCase() : defaultLabel;
  ctx.font = 'bold 44px "Space Grotesk", sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayText, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// =====================================================================
// INDEPENDENT MATERIAL APPLICATION
// =====================================================================

export function applyShoeCustomization(upperGroup, options = {}) {
  if (!upperGroup) return;

  const {
    color = '#C8161D',
    overlayColor = '#1A1A1A',
    accentColor = '#C6F135',
    material = 'recycled-knit',
    personalizationText = ''
  } = options;

  let roughness = 0.7;
  let metalness = 0.1;

  if (material === 'ripstop') {
    roughness = 0.55;
    metalness = 0.2;
  } else if (material === 'leather-mesh') {
    roughness = 0.45;
    metalness = 0.15;
  } else if (material === 'stealth-matte') {
    roughness = 0.9;
    metalness = 0.05;
  }

  const primaryCol = new THREE.Color(color);
  const overlayCol = new THREE.Color(overlayColor);
  const accentCol = new THREE.Color(accentColor);

  upperGroup.traverse((child) => {
    if (child.isMesh && child.material) {
      const name = (child.name || '').toLowerCase();
      const mats = Array.isArray(child.material) ? child.material : [child.material];

      mats.forEach((mat) => {
        const matName = (mat.name || '').toLowerCase();

        // Check if Text mesh
        if (name.includes('text') || matName.includes('text')) {
          if (personalizationText && personalizationText.trim().length > 0) {
            mat.map = createPersonalizationTexture(personalizationText, '#141416', accentColor);
            mat.needsUpdate = true;
          }
          return;
        }

        // Check if Terrex sports shoe model
        if (name.includes('terrex') || matName.includes('terrex')) {
          if (color.toUpperCase() === '#FFFFFF') {
            mat.color.setHex(0xffffff); // Preserve authentic Adidas Terrex photographic textures
          } else {
            mat.color.copy(primaryCol); // Dynamic colorway tint
          }
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
          return;
        }

        // Check if Ridge trail shoe model (ECCO photogrammetry model)
        if (name.includes('ridge') || matName.includes('ridge') || name.includes('ecco') || matName.includes('ecco')) {
          if (color.toUpperCase() === '#FFFFFF') {
            mat.color.setHex(0xffffff); // Preserve authentic ECCO photogrammetry texture
          } else {
            mat.color.copy(primaryCol); // Dynamic colorway tint
          }
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
          return;
        }

        // Check if Laces mesh
        if (name.includes('lace') || matName.includes('lace')) {
          mat.color.copy(accentCol);
          mat.roughness = 0.5;
          mat.needsUpdate = true;
          return;
        }

        // Check if Tongue or Collar
        if (name.includes('tongue') || matName.includes('tongue') || name.includes('collar') || matName.includes('collar')) {
          mat.color.copy(overlayCol);
          mat.roughness = 0.85;
          mat.needsUpdate = true;
          return;
        }

        // Leather and plastic overlays / wings / rand / cage
        if (
          name.includes('leather') || matName.includes('leather') ||
          name.includes('plastic') || matName.includes('plastic') ||
          name.includes('cage') || matName.includes('cage') ||
          name.includes('rand') || matName.includes('rand') ||
          name.includes('wing') || matName.includes('wing')
        ) {
          mat.color.copy(overlayCol);
          mat.roughness = roughness * 0.8;
          mat.metalness = metalness * 1.5;
          mat.needsUpdate = true;
        } else if (
          name.includes('stitch') || matName.includes('stitch') ||
          name.includes('accent') || matName.includes('accent') ||
          name.includes('tab') || matName.includes('tab')
        ) {
          mat.color.copy(accentCol);
          mat.needsUpdate = true;
        } else {
          // Main Upper Body
          mat.color.copy(primaryCol);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
        }
      });
    }
  });

  // Dedicated 3D personalization plaque on the upper heel/collar
  let textPlaque = upperGroup.getObjectByName('Shoe_Custom_Plaque');
  if (!textPlaque) {
    const plaqueGeo = new THREE.PlaneGeometry(0.24, 0.07);
    const plaqueMat = new THREE.MeshBasicMaterial({
      map: createPersonalizationTexture(personalizationText || 'LOOPSTEP', '#141416', accentColor),
      transparent: true,
      side: THREE.DoubleSide
    });
    textPlaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    textPlaque.name = 'Shoe_Custom_Plaque';
    textPlaque.position.set(-0.52, 0.46, 0.22);
    textPlaque.rotation.y = Math.PI / 2.2;
    upperGroup.add(textPlaque);
  } else {
    textPlaque.material.map = createPersonalizationTexture(personalizationText || 'LOOPSTEP', '#141416', accentColor);
    textPlaque.material.needsUpdate = true;
  }
}

export function applySoleCustomization(soleGroup, options = {}) {
  if (!soleGroup) return;

  const {
    outsoleColor = '#141416',
    midsoleColor = '#F4F4F4',
    accentColor = '#C6F135',
    ringColor = '#C6F135',
    surfaceFinish = 'matte',
    laserEngraving = ''
  } = options;

  let roughness = 0.65;
  let metalness = 0.1;
  if (surfaceFinish === 'matte') {
    roughness = 0.88;
    metalness = 0.05;
  } else if (surfaceFinish === 'textured') {
    roughness = 0.72;
    metalness = 0.2;
  } else if (surfaceFinish === 'smooth') {
    roughness = 0.25;
    metalness = 0.35;
  }

  const outCol = new THREE.Color(outsoleColor);
  const midCol = new THREE.Color(midsoleColor);
  const accCol = new THREE.Color(accentColor);
  const ringCol = new THREE.Color(ringColor);

  soleGroup.traverse((child) => {
    if (child.isMesh && child.material) {
      const name = (child.name || '').toLowerCase();
      const mats = Array.isArray(child.material) ? child.material : [child.material];

      mats.forEach((mat) => {
        const matName = (mat.name || '').toLowerCase();

        if (name.includes('twistlock') || matName.includes('twistring') || name.includes('ring')) {
          mat.color.copy(ringCol);
          mat.metalness = 0.85;
          mat.roughness = 0.3;
          mat.needsUpdate = true;
        } else if (name.includes('middle') || matName.includes('middle') || name.includes('midsole')) {
          mat.color.copy(midCol);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
        } else if (
          name.includes('point') || matName.includes('point') ||
          name.includes('accent') || matName.includes('hex') ||
          name.includes('cleat') || matName.includes('cleat')
        ) {
          mat.color.copy(accCol);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
        } else if (name.includes('basement') || name.includes('sole') || name.includes('tread') || matName.includes('basement')) {
          mat.color.copy(outCol);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
        }
      });
    }
  });

  // Laser engraving badge on midfoot sole plate
  let engravePlaque = soleGroup.getObjectByName('Sole_Engrave_Plaque');
  if (!engravePlaque) {
    const engraveGeo = new THREE.PlaneGeometry(0.22, 0.06);
    const engraveMat = new THREE.MeshBasicMaterial({
      map: createPersonalizationTexture(laserEngraving || 'PATENT PENDING', '#101418', accentColor, 'PATENT PENDING'),
      transparent: true,
      side: THREE.DoubleSide
    });
    engravePlaque = new THREE.Mesh(engraveGeo, engraveMat);
    engravePlaque.name = 'Sole_Engrave_Plaque';
    engravePlaque.rotation.x = Math.PI / 2;
    engravePlaque.position.set(0, -0.01, 0);
    soleGroup.add(engravePlaque);
  } else {
    engravePlaque.material.map = createPersonalizationTexture(laserEngraving || 'PATENT PENDING', '#101418', accentColor, 'PATENT PENDING');
    engravePlaque.material.needsUpdate = true;
  }
}

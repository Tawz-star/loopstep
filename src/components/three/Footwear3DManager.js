import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Cache for loaded raw models to prevent redundant network fetches
let cachedGltfScene = null;
let gltfLoadingPromise = null;

let cachedStlGeometry = null;
let stlLoadingPromise = null;

// The 4 Shoe Models in the project
export const SHOE_MODELS = [
  {
    id: 'shoe-01',
    name: 'LoopStep Terra',
    tagline: 'The Everyday Urban Keeper',
    category: 'Lifestyle & Urban',
    basePrice: 2499,
    description: '100% recycled ocean-plastic knit upper with natural rubber cage and precision twist-lock receiver.',
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
    tagline: 'Built to Run, Made to Last',
    category: 'Performance Running',
    basePrice: 2899,
    description: 'High-tensile engineered performance weave with lateral TPU heel counter for athletic stabilization.',
    nodeRange: [20, 40],
    defaultColor: '#1A1A1A', // Ink Black
    defaultOverlay: '#3A3A3A',
    defaultAccent: '#00F0FF',
    thumbnail: '/images/shoe-drift.jpg',
    defaultSoleCategory: 'sports'
  },
  {
    id: 'shoe-03',
    name: 'LoopStep Ridge',
    tagline: 'Trail-Ready, Adventure-Proof',
    category: 'Outdoor & Hiking',
    basePrice: 2999,
    description: 'Abrasion-resistant ripstop upper with mudguard rubber wrap and reinforced Kevlar lace eyelets.',
    nodeRange: [40, 60],
    defaultColor: '#4A6141', // Deep Moss
    defaultOverlay: '#2C312E',
    defaultAccent: '#E7A93B',
    thumbnail: '/images/shoe-ridge.jpg',
    defaultSoleCategory: 'trail'
  },
  {
    id: 'shoe-04',
    name: 'LoopStep Vanguard',
    tagline: 'Aero Carbon Street Runner',
    category: 'Aerodynamic Urban',
    basePrice: 3199,
    description: 'Ultra-lightweight aerodynamic matrix textile with carbon-infused sidewall reinforcement.',
    nodeRange: [60, 80],
    defaultColor: '#1E40AF', // Deep Cobalt
    defaultOverlay: '#141416',
    defaultAccent: '#C6F135',
    thumbnail: '/images/shoe-terra.jpg',
    defaultSoleCategory: 'sports'
  }
];

// The 3 Sole Categories and their selectable 3D model variants
export const SOLE_CATEGORIES = [
  {
    id: 'standard',
    name: 'Standard Edition',
    subtitle: 'Everyday Comfort & City Pavement',
    basePrice: 200,
    thickness: '8 mm',
    durometer: '50-55 Shore A',
    weight: '145g',
    description: 'Low-profile compression molded EVA with flexible natural rubber contact pads for relaxed city walking.',
    variants: [
      {
        id: 'sole-std-01',
        name: 'Standard Wave-Flex',
        desc: 'Natural wave groove flex channels for smooth heel-to-toe roll.',
        source: 'glb-model-1',
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
        source: 'glb-model-1',
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
    description: 'Dual-density stack with nitrogen-infused kinetic rebound insert and high torsional rigidity.',
    variants: [
      {
        id: 'sole-spr-01',
        name: 'Sports Dynamic-Hex',
        desc: 'Multi-directional hex traction cleats for explosive lateral sprint cuts.',
        source: 'glb-model-2',
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
        source: 'glb-model-2',
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
    description: 'Vulcanized high-traction rubber outsole with deep 5mm perimeter lugs and ballistic rock plate.',
    variants: [
      {
        id: 'sole-trl-01',
        name: 'Trail Deep-Lug Mountain',
        desc: 'Aggressive 5mm multi-angle lugs with mud-shedding evacuation channels.',
        source: 'glb-model-3',
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
        source: 'glb-model-4',
        defaultColor: '#2C312E',
        defaultMidsole: '#1A1A1A',
        defaultAccent: '#C8161D',
        tread: 'lug',
        price: 750
      },
      {
        id: 'sole-trl-cad',
        name: 'Engineered PA66 CAD Sole',
        desc: 'Precision CAD model with physical radial bayonet locking teeth.',
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

// Extract an independent Shoe Upper Group for a specific shoe index (0, 1, 2, 3)
export function createShoeUpper(gltfScene, shoeIndex = 0) {
  const shoeDef = SHOE_MODELS[shoeIndex] || SHOE_MODELS[0];
  const [start, end] = shoeDef.nodeRange;

  const upperGroup = new THREE.Group();
  upperGroup.name = `ShoeUpper_${shoeDef.id}`;

  const collectedMeshes = [];
  const upperBox = new THREE.Box3();

  for (let i = start; i < end; i++) {
    const node = gltfScene.children[i];
    if (!node) continue;
    const name = (node.name || '').toLowerCase();

    // Exclude plane nodes and basement/sole nodes
    if (name.startsWith('plane.')) continue;
    if (name.includes('basement')) continue;

    // Clone node and its materials
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

  // Calculate center offset on X and Z so that center of upper is at X=0, Z=0
  const center = upperBox.getCenter(new THREE.Vector3());

  // Apply centering offset to all children
  collectedMeshes.forEach((mesh) => {
    mesh.position.x -= center.x;
    mesh.position.z -= center.z;
  });

  // Attach reference metadata
  upperGroup.userData = {
    modelId: shoeDef.id,
    modelName: shoeDef.name,
    category: shoeDef.category,
    basePrice: shoeDef.basePrice,
    centerX: center.x,
    centerZ: center.z
  };

  return upperGroup;
}

// Extract an independent Sole Group for a specific variant
export function createSoleModel(gltfScene, stlGeometry, variantId = 'sole-std-01') {
  const soleGroup = new THREE.Group();
  soleGroup.name = `Sole_${variantId}`;

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

  if (foundVariant.source === 'stl-cad' && stlGeometry) {
    // Build from precision CAD STL
    const cadMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(foundVariant.defaultColor),
      roughness: 0.45,
      metalness: 0.4
    });
    const cadMesh = new THREE.Mesh(stlGeometry, cadMat);
    cadMesh.name = 'CAD_Tread_Mesh';
    cadMesh.castShadow = true;
    cadMesh.receiveShadow = true;

    // Orient and scale STL to match sneaker dimensions (~1.5m length)
    // STL bounds are ~230 x 185 x 70 mm
    cadMesh.rotation.x = -Math.PI / 2;
    cadMesh.rotation.z = Math.PI / 2;
    cadMesh.scale.setScalar(0.0068);
    cadMesh.position.set(0, 0.05, 0);

    soleGroup.add(cadMesh);
  } else {
    // Extract from GLB Basement nodes
    // Map source to model index
    let shoeIndex = 0;
    if (foundVariant.source === 'glb-model-2') shoeIndex = 1;
    if (foundVariant.source === 'glb-model-3') shoeIndex = 2;
    if (foundVariant.source === 'glb-model-4') shoeIndex = 3;

    const shoeDef = SHOE_MODELS[shoeIndex];
    const [start, end] = shoeDef.nodeRange;

    const collectedMeshes = [];
    const soleBox = new THREE.Box3();

    for (let i = start; i < end; i++) {
      const node = gltfScene.children[i];
      if (!node) continue;
      const name = (node.name || '').toLowerCase();

      // Only take Basement (sole) nodes
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

    // Center sole at X=0, Z=0
    collectedMeshes.forEach((mesh) => {
      mesh.position.x -= center.x;
      mesh.position.z -= center.z;
    });
  }

  // Add the patent-pending PA66-GF30 Twist-Lock Adapter Ring on the sole upper face
  const ringGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.014, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(foundVariant.defaultAccent),
    roughness: 0.3,
    metalness: 0.8,
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

// Generate dynamic 2D canvas texture for 3D text decals
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

// Apply material customizations to Shoe Upper without mutating anything else
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

        // Leather and plastic overlays
        if (name.includes('leather') || matName.includes('leather') || name.includes('plastic') || matName.includes('plastic')) {
          mat.color.copy(overlayCol);
          mat.roughness = roughness * 0.8;
          mat.metalness = metalness * 1.5;
          mat.needsUpdate = true;
        } else if (name.includes('stitch') || matName.includes('stitch') || matName.includes('accent')) {
          mat.color.copy(accentCol);
          mat.needsUpdate = true;
        } else {
          // Main Fabric / Upper Mesh
          mat.color.copy(primaryCol);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.needsUpdate = true;
        }
      });
    }
  });

  // Attach or update a dedicated 3D personalization plaque on the upper heel/collar
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
    // Position on lateral heel collar
    textPlaque.position.set(-0.52, 0.46, 0.22);
    textPlaque.rotation.y = Math.PI / 2.2;
    upperGroup.add(textPlaque);
  } else {
    textPlaque.material.map = createPersonalizationTexture(personalizationText || 'LOOPSTEP', '#141416', accentColor);
    textPlaque.material.needsUpdate = true;
  }
}

// Apply material customizations to Sole Group without mutating anything else
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
        } else if (name.includes('point') || matName.includes('point') || matName.includes('accent')) {
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

  // Attach or update laser engraving badge on midfoot sole plate
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
    // Position on underside midfoot arch plate
    engravePlaque.rotation.x = Math.PI / 2;
    engravePlaque.position.set(0, -0.01, 0);
    soleGroup.add(engravePlaque);
  } else {
    engravePlaque.material.map = createPersonalizationTexture(laserEngraving || 'PATENT PENDING', '#101418', accentColor, 'PATENT PENDING');
    engravePlaque.material.needsUpdate = true;
  }
}

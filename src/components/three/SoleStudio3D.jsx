import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  Sparkles,
  Unlock,
  Lock,
  Compass,
  Zap,
  Info,
  Check,
  ShoppingBag,
  Bookmark,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Colorway Palettes for 3D Sole
export const SOLE_PALETTES = [
  { name: 'Signal Lime', hex: '#C6F135', role: 'High Visibility' },
  { name: 'Stealth Black', hex: '#141416', role: 'Urban Minimalist' },
  { name: 'Chalk White', hex: '#F4F4F4', role: 'Classic Studio' },
  { name: 'Raw Terracotta', hex: '#C2593F', role: 'Trail Earth' },
  { name: 'Cyber Mint', hex: '#3DF1A8', role: 'Aerobic High-Energy' },
  { name: 'Molten Orange', hex: '#FF5E1E', role: 'All-Weather Alert' },
  { name: 'Deep Cobalt', hex: '#1E40AF', role: 'Endurance Deep' },
  { name: 'Graphite Grey', hex: '#374151', role: 'Neutral Technical' },
  { name: 'Gum Rubber', hex: '#B8860B', role: 'Heritage Natural' }
];

export const TREAD_DESIGNS = [
  {
    id: 'wave',
    name: 'Wave Flex™',
    desc: 'Sinusoidal multi-groove flex pattern for low rolling resistance on paved asphalt.',
    depth: '3.5 mm',
    terrain: 'Urban & Commute',
    gripCoeff: '0.82 µ'
  },
  {
    id: 'hex',
    name: 'Hex Dynamic™',
    desc: 'Dual-density hexagonal siping designed for rapid multi-directional pivots and sprint traction.',
    depth: '4.8 mm',
    terrain: 'Sports & Training',
    gripCoeff: '0.94 µ'
  },
  {
    id: 'lug',
    name: 'Deep Lug Chevron™',
    desc: 'Aggressive 6mm perimeter cleats with self-cleaning mud evacuation channels.',
    depth: '6.2 mm',
    terrain: 'Trail, Gravel & Mud',
    gripCoeff: '1.18 µ'
  }
];

export const SOLE_CATEGORIES = [
  {
    id: 'standard',
    name: 'Standard Sole',
    tagline: 'Lightweight Daily Commuter',
    basePrice: 200,
    stackHeight: '18 mm',
    weight: '142 g',
    drop: '6 mm',
    description: 'Designed for daily urban walking, metro commutes, and office wear. Natural rubber outsole bonded with compression-molded EVA.'
  },
  {
    id: 'sports',
    name: 'Sports Sole',
    tagline: 'High-Rebound Athletic Runner',
    basePrice: 500,
    stackHeight: '26 mm',
    weight: '175 g',
    drop: '8 mm',
    description: 'Tuned with high-rebound supercritical nitrogen-infused EVA foam for explosive energy return and sprint stabilization.'
  },
  {
    id: 'trail',
    name: 'Trail Sole',
    tagline: 'Rugged Mountain Rock Gripper',
    basePrice: 700,
    stackHeight: '32 mm',
    weight: '210 g',
    drop: '10 mm',
    description: 'Armed with vulcanized 70 Shore A high-traction rubber and embedded rock-plate puncture protection for technical loose terrain.'
  }
];

export default function SoleStudio3D({ initialCategory = 'standard', onAddToCartSuccess }) {
  const { addToCart, saveDesign, showToast } = useStore();

  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  // 3D Scene Node References
  const upperGroupRef = useRef(null);
  const soleGroupRef = useRef(null);
  const twistPlateUpperRef = useRef(null);
  const twistPlateSoleRef = useRef(null);
  const cadMeshRef = useRef(null);
  const soleMeshesRef = useRef([]);

  // Viewer Assembly States: 'assembled' | 'release' | 'detached' | 'exploded'
  const [assemblyState, setAssemblyState] = useState('assembled');
  const [cameraPreset, setCameraPreset] = useState('perspective');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('category'); // 'category' | 'colors' | 'tread' | 'finish' | 'specs'
  const [modelLoading, setModelLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [modelSource, setModelSource] = useState('Loading 3D Sneaker...');
  const [showWireframe, setShowWireframe] = useState(false);
  const [showCadReference, setShowCadReference] = useState(false);

  // Customization Configuration State
  const [category, setCategory] = useState(initialCategory);
  const [outsoleColor, setOutsoleColor] = useState('#141416');
  const [sidewallColor, setSidewallColor] = useState('#F4F4F4');
  const [accentColor, setAccentColor] = useState('#C6F135');
  const [lockRingColor, setLockRingColor] = useState('#C6F135');
  const [treadPattern, setTreadPattern] = useState('wave');
  const [surfaceFinish, setSurfaceFinish] = useState('matte'); // 'matte' | 'textured' | 'smooth'
  const [cushioningFirmness, setCushioningFirmness] = useState('Balanced'); // 'Soft Cloud', 'Balanced', 'Firm Energy'
  const [laserEngraving, setLaserEngraving] = useState('');
  const [shoeSize, setShoeSize] = useState(42);
  const [includeAdapter, setIncludeAdapter] = useState(false);

  // Undo History Stack
  const historyRef = useRef([]);

  // Push history state
  const pushHistory = useCallback(() => {
    historyRef.current.push({
      category,
      outsoleColor,
      sidewallColor,
      accentColor,
      lockRingColor,
      treadPattern,
      surfaceFinish,
      cushioningFirmness,
      laserEngraving
    });
    if (historyRef.current.length > 20) historyRef.current.shift();
  }, [category, outsoleColor, sidewallColor, accentColor, lockRingColor, treadPattern, surfaceFinish, cushioningFirmness, laserEngraving]);

  const handleUndo = () => {
    if (historyRef.current.length > 0) {
      const prev = historyRef.current.pop();
      setCategory(prev.category);
      setOutsoleColor(prev.outsoleColor);
      setSidewallColor(prev.sidewallColor);
      setAccentColor(prev.accentColor);
      setLockRingColor(prev.lockRingColor);
      setTreadPattern(prev.treadPattern);
      setSurfaceFinish(prev.surfaceFinish);
      setCushioningFirmness(prev.cushioningFirmness);
      setLaserEngraving(prev.laserEngraving);
      showToast('Undone previous customization step', 'info');
    }
  };

  // Calculate live dynamic price
  const activeCategoryObj = SOLE_CATEGORIES.find((c) => c.id === category) || SOLE_CATEGORIES[0];
  let calculatedPrice = activeCategoryObj.basePrice;
  if (surfaceFinish === 'textured') calculatedPrice += 40;
  if (laserEngraving.trim().length > 0) calculatedPrice += 60;
  if (includeAdapter) calculatedPrice += 150;

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION & SCENE GRAPH SETUP
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c1014);
    scene.fog = new THREE.FogExp2(0x0c1014, 0.28);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.05, 50);
    camera.position.set(1.4, 0.8, 1.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 6.0;
    controls.minDistance = 0.6;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Allow looking slightly under sole
    controls.target.set(0, 0.12, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup (Studio 3-Point + Subtle Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b0e0, 1.3);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc6f135, 0.8);
    rimLight.position.set(0, -2, 2);
    scene.add(rimLight);

    // Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.25;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(4, 20, 0x334155, 0x1e293b);
    gridHelper.position.y = -0.252;
    scene.add(gridHelper);

    // 6. Master Assembly Groups
    const upperGroup = new THREE.Group();
    upperGroup.name = 'LoopStep_Upper_Assembly';
    scene.add(upperGroup);
    upperGroupRef.current = upperGroup;

    const soleGroup = new THREE.Group();
    soleGroup.name = 'LoopStep_Sole_Assembly';
    scene.add(soleGroup);
    soleGroupRef.current = soleGroup;

    // 7. LoopStep Patent-Pending Mechanical Twist-Lock Plates
    // Upper Receiver Plate (Female 4-Lug Bayonet track)
    const plateGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.012, 32);
    const upperPlateMat = new THREE.MeshStandardMaterial({
      color: 0x1e252e,
      roughness: 0.35,
      metalness: 0.7,
      name: 'Strobel_PA66_Receiver'
    });
    const upperPlate = new THREE.Mesh(plateGeo, upperPlateMat);
    upperPlate.position.set(0, 0.006, 0);
    upperGroup.add(upperPlate);
    twistPlateUpperRef.current = upperPlate;

    // Sole Adapter Plate (Male 4-Lug Bayonet with locking detents)
    const solePlateGeo = new THREE.CylinderGeometry(0.138, 0.138, 0.012, 32);
    const solePlateMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(lockRingColor),
      roughness: 0.25,
      metalness: 0.85,
      name: 'Sole_PA66_TwistRing'
    });
    const solePlate = new THREE.Mesh(solePlateGeo, solePlateMat);
    solePlate.position.set(0, -0.006, 0);
    soleGroup.add(solePlate);
    twistPlateSoleRef.current = solePlate;

    // Add 4 radial bayonet key lugs
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const lugGeo = new THREE.BoxGeometry(0.04, 0.01, 0.018);
      const lug = new THREE.Mesh(lugGeo, solePlateMat);
      lug.position.set(Math.cos(angle) * 0.12, 0.004, Math.sin(angle) * 0.12);
      lug.rotation.y = angle;
      solePlate.add(lug);
    }

    // 8. Build High-Fidelity Parametric Fallback / Initial Geometry
    // This renders instantly so the user has zero lag while the 50MB GLB finishes loading
    buildParametricShoe(upperGroup, soleGroup);

    // 9. Load the Supplied GLB Model (`/models/sneaker.glb`)
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/sneaker.glb',
      (gltf) => {
        console.log('Sneaker GLB loaded successfully:', gltf);
        setModelLoading(false);
        setModelSource('Supplied GLB Sneaker Model Active');

        // Clear fallback meshes from upper and sole
        clearFallbacks(upperGroup, soleGroup);

        // Process Model 1 (Nodes 0 to 19 in the Dior B44 Sneaker GLB)
        const rootScene = gltf.scene;

        // Traverse and sort meshes into Upper vs Sole
        const gatheredSoleMeshes = [];
        const gatheredUpperMeshes = [];

        rootScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = (child.name || '').toLowerCase();
            const matName = (child.material?.name || '').toLowerCase();

            // Sole detection by node/mesh/material names
            if (
              name.includes('basement') ||
              name.includes('sole') ||
              name.includes('mesh.024') ||
              name.includes('mesh.023') ||
              matName.includes('basement') ||
              matName.includes('sole')
            ) {
              gatheredSoleMeshes.push(child);
            } else if (
              // Belong to Model 1 upper
              !name.includes('.003') &&
              !name.includes('.004') &&
              !name.includes('.005') &&
              !name.includes('.006') &&
              !name.includes('.007') &&
              !name.includes('.008') &&
              !name.includes('.009') &&
              !name.includes('.010') &&
              !name.includes('.011') &&
              !name.includes('.012')
            ) {
              gatheredUpperMeshes.push(child);
            }
          }
        });

        // Reparent gathered meshes into our controllable upperGroup and soleGroup
        gatheredUpperMeshes.forEach((mesh) => {
          const clone = mesh.clone();
          upperGroup.add(clone);
        });

        gatheredSoleMeshes.forEach((mesh) => {
          const clone = mesh.clone();
          // Clone material so color modifications don't mutate global cache
          if (Array.isArray(clone.material)) {
            clone.material = clone.material.map((m) => m.clone());
          } else if (clone.material) {
            clone.material = clone.material.clone();
          }
          soleGroup.add(clone);
          gatheredSoleMeshes.push(clone);
        });

        soleMeshesRef.current = gatheredSoleMeshes;

        // Auto-center and normalize scale of the GLB model
        const box = new THREE.Box3().setFromObject(upperGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 1.0 / (maxDim || 1);

        upperGroup.scale.setScalar(targetScale);
        soleGroup.scale.setScalar(targetScale);

        // Center on X and Z, keep baseline Y = 0
        upperGroup.position.x = -center.x * targetScale;
        upperGroup.position.z = -center.z * targetScale;
        soleGroup.position.x = -center.x * targetScale;
        soleGroup.position.z = -center.z * targetScale;

        // Apply initial colors to sole materials
        applySoleMaterials(soleGroup, outsoleColor, sidewallColor, accentColor, surfaceFinish);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(percent);
        }
      },
      (error) => {
        console.warn('Could not load /models/sneaker.glb, running with high-precision parametric model:', error);
        setModelLoading(false);
        setModelSource('Interactive Parametric 3D Model Active');
      }
    );

    // 10. Load Supplied CAD Sole STL Model (/models/sole_optimized.stl) on Demand
    const stlLoader = new STLLoader();
    stlLoader.load(
      '/models/sole_optimized.stl',
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();
        const cadMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          wireframe: true,
          roughness: 0.4,
          metalness: 0.8
        });
        const cadMesh = new THREE.Mesh(geometry, cadMat);
        cadMesh.scale.setScalar(0.0038); // Match mm to meter units
        cadMesh.position.set(0, -0.08, 0);
        cadMesh.visible = false;
        soleGroup.add(cadMesh);
        cadMeshRef.current = cadMesh;
      },
      undefined,
      (err) => console.log('STL reference optional loader:', err.message)
    );

    // 11. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth state interpolation (Assembled, Release, Detached, Exploded)
      updateAssemblyAnimation(delta);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------
  // PARAMETRIC SHOE GENERATOR (Guarantees Instant 3D Display)
  // -------------------------------------------------------------
  function buildParametricShoe(upperGrp, soleGrp) {
    // Sneaker Upper Mesh (Streamlined Low-Top Runner Profile)
    const upperShape = new THREE.Shape();
    upperShape.moveTo(-0.55, 0.04);
    upperShape.bezierCurveTo(-0.6, 0.18, -0.4, 0.45, -0.15, 0.48);
    upperShape.bezierCurveTo(0.1, 0.5, 0.35, 0.32, 0.52, 0.12);
    upperShape.bezierCurveTo(0.58, 0.06, 0.56, 0.02, 0.48, 0.02);
    upperShape.bezierCurveTo(0.15, 0.02, -0.3, 0.02, -0.55, 0.04);

    const extrudeSettings = {
      steps: 8,
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 6
    };

    const upperGeo = new THREE.ExtrudeGeometry(upperShape, extrudeSettings);
    upperGeo.center();

    const upperMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.72,
      metalness: 0.15,
      name: 'LoopStep_RecycledMesh_Upper'
    });
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.name = 'Parametric_Upper';
    upperMesh.castShadow = true;
    upperMesh.receiveShadow = true;
    upperMesh.position.set(0, 0.22, 0);
    upperGrp.add(upperMesh);

    // Upper Collar & Lacing Panel
    const collarGeo = new THREE.TorusGeometry(0.12, 0.028, 12, 24);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(-0.12, 0.42, 0);
    upperGrp.add(collarMesh);

    // Sole Midsole / Sidewall
    const soleShape = new THREE.Shape();
    soleShape.moveTo(-0.58, 0.0);
    soleShape.bezierCurveTo(-0.62, 0.04, -0.35, 0.08, 0.0, 0.08);
    soleShape.bezierCurveTo(0.35, 0.08, 0.56, 0.04, 0.58, 0.0);
    soleShape.bezierCurveTo(0.56, -0.06, 0.35, -0.08, 0.0, -0.08);
    soleShape.bezierCurveTo(-0.35, -0.08, -0.56, -0.06, -0.58, 0.0);

    const soleExtrude = {
      steps: 4,
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4
    };
    const soleGeo = new THREE.ExtrudeGeometry(soleShape, soleExtrude);
    soleGeo.center();

    const soleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(sidewallColor),
      roughness: 0.65,
      metalness: 0.1,
      name: 'LoopStep_EVA_Midsole'
    });
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.name = 'Parametric_Midsole';
    soleMesh.castShadow = true;
    soleMesh.receiveShadow = true;
    soleMesh.position.set(0, -0.03, 0);
    soleGrp.add(soleMesh);

    // Outsole Bottom Tread Slab
    const treadGeo = new THREE.BoxGeometry(1.15, 0.035, 0.36);
    const treadMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(outsoleColor),
      roughness: 0.85,
      metalness: 0.05,
      name: 'LoopStep_Rubber_Outsole'
    });
    const treadMesh = new THREE.Mesh(treadGeo, treadMat);
    treadMesh.name = 'Parametric_Outsole';
    treadMesh.castShadow = true;
    treadMesh.receiveShadow = true;
    treadMesh.position.set(0, -0.08, 0);
    soleGrp.add(treadMesh);

    soleMeshesRef.current = [soleMesh, treadMesh];
  }

  function clearFallbacks(upperGrp, soleGrp) {
    const toRemoveUpper = upperGrp.children.filter((c) => c.name.startsWith('Parametric_'));
    toRemoveUpper.forEach((c) => upperGrp.remove(c));

    const toRemoveSole = soleGrp.children.filter((c) => c.name.startsWith('Parametric_'));
    toRemoveSole.forEach((c) => soleGrp.remove(c));
  }

  // -------------------------------------------------------------
  // MATERIAL AND COLOR APPLICATION
  // -------------------------------------------------------------
  function applySoleMaterials(soleGrp, outColor, sideColor, accColor, finish) {
    if (!soleGrp) return;

    let roughness = 0.65;
    let metalness = 0.1;
    if (finish === 'matte') roughness = 0.88;
    if (finish === 'smooth') {
      roughness = 0.22;
      metalness = 0.2;
    }
    if (finish === 'textured') roughness = 0.75;

    soleGrp.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const name = (child.name || '').toLowerCase();
        const matName = (mat.name || '').toLowerCase();

        // Check if outsole vs sidewall vs accent
        if (name.includes('middle') || matName.includes('middle') || name.includes('midsole')) {
          mat.color.set(sideColor);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.wireframe = showWireframe;
        } else if (name.includes('point') || matName.includes('point') || name.includes('accent')) {
          mat.color.set(accColor);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.wireframe = showWireframe;
        } else if (name.includes('basement') || name.includes('sole') || name.includes('outsole')) {
          mat.color.set(outColor);
          mat.roughness = roughness;
          mat.metalness = metalness;
          mat.wireframe = showWireframe;
        }
        mat.needsUpdate = true;
      }
    });

    // Update twist plate ring color
    if (twistPlateSoleRef.current && twistPlateSoleRef.current.material) {
      twistPlateSoleRef.current.material.color.set(lockRingColor);
      twistPlateSoleRef.current.material.needsUpdate = true;
    }
  }

  // -------------------------------------------------------------
  // UPDATE REAL-TIME COLOR & FINISH CHANGES
  // -------------------------------------------------------------
  useEffect(() => {
    applySoleMaterials(soleGroupRef.current, outsoleColor, sidewallColor, accentColor, surfaceFinish);
  }, [outsoleColor, sidewallColor, accentColor, lockRingColor, surfaceFinish, showWireframe]);

  // CAD Reference Toggle
  useEffect(() => {
    if (cadMeshRef.current) {
      cadMeshRef.current.visible = showCadReference;
    }
  }, [showCadReference]);

  // -------------------------------------------------------------
  // SOLE CATEGORY MORPH / SCALE ADJUSTMENT
  // -------------------------------------------------------------
  useEffect(() => {
    if (!soleGroupRef.current) return;
    // Category adjusts stack height & sole geometry density
    if (category === 'standard') {
      soleGroupRef.current.scale.set(1.0, 1.0, 1.0);
    } else if (category === 'sports') {
      soleGroupRef.current.scale.set(1.02, 1.25, 1.04);
    } else if (category === 'trail') {
      soleGroupRef.current.scale.set(1.05, 1.45, 1.08);
    }
  }, [category]);

  // -------------------------------------------------------------
  // DETACH / ASSEMBLE STATE ANIMATION INTERPOLATION
  // -------------------------------------------------------------
  const updateAssemblyAnimation = (delta) => {
    const sole = soleGroupRef.current;
    const upper = upperGroupRef.current;
    if (!sole || !upper) return;

    const lerpSpeed = Math.min(1.0, delta * 7.0);

    let targetUpperY = 0;
    let targetSoleY = 0;
    let targetSoleRotY = 0;

    switch (assemblyState) {
      case 'assembled':
        // State A: Assembled & Locked
        targetUpperY = 0;
        targetSoleY = 0;
        targetSoleRotY = 0;
        break;

      case 'release':
        // State B: Twist-Release (45-degree mechanical rotation)
        targetUpperY = 0;
        targetSoleY = -0.02;
        targetSoleRotY = -Math.PI / 4; // 45 deg
        break;

      case 'detached':
        // State C: Fully Detached (Sole descends revealing twist-lock plate)
        targetUpperY = 0;
        targetSoleY = -0.22;
        targetSoleRotY = -Math.PI / 4;
        break;

      case 'exploded':
        // Exploded View: Upper floats up, Sole drops down, interface in middle
        targetUpperY = 0.14;
        targetSoleY = -0.26;
        targetSoleRotY = -Math.PI / 4;
        break;

      default:
        break;
    }

    upper.position.y += (targetUpperY - upper.position.y) * lerpSpeed;
    sole.position.y += (targetSoleY - sole.position.y) * lerpSpeed;
    sole.rotation.y += (targetSoleRotY - sole.rotation.y) * lerpSpeed;
  };

  // -------------------------------------------------------------
  // CAMERA PRESETS
  // -------------------------------------------------------------
  const setCameraView = (preset) => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.target.set(0, 0.08, 0);

    switch (preset) {
      case 'perspective':
        camera.position.set(1.4, 0.75, 1.7);
        break;
      case 'side':
        camera.position.set(2.2, 0.1, 0.0);
        break;
      case 'front':
        camera.position.set(0.0, 0.25, 2.2);
        break;
      case 'rear':
        camera.position.set(0.0, 0.25, -2.2);
        break;
      case 'top':
        camera.position.set(0.05, 2.4, 0.05);
        break;
      case 'bottom':
        // Direct sole tread inspection angle
        camera.position.set(0.05, -2.3, 0.05);
        break;
      default:
        break;
    }
    controls.update();
  };

  // Reset entire design
  const handleResetDesign = () => {
    setCategory('standard');
    setOutsoleColor('#141416');
    setSidewallColor('#F4F4F4');
    setAccentColor('#C6F135');
    setLockRingColor('#C6F135');
    setTreadPattern('wave');
    setSurfaceFinish('matte');
    setCushioningFirmness('Balanced');
    setLaserEngraving('');
    setAssemblyState('assembled');
    setCameraView('perspective');
    showToast('Sole configuration restored to factory default', 'info');
  };

  // Save current design
  const handleSaveDesign = () => {
    saveDesign({
      name: `Custom ${activeCategoryObj.name}`,
      category,
      modelVariant: `LS-${category.toUpperCase()}-v3D`,
      outsoleColor,
      sidewallColor,
      accentColor,
      lockRingColor,
      treadPattern,
      surfaceFinish,
      cushioningFirmness,
      laserEngraving: laserEngraving.trim() || 'NONE',
      price: calculatedPrice,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Add configured sole to cart
  const handleAddToCart = () => {
    const item = {
      id: `configured-sole-${Date.now()}`,
      name: `LoopStep ${activeCategoryObj.name} (EU ${shoeSize})`,
      category: 'Configured Sole',
      edition: activeCategoryObj.name,
      price: calculatedPrice,
      size: shoeSize,
      image: `/models/loopstep-configured-sole.png`,
      customDetails: {
        category,
        modelVariant: `LS-${category.toUpperCase()}-v3D`,
        outsoleColor,
        sidewallColor,
        accentColor,
        lockRingColor,
        treadPattern,
        surfaceFinish,
        cushioningFirmness,
        laserEngraving: laserEngraving.trim() || 'NONE',
        includeAdapter
      },
      quantity: 1
    };

    addToCart(item);
    if (onAddToCartSuccess) onAddToCartSuccess();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const el = mountRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 300px) 1fr minmax(320px, 400px)',
        gap: '16px',
        minHeight: '740px',
        backgroundColor: '#0a0d11',
        borderRadius: '24px',
        border: '1px solid var(--border-dim)',
        overflow: 'hidden',
        position: 'relative'
      }}
      className="sole-studio-grid"
    >
      {/* ========================================================
          LEFT COLUMN: TOOLS, ASSEMBLY STATES & CAMERA PRESETS
          ======================================================== */}
      <div
        style={{
          backgroundColor: 'rgba(15, 20, 26, 0.95)',
          borderRight: '1px solid var(--border-dim)',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto'
        }}
      >
        {/* Studio Branding & Status */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-signal" style={{ padding: '3px 8px', fontSize: '0.68rem' }}>
              <Cpu size={12} /> 3D STUDIO v2.4
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: modelLoading ? 'var(--signal-amber)' : 'var(--signal-green)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: modelLoading ? 'var(--signal-amber)' : 'var(--signal-green)',
                  display: 'inline-block'
                }}
              />
              {modelLoading ? `Loading Assets (${loadProgress}%)` : 'Real-time WebGL Engine'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Twist-Lock System
          </h2>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Control mechanical separation, inspect contact bayonet, and customize 3D sole materials.
          </p>
        </div>

        {/* 1. Detachable Sole Mechanism Controls */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            Assembly & Release State
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setAssemblyState('assembled');
                showToast('State A: Assembled & mechanically locked');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                border: assemblyState === 'assembled' ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                backgroundColor: assemblyState === 'assembled' ? 'rgba(198, 241, 53, 0.12)' : 'rgba(255,255,255,0.02)',
                color: assemblyState === 'assembled' ? 'var(--primary)' : '#e2e8f0',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={15} /> Assembled (Locked)
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>0° Lock</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAssemblyState('release');
                showToast('State B: 45° twist release motion triggered');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                border: assemblyState === 'release' ? '1px solid var(--signal-amber)' : '1px solid var(--border-dim)',
                backgroundColor: assemblyState === 'release' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.02)',
                color: assemblyState === 'release' ? 'var(--signal-amber)' : '#e2e8f0',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={15} /> Release (45° Twist)
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Disengage</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAssemblyState('detached');
                showToast('State C: Sole detached to expose Strobel interface');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                border: assemblyState === 'detached' ? '1px solid var(--signal-blue)' : '1px solid var(--border-dim)',
                backgroundColor: assemblyState === 'detached' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                color: assemblyState === 'detached' ? 'var(--signal-blue)' : '#e2e8f0',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Unlock size={15} /> Detached (Revealed)
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Inspect</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAssemblyState('exploded');
                showToast('Exploded View: Upper, PA66 Plate & Sole separated');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                border: assemblyState === 'exploded' ? '1px solid #a855f7' : '1px solid var(--border-dim)',
                backgroundColor: assemblyState === 'exploded' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255,255,255,0.02)',
                color: assemblyState === 'exploded' ? '#c084fc' : '#e2e8f0',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={15} /> Exploded Architecture
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Layers</span>
            </button>
          </div>
        </div>

        {/* 2. Studio Camera Angles */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            Camera Angles
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '8px' }}>
            {[
              { id: 'perspective', label: 'Perspective' },
              { id: 'side', label: 'Side' },
              { id: 'front', label: 'Front' },
              { id: 'rear', label: 'Rear' },
              { id: 'top', label: 'Top' },
              { id: 'bottom', label: 'Tread' }
            ].map((cam) => (
              <button
                key={cam.id}
                type="button"
                onClick={() => setCameraView(cam.id)}
                style={{
                  padding: '7px 4px',
                  borderRadius: '8px',
                  border: cameraPreset === cam.id ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                  backgroundColor: cameraPreset === cam.id ? 'rgba(198, 241, 53, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: cameraPreset === cam.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Engineering Display Toggles */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            Engineering Overlays
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}
            >
              <span>Mesh Wireframe</span>
              <input
                type="checkbox"
                checked={showWireframe}
                onChange={(e) => setShowWireframe(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}
            >
              <span>CAD Sole Reference (STL)</span>
              <input
                type="checkbox"
                checked={showCadReference}
                onChange={(e) => setShowCadReference(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
            </label>
          </div>
        </div>

        {/* 4. Specs Card */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-dim)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 700 }}>
            <ShieldCheck size={14} /> Patent Mechanics
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            Twist-lock uses PA66 + 30% glass-fiber bayonet with 1,200 N retention force rating. Fits size EU 38-46.
          </p>
        </div>
      </div>

      {/* ========================================================
          CENTER COLUMN: LARGE INTERACTIVE 3D VIEWPORT
          ======================================================== */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '580px' }}>
        {/* Floating Top Status Bar */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgba(12, 16, 20, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid var(--border-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.76rem',
              color: '#fff'
            }}
          >
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>LOOPSTEP</span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span>{activeCategoryObj.name}</span>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span style={{ color: 'var(--signal-green)' }}>₹{calculatedPrice}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button
              type="button"
              onClick={handleResetDesign}
              title="Reset to default"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(12, 16, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-dim)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title="Fullscreen"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(12, 16, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-dim)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* 3D Canvas Mount Point */}
        <div ref={mountRef} style={{ width: '100%', height: '100%', flex: 1, cursor: 'grab' }} />

        {/* Model Loading Spinner / Indicator */}
        {modelLoading && (
          <div
            style={{
              position: 'absolute',
              bottom: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(12, 16, 20, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--primary)',
              borderRadius: '14px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 20
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid var(--border-dim)',
                borderTop: '2px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>
              Streaming High-Res GLB Assets... ({loadProgress}%)
            </span>
          </div>
        )}

        {/* Interaction Helper Notice */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            backgroundColor: 'rgba(12, 16, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid var(--border-dim)'
          }}
        >
          <span>Drag to rotate</span>
          <span>·</span>
          <span>Scroll to zoom</span>
          <span>·</span>
          <span>State: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{assemblyState}</strong></span>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: ACCORDION / TABBED CUSTOMIZATION PANEL
          ======================================================== */}
      <div
        style={{
          backgroundColor: 'rgba(15, 20, 26, 0.95)',
          borderLeft: '1px solid var(--border-dim)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Navigation Tabs for Customizer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid var(--border-dim)',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}
        >
          {[
            { id: 'category', label: 'Category' },
            { id: 'colors', label: 'Colors' },
            { id: 'tread', label: 'Tread' },
            { id: 'specs', label: 'Specs' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 6px',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Customization Controls */}
        <div style={{ flex: 1, padding: '20px 18px', overflowY: 'auto' }}>
          {/* TAB 1: SOLE CATEGORIES */}
          {activeTab === 'category' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px' }}>Choose Sole Category</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Each variant features engineered stack height, durometer, and compatible twist-lock geometry.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SOLE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        pushHistory();
                        setCategory(cat.id);
                        showToast(`Selected ${cat.name} (₹${cat.basePrice})`);
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-dim)',
                        backgroundColor: isSelected ? 'rgba(198, 241, 53, 0.08)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isSelected ? 'var(--primary)' : '#fff' }}>
                            {cat.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {cat.tagline}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                            ₹{cat.basePrice}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '8px 0 0', lineHeight: 1.4 }}>
                        {cat.description}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                          Stack: {cat.stackHeight}
                        </span>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                          Weight: {cat.weight}
                        </span>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                          Drop: {cat.drop}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shoe Size Selector */}
              <div style={{ marginTop: '8px' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '8px' }}>
                  Select EU Shoe Size
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {[39, 40, 41, 42, 43, 44, 45].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShoeSize(s)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: shoeSize === s ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                        backgroundColor: shoeSize === s ? 'rgba(198, 241, 53, 0.2)' : 'rgba(255,255,255,0.02)',
                        color: shoeSize === s ? 'var(--primary)' : '#cbd5e1',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      EU {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLOR CUSTOMIZATION */}
          {activeTab === 'colors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px' }}>3D Color Tuning</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Colors update directly on the 3D materials. Upper stays pristine while sole adapts.
                </p>
              </div>

              {/* Region 1: Outsole Slab */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0' }}>Outsole Rubber</label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {SOLE_PALETTES.find((p) => p.hex === outsoleColor)?.name || outsoleColor}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {SOLE_PALETTES.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      title={p.name}
                      onClick={() => {
                        pushHistory();
                        setOutsoleColor(p.hex);
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '10px',
                        backgroundColor: p.hex,
                        border: outsoleColor === p.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        boxShadow: outsoleColor === p.hex ? '0 0 10px rgba(255,255,255,0.4)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Region 2: Sidewall Midsole */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0' }}>Sidewall / Midsole</label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {SOLE_PALETTES.find((p) => p.hex === sidewallColor)?.name || sidewallColor}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {SOLE_PALETTES.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      title={p.name}
                      onClick={() => {
                        pushHistory();
                        setSidewallColor(p.hex);
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '10px',
                        backgroundColor: p.hex,
                        border: sidewallColor === p.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        boxShadow: sidewallColor === p.hex ? '0 0 10px rgba(255,255,255,0.4)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Region 3: Twist-Lock Bayonet Accent */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0' }}>Twist-Lock Ring Accent</label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {SOLE_PALETTES.find((p) => p.hex === lockRingColor)?.name || lockRingColor}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {SOLE_PALETTES.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      title={p.name}
                      onClick={() => {
                        pushHistory();
                        setLockRingColor(p.hex);
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '10px',
                        backgroundColor: p.hex,
                        border: lockRingColor === p.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        boxShadow: lockRingColor === p.hex ? '0 0 10px rgba(255,255,255,0.4)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TREAD & SURFACE FINISH */}
          {activeTab === 'tread' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px' }}>Tread & Traction Surface</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Select terrain-tested siping patterns and composite texture finishes.
                </p>
              </div>

              {/* Tread Pattern Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TREAD_DESIGNS.map((tr) => {
                  const isSelected = treadPattern === tr.id;
                  return (
                    <div
                      key={tr.id}
                      onClick={() => {
                        pushHistory();
                        setTreadPattern(tr.id);
                        showToast(`Switched tread to ${tr.name}`);
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-dim)',
                        backgroundColor: isSelected ? 'rgba(198, 241, 53, 0.08)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: isSelected ? 'var(--primary)' : '#fff' }}>
                          {tr.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--signal-green)', fontWeight: 600 }}>
                          Grip: {tr.gripCoeff}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '4px 0 0', lineHeight: 1.4 }}>
                        {tr.desc}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        <span>Depth: {tr.depth}</span>
                        <span>·</span>
                        <span>Terrain: {tr.terrain}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Surface Finish */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '8px' }}>
                  Surface Material Finish
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'matte', label: 'Matte Clean', fee: '+₹0' },
                    { id: 'textured', label: 'Traction Grip', fee: '+₹40' },
                    { id: 'smooth', label: 'Studio Gloss', fee: '+₹0' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        pushHistory();
                        setSurfaceFinish(f.id);
                      }}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: surfaceFinish === f.id ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                        backgroundColor: surfaceFinish === f.id ? 'rgba(198, 241, 53, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: surfaceFinish === f.id ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {f.label}
                      <div style={{ fontSize: '0.64rem', opacity: 0.7, marginTop: '2px' }}>{f.fee}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED SPECS & LASER ENGRAVING */}
          {activeTab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px' }}>Engineering Customization</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Fine-tune cushioning firmness and add your custom laser-etched serial badge.
                </p>
              </div>

              {/* Cushioning Firmness */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '8px' }}>
                  Cushioning Density
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {['Soft Cloud', 'Balanced', 'Firm Energy'].map((cush) => (
                    <button
                      key={cush}
                      type="button"
                      onClick={() => {
                        pushHistory();
                        setCushioningFirmness(cush);
                      }}
                      style={{
                        padding: '9px 4px',
                        borderRadius: '8px',
                        border: cushioningFirmness === cush ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                        backgroundColor: cushioningFirmness === cush ? 'rgba(198, 241, 53, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: cushioningFirmness === cush ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {cush}
                    </button>
                  ))}
                </div>
              </div>

              {/* Laser Engraving */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0' }}>Custom Laser Engraving</label>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>+₹60</span>
                </div>
                <input
                  type="text"
                  maxLength={14}
                  value={laserEngraving}
                  onChange={(e) => setLaserEngraving(e.target.value.toUpperCase())}
                  placeholder="E.G. LOOP-TAWZ"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-dim)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em'
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Precision laser-etched onto the PA66 heel counter lock plate. Max 14 chars.
                </span>
              </div>

              {/* Add ReFit Universal Adapter */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-dim)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={includeAdapter}
                  onChange={(e) => setIncludeAdapter(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', marginTop: '3px' }}
                />
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                    Include ReFit™ Universal Adapter (+₹150)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3, display: 'block', marginTop: '2px' }}>
                    Converts your existing Nike, Adidas, or Vans shoe to fit this LoopStep twist-lock sole.
                  </span>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION & CHECKOUT BAR */}
        <div
          style={{
            padding: '16px 18px',
            borderTop: '1px solid var(--border-dim)',
            backgroundColor: 'rgba(10, 13, 17, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Price & Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Calculated Price
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
                ₹{calculatedPrice}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleUndo}
                title="Undo Step"
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-dim)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Undo
              </button>
              <button
                type="button"
                onClick={handleSaveDesign}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-dim)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Bookmark size={13} /> Save Design
              </button>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBag size={17} /> Add Configured Sole to Cart · ₹{calculatedPrice}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Maximize2, Minimize2, Eye, ShieldCheck, Sparkles, Layers, Cog } from 'lucide-react';
import { loadSneakerGLTF, createShoeUpper, createSoleModel } from './Footwear3DManager';

export const MECHANISM_COMPONENTS = [
  {
    id: 'upper',
    name: 'LoopStep Shoe Upper',
    category: 'Footwear Chassis',
    material: '100% Recycled Ocean-Plastic Knit & TPU Overlay',
    tensileRating: '65 MPa Tear Resistance',
    purpose: 'Breathable, anatomical upper broken in to fit the user’s foot. Designed to outlast 5–10 replacement soles over 3+ years.',
    explodedY: 0.38,
    color: '#242f3a'
  },
  {
    id: 'upper_base',
    name: 'Upper Strobel Connection Base',
    category: 'Structural Interface',
    material: 'PA66 Glass-Fiber Reinforced (30%) High Modulus Plate',
    tensileRating: '180 MPa Flexural Strength',
    purpose: 'Ultrathin 2.0mm high-strength foundation strobel-stitched directly into the shoe base, hosting the female bayonet retention track.',
    explodedY: 0.22,
    color: '#1a222c'
  },
  {
    id: 'twist_ring',
    name: 'Reinforced Twist-Lock Ring',
    category: 'Mechanical Core',
    material: 'DuPont Zytel PA66-GF30 Polymer Matrix',
    tensileRating: '170 – 200 MPa Ultimate Tensile',
    purpose: 'Concentric ring engineered with 4 precision-tapered bayonet track channels with self-aligning lead-in ramps.',
    explodedY: 0.10,
    color: '#C6F135'
  },
  {
    id: 'locking_teeth',
    name: 'Radial Locking Teeth & Detents',
    category: 'Retention Hardware',
    material: 'Austenitic Stainless Steel 304 Detents & PA66 Lugs',
    tensileRating: '7,000 N Tested Vertical Shear Capacity',
    purpose: 'Spring-loaded acoustic detents that audibly snap shut at 45° rotation, providing positive lock and preventing lateral dislocation.',
    explodedY: 0.00,
    color: '#00F0FF'
  },
  {
    id: 'sole_interface',
    name: 'Sole Connection Surface & Gasket',
    category: 'Sealing & Alignment',
    material: 'EPDM Sealed Perimeter Elastomer Gasket',
    tensileRating: 'Dust & Water Ingress Exclusion IP64',
    purpose: 'Recessed alignment notch and sealed perimeter seal preventing sand, mud, and water from penetrating into the locking track.',
    explodedY: -0.12,
    color: '#2a3744'
  },
  {
    id: 'replacement_sole',
    name: 'Replacement Modular Outsole',
    category: 'Terrain Traction',
    material: 'Compression Molded Dual-Density EVA + Vulcanized Rubber',
    tensileRating: '50-68 Shore A Durometer Range',
    purpose: 'Interchangeable high-wear contact surface. Can be swapped in 10 seconds between Standard, Sports, and Trail terrain profiles.',
    explodedY: -0.28,
    color: '#141416'
  }
];

export default function TwistLock3DViewer({
  viewMode = 'normal', // 'normal' | 'engineering'
  selectedComponentId = 'twist_ring',
  onSelectComponent,
  currentStepIndex = 0
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  // Group references
  const componentNodesRef = useRef({});
  const normalAssemblyGroupRef = useRef(null);
  const engineeringGroupRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c1014);
    scene.fog = new THREE.FogExp2(0x0c1014, 0.22);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 50);
    camera.position.set(1.4, 0.6, 1.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 5.0;
    controls.minDistance = 0.5;
    controls.target.set(0, 0.05, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b0e0, 1.2);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc6f135, 1.0);
    rimLight.position.set(0, -2, 2.5);
    scene.add(rimLight);

    // Floor
    const gridHelper = new THREE.GridHelper(4, 20, 0x334155, 0x17202a);
    gridHelper.position.y = -0.32;
    scene.add(gridHelper);

    // Master Groups
    const normalGroup = new THREE.Group();
    normalGroup.name = 'Normal_Assembly_Group';
    scene.add(normalGroup);
    normalAssemblyGroupRef.current = normalGroup;

    const engGroup = new THREE.Group();
    engGroup.name = 'Engineering_Exploded_Group';
    engGroup.visible = false;
    scene.add(engGroup);
    engineeringGroupRef.current = engGroup;

    // Build the 6 discrete engineering components
    buildEngineeringExplodedStack(engGroup, componentNodesRef.current);

    // Load actual GLB for normal assembly
    loadSneakerGLTF()
      .then((gltf) => {
        const upper = createShoeUpper(gltf, 0);
        const sole = createSoleModel(gltf, null, 'sole-std-01');
        normalGroup.add(upper);
        normalGroup.add(sole);
        normalGroup.userData = { upper, sole };
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Normal mode 6-step twist-lock animation
      if (normalGroup.visible && normalGroup.userData?.sole) {
        const sole = normalGroup.userData.sole;
        let targetY = 0;
        let targetRotY = 0;

        if (currentStepIndex === 1) {
          // Twist to release (45 deg counter-clockwise)
          targetRotY = -Math.PI / 4;
          targetY = -0.02;
        } else if (currentStepIndex === 2) {
          // Remove worn sole
          targetRotY = -Math.PI / 4;
          targetY = -0.22;
        } else if (currentStepIndex === 3) {
          // Align replacement
          targetRotY = -Math.PI / 4;
          targetY = -0.08;
        } else if (currentStepIndex >= 4) {
          // Twist & Lock (positive engagement)
          targetRotY = 0;
          targetY = 0;
        }

        sole.position.y += (targetY - sole.position.y) * 0.1;
        sole.rotation.y += (targetRotY - sole.rotation.y) * 0.1;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

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

  // Update visibility between Normal and Engineering Mode
  useEffect(() => {
    if (!normalAssemblyGroupRef.current || !engineeringGroupRef.current) return;

    if (viewMode === 'engineering') {
      normalAssemblyGroupRef.current.visible = false;
      engineeringGroupRef.current.visible = true;
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0.05, 0);
        controlsRef.current.update();
      }
    } else {
      normalAssemblyGroupRef.current.visible = true;
      engineeringGroupRef.current.visible = false;
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0.15, 0);
        controlsRef.current.update();
      }
    }
  }, [viewMode]);

  // Update component highlight in Engineering mode
  useEffect(() => {
    if (viewMode !== 'engineering') return;

    Object.entries(componentNodesRef.current).forEach(([id, mesh]) => {
      if (!mesh || !mesh.material) return;
      const isSelected = id === selectedComponentId;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      mats.forEach((mat) => {
        if (isSelected) {
          mat.emissive = new THREE.Color(0xc6f135);
          mat.emissiveIntensity = 0.55;
          mat.opacity = 1.0;
        } else {
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0.0;
          mat.opacity = selectedComponentId ? 0.35 : 0.9;
        }
        mat.transparent = true;
        mat.needsUpdate = true;
      });
    });
  }, [viewMode, selectedComponentId]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        backgroundColor: '#0c1014',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-dim)'
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(12, 16, 20, 0.9)'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            LOADING 3D MECHANISM CAD...
          </span>
        </div>
      )}

      {/* Floating Mode Indicator Badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(12, 16, 20, 0.85)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-light)'
        }}
      >
        <Cog size={14} color="var(--primary)" />
        <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em' }}>
          {viewMode === 'engineering' ? 'ENGINEERING EXPLODED VIEW' : 'NORMAL ASSEMBLED VIEW'}
        </span>
      </div>
    </div>
  );
}

// Build the 6 discrete engineering components with actual geometry
function buildEngineeringExplodedStack(parentGroup, nodeMap) {
  // 1. Shoe Upper (Cutaway chassis)
  const upperGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.12, 32);
  upperGeo.scale(1.8, 1.0, 0.9);
  const upperMat = new THREE.MeshStandardMaterial({
    color: 0x242f3a,
    roughness: 0.65,
    metalness: 0.2,
    wireframe: false
  });
  const upperMesh = new THREE.Mesh(upperGeo, upperMat);
  upperMesh.position.set(0, 0.38, 0);
  upperMesh.name = 'Component_Upper';
  parentGroup.add(upperMesh);
  nodeMap['upper'] = upperMesh;

  // 2. Upper Strobel Connection Base
  const baseGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.016, 32);
  baseGeo.scale(1.7, 1.0, 0.88);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1a222c,
    roughness: 0.3,
    metalness: 0.7
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.set(0, 0.22, 0);
  baseMesh.name = 'Component_UpperBase';
  parentGroup.add(baseMesh);
  nodeMap['upper_base'] = baseMesh;

  // 3. Reinforced Twist-Lock Ring (PA66-GF30)
  const ringGeo = new THREE.TorusGeometry(0.16, 0.024, 16, 48);
  ringGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xc6f135,
    roughness: 0.25,
    metalness: 0.85
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.set(0, 0.10, 0);
  ringMesh.name = 'Component_TwistRing';
  parentGroup.add(ringMesh);
  nodeMap['twist_ring'] = ringMesh;

  // 4. Radial Locking Teeth & Detent Springs (4 teeth)
  const teethGroup = new THREE.Group();
  teethGroup.position.set(0, 0.00, 0);
  const toothMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    roughness: 0.2,
    metalness: 0.9
  });
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const toothGeo = new THREE.BoxGeometry(0.045, 0.018, 0.025);
    const tooth = new THREE.Mesh(toothGeo, toothMat);
    tooth.position.set(Math.cos(angle) * 0.16, 0, Math.sin(angle) * 0.16);
    tooth.rotation.y = angle;
    teethGroup.add(tooth);
  }
  parentGroup.add(teethGroup);
  nodeMap['locking_teeth'] = teethGroup.children[0]; // representative

  // 5. Sole Connection Surface & EPDM Gasket
  const gasketGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.012, 32);
  gasketGeo.scale(1.7, 1.0, 0.88);
  const gasketMat = new THREE.MeshStandardMaterial({
    color: 0x2a3744,
    roughness: 0.8,
    metalness: 0.1
  });
  const gasketMesh = new THREE.Mesh(gasketGeo, gasketMat);
  gasketMesh.position.set(0, -0.12, 0);
  gasketMesh.name = 'Component_SoleInterface';
  parentGroup.add(gasketMesh);
  nodeMap['sole_interface'] = gasketMesh;

  // 6. Replacement Modular Sole (Molded Outsole)
  const soleGeo = new THREE.CylinderGeometry(0.2, 0.21, 0.06, 32);
  soleGeo.scale(1.75, 1.0, 0.9);
  const soleMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.85,
    metalness: 0.1
  });
  const soleMesh = new THREE.Mesh(soleGeo, soleMat);
  soleMesh.position.set(0, -0.28, 0);
  soleMesh.name = 'Component_Sole';
  parentGroup.add(soleMesh);
  nodeMap['replacement_sole'] = soleMesh;

  // Add guide connector line through center
  const lineGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.72, 8);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, opacity: 0.4, transparent: true });
  const lineMesh = new THREE.Mesh(lineGeo, lineMat);
  lineMesh.position.set(0, 0.05, 0);
  parentGroup.add(lineMesh);
}

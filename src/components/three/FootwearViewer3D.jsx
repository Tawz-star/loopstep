import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Compass,
  ArrowUp,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import {
  loadSneakerGLTF,
  loadSoleSTL,
  createShoeUpper,
  createSoleModel,
  applyShoeCustomization,
  applySoleCustomization,
  SHOE_MODELS,
  SOLE_CATEGORIES
} from './Footwear3DManager';

export default function FootwearViewer3D({
  mode = 'assembly', // 'shoe' | 'sole' | 'assembly'
  shoeModelId = 'shoe-01',
  shoeConfig = {},
  soleVariantId = 'sole-std-01',
  soleConfig = {},
  assemblyState = 'assembled', // 'assembled' | 'release' | 'detached'
  onAssemblyChange
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  // Active scene nodes
  const activeUpperRef = useRef(null);
  const activeSoleRef = useRef(null);
  const gltfSceneRef = useRef(null);
  const stlGeometryRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('perspective');

  // Animation interpolation state
  const currentAssemblyStateRef = useRef(assemblyState);
  currentAssemblyStateRef.current = assemblyState;

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c1014);
    scene.fog = new THREE.FogExp2(0x0c1014, 0.22);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 50);
    camera.position.set(1.4, 0.75, 1.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
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
    controls.minDistance = 0.5;
    controls.target.set(0, 0.12, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8fa3bf, 1.4);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc6f135, 1.1);
    rimLight.position.set(0, -2, 2.5);
    scene.add(rimLight);

    // Subtle Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.5 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.001;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Tech Grid Floor
    const gridHelper = new THREE.GridHelper(5, 24, 0x334155, 0x17202a);
    gridHelper.position.y = -0.002;
    scene.add(gridHelper);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth assembly state interpolation
      const sole = activeSoleRef.current;
      const upper = activeUpperRef.current;

      if (sole && upper && mode === 'assembly') {
        const lerpSpeed = Math.min(1.0, delta * 7.0);
        let targetSoleY = 0;
        let targetSoleRotY = 0;

        switch (currentAssemblyStateRef.current) {
          case 'assembled':
            targetSoleY = 0;
            targetSoleRotY = 0;
            break;
          case 'release':
            targetSoleY = -0.03;
            targetSoleRotY = -Math.PI / 4; // 45 deg twist
            break;
          case 'detached':
            targetSoleY = -0.24;
            targetSoleRotY = -Math.PI / 4;
            break;
          default:
            break;
        }

        sole.position.y += (targetSoleY - sole.position.y) * lerpSpeed;
        sole.rotation.y += (targetSoleRotY - sole.rotation.y) * lerpSpeed;
      }

      if (controls) {
        controls.autoRotate = isAutoRotate;
        controls.autoRotateSpeed = 2.0;
        controls.update();
      }

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

    // 7. Load raw GLTF & STL assets
    Promise.all([loadSneakerGLTF(), loadSoleSTL().catch(() => null)])
      .then(([gltf, stl]) => {
        gltfSceneRef.current = gltf;
        stlGeometryRef.current = stl;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading 3D assets:', err);
        setLoadError(err.message || 'Failed to load 3D assets');
        setIsLoading(false);
      });

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, []);

  // Update scene models whenever mode, shoeModelId, or soleVariantId changes
  useEffect(() => {
    const scene = sceneRef.current;
    const gltfScene = gltfSceneRef.current;
    if (!scene || !gltfScene) return;

    // Remove existing upper and sole from scene
    if (activeUpperRef.current) {
      scene.remove(activeUpperRef.current);
      activeUpperRef.current = null;
    }
    if (activeSoleRef.current) {
      scene.remove(activeSoleRef.current);
      activeSoleRef.current = null;
    }

    const shoeIdx = SHOE_MODELS.findIndex((m) => m.id === shoeModelId);
    const validShoeIdx = shoeIdx >= 0 ? shoeIdx : 0;

    // 1. Mount Shoe Upper if mode is 'shoe' or 'assembly'
    if (mode === 'shoe' || mode === 'assembly') {
      const upper = createShoeUpper(gltfScene, validShoeIdx);
      applyShoeCustomization(upper, shoeConfig);
      scene.add(upper);
      activeUpperRef.current = upper;
    }

    // 2. Mount Sole if mode is 'sole' or 'assembly'
    if (mode === 'sole' || mode === 'assembly') {
      const sole = createSoleModel(gltfScene, stlGeometryRef.current, soleVariantId);
      applySoleCustomization(sole, soleConfig);

      // In sole-only mode, position sole centered at Y=0.08 for optimal inspection
      if (mode === 'sole') {
        sole.position.set(0, 0.08, 0);
        sole.rotation.set(0, 0, 0);
      } else {
        sole.position.set(0, 0, 0);
        sole.rotation.set(0, 0, 0);
      }

      scene.add(sole);
      activeSoleRef.current = sole;
    }

    // Adjust camera target
    if (controlsRef.current) {
      if (mode === 'shoe') {
        controlsRef.current.target.set(0, 0.32, 0);
      } else if (mode === 'sole') {
        controlsRef.current.target.set(0, 0.08, 0);
      } else {
        controlsRef.current.target.set(0, 0.22, 0);
      }
      controlsRef.current.update();
    }
  }, [mode, shoeModelId, soleVariantId, isLoading]);

  // Real-time material updates on the active Upper
  useEffect(() => {
    if (activeUpperRef.current) {
      applyShoeCustomization(activeUpperRef.current, shoeConfig);
    }
  }, [shoeConfig]);

  // Real-time material updates on the active Sole
  useEffect(() => {
    if (activeSoleRef.current) {
      applySoleCustomization(activeSoleRef.current, soleConfig);
    }
  }, [soleConfig]);

  // Camera presets
  const setCameraView = (preset) => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const targetY = mode === 'shoe' ? 0.32 : mode === 'sole' ? 0.08 : 0.22;
    controls.target.set(0, targetY, 0);

    switch (preset) {
      case 'perspective':
        camera.position.set(1.4, targetY + 0.5, 1.6);
        break;
      case 'side':
        camera.position.set(2.2, targetY + 0.05, 0.0);
        break;
      case 'front':
        camera.position.set(0.0, targetY + 0.15, 2.2);
        break;
      case 'top':
        camera.position.set(0.05, targetY + 2.2, 0.05);
        break;
      case 'bottom':
        // Direct tread inspection angle
        camera.position.set(0.05, targetY - 2.1, 0.05);
        break;
      default:
        break;
    }
    controls.update();
  };

  const handleResetCamera = () => {
    setCameraView('perspective');
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1000 : 1,
        width: '100%',
        height: isFullscreen ? '100vh' : '520px',
        backgroundColor: '#0c1014',
        borderRadius: isFullscreen ? 0 : '20px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid var(--border-dim)',
        boxShadow: 'var(--shadow-heavy)'
      }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(12, 16, 20, 0.94)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(198, 241, 53, 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            INITIALIZING 3D ENGINE & EXTRACTING GEOMETRY...
          </p>
        </div>
      )}

      {/* Top Floating Viewport Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 5
        }}
      >
        {/* Mode & Model Identity Badge */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(12, 16, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary)'
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {mode === 'shoe' && `SHOE: ${SHOE_MODELS.find((m) => m.id === shoeModelId)?.name || 'Shoe Model'}`}
            {mode === 'sole' && 'SOLE CUSTOMIZATION WORKSPACE'}
            {mode === 'assembly' && 'FINAL ASSEMBLED CONFIGURATION'}
          </span>
        </div>

        {/* Viewport Control Actions */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsAutoRotate((prev) => !prev)}
            className={`btn-secondary btn-sm ${isAutoRotate ? 'active' : ''}`}
            title="Toggle 360 Auto-Rotation"
            style={{
              backgroundColor: isAutoRotate ? 'rgba(198, 241, 53, 0.15)' : 'rgba(12, 16, 20, 0.8)',
              borderColor: isAutoRotate ? 'var(--primary)' : 'var(--border-dim)'
            }}
          >
            <RefreshCw size={13} style={{ animation: isAutoRotate ? 'spin 4s linear infinite' : 'none' }} />
            <span className="hide-mobile">Rotate</span>
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="btn-secondary btn-sm"
            title="Reset Camera View"
            style={{ backgroundColor: 'rgba(12, 16, 20, 0.8)' }}
          >
            <RotateCcw size={13} />
            <span className="hide-mobile">Reset</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn-secondary btn-sm"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            style={{ backgroundColor: 'rgba(12, 16, 20, 0.8)' }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Bottom Camera Angle Presets & Assembly Controller */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'none',
          zIndex: 5
        }}
      >
        {/* Camera Angle Selector */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            gap: '4px',
            backgroundColor: 'rgba(12, 16, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-dim)'
          }}
        >
          {['perspective', 'side', 'front', 'top', ...(mode === 'sole' || mode === 'assembly' ? ['bottom'] : [])].map(
            (preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraView(preset)}
                style={{
                  background: cameraPreset === preset ? 'rgba(198, 241, 53, 0.2)' : 'transparent',
                  border: 'none',
                  color: cameraPreset === preset ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {preset === 'bottom' ? 'Tread View' : preset}
              </button>
            )
          )}
        </div>

        {/* Assembly Mode Selector (Only visible in assembly mode) */}
        {mode === 'assembly' && onAssemblyChange && (
          <div
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              gap: '4px',
              backgroundColor: 'rgba(12, 16, 20, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '4px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-dim)'
            }}
          >
            <button
              type="button"
              onClick={() => onAssemblyChange('assembled')}
              style={{
                background: assemblyState === 'assembled' ? 'var(--primary)' : 'transparent',
                color: assemblyState === 'assembled' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Lock size={12} /> Locked
            </button>

            <button
              type="button"
              onClick={() => onAssemblyChange('release')}
              style={{
                background: assemblyState === 'release' ? 'var(--primary)' : 'transparent',
                color: assemblyState === 'release' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Unlock size={12} /> 45° Twist
            </button>

            <button
              type="button"
              onClick={() => onAssemblyChange('detached')}
              style={{
                background: assemblyState === 'detached' ? 'var(--primary)' : 'transparent',
                color: assemblyState === 'detached' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Layers size={12} /> Detached
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, Eye, Sparkles, Layers, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

export default function Hero3DCanvas({ onExploreTech, onCustomize }) {
  const mountRef = useRef(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [accentColor, setAccentColor] = useState('#C6F135');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // References to 3D objects for dynamic animation
  const soleGroupRef = useRef(null);
  const ringRef = useRef(null);
  const shoeGroupRef = useRef(null);
  const targetExplodeRef = useRef(0); // 0 = assembled, 1 = exploded
  const currentExplodeRef = useRef(0);

  // Play synthesized mechanical click sound via Web Audio API
  const playClickSound = (pitch = 440) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.8, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1014, 0.035);

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4.5, 2.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 3.0);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x00f0ff, 1.2, 20);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // Root Shoe Container
    const shoeRoot = new THREE.Group();
    shoeGroupRef.current = shoeRoot;
    scene.add(shoeRoot);

    // 1. Shoe Upper Group
    const upperGroup = new THREE.Group();
    shoeRoot.add(upperGroup);

    // Upper Main Mesh (Aerodynamic sculpted sneaker upper)
    const upperGeo = new THREE.CylinderGeometry(0.72, 1.05, 3.2, 32, 16);
    upperGeo.rotateZ(Math.PI / 2);
    upperGeo.scale(1.15, 0.68, 0.85);

    const upperMat = new THREE.MeshStandardMaterial({
      color: 0x181e24,
      roughness: 0.65,
      metalness: 0.15
    });
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.set(0, 0.65, 0);
    upperMesh.castShadow = true;
    upperGroup.add(upperMesh);

    // Collar & Tongue
    const collarGeo = new THREE.TorusGeometry(0.55, 0.18, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x222a33, roughness: 0.8 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.set(-0.55, 1.2, 0);
    upperGroup.add(collarMesh);

    // Heel Pull Tab with Lime Accent
    const tabGeo = new THREE.BoxGeometry(0.12, 0.45, 0.25);
    const tabMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.35,
      roughness: 0.3
    });
    const tabMesh = new THREE.Mesh(tabGeo, tabMat);
    tabMesh.position.set(-1.45, 1.2, 0);
    tabMesh.rotation.z = -0.25;
    upperGroup.add(tabMesh);

    // Lateral Cage Panel (Ocean Plastic Overlay)
    const cageGeo = new THREE.BoxGeometry(1.6, 0.4, 0.95);
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x242e38, roughness: 0.4, metalness: 0.3 });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    cageMesh.position.set(-0.1, 0.6, 0);
    upperGroup.add(cageMesh);

    // 2. Twist-Lock Interface Plate & Ring (PA66-GF30)
    const ringGroup = new THREE.Group();
    ringRef.current = ringGroup;
    upperGroup.add(ringGroup);

    // Midsole Plate
    const plateGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.16, 32);
    plateGeo.scale(1.9, 1, 0.88);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x12171c,
      roughness: 0.3,
      metalness: 0.4
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.set(0, 0.08, 0);
    ringGroup.add(plateMesh);

    // Concentric Twist-Lock Ring with Teeth
    const ringGeo = new THREE.TorusGeometry(0.68, 0.09, 16, 48);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.7
    });
    const lockRingMesh = new THREE.Mesh(ringGeo, ringMat);
    lockRingMesh.position.set(0, 0.02, 0);
    ringGroup.add(lockRingMesh);

    // 8 Radial Bayonet Locking Teeth
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const toothGeo = new THREE.BoxGeometry(0.12, 0.14, 0.06);
      const toothMesh = new THREE.Mesh(toothGeo, ringMat);
      toothMesh.position.set(Math.cos(angle) * 0.68, -0.02, Math.sin(angle) * 0.68);
      toothMesh.rotation.y = -angle;
      ringGroup.add(toothMesh);
    }

    // 3. Detachable Modular Outsole Sole Assembly
    const soleGroup = new THREE.Group();
    soleGroupRef.current = soleGroup;
    shoeRoot.add(soleGroup);

    // Sole Outsole Bed
    const soleGeo = new THREE.CylinderGeometry(0.88, 0.92, 0.32, 32);
    soleGeo.scale(2.0, 1, 0.92);
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x1e252d,
      roughness: 0.7,
      metalness: 0.1
    });
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.position.set(0, -0.16, 0);
    soleMesh.castShadow = true;
    soleMesh.receiveShadow = true;
    soleGroup.add(soleMesh);

    // Outsole Lugs / Tread Studs (Chevron and Hex Geometry)
    const lugMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      roughness: 0.4,
      metalness: 0.2
    });

    for (let x = -1.4; x <= 1.4; x += 0.42) {
      for (let z = -0.32; z <= 0.32; z += 0.32) {
        const lugGeo = new THREE.BoxGeometry(0.24, 0.1, 0.18);
        const lug = new THREE.Mesh(lugGeo, lugMat);
        lug.position.set(x, -0.34, z);
        lug.rotation.y = (x + z) * 0.5;
        soleGroup.add(lug);
      }
    }

    // Matching Female Detent Lugs on Sole
    const innerRingGeo = new THREE.TorusGeometry(0.68, 0.06, 16, 48);
    innerRingGeo.rotateX(Math.PI / 2);
    const innerRingMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.3 });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.position.set(0, 0.01, 0);
    soleGroup.add(innerRing);

    // Interactive Drag Controls (Mouse & Touch Orbiting)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      shoeRoot.rotation.y += deltaX * 0.012;
      shoeRoot.rotation.x = Math.max(-0.6, Math.min(0.6, shoeRoot.rotation.x + deltaY * 0.008));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(3.5, Math.min(8.5, camera.position.z + e.deltaY * 0.005));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth Exploded Interpolation
      const target = targetExplodeRef.current;
      currentExplodeRef.current += (target - currentExplodeRef.current) * 0.08;
      const t = currentExplodeRef.current;

      if (soleGroupRef.current) {
        // Explode separation downwards
        soleGroupRef.current.position.y = -t * 2.2;
        // Twist 45 degrees when separated
        soleGroupRef.current.rotation.y = t * (Math.PI / 4);
      }

      if (ringRef.current) {
        ringRef.current.position.y = -t * 0.6;
      }

      // Auto rotation if user is not actively dragging
      if (isAutoRotate && !isDragging) {
        shoeRoot.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update target explosion state
  useEffect(() => {
    targetExplodeRef.current = isExploded ? 1 : 0;
    playClickSound(isExploded ? 320 : 580);
  }, [isExploded]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Three.js Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          background: 'radial-gradient(circle at 50% 50%, #151b22 0%, #080b0e 85%)'
        }}
      />

      {/* Top Floating Badge & Status */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none'
        }}
      >
        <span className="eyebrow" style={{ backdropFilter: 'blur(10px)' }}>
          <Sparkles size={13} /> Interactive 3D Digital Twin
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isExploded ? 'var(--signal-amber)' : 'var(--primary)',
              boxShadow: `0 0 12px ${isExploded ? 'var(--signal-amber)' : 'var(--primary)'}`
            }}
          />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            STATUS: {isExploded ? '45° EXPLODED VIEW (DISENGAGED)' : 'LOCKED (10,000+ CYCLE RATED)'}
          </span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'rgba(18, 23, 28, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-light)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)'
        }}
      >
        {/* View Mode Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsExploded(!isExploded)}
            className="btn-primary btn-sm"
            style={{
              backgroundColor: isExploded ? 'var(--signal-amber)' : 'var(--primary)',
              color: '#000'
            }}
          >
            <Layers size={15} />
            {isExploded ? 'Assemble Shoe' : 'Explode Twist-Lock'}
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="btn-secondary btn-sm"
            title="Toggle Continuous Orbit"
          >
            <RotateCw size={14} style={{ transform: isAutoRotate ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
            {isAutoRotate ? 'Spinning' : 'Static'}
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary btn-sm"
            title="Toggle Mechanical Audio"
          >
            {soundEnabled ? <Volume2 size={14} color="var(--primary)" /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Quick Spec Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'none', mdDisplay: 'inline' }}>
            DRAG TO ORBIT · SCROLL TO ZOOM
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            PA66-GF30 INTERFACE
          </span>
        </div>
      </div>
    </div>
  );
}

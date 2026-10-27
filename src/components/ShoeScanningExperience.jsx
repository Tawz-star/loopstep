import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Camera, Upload, Store, CheckCircle, RefreshCcw, AlertCircle, ArrowRight, Scan, ShieldCheck, Ruler, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ShoeScanningExperience({ onProceedToCustomizer }) {
  const { setActiveTab } = useStore();
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera', 'upload', 'instore'
  const [currentStep, setCurrentStep] = useState(1); // 1: Method, 2: Capture, 3: 3D Preview & Measurement, 4: Compatibility
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  // Calibrated measurements
  const [footLength, setFootLength] = useState(265); // mm
  const [footBreadth, setFootBreadth] = useState(98); // mm
  const [archType, setArchType] = useState('neutral'); // 'low', 'neutral', 'high'
  const [calibrationMode, setCalibrationMode] = useState('A4 Paper Reference');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvas3DRef = useRef(null);

  // Initialize camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError('Camera access declined or unsupported on this device. You can easily upload a photo or use manual measurements below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    stopCamera();
    setCurrentStep(3);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setCurrentStep(3);
      };
      reader.readAsDataURL(file);
    }
  };

  // Three.js Point Cloud & 3D Footprint Mesh Generator
  useEffect(() => {
    if (currentStep !== 3 || !canvas3DRef.current) return;
    const container = canvas3DRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1014, 0.04);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 3.2, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Create 3D Point Cloud Representation of Foot & Sole Profile
    const pointCount = 1800;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    const lengthRatio = footLength / 265;
    const breadthRatio = footBreadth / 98;

    for (let i = 0; i < pointCount; i++) {
      // Anatomical foot profile parametrization
      const u = Math.random() * 2 - 1; // -1 to 1 (lengthwise)
      const v = Math.random() * 2 - 1; // widthwise

      // Shape ellipse taper to mimic human foot footprint
      const taper = 0.5 + 0.5 * (1 - (u + 0.3) * (u + 0.3));
      if (v * v + (u * 1.3) * (u * 1.3) < 1.05 * taper) {
        const x = v * 0.72 * breadthRatio;
        const z = u * 1.45 * lengthRatio;
        // Arch height elevation
        let y = 0.05 * Math.sin(u * Math.PI) * (archType === 'high' ? 2.2 : archType === 'low' ? 0.6 : 1.2);
        if (x > 0 && u > -0.2 && u < 0.4) {
          y += 0.15; // Medial arch elevation
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color gradient from heel to toe with lime accents
        colors[i * 3] = 0.78; // R
        colors[i * 3 + 1] = 0.94; // G (Lime primary)
        colors[i * 3 + 2] = 0.21; // B
      }
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointCloud);

    // Subtle Grid Floor
    const gridHelper = new THREE.GridHelper(3.5, 20, 0x1f2937, 0x111827);
    gridHelper.position.y = -0.15;
    scene.add(gridHelper);

    // Orbit Animation
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      pointCloud.rotation.y += 0.007;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [currentStep, footLength, footBreadth, archType]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const calculateSize = () => {
    const size = Math.round(33 + footLength / 6.67);
    return Math.max(38, Math.min(46, size));
  };

  return (
    <section id="scan" style={{ padding: '90px 0', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="eyebrow">
            <Scan size={13} /> Optical Fitment Architecture
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            SCAN YOUR SHOE. <span className="text-signal">DISCOVER YOUR FIT.</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            LoopStep’s optical fitment engine identifies shoe geometry, estimates anatomical arch distribution, and verifies compatibility with our twist-lock modular interface or ReFit conversion adapter.
          </p>
        </div>

        {/* Workflow Steps Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { id: 1, label: 'Choose Method' },
            { id: 2, label: 'Capture & Guidance' },
            { id: 3, label: '3D Preview & Specs' },
            { id: 4, label: 'Compatibility & Order' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStep(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: currentStep === s.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                color: currentStep === s.id ? '#000' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: `1px solid ${currentStep === s.id ? 'var(--primary)' : 'var(--border-dim)'}`,
                transition: '0.2s'
              }}
            >
              <span>0{s.id}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* STEP 1: METHOD SELECTION */}
        {currentStep === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div
              className={`surface-panel ${scanMethod === 'camera' ? 'interactive' : ''}`}
              style={{
                padding: '32px',
                textAlign: 'center',
                border: scanMethod === 'camera' ? '2px solid var(--primary)' : '1px solid var(--border-dim)',
                cursor: 'pointer'
              }}
              onClick={() => setScanMethod('camera')}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                <Camera size={28} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Smartphone / Webcam Scan</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.5 }}>
                Real-time browser camera guidance with multi-angle alignment stencils (side, heel, outsole tread).
              </p>
              <button
                type="button"
                onClick={() => {
                  setScanMethod('camera');
                  setCurrentStep(2);
                  startCamera();
                }}
                className="btn-primary"
                style={{ marginTop: '24px', width: '100%' }}
              >
                Launch Camera Guidance
              </button>
            </div>

            <div
              className={`surface-panel ${scanMethod === 'upload' ? 'interactive' : ''}`}
              style={{
                padding: '32px',
                textAlign: 'center',
                border: scanMethod === 'upload' ? '2px solid var(--primary)' : '1px solid var(--border-dim)',
                cursor: 'pointer'
              }}
              onClick={() => setScanMethod('upload')}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0, 240, 255, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                <Upload size={28} color="var(--signal-cyan)" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Upload Reference Photos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.5 }}>
                Drop a top-down photograph with your foot on an A4 sheet. Our algorithm uses the standard paper edge for scale calibration.
              </p>
              <label
                className="btn-secondary"
                style={{ marginTop: '24px', width: '100%', cursor: 'pointer', display: 'flex' }}
              >
                Choose Photo File
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            <div
              className={`surface-panel ${scanMethod === 'instore' ? 'interactive' : ''}`}
              style={{
                padding: '32px',
                textAlign: 'center',
                border: scanMethod === 'instore' ? '2px solid var(--primary)' : '1px solid var(--border-dim)',
                cursor: 'pointer'
              }}
              onClick={() => setScanMethod('instore')}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(231, 169, 59, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                <Store size={28} color="var(--signal-amber)" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>In-Store Optical Kiosk</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.5 }}>
                Visit our retail partner kiosks for millimeter-calibrated optical turntable scans and immediate sole fitting.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFootLength(270);
                  setFootBreadth(102);
                  setArchType('neutral');
                  setCalibrationMode('Retail Kiosk Turntable (Calibrated)');
                  setCurrentStep(3);
                }}
                className="btn-secondary"
                style={{ marginTop: '24px', width: '100%' }}
              >
                Simulate Kiosk Fitment
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CAMERA CAPTURE / GUIDANCE */}
        {currentStep === 2 && (
          <div className="surface-panel" style={{ maxWidth: '820px', margin: '0 auto', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span className="badge-outline">GUIDED OPTICAL VIEW</span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '6px' }}>Align Foot on Flat Surface</h3>
              </div>
              <button type="button" onClick={() => { stopCamera(); setCurrentStep(1); }} className="btn-secondary btn-sm">
                Change Method
              </button>
            </div>

            {/* Video Viewport with Overlay */}
            <div
              style={{
                position: 'relative',
                height: '420px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0a0e12',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cameraError ? (
                <div style={{ textAlign: 'center', padding: '30px', maxWidth: '480px' }}>
                  <AlertCircle size={36} color="var(--signal-amber)" style={{ margin: '0 auto 14px' }} />
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '14px' }}>{cameraError}</p>
                  <label className="btn-primary" style={{ cursor: 'pointer' }}>
                    Upload Photo Instead
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Optical Targeting Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '40px',
                      border: '2px dashed rgba(198, 241, 53, 0.6)',
                      borderRadius: 'var(--radius-md)',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.65)', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)' }}>
                        PLACE HEEL AT BOTTOM NOTCH · TOE AT APEX
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Capture Controls */}
            {cameraActive && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={captureSnapshot} className="btn-primary" style={{ padding: '14px 32px' }}>
                  <Camera size={18} /> Capture Alignment & Analyze
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: 3D PREVIEW & MEASUREMENT REVIEW */}
        {currentStep === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1100px', margin: '0 auto' }}>
            {/* 3D Point Cloud Viewport */}
            <div className="surface-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="eyebrow">Interactive Digital Sole Reconstruction</span>
                <span className="badge-outline">ROTATING MESH</span>
              </div>

              <div
                ref={canvas3DRef}
                style={{
                  width: '100%',
                  height: '380px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle at 50% 50%, #151b22 0%, #090c0f 90%)'
                }}
              />

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>CALIBRATION: {calibrationMode}</span>
                <span style={{ color: 'var(--primary)' }}>ESTIMATED RESOLUTION: ±1.8 mm</span>
              </div>
            </div>

            {/* Measurements & Custom Adjustments */}
            <div className="surface-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="eyebrow">Optical Analysis Report</span>
                <h3 style={{ fontSize: '1.6rem', marginTop: '10px' }}>Calibrated Foot Profile</h3>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Foot Length Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                      <span>Foot Length:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{footLength} mm</span>
                    </div>
                    <input
                      type="range"
                      min={240}
                      max={295}
                      value={footLength}
                      onChange={(e) => setFootLength(Number(e.target.value))}
                      style={{ marginTop: '8px', accentColor: 'var(--primary)' }}
                    />
                  </div>

                  {/* Foot Breadth Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                      <span>Foot Breadth (Forefoot):</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{footBreadth} mm</span>
                    </div>
                    <input
                      type="range"
                      min={85}
                      max={115}
                      value={footBreadth}
                      onChange={(e) => setFootBreadth(Number(e.target.value))}
                      style={{ marginTop: '8px', accentColor: 'var(--primary)' }}
                    />
                  </div>

                  {/* Arch Type Selection */}
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Arch Distribution:</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                      {['low', 'neutral', 'high'].map((arch) => (
                        <button
                          key={arch}
                          type="button"
                          onClick={() => setArchType(arch)}
                          style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${archType === arch ? 'var(--primary)' : 'var(--border-dim)'}`,
                            backgroundColor: archType === arch ? 'rgba(198, 241, 53, 0.15)' : 'transparent',
                            color: archType === arch ? 'var(--primary)' : 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        >
                          {arch} Arch
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendation Summary */}
                <div style={{ marginTop: '24px', padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <strong>Recommended Size:</strong> EU {calculateSize()} (Standard D-Width)
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Geometry mapped to standard PA66-GF30 twist-lock ring tolerance.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Verify Compatibility <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary"
                  title="Restart Scan"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: COMPATIBILITY RESULT & CUSTOMIZER HAND-OFF */}
        {currentStep === 4 && (
          <div className="surface-panel" style={{ maxWidth: '820px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 102, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color="var(--signal-green)" />
            </div>

            <span className="eyebrow" style={{ borderColor: 'var(--signal-green)', color: 'var(--signal-green)' }}>
              Optical Compatibility Verified
            </span>

            <h3 style={{ fontSize: '2rem', marginTop: '16px' }}>Ready for Modular Sole Engagement</h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '600px', margin: '14px auto 0', lineHeight: 1.6 }}>
              Your scanned footprint (EU {calculateSize()}, {footLength} mm length, {archType} arch) is fully compatible with our standard PA66-GF30 twist-lock soles. If using an existing shoe brand, the ReFit Universal Adapter will bond seamlessly.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
              <button
                type="button"
                onClick={() => {
                  if (onProceedToCustomizer) onProceedToCustomizer({ size: calculateSize(), arch: archType });
                  else setActiveTab('customize');
                }}
                className="btn-primary"
              >
                Proceed to Custom Sole Studio <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('refit')}
                className="btn-secondary"
              >
                Learn About ReFit Adapter (₹50)
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

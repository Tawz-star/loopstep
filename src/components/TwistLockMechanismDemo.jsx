import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  Cog,
  Layers,
  Cpu,
  Info,
  Maximize2
} from 'lucide-react';
import TwistLock3DViewer, { MECHANISM_COMPONENTS } from './three/TwistLock3DViewer';

const STEPS = [
  {
    step: 1,
    title: 'Choose Your Sole',
    subtitle: 'Terrain-specific modular replacement',
    description: 'Select your sole based on your scheduled activity: Standard (8mm) for city commutes, Sports (12mm) for running, or Trail (15mm) for backcountry trekking.',
    technicalDetail: 'All editions share the standardized PA66-GF30 twist-lock ring standard, ensuring universal cross-compatibility across all LoopStep models.',
    angle: 0,
    statusText: 'Engaged & Ready'
  },
  {
    step: 2,
    title: 'Twist to Release',
    subtitle: '45-Degree manual counter-clockwise rotation',
    description: 'Grip the outsole heel and rotate 45 degrees counter-clockwise. The bayonet lugs slide out from underneath the retention shoulders with zero mechanical resistance.',
    technicalDetail: 'The dual-retention detent requires an intentional 2.4 Nm rotational torque break-away force, preventing any accidental unlock during aggressive lateral athletic cuts.',
    angle: -45,
    statusText: 'Disengaging Detent'
  },
  {
    step: 3,
    title: 'Remove the Worn Sole',
    subtitle: 'Zero adhesive, zero residue separation',
    description: 'Pull the sole away from the shoe upper. The midsole interface stays completely dry and pristine—no glue breakdown, no heating, no tools required.',
    technicalDetail: 'Sealed perimeter elastomer gasket prevents ingress of fine dust, street water, or mud into the bayonet teeth channels during use.',
    angle: -45,
    statusText: 'Interface Exposed'
  },
  {
    step: 4,
    title: 'Align the Replacement',
    subtitle: 'Index marker and radial tooth registration',
    description: 'Position your new sole against the shoe base. The recessed alignment notch guides the 4 radial bayonet teeth directly into their receiving slots effortlessly.',
    technicalDetail: 'PA66-GF30 exhibits exceptional tensile strength (170-200 MPa) and impact resistance, maintaining microscopic tolerances through thousands of swaps.',
    angle: -45,
    statusText: 'Teeth Registered'
  },
  {
    step: 5,
    title: 'Twist & Lock',
    subtitle: '45-Degree clockwise engagement with tactile click',
    description: 'Rotate the new sole 45 degrees clockwise. The sprung detents snap shut with an audible, satisfying mechanical click confirming full positive engagement.',
    technicalDetail: 'Tested safe vertical & shear load capacity reaches 7,000 N (~713 kgf), with design ultimate capacity calculated at 8,000–10,000 N.',
    angle: 0,
    statusText: 'Positive Lock Confirmed'
  },
  {
    step: 6,
    title: 'Ready for the Next Journey',
    subtitle: 'Footwear transformed in under 10 seconds',
    description: 'Your shoe is completely renewed. The upper you already broke in stays on your foot; only the contact rubber has changed. Step forward and repeat.',
    technicalDetail: 'Design cycle rating exceeds 10,000+ lock/unlock cycles without measurable retention degradation. 100% recyclable worn sole return.',
    angle: 0,
    statusText: 'System Active'
  }
];

export default function TwistLockMechanismDemo() {
  const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'engineering'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCompId, setSelectedCompId] = useState('twist_ring');

  const step = STEPS[currentStepIndex];
  const activeComponent = MECHANISM_COMPONENTS.find((c) => c.id === selectedCompId) || MECHANISM_COMPONENTS[2];

  // Synthesized mechanical audio click via Web Audio API
  const playClick = (freq = 520) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch {
      // Audio unsupported or user hasn't interacted
    }
  };

  // Auto-play timer for Normal mode
  useEffect(() => {
    let timer;
    if (isPlaying && viewMode === 'normal') {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = (prev + 1) % STEPS.length;
          playClick(next === 4 ? 680 : 420);
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, viewMode]);

  const handleNext = () => {
    const next = Math.min(STEPS.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(next);
    playClick(next === 4 ? 680 : 440);
  };

  const handlePrev = () => {
    const prev = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(prev);
    playClick(380);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    playClick(400);
  };

  return (
    <section id="technology" style={{ padding: '90px 0', borderTop: '1px solid var(--border-dim)', background: 'var(--bg-base)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            <Cog size={13} /> The Signature Innovation
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '16px', lineHeight: 1.1 }}>
            TWIST. RELEASE. <span className="text-signal">REPLACE. REPEAT.</span>
          </h2>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A modular mechanical sole interface engineered to decouple footwear wear from footwear replacement. Pure precision industrial engineering with DuPont Zytel PA66-GF30.
          </p>

          {/* Mode Switcher Buttons */}
          <div
            style={{
              display: 'inline-flex',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-dim)',
              gap: '6px',
              marginTop: '28px'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setViewMode('normal');
                playClick(480);
              }}
              style={{
                background: viewMode === 'normal' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'normal' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={15} /> Normal Mode (Assembled)
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('engineering');
                setIsPlaying(false);
                playClick(580);
              }}
              style={{
                background: viewMode === 'engineering' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'engineering' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Layers size={15} /> Engineering Mode (Exploded CAD)
            </button>
          </div>
        </div>

        {/* Interactive 3D Stage & Spec Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}
        >
          {/* LEFT: Live 3D Mechanism Viewport */}
          <div
            className="surface-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-dim)'
            }}
          >
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: viewMode === 'engineering' ? 'var(--signal-cyan)' : 'var(--primary)',
                    boxShadow: '0 0 12px currentColor'
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {viewMode === 'engineering'
                    ? `COMPONENT: ${activeComponent.name.toUpperCase()}`
                    : `STAGE 0${step.step}: ${step.statusText.toUpperCase()}`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: soundEnabled ? 'var(--primary)' : 'var(--text-dim)',
                  cursor: 'pointer'
                }}
                title={soundEnabled ? 'Mute Mechanical Audio' : 'Enable Mechanical Audio'}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            {/* 3D Canvas */}
            <TwistLock3DViewer
              viewMode={viewMode}
              selectedComponentId={selectedCompId}
              onSelectComponent={setSelectedCompId}
              currentStepIndex={currentStepIndex}
            />

            {/* Normal Mode Controls */}
            {viewMode === 'normal' && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="btn-primary btn-sm"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause Demo' : 'Auto Play Twist'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentStepIndex === 0}
                      className="btn-secondary btn-sm"
                      style={{ opacity: currentStepIndex === 0 ? 0.4 : 1 }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentStepIndex === STEPS.length - 1}
                      className="btn-secondary btn-sm"
                      style={{ opacity: currentStepIndex === STEPS.length - 1 ? 0.4 : 1 }}
                    >
                      Next <ChevronRight size={16} />
                    </button>

                    <button type="button" onClick={handleReset} className="btn-secondary btn-sm" title="Reset">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-dim)', borderRadius: '2px', marginTop: '16px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
                      backgroundColor: 'var(--primary)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Engineering Callouts & Component Inspector */}
          <div
            className="surface-panel"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-dim)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {viewMode === 'normal' ? (
              /* Normal Step Details */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="badge-outline" style={{ fontSize: '0.75rem' }}>
                    STEP 0{step.step} OF 06
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    ROTATION: {Math.abs(step.angle)}°
                  </span>
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 4px', lineHeight: 1.2 }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '14px' }}>
                  {step.subtitle}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {step.description}
                </p>

                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(198, 241, 53, 0.05)',
                    border: '1px solid rgba(198, 241, 53, 0.2)',
                    fontSize: '0.86rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5
                  }}
                >
                  <strong style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <ShieldCheck size={16} color="var(--primary)" /> Engineering Note:
                  </strong>
                  {step.technicalDetail}
                </div>

                <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {STEPS.map((s, idx) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        playClick(idx === 4 ? 680 : 440);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: idx === currentStepIndex ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        border: '1px solid',
                        borderColor: idx === currentStepIndex ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', color: idx === currentStepIndex ? '#fff' : 'var(--text-muted)', fontWeight: idx === currentStepIndex ? 700 : 500 }}>
                        0{s.step}. {s.title}
                      </span>
                      {idx === currentStepIndex && <CheckCircle2 size={16} color="var(--primary)" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Engineering Exploded Component Inspector */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span className="eyebrow">
                    <Cpu size={13} /> COMPONENT ANATOMY INSPECTOR
                  </span>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px' }}>
                  {activeComponent.name}
                </h3>
                <span className="badge-outline" style={{ display: 'inline-block', marginBottom: '16px' }}>
                  {activeComponent.category}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                      Material Composition
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px', display: 'block' }}>
                      {activeComponent.material}
                    </strong>
                  </div>

                  <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                      Tensile & Shear Resistance
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--signal-green)', marginTop: '2px', display: 'block' }}>
                      {activeComponent.tensileRating}
                    </strong>
                  </div>

                  <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                      Functional Purpose
                    </span>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px', margin: 0 }}>
                      {activeComponent.purpose}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '18px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px', display: 'block' }}>
                    Select Component to Inspect in 3D:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                    {MECHANISM_COMPONENTS.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          setSelectedCompId(comp.id);
                          playClick(620);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          backgroundColor: comp.id === selectedCompId ? 'rgba(198, 241, 53, 0.12)' : 'rgba(255,255,255,0.02)',
                          border: '1px solid',
                          borderColor: comp.id === selectedCompId ? 'var(--primary)' : 'var(--border-dim)',
                          color: comp.id === selectedCompId ? 'var(--primary)' : 'var(--text-muted)',
                          fontSize: '0.82rem',
                          fontWeight: comp.id === selectedCompId ? 700 : 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{comp.name}</span>
                        {comp.id === selectedCompId && <CheckCircle2 size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

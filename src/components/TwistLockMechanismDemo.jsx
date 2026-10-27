import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Volume2, VolumeX, ShieldCheck, CheckCircle2, Cog, ArrowRightLeft } from 'lucide-react';
import { SOLE_EDITIONS } from '../data/mockData';

const STEPS = [
  {
    step: 1,
    title: 'Choose Your Sole',
    subtitle: 'Terrain-specific modular replacement',
    description: 'Select your sole based on your scheduled activity: Standard (8mm) for city commutes, Sports (12mm) for running, or Trail (15mm) for backcountry trekking.',
    technicalDetail: 'All editions share the standardized PA66-GF30 twist-lock ring standard, ensuring universal cross-compatibility across all LoopStep models.',
    angle: 0,
    separation: 0,
    statusText: 'Engaged & Ready'
  },
  {
    step: 2,
    title: 'Twist to Release',
    subtitle: '45-Degree manual counter-clockwise rotation',
    description: 'Grip the outsole heel and rotate 45 degrees counter-clockwise. The bayonet lugs slide out from underneath the retention shoulders with zero mechanical resistance.',
    technicalDetail: 'The dual-retention detent requires an intentional 2.4 Nm rotational torque break-away force, preventing any accidental unlock during aggressive lateral athletic cuts.',
    angle: -45,
    separation: 0.1,
    statusText: 'Disengaging Detent'
  },
  {
    step: 3,
    title: 'Remove the Worn Sole',
    subtitle: 'Zero adhesive, zero residue separation',
    description: 'Pull the sole away from the shoe upper. The midsole interface stays completely dry and pristine—no glue breakdown, no heating, no tools required.',
    technicalDetail: 'Sealed perimeter elastomer gasket prevents ingress of fine dust, street water, or mud into the bayonet teeth channels during use.',
    angle: -45,
    separation: 1.0,
    statusText: 'Interface Exposed'
  },
  {
    step: 4,
    title: 'Align the Replacement',
    subtitle: 'Index marker and radial tooth registration',
    description: 'Position your new sole against the shoe base. The recessed alignment notch guides the 8 radial teeth directly into their receiving slots effortlessly.',
    technicalDetail: 'PA66-GF30 exhibits exceptional tensile strength (170-200 MPa) and impact resistance, maintaining microscopic tolerances through thousands of swaps.',
    angle: -45,
    separation: 0.35,
    statusText: 'Teeth Registered'
  },
  {
    step: 5,
    title: 'Twist & Lock',
    subtitle: '45-Degree clockwise engagement with tactile click',
    description: 'Rotate the new sole 45 degrees clockwise. The sprung detents snap shut with an audible, satisfying mechanical click confirming full positive engagement.',
    technicalDetail: 'Tested safe vertical & shear load capacity reaches 7,000 N (~713 kgf), with design ultimate capacity calculated at 8,000–10,000 N.',
    angle: 0,
    separation: 0,
    statusText: 'Positive Lock Confirmed'
  },
  {
    step: 6,
    title: 'Ready for the Next Journey',
    subtitle: 'Footwear transformed in under 10 seconds',
    description: 'Your shoe is completely renewed. The upper you already broke in stays on your foot; only the contact rubber has changed. Step forward and repeat.',
    technicalDetail: 'Design cycle rating exceeds 10,000+ lock/unlock cycles without measurable retention degradation. 100% recyclable worn sole return.',
    angle: 0,
    separation: 0,
    statusText: 'System Active'
  }
];

export default function TwistLockMechanismDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState(SOLE_EDITIONS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const step = STEPS[currentStepIndex];

  // Play mechanical audio click
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

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = (prev + 1) % STEPS.length;
          playClick(next === 4 ? 680 : 420);
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

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
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
          <span className="eyebrow">
            <Cog size={13} /> The Signature Innovation
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '16px', lineHeight: 1.1 }}>
            TWIST. RELEASE. <span className="text-signal">REPLACE. REPEAT.</span>
          </h2>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A modular mechanical sole interface engineered to decouple footwear wear from footwear replacement. No electronics, no batteries, no adhesives — just precision industrial mechanical engineering.
          </p>
        </div>

        {/* Main Interactive Stage */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}
        >
          {/* Visual Interactive Mechanism Renderer */}
          <div
            className="surface-panel"
            style={{
              padding: '36px',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 40%, #17212a 0%, #0d1217 90%)'
            }}
          >
            {/* Top Status Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: currentStepIndex === 4 ? 'var(--signal-green)' : currentStepIndex >= 2 ? 'var(--signal-amber)' : 'var(--primary)',
                    boxShadow: '0 0 12px currentColor'
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  STAGE 0{step.step}: {step.statusText.toUpperCase()}
                </span>
              </div>
              <span className="badge-outline">
                {step.angle === 0 ? 'ROTATION: 0° (LOCKED)' : `ROTATION: ${Math.abs(step.angle)}° COUNTER-CLOCKWISE`}
              </span>
            </div>

            {/* Visual SVG & Layer Animation */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '40px 0',
                position: 'relative',
                height: '260px'
              }}
            >
              {/* Upper Shoe Representation */}
              <div
                style={{
                  width: '260px',
                  height: '75px',
                  borderRadius: '40px 40px 10px 10px',
                  background: 'linear-gradient(180deg, #242f3a 0%, #182028 100%)',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.4s ease'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  LOOPSTEP UPPER (RECYCLED KNIT)
                </span>

                {/* PA66 Twist-Lock Ring Layer */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '180px',
                    height: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#12181f',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 0 16px rgba(198, 241, 53, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '0 8px'
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: '6px',
                        height: '10px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Exploded Air Gap Indicator */}
              {step.separation > 0 && (
                <div
                  style={{
                    margin: `${step.separation * 35}px 0`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--signal-amber)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <ArrowRightLeft size={13} style={{ transform: 'rotate(90deg)' }} />
                  <span>DISENGAGED GAP · {Math.round(step.separation * 45)} mm</span>
                </div>
              )}

              {/* Modular Outsole Layer */}
              <div
                style={{
                  width: '280px',
                  height: '55px',
                  borderRadius: '12px 12px 35px 35px',
                  background: `linear-gradient(180deg, ${selectedEdition.defaultColor} 0%, #0d1114 100%)`,
                  border: `2px solid ${step.angle === 0 ? 'var(--primary)' : 'var(--signal-amber)'}`,
                  boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginTop: step.separation > 0 ? '0' : '16px',
                  transform: `rotate(${step.angle}deg)`,
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                    {selectedEdition.name.toUpperCase()}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--primary)' }}>
                    {selectedEdition.thickness} · ₹{selectedEdition.price}
                  </p>
                </div>

                {/* Audible Click Wave Marker */}
                {currentStepIndex === 4 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-8px',
                      borderRadius: '16px',
                      border: '2px solid var(--signal-green)',
                      animation: 'pulseGlow 1.5s infinite'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Bottom Mechanism Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                borderTop: '1px solid var(--border-dim)',
                paddingTop: '20px',
                zIndex: 2
              }}
            >
              {/* Play / Step Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? 'Pause Demo' : 'Play Sequence'}
                </button>

                <button type="button" onClick={handlePrev} disabled={currentStepIndex === 0} className="btn-secondary btn-sm">
                  <ChevronLeft size={16} />
                </button>

                <button type="button" onClick={handleNext} disabled={currentStepIndex === STEPS.length - 1} className="btn-secondary btn-sm">
                  <ChevronRight size={16} />
                </button>

                <button type="button" onClick={handleReset} className="btn-secondary btn-sm" title="Reset Demo">
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="btn-secondary btn-sm"
                title="Toggle Audio Feedback"
              >
                {soundEnabled ? <Volume2 size={14} color="var(--primary)" /> : <VolumeX size={14} />}
                <span>{soundEnabled ? 'Click Audio On' : 'Muted'}</span>
              </button>
            </div>
          </div>

          {/* Step Narrative & Technical Engineering Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step Progress Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    playClick(idx === 4 ? 680 : 440);
                  }}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: idx === currentStepIndex ? 'var(--primary)' : idx < currentStepIndex ? 'var(--signal-green)' : 'var(--border-light)',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Step 0${s.step}: ${s.title}`}
                />
              ))}
            </div>

            {/* Current Step Description Card */}
            <div className="surface-panel" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                  STEP 0{step.step} OF 06
                </span>
                <span className="badge-outline">MECHANICAL LOCK</span>
              </div>

              <h3 style={{ fontSize: '1.6rem', marginTop: '10px' }}>{step.title}</h3>
              <p style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>
                {step.subtitle}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '12px' }}>
                {step.description}
              </p>

              {/* Engineering Annotation Box */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(198, 241, 53, 0.05)',
                  border: '1px solid rgba(198, 241, 53, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
                    ENGINEERING SPECIFICATION
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.5 }}>
                    {step.technicalDetail}
                  </p>
                </div>
              </div>
            </div>

            {/* Sole Edition Switcher */}
            <div className="surface-panel" style={{ padding: '24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Test Swapping Sole Editions:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                {SOLE_EDITIONS.map((ed) => (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => {
                      setSelectedEdition(ed);
                      playClick(500);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${selectedEdition.id === ed.id ? 'var(--primary)' : 'var(--border-dim)'}`,
                      backgroundColor: selectedEdition.id === ed.id ? 'rgba(198, 241, 53, 0.08)' : 'transparent',
                      textAlign: 'left',
                      transition: '0.2s'
                    }}
                  >
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedEdition.id === ed.id ? 'var(--primary)' : 'var(--text-main)' }}>
                      {ed.name.split(' ')[0]}
                    </p>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
                      ₹{ed.price} · {ed.thickness}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

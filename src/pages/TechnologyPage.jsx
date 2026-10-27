import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, ShieldCheck, Cpu, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import TwistLockMechanismDemo from '../components/TwistLockMechanismDemo';
import MaterialsEngineering from '../components/MaterialsEngineering';

export default function TechnologyPage() {
  return (
    <div style={{ paddingBottom: '90px' }}>
      {/* 1. TECHNOLOGY HERO */}
      <section
        className="deep-glow grid-etch"
        style={{
          padding: '60px 0 70px',
          borderBottom: '1px solid var(--border-dim)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            <Cpu size={13} /> MECHANICAL ENGINEERING & PATENTS
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: '12px',
              letterSpacing: '-0.02em'
            }}
          >
            The Twist-Lock Mechanism
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              marginTop: '18px',
              lineHeight: 1.6
            }}
          >
            A high-strength bayonet interface engineered with 30% glass-fiber reinforced Nylon PA66 and spring-loaded stainless steel detents. No glue. No tools. Locked in under 10 seconds.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '28px' }}>
            <Link to="/sole-studio" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Sliders size={16} /> Test in 3D Sole Studio
            </Link>
            <Link to="/refit" className="btn-secondary" style={{ padding: '12px 22px' }}>
              See ReFit™ Conversion Adapter <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 6-STEP TWIST-AND-REPLACE DEMO */}
      <TwistLockMechanismDemo />

      {/* 3. EXPLODED LOCKING INTERFACE SPECIFICATION */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              <Layers size={13} /> STRUCTURAL ANATOMY
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px' }}>
              Locking Interface Engineering
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
              Four radial bayonet lugs engage in a tapered track with tactile acoustic feedback at 45 degrees.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}
          >
            <div
              className="card-interactive"
              style={{
                padding: '28px',
                borderRadius: '20px',
                border: '1px solid var(--border-dim)'
              }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: '14px' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px' }}>
                1,200 N Retention Force
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Under dynamic athletic sprint testing and lateral shear loads, the twist-lock exceeds ISO 20344 footwear adhesion safety thresholds without slippage.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--primary)" /> 4-lug self-centering bayonet layout
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--primary)" /> Dual ball detents for positive lock click
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--primary)" /> Tapered ramp for zero lateral play
                </li>
              </ul>
            </div>

            <div
              className="card-interactive"
              style={{
                padding: '28px',
                borderRadius: '20px',
                border: '1px solid var(--border-dim)'
              }}
            >
              <div style={{ color: 'var(--signal-green)', marginBottom: '14px' }}>
                <RefreshCw size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px' }}>
                10,000+ Cycles Durability
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Injection-molded DuPont Zytel PA66 reinforced with glass fiber offers near-zero creep and exceptional fatigue life through rain, mud, and sub-zero temperatures.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--signal-green)" /> Self-lubricating polymer interface
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--signal-green)" /> IP67 sand and mud ingress seal
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--signal-green)" /> Operates from -20°C to +60°C
                </li>
              </ul>
            </div>

            <div
              className="card-interactive"
              style={{
                padding: '28px',
                borderRadius: '20px',
                border: '1px solid var(--border-dim)'
              }}
            >
              <div style={{ color: 'var(--signal-blue)', marginBottom: '14px' }}>
                <Layers size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px' }}>
                Flush Strobel Integration
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                The upper receiver plate sits flush with the Strobel stitch line, preserving natural foot roll, arch flexibility, and cushioning ergonomics.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--signal-blue)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--signal-blue)" /> Lightweight 42g adapter footprint
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--signal-blue)" /> Anatomical heel-to-toe flex channels
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--signal-blue)" /> 100% recyclable mono-material structure
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MATERIALS & ENGINEERING SPECIFICATIONS */}
      <MaterialsEngineering />
    </div>
  );
}

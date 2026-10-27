import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, CheckCircle2, AlertTriangle, ArrowRight, Sliders, ShieldCheck, ShoppingBag } from 'lucide-react';
import ReFitUniversalSection from '../components/ReFitUniversalSection';

export default function ReFitPage() {
  return (
    <div style={{ paddingBottom: '90px' }}>
      {/* 1. HERO BANNER */}
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
            <Wrench size={13} /> CIRCULAR CONVERSION SYSTEM
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
            ReFit™ Retrofit Adapter
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              marginTop: '18px',
              lineHeight: 1.6
            }}
          >
            Convert your existing Nike, Adidas, Converse, or Vans sneakers into modular LoopStep shoes. Bond our reinforced PA66 receiver plate to your shoe’s Strobel board and unlock interchangeable soles forever.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '28px' }}>
            <Link to="/3d-scan" className="btn-primary" style={{ padding: '12px 24px' }}>
              Check Shoe Compatibility <ArrowRight size={15} />
            </Link>
            <Link to="/sole-studio" className="btn-secondary" style={{ padding: '12px 22px' }}>
              <Sliders size={16} /> Customize a Sole First
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN REFIT UNIVERSAL SECTION (Search, Blueprints, Pricing) */}
      <ReFitUniversalSection />

      {/* 3. TRANSPARENT COMPATIBILITY VALIDATION DISCLAIMER */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={24} color="var(--signal-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--signal-amber)', margin: '0 0 6px' }}>
                Engineering Compatibility Notice
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                LoopStep does not claim universal compatibility without prior geometric validation. The ReFit™ adapter requires a cupsole or flat strobel construction with at least 8.5 cm width at the ball of the foot and 6.0 cm at the heel. Ultra-curved sprint spikes, zero-drop barefoot shoes with paper-thin outsoles, and extreme wedge platforms are not supported. Scan your shoe or review our verified brand database before ordering.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

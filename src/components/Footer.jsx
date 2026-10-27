import React from 'react';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { setActiveTab } = useStore();

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    const elem = document.getElementById(tabId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ borderTop: '1px solid var(--border-dim)', backgroundColor: 'var(--bg-dark)', padding: '70px 0 30px' }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/loopstep-logo.svg" alt="LoopStep Logo" style={{ width: '36px', height: '36px' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>
                LOOP<span style={{ color: 'var(--primary)' }}>STEP</span>
              </span>
            </div>

            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', lineHeight: 1.6 }}>
              “Step Forward. Replace. Repeat.” A mechanical twist-lock modular footwear system engineered to separate component wear from shoe replacement.
            </p>

            {/* SDG Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
              <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                SDG 12 · RESPONSIBLE CONSUMPTION
              </span>
              <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                SDG 13 · CLIMATE ACTION
              </span>
              <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                SDG 8 · DECENT WORK
              </span>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Shop & Configure
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>
                <button type="button" onClick={() => handleNav('shoes')} style={{ color: 'inherit', textAlign: 'left' }}>
                  Our Shoes (Terra, Drift, Ridge)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('soles')} style={{ color: 'inherit', textAlign: 'left' }}>
                  Standard Edition Sole (₹200)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('soles')} style={{ color: 'inherit', textAlign: 'left' }}>
                  Sports Edition Sole (₹500)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('soles')} style={{ color: 'inherit', textAlign: 'left' }}>
                  Trail Edition Sole (₹700)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('customize')} style={{ color: 'inherit', textAlign: 'left' }}>
                  3D Sole Studio Configurator
                </button>
              </li>
            </ul>
          </div>

          {/* Right to Repair & Tech */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Right to Repair
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>
                <button type="button" onClick={() => handleNav('refit')} style={{ color: 'inherit', textAlign: 'left' }}>
                  ReFit™ Universal Adapter (₹50)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('scan')} style={{ color: 'inherit', textAlign: 'left' }}>
                  3D Optical Foot Fitment Scan
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('technology')} style={{ color: 'inherit', textAlign: 'left' }}>
                  Twist-Lock Mechanism Specs
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('engineering')} style={{ color: 'inherit', textAlign: 'left' }}>
                  PA66-GF30 Material Spec Sheet
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('sustainability')} style={{ color: 'inherit', textAlign: 'left' }}>
                  1:1 Sole Donation Pledge
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Hackathon Disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--border-dim)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © 2026 LOOPSTEP INNOVATIONS · RIGHT TO REPAIR FOR FOOTWEAR
          </div>

          <div style={{ display: 'flex', gap: '18px' }}>
            <span>PATENT-PENDING MECHANISM</span>
            <span>PROTOTYPE VALIDATION</span>
            <span>CIRCULAR FOOTWEAR ARCHITECTURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

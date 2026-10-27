import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-dim)', backgroundColor: 'var(--bg-dark)', padding: '70px 0 30px' }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img src="/loopstep-logo.svg" alt="LoopStep Logo" style={{ width: '36px', height: '36px' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>
                LOOP<span style={{ color: 'var(--primary)' }}>STEP</span>
              </span>
            </Link>

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
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)', padding: 0 }}>
              <li>
                <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Our Shoes (Terra, Drift, Ridge)
                </Link>
              </li>
              <li>
                <Link to="/soles" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Standard Edition Sole (₹200)
                </Link>
              </li>
              <li>
                <Link to="/soles" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Sports Edition Sole (₹500)
                </Link>
              </li>
              <li>
                <Link to="/soles" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Trail Edition Sole (₹700)
                </Link>
              </li>
              <li>
                <Link to="/sole-studio" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                  3D Sole Studio Configurator →
                </Link>
              </li>
            </ul>
          </div>

          {/* Right to Repair & Tech */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Right to Repair
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)', padding: 0 }}>
              <li>
                <Link to="/refit" style={{ color: 'inherit', textDecoration: 'none' }}>
                  ReFit™ Universal Adapter
                </Link>
              </li>
              <li>
                <Link to="/3d-scan" style={{ color: 'inherit', textDecoration: 'none' }}>
                  3D Shoe Fitment Scanner
                </Link>
              </li>
              <li>
                <Link to="/technology" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Twist-Lock Mechanism Demo
                </Link>
              </li>
              <li>
                <Link to="/materials" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Materials & Engineering Specs
                </Link>
              </li>
              <li>
                <Link to="/sustainability" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Impact & Savings Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Support */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Project & Support
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)', padding: 0 }}>
              <li>
                <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                  About & FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Cart & Checkout
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-dim)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © {new Date().getFullYear()} LoopStep Footwear Innovations Pvt. Ltd. Patent Pending.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/technology" style={{ color: 'inherit', textDecoration: 'none' }}>Patent Documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

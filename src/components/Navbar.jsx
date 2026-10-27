import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sliders, Sparkles, Shield, User, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { totalCartCount } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const primaryNavItems = [
    { to: '/', label: 'Home' },
    { to: '/technology', label: 'Technology' },
    { to: '/3d-scan', label: '3D Scan' },
    { to: '/sole-studio', label: 'Sole Studio', badge: '3D' },
    { to: '/refit', label: 'ReFit™' },
    { to: '/soles', label: 'Collection' },
    { to: '/shop', label: 'Shop' },
    { to: '/sustainability', label: 'Sustainability' },
    { to: '/materials', label: 'Materials' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backgroundColor: 'rgba(12, 16, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-dim)'
      }}
    >
      <div
        className="container"
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Logo & Name */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <img
            src="/loopstep-logo.svg"
            alt="LoopStep Logo"
            style={{ width: '36px', height: '36px', borderRadius: '10px' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: '#fff'
            }}
          >
            LOOP<span style={{ color: 'var(--primary)' }}>STEP</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '4px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-dim)'
            }}
          >
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-pill ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(198, 241, 53, 0.12)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                })}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      backgroundColor: 'var(--primary)',
                      color: '#000',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      lineHeight: 1.2
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Right Action Icons (Cart & Mobile Menu) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Cart Route Link */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: totalCartCount > 0 ? 'rgba(198, 241, 53, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: totalCartCount > 0 ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
              color: totalCartCount > 0 ? 'var(--primary)' : '#fff',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <ShoppingBag size={17} />
            <span className="cart-label">Cart</span>
            {totalCartCount > 0 && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                  borderRadius: '50%',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* Quick 3D Studio Button */}
          <Link
            to="/sole-studio"
            className="btn-primary desktop-cta"
            style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            <Sliders size={14} /> 3D Studio
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: '1px solid var(--border-dim)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0c1014',
            borderBottom: '1px solid var(--border-dim)',
            padding: '20px 24px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
          className="mobile-drawer"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(198, 241, 53, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                  color: isActive ? 'var(--primary)' : '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500
                })}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      backgroundColor: 'var(--primary)',
                      color: '#000',
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Link
              to="/sole-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary"
              style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '0.86rem' }}
            >
              <Sliders size={16} /> Open 3D Studio
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary"
              style={{ padding: '12px 16px', fontSize: '0.86rem' }}
            >
              Cart ({totalCartCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

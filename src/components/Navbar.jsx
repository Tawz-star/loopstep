import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Scan, Sliders, Shield, User, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar({ onOpenCart }) {
  const { activeTab, setActiveTab, totalCartCount, setIsCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'technology', label: 'Technology' },
    { id: 'soles', label: 'Soles' },
    { id: 'customize', label: 'Customize' },
    { id: 'scan', label: '3D Scan' },
    { id: 'refit', label: 'ReFit™' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'sustainability', label: 'Impact' },
    { id: 'business', label: 'Economics' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    // Scroll smoothly to section if on home
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(12, 16, 20, 0.88)',
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
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <img
            src="/loopstep-logo.svg"
            alt="LoopStep Logo"
            style={{ width: '38px', height: '38px', borderRadius: '10px' }}
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
        </button>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', lgDisplay: 'flex' }} className="desktop-nav">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-dim)'
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isActive ? '#000' : 'var(--text-muted)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Action Icons (3D Scan, Cart, Admin, Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Quick Scan Action */}
          <button
            type="button"
            onClick={() => handleNavClick('scan')}
            className="btn-secondary btn-sm"
            style={{ display: 'none', smDisplay: 'flex', gap: '6px' }}
          >
            <Scan size={15} color="var(--primary)" />
            <span>3D Scan</span>
          </button>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-light)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text-main)',
              transition: '0.2s'
            }}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={18} />
            {totalCartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 0 10px rgba(198, 241, 53, 0.6)'
                }}
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Admin link */}
          <button
            type="button"
            onClick={() => handleNavClick('admin')}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: activeTab === 'admin' ? 'rgba(198, 241, 53, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${activeTab === 'admin' ? 'var(--primary)' : 'var(--border-dim)'}`,
              display: 'grid',
              placeItems: 'center',
              color: activeTab === 'admin' ? 'var(--primary)' : 'var(--text-muted)'
            }}
            title="Admin Console (PIN: 2026)"
          >
            <User size={18} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-dim)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text-main)'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-glass-heavy)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-dim)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: activeTab === link.id ? 'var(--primary)' : 'var(--text-main)',
                backgroundColor: activeTab === link.id ? 'rgba(198, 241, 53, 0.1)' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{link.label}</span>
              {activeTab === link.id && <ArrowRight size={16} color="var(--primary)" />}
            </button>
          ))}
        </div>
      )}

      {/* Responsive media query helper via inline style tag */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: grid !important; }
        }
        @media (min-width: 640px) {
          .sm\\:flex { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

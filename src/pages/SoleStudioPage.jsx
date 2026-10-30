import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Sliders, Bookmark, Trash2, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import InteractiveCustomizer from '../components/customizer/InteractiveCustomizer';
import { useStore } from '../context/StoreContext';

export default function SoleStudioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedDesigns, deleteDesign, showToast } = useStore();

  const [activeCategory, setActiveCategory] = useState(
    location.state?.scannedSpecs?.category || 'standard'
  );

  return (
    <div style={{ padding: '40px 0 90px' }}>
      <div className="container">
        {/* Studio Page Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="eyebrow">
              <Sparkles size={13} /> LOOPSTEP INNOVATION CORE
            </span>
            <span className="badge-outline">INTERACTIVE 3D FOOTWEAR CUSTOMIZATION ENGINE</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '16px'
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: '-0.03em'
                }}
              >
                Interactive Footwear Studio
              </h1>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  marginTop: '8px',
                  maxWidth: '720px',
                  lineHeight: 1.5
                }}
              >
                Select and customize your shoe upper, choose and customize your terrain replacement sole, combine both in real-time 3D assembly, and transfer your exact configuration to the cart.
              </p>
            </div>

            {/* Mechanical Certification Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-dim)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}
            >
              <ShieldCheck size={18} color="var(--primary)" />
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Mechanical CAD Alignment</strong>
                <span>DuPont PA66 Bayonet Interface</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time 3D Product Customization Engine */}
        <InteractiveCustomizer
          initialCategory={activeCategory}
          onAddToCartSuccess={() => {
            navigate('/cart');
          }}
        />

        {/* SAVED CONFIGURATIONS MANAGER */}
        {savedDesigns && savedDesigns.length > 0 && (
          <section
            style={{
              marginTop: '60px',
              padding: '32px',
              borderRadius: '24px',
              backgroundColor: 'rgba(15, 20, 26, 0.8)',
              border: '1px solid var(--border-dim)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bookmark size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Saved 3D Configurations</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Your locally persisted custom configurations.
                </p>
              </div>
              <span className="badge-signal">{savedDesigns.length} SAVED</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '18px'
              }}
            >
              {savedDesigns.map((dsg) => (
                <div
                  key={dsg.id || dsg.name}
                  className="card-interactive"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-dim)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        {dsg.shoeModel || 'Custom Sneaker'}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{dsg.price}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '8px 0 4px' }}>
                      {dsg.name}
                    </h4>

                    {/* Colorway chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '10px 0' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Colors:</span>
                      {dsg.shoeColor && (
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: dsg.shoeColor,
                            border: '1px solid #fff'
                          }}
                          title="Shoe Color"
                        />
                      )}
                      {dsg.outsoleColor && (
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: dsg.outsoleColor,
                            border: '1px solid #fff'
                          }}
                          title="Sole Color"
                        />
                      )}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>Sole: <strong>{dsg.soleCategory || 'Standard'}</strong></span>
                      {dsg.shoePersonalization && (
                        <span>Text: <code>{dsg.shoePersonalization}</code></span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-dim)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Restored design: ${dsg.name}`);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                    >
                      <RotateCcw size={13} /> Active
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDesign(dsg.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-dim)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        color: 'var(--text-dim)',
                        cursor: 'pointer'
                      }}
                      title="Delete saved design"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3D Studio Architecture & Mechanical Validation Note */}
        <div
          style={{
            marginTop: '50px',
            padding: '24px',
            borderRadius: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-dim)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} /> Genuine 3D Mesh Separation
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              4 independent sneaker uppers and 3 distinct sole categories (Standard, Sports, Trail) load independently in their own scenes. No unrelated models overlap or pollute the viewport.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--signal-green)', fontWeight: 700, fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} /> 45° Mechanical Twist Animation
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              The release state simulates the 45° counter-clockwise rotation required to disengage the 4 radial bayonet keyways before the sole separates cleanly from the shoe chassis.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--signal-blue)', fontWeight: 700, fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} /> Precision CAD STL Geometry
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              Includes the precision 3D CAD sole model with physical interlocking bayonet teeth and engineered mud-exclusion gasket channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Sliders, Bookmark, Trash2, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import SoleStudio3D from '../components/three/SoleStudio3D';
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
            <span className="badge-outline">REAL-TIME WEBGL 3D CONFIGURATOR</span>
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
                3D Sole Studio
              </h1>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  marginTop: '8px',
                  maxWidth: '680px',
                  lineHeight: 1.5
                }}
              >
                Inspect the sneaker geometry, detach the sole via a realistic 45° twist motion, configure material colorways and tread variants in real-time 3D, and reattach your custom configuration.
              </p>
            </div>

            {/* Quick Helper Badge */}
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

        {/* Real-time 3D Product Configurator Viewport */}
        <SoleStudio3D
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
                  Your locally persisted custom soles. Restore any saved configuration directly into the 3D viewport.
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
                  key={dsg.id}
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
                        {dsg.modelVariant || 'LS-STD-v3D'}
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
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: dsg.outsoleColor || '#141416',
                          border: '1px solid #fff'
                        }}
                        title="Outsole"
                      />
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: dsg.sidewallColor || '#f4f4f4',
                          border: '1px solid #fff'
                        }}
                        title="Sidewall"
                      />
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: dsg.accentColor || '#c6f135',
                          border: '1px solid #fff'
                        }}
                        title="Accent"
                      />
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>Tread: <strong>{dsg.treadPattern || 'Wave Flex'}</strong></span>
                      {dsg.laserEngraving && dsg.laserEngraving !== 'NONE' && (
                        <span>Laser Engraving: <code>{dsg.laserEngraving}</code></span>
                      )}
                      <span>Saved: {dsg.savedAt || 'Recently'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-dim)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(dsg.category || 'standard');
                        showToast(`Restored design: ${dsg.name}`);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                    >
                      <RotateCcw size={13} /> Load into 3D
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
              The Dior B44 sneaker model in our viewport consists of independent upper meshes and outsole geometries. Color changes apply directly to the PBR materials of the sole without mutating the upper.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--signal-green)', fontWeight: 700, fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} /> 45° Mechanical Twist Animation
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              The release state simulates the 45° counter-clockwise rotation required to disengage the 4 radial bayonet keyways before the sole drops vertically away from the Strobel board.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--signal-blue)', fontWeight: 700, fontSize: '0.86rem' }}>
              <CheckCircle2 size={16} /> CAD STL Inspection
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              Toggle the CAD Sole Reference switch in the engineering overlays to view the 3D Systems CAD toolpath geometry overlaid directly with the configured sole.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

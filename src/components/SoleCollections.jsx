import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Check, Sliders, Shield, Zap, Compass, Footprints } from 'lucide-react';
import { SOLE_EDITIONS } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function SoleCollections({ onCustomizeSole }) {
  const { addToCart, setActiveTab } = useStore();
  const [selectedEdition, setSelectedEdition] = useState(SOLE_EDITIONS[0]);
  const [selectedSize, setSelectedSize] = useState(42);

  const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];

  const handleAddToCart = (edition) => {
    addToCart({
      id: `sole-${edition.id}`,
      name: `${edition.name} (${selectedSize})`,
      price: edition.price,
      image: edition.image,
      size: selectedSize,
      edition: edition.name,
      category: 'Modular Sole',
      color: edition.defaultColor,
      quantity: 1
    });
  };

  return (
    <section id="soles" style={{ padding: '90px 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', marginBottom: '50px' }}>
          <div>
            <span className="eyebrow">
              <Footprints size={13} /> Three Profiles. One Locking Standard.
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginTop: '14px', lineHeight: 1.15 }}>
              TERRAIN-SPECIFIC <span className="text-signal">SOLE EDITIONS</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px', maxWidth: '640px' }}>
              Every LoopStep shoe upper accepts all three sole editions interchangeably in under 10 seconds. Switch from commuting to trail hiking or gym training effortlessly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onCustomizeSole) onCustomizeSole(selectedEdition.id);
              else setActiveTab('customize');
            }}
            className="btn-secondary"
          >
            <Sliders size={16} /> Open 3D Customizer <ArrowRight size={16} />
          </button>
        </div>

        {/* Global Size Selector */}
        <div
          className="surface-panel"
          style={{
            padding: '16px 24px',
            marginBottom: '40px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            background: 'var(--bg-glass)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              CHOOSE YOUR FIT:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
              EU {selectedSize} ({selectedSize === 42 ? '265 mm' : `${230 + (selectedSize - 38) * 8} mm`})
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                style={{
                  width: '40px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${selectedSize === s ? 'var(--primary)' : 'var(--border-dim)'}`,
                  backgroundColor: selectedSize === s ? 'rgba(198, 241, 53, 0.15)' : 'transparent',
                  color: selectedSize === s ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: '0.2s'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Sole Product Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          {SOLE_EDITIONS.map((edition) => {
            const isSelected = selectedEdition.id === edition.id;
            return (
              <article
                key={edition.id}
                className={`surface-panel ${isSelected ? 'interactive' : ''}`}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-subtle)',
                  borderRadius: 'var(--radius-lg)'
                }}
                onClick={() => setSelectedEdition(edition)}
              >
                <div>
                  {/* Image Display */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      height: '240px',
                      backgroundColor: '#0a0d10'
                    }}
                  >
                    <img
                      src={edition.image}
                      alt={edition.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(14, 18, 22, 0.85)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--primary)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      {edition.thickness}
                    </div>
                  </div>

                  {/* Title & Price Header */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.4rem' }}>{edition.name}</h3>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{edition.price}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                    {edition.subtitle}
                  </p>

                  {/* Specs List */}
                  <ul style={{ listStyle: 'none', marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {edition.materials.map((mat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--primary)' }}>●</span> {mat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '26px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(edition);
                    }}
                    className="btn-primary"
                    style={{ flex: 1, padding: '12px 18px', fontSize: '0.88rem' }}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCustomizeSole) onCustomizeSole(edition.id);
                      else setActiveTab('customize');
                    }}
                    className="btn-secondary"
                    style={{ padding: '12px 16px' }}
                    title="Customize in 3D studio"
                  >
                    <Sliders size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Sole Comparison Tool / Matrix */}
        <div className="surface-panel" style={{ padding: '36px', overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow">Interactive Matrix</span>
            <h3 style={{ fontSize: '1.6rem', marginTop: '10px' }}>Technical Sole Comparison</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Compare physical specifications, durometer ratings, and terrain profiles across all three editions.
            </p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SPECIFICATION</th>
                <th style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text-main)' }}>STANDARD SOLE</th>
                <th style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--primary)' }}>SPORTS SOLE</th>
                <th style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--signal-amber)' }}>TRAIL SOLE</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Listed Price</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>₹200</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>₹500</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>₹700</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Stack Thickness</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>8 mm</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>12 mm</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>15 mm</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Intended Activity</td>
                <td style={{ padding: '14px 16px' }}>City walking & commuting</td>
                <td style={{ padding: '14px 16px' }}>Running, training & sports</td>
                <td style={{ padding: '14px 16px' }}>Hiking, mud & jagged rock</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Tread Pattern</td>
                <td style={{ padding: '14px 16px' }}>Wave flex roll grooves</td>
                <td style={{ padding: '14px 16px' }}>Hex & chevron traction</td>
                <td style={{ padding: '14px 16px' }}>5mm multi-angle mud lugs</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Cushioning Focus</td>
                <td style={{ padding: '14px 16px' }}>Lightweight EVA comfort</td>
                <td style={{ padding: '14px 16px' }}>High-density TPU rebound</td>
                <td style={{ padding: '14px 16px' }}>Ballistic rock plate chassis</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-dim)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Durometer Hardness</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>50–55 Shore A</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>60 Shore A</td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>68 Shore A</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>Twist-Lock Ring</td>
                <td style={{ padding: '14px 16px', color: 'var(--primary)' }}>PA66-GF30 (Universal)</td>
                <td style={{ padding: '14px 16px', color: 'var(--primary)' }}>PA66-GF30 (Universal)</td>
                <td style={{ padding: '14px 16px', color: 'var(--primary)' }}>PA66-GF30 (Universal)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

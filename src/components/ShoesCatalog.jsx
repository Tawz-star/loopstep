import React, { useState } from 'react';
import { ShoppingBag, Sliders, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { COMPLETE_SHOES } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function ShoesCatalog({ onCustomizeSole }) {
  const { addToCart, setActiveTab } = useStore();
  const [selectedSizes, setSelectedSizes] = useState({
    'shoe-terra': 42,
    'shoe-drift': 42,
    'shoe-ridge': 42
  });

  const handleSizeChange = (shoeId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [shoeId]: size }));
  };

  const handleAddShoeToCart = (shoe) => {
    const size = selectedSizes[shoe.id] || 42;
    addToCart({
      id: `${shoe.id}-${size}`,
      name: `${shoe.name} (EU ${size})`,
      price: shoe.price,
      image: shoe.image,
      category: 'Complete Shoe',
      size,
      edition: shoe.includedSole,
      quantity: 1
    });
  };

  return (
    <section id="shoes" style={{ padding: '90px 0', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
          <span className="eyebrow">
            <Zap size={13} /> Complete Footwear Lineup
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            THREE UPPERS. <span className="text-signal">ONE RING STANDARD.</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every LoopStep sneaker ships with the high-strength PA66 twist-lock adapter moulded directly into the midsole. Swap between city, athletic, and trail soles at any moment.
          </p>
        </div>

        {/* Shoes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {COMPLETE_SHOES.map((shoe) => {
            const currentSize = selectedSizes[shoe.id] || 42;
            return (
              <article
                key={shoe.id}
                className="surface-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-subtle)',
                  overflow: 'hidden'
                }}
              >
                <div>
                  {/* Shoe Image */}
                  <div
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      height: '260px',
                      backgroundColor: '#0c1014',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={shoe.image}
                      alt={shoe.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(10, 14, 18, 0.85)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--primary)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      {shoe.category}
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.45rem' }}>{shoe.name}</h3>
                      <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                        {shoe.tagline}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                        ₹{shoe.price}
                      </span>
                      {shoe.originalPrice && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{shoe.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', lineHeight: 1.5 }}>
                    {shoe.description}
                  </p>

                  {/* Included Sole Spec */}
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-dim)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>FITTED SOLE:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{shoe.includedSole.toUpperCase()}</span>
                  </div>

                  {/* Size Selector */}
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>SELECT SIZE:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                        EU {currentSize}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {shoe.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSizeChange(shoe.id, s)}
                          style={{
                            width: '38px',
                            height: '34px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${currentSize === s ? 'var(--primary)' : 'var(--border-dim)'}`,
                            backgroundColor: currentSize === s ? 'rgba(198, 241, 53, 0.15)' : 'transparent',
                            color: currentSize === s ? 'var(--primary)' : 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '26px' }}>
                  <button
                    type="button"
                    onClick={() => handleAddShoeToCart(shoe)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '12px 18px', fontSize: '0.88rem' }}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomizeSole) onCustomizeSole('standard');
                      else setActiveTab('customize');
                    }}
                    className="btn-secondary"
                    style={{ padding: '12px 16px' }}
                    title="Customize replacement soles for this upper"
                  >
                    <Sliders size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

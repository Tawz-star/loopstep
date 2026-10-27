import React, { useState } from 'react';
import { Wrench, CheckCircle, Search, HelpCircle, ArrowRight, ShoppingBag, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { REFIT_ADAPTER, BRAND_COMPATIBILITY_LIST } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function ReFitUniversalSection() {
  const { addToCart, setActiveTab } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);

  const filteredBrands = BRAND_COMPATIBILITY_LIST.filter(
    (b) =>
      b.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.models.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddAdapterToCart = () => {
    addToCart({
      id: REFIT_ADAPTER.id,
      name: REFIT_ADAPTER.name,
      price: REFIT_ADAPTER.price,
      image: REFIT_ADAPTER.image,
      category: 'Conversion Kit',
      quantity: 1
    });
  };

  return (
    <section id="refit" style={{ padding: '90px 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 50px', textAlign: 'center' }}>
          <span className="eyebrow">
            <Wrench size={13} /> Universal Right to Repair
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            YOUR EXISTING SHOES <span className="text-signal">DESERVE ANOTHER LIFE.</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Footwear carries memories. The sneakers you ran your first race in or traveled the world with shouldn't be discarded just because the outsole wore flat. The LoopStep ReFit™ Universal Adapter bonds our twist-lock interface onto any shoe brand for just ₹50.
          </p>
        </div>

        {/* Exploded Diagram Card */}
        <div
          className="surface-panel"
          style={{
            padding: '30px',
            marginBottom: '60px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img
                src="/images/refit-adapter.jpg"
                alt="ReFit universal adapter exploded blueprint"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="eyebrow" style={{ backgroundColor: 'rgba(0, 240, 255, 0.1)', borderColor: 'var(--signal-cyan)', color: 'var(--signal-cyan)' }}>
                  PATENT-PENDING ADAPTER
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                  ₹50
                </span>
              </div>

              <h3 style={{ fontSize: '1.6rem', marginTop: '12px' }}>The Universal Conversion Plate</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '10px', lineHeight: 1.6 }}>
                Crafted from ultra-durable 2.2mm glass-fiber reinforced PA66. A pre-applied industrial polyurethane bonding matrix adheres permanently to the flat midsole of your sneaker, resisting over 4.5 MPa of shear force.
              </p>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {REFIT_ADAPTER.contents.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={handleAddAdapterToCart}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={16} /> Add ReFit Kit · ₹50
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('customize')}
                  className="btn-secondary"
                >
                  Pick Replacement Sole
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Home Installation Guide */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="eyebrow">DIY Home Conversion Guide</span>
            <h3 style={{ fontSize: '1.8rem', marginTop: '10px' }}>How to Convert Your Shoes in 4 Simple Steps</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              {
                step: '01',
                title: 'Clean & Abrade',
                desc: 'Scuff the worn rubber outsole with the supplied sandpaper pad to expose clean, porous EVA/rubber substrate.'
              },
              {
                step: '02',
                title: 'Apply Primer & Resin',
                desc: 'Spread an even layer of the high-performance polyurethane adhesive across the midsole bonding surface.'
              },
              {
                step: '03',
                title: 'Align Stencil & Clamp',
                desc: 'Position the ReFit PA66 adapter plate using the alignment guide. Apply firm pressure or clamp for 15 minutes.'
              },
              {
                step: '04',
                title: 'Twist & Step Forward',
                desc: 'After a 12-hour full cure, click in any LoopStep modular sole (Standard, Sports, Trail) and step out!'
              }
            ].map((st) => (
              <div key={st.step} className="surface-panel" style={{ padding: '24px', position: 'relative' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    opacity: 0.8
                  }}
                >
                  {st.step}
                </span>
                <h4 style={{ fontSize: '1.1rem', marginTop: '10px' }}>{st.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px', lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Compatibility Checker */}
        <div className="surface-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div>
              <span className="eyebrow">Compatibility Database</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '8px' }}>Check Your Sneaker Model</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                We test major commercial footwear silhouettes for sole curvature and ReFit adapter flatness.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search Nike, Adidas, Puma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {filteredBrands.map((item) => (
              <div
                key={item.brand}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-dim)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{item.brand}</h4>
                  <span
                    className="badge-outline"
                    style={{
                      borderColor: item.status === 'Verified Match' ? 'var(--signal-green)' : 'var(--signal-amber)',
                      color: item.status === 'Verified Match' ? 'var(--signal-green)' : 'var(--signal-amber)'
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Popular Models: {item.models.join(', ')}
                </p>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>RECOMMENDED:</span>
                  <span style={{ color: 'var(--primary)' }}>{item.adapterNeeded}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textAlign: 'center' }}>
            NOTE: LoopStep ReFit requires a solid, non-hollow midsole layer. Shoes with exposed air pockets or severe lateral rocker soles require manual inspection.
          </p>
        </div>
      </div>
    </section>
  );
}

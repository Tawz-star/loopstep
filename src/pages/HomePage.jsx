import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, Sparkles, RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react';
import Hero3DCanvas from '../components/Hero3DCanvas';
import { SOLE_EDITIONS, COMPLETE_SHOES } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function HomePage() {
  const { addToCart } = useStore();

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        className="deep-glow grid-etch"
        style={{
          position: 'relative',
          padding: '70px 0 90px',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-dim)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Hero Pitch */}
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                <span className="eyebrow">
                  <Sparkles size={13} /> STEP FORWARD. REPLACE. REPEAT.
                </span>
                <span className="badge-outline">PATENT-PENDING TWIST-LOCK</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.04,
                  letterSpacing: '-0.03em'
                }}
              >
                ONE SHOE.<br />
                EVERY TERRAIN.<br />
                <span className="text-signal">REPLACE THE SOLE.</span>
              </h1>

              <p
                style={{
                  marginTop: '22px',
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}
              >
                90% of a shoe is still in perfect condition when the sole wears down. LoopStep changes that with an interchangeable mechanical twist-lock sole. Keep your upper, swap your tread, and eliminate footwear waste.
              </p>

              {/* CTAs to 3D Sole Studio and Technology */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '32px' }}>
                <Link to="/sole-studio" className="btn-primary" style={{ padding: '14px 28px' }}>
                  <Sliders size={18} /> Open 3D Sole Studio
                </Link>

                <Link to="/technology" className="btn-secondary" style={{ padding: '14px 26px' }}>
                  Explore Twist-Lock Tech <ArrowRight size={16} />
                </Link>
              </div>

              {/* 4 Stat Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                  marginTop: '44px',
                  paddingTop: '28px',
                  borderTop: '1px solid var(--border-dim)'
                }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    &lt;10s
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Swap Time</p>
                </div>

                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ₹200
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Soles From</p>
                </div>

                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-green)' }}>
                    1:1
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Soles Donated</p>
                </div>

                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-amber)' }}>
                    -70%
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Shoe Waste</p>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Shoe Canvas Hero */}
            <div style={{ position: 'relative', width: '100%', height: '540px' }}>
              <Hero3DCanvas
                onExploreTech={() => {}}
                onCustomize={() => {}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE FLAGSHIP SOLES OVERVIEW */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              <Layers size={13} /> MODULAR ECOSYSTEM
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              Three Soles. Endless Possibilities.
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '1rem' }}>
              Swap between city walking, high-energy running, and aggressive off-road trails in under 10 seconds.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}
          >
            {SOLE_EDITIONS.map((edition) => (
              <div
                key={edition.id}
                className="card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'relative', height: '220px', backgroundColor: '#0a0d11', overflow: 'hidden' }}>
                  <img
                    src={edition.image}
                    alt={edition.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      backgroundColor: 'rgba(12, 16, 20, 0.85)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--primary)'
                    }}
                  >
                    ₹{edition.price}
                  </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {edition.terrain}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0 10px' }}>{edition.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    {edition.desc}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <Link
                      to="/sole-studio"
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem', textAlign: 'center' }}
                    >
                      <Sliders size={14} /> Customize in 3D
                    </Link>
                    <Link
                      to="/soles"
                      className="btn-secondary"
                      style={{ padding: '10px 14px', fontSize: '0.82rem' }}
                    >
                      Specs
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SUSTAINABILITY USP HIGHLIGHT */}
      <section
        style={{
          padding: '80px 0',
          backgroundColor: 'rgba(255, 255, 255, 0.015)',
          borderBottom: '1px solid var(--border-dim)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="eyebrow">
                <RefreshCw size={13} /> CIRCULAR ECONOMY
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
                Why Throw Away 90% of a Shoe?
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '1rem', lineHeight: 1.6 }}>
                Traditional footwear glues the sole directly to the upper with toxic adhesives. When the bottom 8mm wears out, the entire sneaker enters a landfill where it takes 1,000 years to decompose.
              </p>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '1rem', lineHeight: 1.6 }}>
                LoopStep’s patent-pending mechanical twist-lock separates without chemicals. Send back your worn soles for ₹20 credit, and we re-vulcanize the rubber for our 1:1 community donation program.
              </p>

              <div style={{ marginTop: '28px' }}>
                <Link to="/sustainability" className="btn-secondary" style={{ padding: '12px 22px' }}>
                  Explore Our Impact & Calculator <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--border-dim)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <img
                src="/loopstep-hero-sneaker.jpg"
                alt="LoopStep Sustainable Modular Sneaker"
                style={{ width: '100%', height: '380px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS PREVIEW */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span className="eyebrow">FEATURED FOOTWEAR</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '6px' }}>Complete Modular Shoes</h2>
            </div>
            <Link to="/shop" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              View Complete Shop <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {COMPLETE_SHOES.slice(0, 3).map((shoe) => (
              <div
                key={shoe.id}
                className="card-interactive"
                style={{ borderRadius: '20px', overflow: 'hidden' }}
              >
                <div style={{ height: '240px', backgroundColor: '#0c1014', overflow: 'hidden' }}>
                  <img src={shoe.image} alt={shoe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{shoe.name}</h3>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>₹{shoe.price}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 16px' }}>{shoe.desc}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => addToCart({ ...shoe, quantity: 1, size: 42 })}
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to="/sole-studio"
                      className="btn-secondary"
                      style={{ padding: '10px 14px', fontSize: '0.82rem' }}
                    >
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

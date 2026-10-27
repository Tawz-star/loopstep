import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Trash2, TrendingUp, DollarSign, ArrowRightLeft } from 'lucide-react';

export default function ProblemComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <section style={{ padding: '90px 0', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
          <span className="eyebrow">
            <AlertTriangle size={13} color="var(--signal-amber)" /> The Footwear Dilemma
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '16px', lineHeight: 1.15 }}>
            WHY REPLACE THE <span className="text-signal">WHOLE SHOE?</span>
          </h2>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every year, over 24 billion pairs of shoes are manufactured worldwide. In conventional footwear, 90% of discarded sneakers still have perfectly sound uppers, but are thrown into landfills because only 2mm of the rubber outsole wore thin.
          </p>
        </div>

        {/* Interactive Before & After Comparison Slider */}
        <div
          className="surface-panel"
          style={{
            position: 'relative',
            height: '460px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            cursor: 'ew-resize',
            userSelect: 'none',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-heavy)'
          }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Background Right: LOOPSTEP MODULAR REVOLUTION (Revealed on Right) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #101920 0%, #0c1217 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '40px',
              backgroundImage: 'url(/images/hero-mechanism.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(12,18,23,0.95) 15%, rgba(12,18,23,0.4) 60%, rgba(12,18,23,0.7) 100%)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px', marginLeft: 'auto', textAlign: 'right' }}>
              <span className="eyebrow" style={{ backgroundColor: 'rgba(198, 241, 53, 0.15)', borderColor: 'var(--primary)' }}>
                <CheckCircle size={13} /> The LoopStep Method
              </span>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', marginTop: '12px' }}>Keep the Upper. Swap the Sole.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', lineHeight: 1.5 }}>
                Retain the comfortable, broken-in upper for 3–5x longer lifespan. Replace only the worn sole starting at ₹200. Choose a new sole for any new activity on demand.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '16px' }}>
                <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>-70% MATERIAL WASTE*</span>
                <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>₹200 SOLE REPLACEMENT</span>
              </div>
            </div>
          </div>

          {/* Foreground Left: TRADITIONAL FOOTWEAR WASTE (Clipped by Slider) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${sliderPosition}%`,
              overflow: 'hidden',
              backgroundImage: 'url(/images/waste-comparison.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'left center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,12,15,0.95) 15%, rgba(10,12,15,0.5) 60%, rgba(10,12,15,0.8) 100%)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                zIndex: 2,
                width: '380px',
                textAlign: 'left'
              }}
            >
              <span className="eyebrow" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', borderColor: 'var(--signal-red)', color: 'var(--signal-red)' }}>
                <Trash2 size={13} /> Traditional Model
              </span>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', marginTop: '12px' }}>100% Discarded For 1 Worn Sole</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', lineHeight: 1.5 }}>
                Worn outsole forces you to throw away the perfectly usable upper. Pay full-pair replacement costs every time. Unnecessary synthetic material landfill waste.
              </p>
              <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
                <span className="badge-outline" style={{ borderColor: 'var(--signal-red)', color: 'var(--signal-red)' }}>₹3,000+ PER NEW PAIR</span>
                <span className="badge-outline" style={{ borderColor: 'var(--signal-red)', color: 'var(--signal-red)' }}>14.5 KG CO2 EMITTED</span>
              </div>
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sliderPosition}%`,
              width: '4px',
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 18px rgba(198, 241, 53, 0.8)',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                cursor: 'ew-resize'
              }}
            >
              <ArrowRightLeft size={18} />
            </div>
          </div>

          {/* Floating Instructions */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 12,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-main)',
              border: '1px solid var(--border-light)',
              pointerEvents: 'none'
            }}
          >
            DRAG SLIDER TO COMPARE
          </div>
        </div>

        {/* 4 Feature Value Props */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '40px'
          }}
        >
          <div className="surface-panel" style={{ padding: '28px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center' }}>
              <RefreshCw size={22} color="var(--primary)" />
            </div>
            <h4 style={{ fontSize: '1.15rem', marginTop: '18px' }}>Component Lifespan Mismatch</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px', lineHeight: 1.5 }}>
              Outsoles grind down after 400–600 km, while high-grade engineered knit uppers easily last 2,500+ km. LoopStep harmonizes this component lifespan discrepancy.
            </p>
          </div>

          <div className="surface-panel" style={{ padding: '28px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center' }}>
              <DollarSign size={22} color="var(--primary)" />
            </div>
            <h4 style={{ fontSize: '1.15rem', marginTop: '18px' }}>A Fraction of the Replacement Cost</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px', lineHeight: 1.5 }}>
              Instead of spending ₹2,500 to ₹3,500 on a complete pair, a fresh high-traction replacement sole starts at only ₹200. Premium performance with zero wasteful markup.
            </p>
          </div>

          <div className="surface-panel" style={{ padding: '28px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center' }}>
              <TrendingUp size={22} color="var(--primary)" />
            </div>
            <h4 style={{ fontSize: '1.15rem', marginTop: '18px' }}>3x to 5x Lifespan Multiplier</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px', lineHeight: 1.5 }}>
              By rotating between Standard, Sports, and Trail soles, a single shoe upper serves multiple athletic purposes and lasts years instead of months.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '24px' }}>
          *Data source: LoopStep Hackathon Engineering Abstract & presentation estimates pending independent ISO certification.
        </p>
      </div>
    </section>
  );
}

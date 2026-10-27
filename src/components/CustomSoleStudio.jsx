import React, { useState } from 'react';
import { Sliders, ShoppingBag, Bookmark, RotateCcw, Check, Sparkles, Tag, Shield, Layers, HelpCircle } from 'lucide-react';
import { SOLE_EDITIONS } from '../data/mockData';
import { useStore } from '../context/StoreContext';

const COLOR_PALETTE = [
  { name: 'Signal Lime', hex: '#C6F135' },
  { name: 'Ink Black', hex: '#1A1A1A' },
  { name: 'Graphite', hex: '#3A3A3A' },
  { name: 'Chalk White', hex: '#F7F5F2' },
  { name: 'Bone', hex: '#DFD8CE' },
  { name: 'LoopStep Red', hex: '#C8161D' },
  { name: 'Deep Ember', hex: '#8E1014' },
  { name: 'Cool Steel', hex: '#8B9299' },
  { name: 'Solar Amber', hex: '#E7A93B' },
  { name: 'Deep Moss', hex: '#4A6141' }
];

const TREAD_PATTERNS = [
  { id: 'wave', name: 'Wave Flex', desc: 'Smooth heel-to-toe roll for asphalt & sidewalks' },
  { id: 'hex', name: 'Hex Grip', desc: 'Multi-directional responsive traction for sprints' },
  { id: 'lug', name: 'Deep Lug', desc: 'Aggressive 5mm teeth for wet gravel & dirt trails' },
  { id: 'court', name: 'Court Grid', desc: 'Non-marking high friction indoor court pattern' }
];

export default function CustomSoleStudio({ initialTier = 'standard' }) {
  const { addToCart, saveDesign } = useStore();

  const [selectedTier, setSelectedTier] = useState(initialTier); // 'standard', 'sports', 'trail'
  const [baseColor, setBaseColor] = useState('#1A1A1A');
  const [treadColor, setTreadColor] = useState('#C6F135');
  const [ringColor, setRingColor] = useState('#C6F135');
  const [treadPattern, setTreadPattern] = useState('wave');
  const [fitProfile, setFitProfile] = useState('Regular'); // 'Narrow', 'Regular', 'Wide'
  const [archShape, setArchShape] = useState('Neutral'); // 'Low / Flat', 'Neutral', 'High Arch'
  const [size, setSize] = useState(42);
  const [durometer, setDurometer] = useState(55); // 40 to 70 Shore A
  const [engraving, setEngraving] = useState('');
  const [includeAdapter, setIncludeAdapter] = useState(false);
  const [recycleOldSole, setRecycleOldSole] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const activeEdition = SOLE_EDITIONS.find((e) => e.id === selectedTier) || SOLE_EDITIONS[0];

  // Price Calculation
  let basePrice = activeEdition.price;
  if (includeAdapter) basePrice += 50;
  const discount = recycleOldSole ? Math.round(basePrice * 0.1) : 0;
  const finalPrice = Math.max(0, basePrice - discount);

  const handleAddToCart = () => {
    addToCart({
      id: `custom-sole-${Date.now()}`,
      name: `Custom ${activeEdition.name} (EU ${size})`,
      price: finalPrice,
      image: activeEdition.image,
      category: 'Configured Sole',
      size,
      edition: activeEdition.name,
      customDetails: {
        baseColor,
        treadColor,
        ringColor,
        treadPattern,
        fitProfile,
        archShape,
        durometer: `${durometer} Shore A`,
        engraving: engraving.trim() || 'NONE',
        includeAdapter,
        recycleOldSole
      },
      quantity: 1
    });
  };

  const handleSaveDesign = () => {
    saveDesign({
      name: `Custom ${activeEdition.name}`,
      edition: activeEdition.name,
      baseColor,
      treadColor,
      ringColor,
      treadPattern,
      size,
      price: finalPrice,
      engraving
    });
  };

  const handleReset = () => {
    setSelectedTier('standard');
    setBaseColor('#1A1A1A');
    setTreadColor('#C6F135');
    setRingColor('#C6F135');
    setTreadPattern('wave');
    setDurometer(55);
    setEngraving('');
    setIncludeAdapter(false);
    setRecycleOldSole(false);
    setRotationAngle(0);
  };

  return (
    <section id="customize" style={{ padding: '90px 0', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
          <span className="eyebrow">
            <Sliders size={13} /> Precision 3D Sole Configurator
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            DESIGNED AROUND <span className="text-signal">YOUR NEXT STEP.</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Customize every physical element of your replacement modular sole. Choose your edition, colorway, tread pattern, durometer hardness, and custom laser engraving.
          </p>
        </div>

        {/* Studio Workspace Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* LEFT: Live SVG / Canvas Sole Studio Preview */}
          <div
            className="surface-panel"
            style={{
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'sticky',
              top: '90px',
              borderRadius: 'var(--radius-lg)',
              background: 'radial-gradient(circle at 50% 40%, #151d24 0%, #0a0d10 90%)'
            }}
          >
            {/* Top Toolbar */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="eyebrow" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-light)', color: 'var(--text-main)' }}>
                {activeEdition.name} · {activeEdition.thickness}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                  className="btn-secondary btn-sm"
                  title="Rotate Sole Preview"
                >
                  <RotateCcw size={14} /> Rotate
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary btn-sm"
                  title="Reset to Defaults"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Interactive Procedural Sole Silhouette Render */}
            <div
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '440px',
                display: 'grid',
                placeItems: 'center',
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.4s ease'
              }}
            >
              <svg viewBox="0 0 200 460" style={{ height: '420px', width: 'auto' }} role="img" aria-label="Interactive configured modular sole">
                <defs>
                  <clipPath id="customSoleClip">
                    <path d="M80 12 C126 12 152 52 152 108 C152 160 138 196 138 240 C142 300 152 330 152 372 C152 424 124 448 80 448 C36 448 12 424 12 372 C12 330 22 300 26 240 C26 196 12 160 12 108 C12 52 34 12 80 12 Z" />
                  </clipPath>
                  <linearGradient id="customSheen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Drop shadow */}
                <path
                  d="M80 12 C126 12 152 52 152 108 C152 160 138 196 138 240 C142 300 152 330 152 372 C152 424 124 448 80 448 C36 448 12 424 12 372 C12 330 22 300 26 240 C26 196 12 160 12 108 C12 52 34 12 80 12 Z"
                  fill="#000"
                  opacity="0.6"
                  transform="translate(4, 8)"
                />

                {/* Base Outsole Bed */}
                <path
                  d="M80 12 C126 12 152 52 152 108 C152 160 138 196 138 240 C142 300 152 330 152 372 C152 424 124 448 80 448 C36 448 12 424 12 372 C12 330 22 300 26 240 C26 196 12 160 12 108 C12 52 34 12 80 12 Z"
                  fill={baseColor}
                />

                {/* Dynamic Tread Pattern */}
                <g clipPath="url(#customSoleClip)">
                  {treadPattern === 'wave' && (
                    <g stroke={treadColor} strokeWidth="5" strokeLinecap="round" opacity="0.9">
                      {[52, 82, 112, 142, 172, 202, 232, 262, 292, 322, 352, 382].map((y) => (
                        <path key={y} d={`M22 ${y} q28 -14 56 0 q28 14 56 0`} fill="none" />
                      ))}
                    </g>
                  )}

                  {treadPattern === 'hex' && (
                    <g fill={treadColor} opacity="0.88">
                      {[56, 96, 136, 176, 216, 256, 296, 336, 376].map((y, rowIdx) =>
                        [34, 66, 98, 130].map((x, colIdx) => (
                          <polygon
                            key={`${rowIdx}-${colIdx}`}
                            points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4"
                            transform={`translate(${rowIdx % 2 === 0 ? x : x + 16}, ${y})`}
                          />
                        ))
                      )}
                    </g>
                  )}

                  {treadPattern === 'lug' && (
                    <g fill={treadColor} opacity="0.95">
                      {[60, 100, 140, 180, 220, 260, 300, 340, 380].map((y) =>
                        [35, 75, 115].map((x) => (
                          <rect key={`${x}-${y}`} x={x} y={y} width="22" height="14" rx="3" transform={`rotate(15, ${x + 11}, ${y + 7})`} />
                        ))
                      )}
                    </g>
                  )}

                  {treadPattern === 'court' && (
                    <g stroke={treadColor} strokeWidth="3" opacity="0.85">
                      {[40, 70, 100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 400].map((y) => (
                        <line key={`h-${y}`} x1="10" y1={y} x2="160" y2={y} />
                      ))}
                      {[25, 55, 85, 115, 145].map((x) => (
                        <line key={`v-${x}`} x1={x} y1="30" x2={x} y2="430" />
                      ))}
                    </g>
                  )}

                  {/* Midfoot Recessed Interface Plate */}
                  <ellipse cx="82" cy="250" rx="54" ry="72" fill="#0c1014" opacity="0.45" />
                  <rect x="0" y="0" width="200" height="460" fill="url(#customSheen)" />
                </g>

                {/* PA66-GF Twist-Lock Concentric Ring with Radial Teeth */}
                <g transform="translate(82 250)">
                  <circle r="30" fill="#0e1318" opacity="0.9" />
                  <circle r="26" fill="none" stroke={ringColor} strokeWidth="6" />
                  <circle r="13" fill="none" stroke={ringColor} strokeWidth="3" opacity="0.75" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                    <rect
                      key={ang}
                      x="-2"
                      y="-30"
                      width="4"
                      height="8"
                      rx="2"
                      fill={ringColor}
                      transform={`rotate(${ang})`}
                    />
                  ))}
                </g>

                {/* Laser Engraving Text if present */}
                {engraving.trim() && (
                  <text
                    x="82"
                    y="390"
                    textAnchor="middle"
                    fill={treadColor}
                    fontSize="9"
                    fontFamily="monospace"
                    letterSpacing="2"
                    fontWeight="bold"
                  >
                    {engraving.trim().toUpperCase()}
                  </text>
                )}

                {/* Bottom Technical Spec Stamp */}
                <text
                  x="100"
                  y="455"
                  textAnchor="middle"
                  fill="#ffffff"
                  opacity="0.55"
                  fontSize="10"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {activeEdition.thickness} · EU {size} · {fitProfile} · {durometer}A
                </text>
              </svg>
            </div>

            {/* Price & Summary Box */}
            <div style={{ width: '100%', marginTop: '20px', borderTop: '1px solid var(--border-dim)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Configured Total:</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  ₹{finalPrice}
                </span>
              </div>

              {recycleOldSole && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--signal-green)', marginTop: '4px' }}>
                  <Tag size={13} /> 10% Sole Return Recycle Credit Applied (-₹{discount})
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                <button type="button" onClick={handleAddToCart} className="btn-primary" style={{ flex: 1 }}>
                  <ShoppingBag size={16} /> Add Configured Sole
                </button>
                <button type="button" onClick={handleSaveDesign} className="btn-secondary" title="Save to Profile">
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Customization Control Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Sole Edition Selection */}
            <div className="surface-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="eyebrow">Step 01</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)' }}>
                  {activeEdition.thickness}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>Select Edition & Stack</h3>

              <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
                {SOLE_EDITIONS.map((ed) => (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => setSelectedTier(ed.id)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${selectedTier === ed.id ? 'var(--primary)' : 'var(--border-dim)'}`,
                      backgroundColor: selectedTier === ed.id ? 'rgba(198, 241, 53, 0.08)' : 'transparent',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: '0.2s'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: selectedTier === ed.id ? 'var(--primary)' : 'var(--text-main)' }}>
                        {ed.name} · ₹{ed.price}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {ed.materials.slice(0, 2).join(' · ')}
                      </p>
                    </div>
                    {selectedTier === ed.id && <Check size={18} color="var(--primary)" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Colorways (Base, Tread, Ring) */}
            <div className="surface-panel" style={{ padding: '24px' }}>
              <span className="eyebrow">Step 02</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>Color Customization</h3>

              {/* Base Color Picker */}
              <div style={{ marginTop: '18px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Base Bed Color:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setBaseColor(c.hex)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: `2px solid ${baseColor === c.hex ? 'var(--primary)' : 'var(--border-dim)'}`,
                        transform: baseColor === c.hex ? 'scale(1.15)' : 'none',
                        transition: '0.15s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tread Color Picker */}
              <div style={{ marginTop: '18px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Tread & Lug Color:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setTreadColor(c.hex)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: `2px solid ${treadColor === c.hex ? 'var(--primary)' : 'var(--border-dim)'}`,
                        transform: treadColor === c.hex ? 'scale(1.15)' : 'none',
                        transition: '0.15s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Twist-Lock Ring Color Picker */}
              <div style={{ marginTop: '18px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Twist-Lock Ring Detent Color:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setRingColor(c.hex)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: `2px solid ${ringColor === c.hex ? 'var(--primary)' : 'var(--border-dim)'}`,
                        transform: ringColor === c.hex ? 'scale(1.15)' : 'none',
                        transition: '0.15s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Tread Pattern Selection */}
            <div className="surface-panel" style={{ padding: '24px' }}>
              <span className="eyebrow">Step 03</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>Tread Traction Pattern</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '16px' }}>
                {TREAD_PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTreadPattern(p.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${treadPattern === p.id ? 'var(--primary)' : 'var(--border-dim)'}`,
                      backgroundColor: treadPattern === p.id ? 'rgba(198, 241, 53, 0.08)' : 'transparent',
                      textAlign: 'left'
                    }}
                  >
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: treadPattern === p.id ? 'var(--primary)' : 'var(--text-main)' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {p.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Fit Profile & Arch */}
            <div className="surface-panel" style={{ padding: '24px' }}>
              <span className="eyebrow">Step 04</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>Anatomical Fit & Hardness</h3>

              {/* Fit Profile */}
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Width Profile:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Narrow', 'Regular', 'Wide'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFitProfile(f)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${fitProfile === f ? 'var(--primary)' : 'var(--border-dim)'}`,
                        backgroundColor: fitProfile === f ? 'rgba(198, 241, 53, 0.15)' : 'transparent',
                        color: fitProfile === f ? 'var(--primary)' : 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Durometer Hardness Slider */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Durometer (Rubber Density):</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{durometer} Shore A</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={70}
                  value={durometer}
                  onChange={(e) => setDurometer(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor: 'var(--primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>40A (Plush Cushioning)</span>
                  <span>70A (High Abrasion Firm)</span>
                </div>
              </div>

              {/* Laser Engraving Input */}
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  Laser Engraving (Up to 14 Chars):
                </p>
                <input
                  type="text"
                  maxLength={14}
                  placeholder="e.g. YOUR NAME or INITIALS"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            {/* 5. Circular Economy & Add-ons */}
            <div className="surface-panel" style={{ padding: '24px' }}>
              <span className="eyebrow">Step 05</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px' }}>Right to Repair Add-ons</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${includeAdapter ? 'var(--primary)' : 'var(--border-dim)'}`,
                    backgroundColor: includeAdapter ? 'rgba(198, 241, 53, 0.05)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeAdapter}
                    onChange={(e) => setIncludeAdapter(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Include ReFit™ Universal Adapter Plate (+₹50)
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Allows this modular sole to bond onto non-LoopStep sneakers (Nike, Adidas, etc.).
                    </p>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${recycleOldSole ? 'var(--signal-green)' : 'var(--border-dim)'}`,
                    backgroundColor: recycleOldSole ? 'rgba(0, 255, 102, 0.05)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={recycleOldSole}
                    onChange={(e) => setRecycleOldSole(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--signal-green)' }}
                  />
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--signal-green)' }}>
                      Return Worn Sole For Recycling (Take 10% Off)
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      We send a prepaid return mailer. Retired rubber is ground down into new outsoles.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

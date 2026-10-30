import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Layers,
  Edit3,
  Bookmark,
  Eye,
  Tag,
  Palette,
  Type,
  Maximize2
} from 'lucide-react';
import FootwearViewer3D from '../three/FootwearViewer3D';
import {
  SHOE_MODELS,
  SOLE_CATEGORIES,
  COLOR_OPTIONS,
  UPPER_MATERIALS
} from '../three/Footwear3DManager';
import { useStore } from '../../context/StoreContext';

export default function InteractiveCustomizer({ initialCategory = 'standard', onAddToCartSuccess }) {
  const navigate = useNavigate();
  const { addToCart, saveDesign, showToast } = useStore();

  // Workflow Steps:
  // 1: Select Customization Type ('shoe' | 'sole' | 'both')
  // 2: Shoe Customization Workspace
  // 3: Sole Customization Workspace
  // 4: Final 3D Preview & Assembly
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowMode, setWorkflowMode] = useState('both'); // 'shoe' | 'sole' | 'both'

  // Shoe Configuration State
  const [shoeModelId, setShoeModelId] = useState('shoe-01');
  const [shoeColor, setShoeColor] = useState('#C8161D');
  const [shoeOverlayColor, setShoeOverlayColor] = useState('#1A1A1A');
  const [shoeAccentColor, setShoeAccentColor] = useState('#C6F135');
  const [shoeMaterial, setShoeMaterial] = useState('recycled-knit');
  const [shoePersonalization, setShoePersonalization] = useState('');
  const [shoeSize, setShoeSize] = useState(42);

  // Sole Configuration State
  const [soleCategory, setSoleCategory] = useState(initialCategory || 'standard');
  const [soleVariantId, setSoleVariantId] = useState(
    initialCategory === 'sports'
      ? 'sole-spr-01'
      : initialCategory === 'trail'
      ? 'sole-trl-01'
      : 'sole-std-01'
  );
  const [outsoleColor, setOutsoleColor] = useState('#141416');
  const [midsoleColor, setMidsoleColor] = useState('#F4F4F4');
  const [soleAccentColor, setSoleAccentColor] = useState('#C6F135');
  const [ringColor, setRingColor] = useState('#C6F135');
  const [treadPattern, setTreadPattern] = useState('wave');
  const [surfaceFinish, setSurfaceFinish] = useState('matte');
  const [soleEngraving, setSoleEngraving] = useState('');
  const [includeAdapter, setIncludeAdapter] = useState(false);

  // Final Assembly Viewer State: 'assembled' | 'release' | 'detached'
  const [assemblyState, setAssemblyState] = useState('assembled');

  // Lookups
  const activeShoeModel = SHOE_MODELS.find((m) => m.id === shoeModelId) || SHOE_MODELS[0];
  const activeSoleCategory = SOLE_CATEGORIES.find((c) => c.id === soleCategory) || SOLE_CATEGORIES[0];
  const activeSoleVariant =
    activeSoleCategory.variants.find((v) => v.id === soleVariantId) || activeSoleCategory.variants[0];

  // Dynamic Price Calculation
  const isShoeOnly = workflowMode === 'shoe';
  const isSoleOnly = workflowMode === 'sole';

  let calculatedPrice = 0;
  if (isShoeOnly) {
    calculatedPrice = activeShoeModel.basePrice;
  } else if (isSoleOnly) {
    calculatedPrice = activeSoleVariant.price;
  } else {
    // Complete Sneaker (Shoe + Sole)
    calculatedPrice = activeShoeModel.basePrice + activeSoleVariant.price;
  }

  if (surfaceFinish === 'textured') calculatedPrice += 40;
  if (shoePersonalization.trim().length > 0) calculatedPrice += 50;
  if (soleEngraving.trim().length > 0) calculatedPrice += 50;
  if (includeAdapter) calculatedPrice += 50;

  // Handle Sole Category Change
  const handleSoleCategorySelect = (catId) => {
    setSoleCategory(catId);
    const cat = SOLE_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.variants.length > 0) {
      const firstVar = cat.variants[0];
      setSoleVariantId(firstVar.id);
      setOutsoleColor(firstVar.defaultColor);
      setMidsoleColor(firstVar.defaultMidsole);
      setSoleAccentColor(firstVar.defaultAccent);
      setTreadPattern(firstVar.tread);
    }
  };

  // Handle Sole Variant Change
  const handleSoleVariantSelect = (v) => {
    setSoleVariantId(v.id);
    setOutsoleColor(v.defaultColor);
    setMidsoleColor(v.defaultMidsole);
    setSoleAccentColor(v.defaultAccent);
    setTreadPattern(v.tread);
  };

  // Add Customized Footwear to Cart
  const handleAddToCart = () => {
    const configTitle = isShoeOnly
      ? `Custom ${activeShoeModel.name} Upper`
      : isSoleOnly
      ? `Custom ${activeSoleVariant.name} Sole`
      : `Custom ${activeShoeModel.name} + ${activeSoleCategory.name}`;

    addToCart({
      id: `custom-footwear-${Date.now()}`,
      name: `${configTitle} (EU ${shoeSize})`,
      price: calculatedPrice,
      image: activeShoeModel.thumbnail,
      category: isSoleOnly ? 'Configured Sole' : 'Configured Complete Shoe',
      size: shoeSize,
      edition: activeSoleCategory.name,
      customDetails: {
        shoeModel: activeShoeModel.name,
        shoeColor,
        shoeMaterial,
        shoePersonalization: shoePersonalization.trim() || 'NONE',
        soleCategory: activeSoleCategory.name,
        soleVariant: activeSoleVariant.name,
        outsoleColor,
        midsoleColor,
        ringColor,
        treadPattern,
        surfaceFinish,
        soleEngraving: soleEngraving.trim() || 'NONE',
        includeAdapter
      },
      quantity: 1
    });

    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    } else {
      navigate('/cart');
    }
  };

  // Save Design
  const handleSaveDesign = () => {
    saveDesign({
      name: `${activeShoeModel.name} (${activeSoleCategory.name})`,
      shoeModel: activeShoeModel.name,
      shoeColor,
      soleCategory: activeSoleCategory.name,
      soleVariant: activeSoleVariant.name,
      outsoleColor,
      size: shoeSize,
      price: calculatedPrice,
      shoePersonalization,
      soleEngraving
    });
  };

  // Reset Customization
  const handleResetShoe = () => {
    setShoeColor(activeShoeModel.defaultColor);
    setShoeOverlayColor(activeShoeModel.defaultOverlay);
    setShoeAccentColor(activeShoeModel.defaultAccent);
    setShoeMaterial('recycled-knit');
    setShoePersonalization('');
    showToast('Shoe customization reset to factory defaults', 'info');
  };

  const handleResetSole = () => {
    setOutsoleColor(activeSoleVariant.defaultColor);
    setMidsoleColor(activeSoleVariant.defaultMidsole);
    setSoleAccentColor(activeSoleVariant.defaultAccent);
    setRingColor('#C6F135');
    setSurfaceFinish('matte');
    setSoleEngraving('');
    showToast('Sole customization reset to factory defaults', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* WORKFLOW STEPPER BAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderRadius: '16px',
          backgroundColor: 'rgba(15, 20, 26, 0.85)',
          border: '1px solid var(--border-dim)',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {[
            { num: 1, label: 'Mode' },
            { num: 2, label: '1. Shoe' },
            { num: 3, label: '2. Sole' },
            { num: 4, label: '3. Assembly' }
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (currentStep > 1 && s.num > 1) setCurrentStep(s.num);
                }}
                disabled={currentStep === 1 && s.num > 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isActive ? 'rgba(198, 241, 53, 0.15)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--primary)' : isCompleted ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: isActive ? 'var(--primary)' : isCompleted ? '#fff' : 'var(--text-dim)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: currentStep > 1 && s.num > 1 ? 'pointer' : 'default'
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--primary)' : isCompleted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#000' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  {isCompleted ? <Check size={12} /> : s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Running Price Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
              Configured Price
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
              ₹{calculatedPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {currentStep === 4 && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-primary btn-sm"
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShoppingBag size={15} /> Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 1: SELECT CUSTOMIZATION TYPE */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div style={{ maxWidth: '960px', margin: '20px auto 40px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              <Sliders size={13} /> STEP 01 — SELECT CUSTOMIZATION PATH
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginTop: '12px', lineHeight: 1.15 }}>
              WHAT WOULD YOU LIKE TO <span className="text-signal">CREATE?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '14px auto 0' }}>
              Choose your custom footwear path. You can design a bespoke sneaker upper, configure a terrain-specific replacement sole, or assemble a complete unified modular sneaker.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* OPTION A: CUSTOMIZE YOUR SHOE */}
            <div
              className="surface-panel card-interactive"
              onClick={() => {
                setWorkflowMode('both');
                setCurrentStep(2);
              }}
              style={{
                padding: '36px 30px',
                borderRadius: '24px',
                border: '1px solid var(--border-dim)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(198, 241, 53, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '20px'
                  }}
                >
                  <Sparkles size={28} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px' }}>
                  Customize Your Shoe
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Select from 4 athletic sneaker silhouettes, customize upper knit materials, dynamic colorways, and personalized laser text. Continues directly to sole pairing.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span className="badge-outline">4 Sneaker Models</span>
                  <span className="badge-outline">Material Slots</span>
                  <span className="badge-outline">Text Decal</span>
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                <span>Start Shoe Customizer</span>
                <ArrowRight size={16} />
              </div>
            </div>

            {/* OPTION B: CUSTOMIZE YOUR SOLE */}
            <div
              className="surface-panel card-interactive"
              onClick={() => {
                setWorkflowMode('sole');
                setCurrentStep(3);
              }}
              style={{
                padding: '36px 30px',
                borderRadius: '24px',
                border: '1px solid var(--border-dim)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    marginBottom: '20px'
                  }}
                >
                  <Layers size={28} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px' }}>
                  Customize Your Sole
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Already own a shoe or want a replacement modular sole? Choose between Standard (8mm), Sports (12mm), or Trail (15mm) editions, customize tread and colorways.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span className="badge-outline">Standard · Sports · Trail</span>
                  <span className="badge-outline">Tread Geometries</span>
                  <span className="badge-outline">Laser Engraving</span>
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
                <span>Start Sole Customizer</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: SHOE CUSTOMIZATION WORKSPACE */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* LEFT: 3D Viewport (ONLY renders selected shoe upper!) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FootwearViewer3D
              mode="shoe"
              shoeModelId={shoeModelId}
              shoeConfig={{
                color: shoeColor,
                overlayColor: shoeOverlayColor,
                accentColor: shoeAccentColor,
                material: shoeMaterial,
                personalizationText: shoePersonalization
              }}
            />

            {/* Model Card Selector (The 4 Sneaker Models) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {SHOE_MODELS.map((model) => {
                const isSelected = model.id === shoeModelId;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      setShoeModelId(model.id);
                      setShoeColor(model.defaultColor);
                      setShoeOverlayColor(model.defaultOverlay);
                      setShoeAccentColor(model.defaultAccent);
                    }}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      backgroundColor: isSelected ? 'rgba(198, 241, 53, 0.08)' : 'rgba(15, 20, 26, 0.8)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-dim)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--primary)' : 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {model.category}
                      </span>
                      {isSelected && <CheckCircle2 size={14} color="var(--primary)" />}
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                      {model.name}
                    </strong>
                    {model.id === 'shoe-02' && (
                      <span style={{ fontSize: '0.68rem', color: '#00F0FF', fontWeight: 600 }}>
                        3D Asset: Adidas Terrex
                      </span>
                    )}
                    {model.id === 'shoe-03' && (
                      <span style={{ fontSize: '0.68rem', color: '#E7A93B', fontWeight: 600 }}>
                        3D Asset: ECCO Trail Ridge
                      </span>
                    )}
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      From ₹{model.basePrice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Shoe Customization Control Panel */}
          <div
            className="surface-panel"
            style={{
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid var(--border-dim)',
              display: 'flex',
              flexDirection: 'column',
              gap: '26px'
            }}
          >
            <div>
              <span className="eyebrow">
                <Palette size={13} /> SHOE CUSTOMIZATION
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                {activeShoeModel.name}
              </h3>
              {activeShoeModel.id === 'shoe-02' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.25)', padding: '4px 10px', borderRadius: '6px', marginTop: '6px', marginBottom: '4px' }}>
                  <Sparkles size={12} color="#00F0FF" />
                  <span style={{ fontSize: '0.74rem', color: '#00F0FF', fontWeight: 600 }}>
                    3D Model: Adidas Terrex (High-Detail Trail Chassis & Reconstructed PBR)
                  </span>
                </div>
              )}
              {activeShoeModel.id === 'shoe-03' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(231, 169, 59, 0.1)', border: '1px solid rgba(231, 169, 59, 0.25)', padding: '4px 10px', borderRadius: '6px', marginTop: '6px', marginBottom: '4px' }}>
                  <Sparkles size={12} color="#E7A93B" />
                  <span style={{ fontSize: '0.74rem', color: '#E7A93B', fontWeight: 600 }}>
                    3D Model: ECCO Trail (High-Detail Photogrammetry & Reconstructed PBR)
                  </span>
                </div>
              )}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {activeShoeModel.description}
              </p>
            </div>

            {/* 1. Upper Primary Colorway */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                Upper Primary Color
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {COLOR_OPTIONS.map((col) => {
                  const isSelected = shoeColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setShoeColor(col.hex)}
                      title={col.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: isSelected ? '3px solid #fff' : '2px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <span
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: col.hex === '#F4F4F4' ? '#000' : '#fff'
                          }}
                        >
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Overlay / Cage Color */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                Structural Overlay / Cage Color
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {COLOR_OPTIONS.slice(0, 6).map((col) => {
                  const isSelected = shoeOverlayColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={`overlay-${col.name}`}
                      type="button"
                      onClick={() => setShoeOverlayColor(col.hex)}
                      title={`Overlay: ${col.name}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: col.hex,
                        border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 3. Upper Material Selection */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                Upper Material Finish
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {UPPER_MATERIALS.map((mat) => {
                  const isSelected = shoeMaterial === mat.id;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setShoeMaterial(mat.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? 'rgba(198, 241, 53, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-dim)',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'block', color: isSelected ? 'var(--primary)' : '#fff' }}>{mat.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{mat.desc.slice(0, 28)}...</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Text Personalization */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                <Type size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Personalized 3D Surface Text
              </span>
              <input
                type="text"
                maxLength={16}
                value={shoePersonalization}
                onChange={(e) => setShoePersonalization(e.target.value.toUpperCase())}
                placeholder="E.G. TAWFE SPEED 27"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Laser-rendered directly onto the 3D shoe upper collar. (+₹50)
              </span>
            </div>

            {/* 5. Shoe Size */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Shoe Size (EU Standard)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[38, 39, 40, 41, 42, 43, 44, 45, 46].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShoeSize(s)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: shoeSize === s ? 'var(--primary)' : 'var(--border-dim)',
                      backgroundColor: shoeSize === s ? 'var(--primary)' : 'transparent',
                      color: shoeSize === s ? '#000' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-dim)' }}>
              <button type="button" onClick={handleResetShoe} className="btn-secondary btn-sm">
                <RotateCcw size={13} /> Reset
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-primary"
                style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Continue to Sole Customizer</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: SOLE CUSTOMIZATION WORKSPACE */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* LEFT: 3D Viewport (ONLY renders selected sole!) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FootwearViewer3D
              mode="sole"
              soleVariantId={soleVariantId}
              soleConfig={{
                outsoleColor,
                midsoleColor,
                accentColor: soleAccentColor,
                ringColor,
                surfaceFinish,
                laserEngraving: soleEngraving
              }}
            />

            {/* Sole Category Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {SOLE_CATEGORIES.map((cat) => {
                const isSelected = cat.id === soleCategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSoleCategorySelect(cat.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: isSelected ? 'rgba(198, 241, 53, 0.12)' : 'rgba(15, 20, 26, 0.8)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-dim)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <strong style={{ fontSize: '0.88rem', display: 'block', color: isSelected ? '#fff' : 'inherit' }}>
                      {cat.name.split(' ')[0]}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      ₹{cat.basePrice} · {cat.thickness}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selectable Variants under Active Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                {activeSoleCategory.name} Variants:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {activeSoleCategory.variants.map((v) => {
                  const isSelected = v.id === soleVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSoleVariantSelect(v)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-dim)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.84rem', color: isSelected ? 'var(--primary)' : '#fff' }}>
                          {v.name}
                        </strong>
                        {isSelected && <Check size={14} color="var(--primary)" />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                        {v.desc.slice(0, 36)}...
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Sole Customization Control Panel */}
          <div
            className="surface-panel"
            style={{
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid var(--border-dim)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <span className="eyebrow">
                <Layers size={13} /> SOLE CUSTOMIZATION
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                {activeSoleVariant.name}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {activeSoleCategory.description}
              </p>
            </div>

            {/* 1. Outsole Tread Color */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Outsole Contact Tread Color
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {COLOR_OPTIONS.map((col) => {
                  const isSelected = outsoleColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={`sole-out-${col.name}`}
                      type="button"
                      onClick={() => setOutsoleColor(col.hex)}
                      title={col.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: isSelected ? '3px solid #fff' : '2px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 2. Midsole Sidewall Color */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Midsole Sidewall Color
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {COLOR_OPTIONS.slice(0, 7).map((col) => {
                  const isSelected = midsoleColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={`sole-mid-${col.name}`}
                      type="button"
                      onClick={() => setMidsoleColor(col.hex)}
                      title={`Midsole: ${col.name}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: col.hex,
                        border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 3. Twist-Lock Ring Color */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                PA66-GF30 Twist-Lock Ring Accent
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['#C6F135', '#00F0FF', '#C8161D', '#E7A93B', '#141416', '#F4F4F4'].map((hex) => {
                  const isSelected = ringColor.toLowerCase() === hex.toLowerCase();
                  return (
                    <button
                      key={`ring-${hex}`}
                      type="button"
                      onClick={() => setRingColor(hex)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        backgroundColor: hex,
                        border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 4. Surface Finish */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Tread Surface Finish
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'matte', label: 'Matte Standard' },
                  { id: 'textured', label: 'High-Grip Micro' },
                  { id: 'smooth', label: 'Slick Finish' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSurfaceFinish(f.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      backgroundColor: surfaceFinish === f.id ? 'rgba(198, 241, 53, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: surfaceFinish === f.id ? 'var(--primary)' : 'var(--border-dim)',
                      color: surfaceFinish === f.id ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Laser Engraving on Sole */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Laser Engraving on Midfoot Plate
              </span>
              <input
                type="text"
                maxLength={14}
                value={soleEngraving}
                onChange={(e) => setSoleEngraving(e.target.value.toUpperCase())}
                placeholder="E.G. TRAIL EXPLORER"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Precision micro-etched into PA66 twist-lock plate. (+₹50)
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-dim)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setCurrentStep(2)} className="btn-secondary btn-sm">
                  <ArrowLeft size={13} /> Edit Shoe
                </button>
                <button type="button" onClick={handleResetSole} className="btn-secondary btn-sm">
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="btn-primary"
                style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Preview Final Assembly</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 4: FINAL 3D PREVIEW & ASSEMBLY */}
      {/* ============================================================== */}
      {currentStep === 4 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* LEFT: Combined 3D Assembly Viewport */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FootwearViewer3D
              mode="assembly"
              shoeModelId={shoeModelId}
              shoeConfig={{
                color: shoeColor,
                overlayColor: shoeOverlayColor,
                accentColor: shoeAccentColor,
                material: shoeMaterial,
                personalizationText: shoePersonalization
              }}
              soleVariantId={soleVariantId}
              soleConfig={{
                outsoleColor,
                midsoleColor,
                accentColor: soleAccentColor,
                ringColor,
                surfaceFinish,
                laserEngraving: soleEngraving
              }}
              assemblyState={assemblyState}
              onAssemblyChange={setAssemblyState}
            />

            {/* Quick Assembly Explainer */}
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-dim)',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Interlocking PA66-GF30 4-Lug Bayonet Interface verified.</span>
              </div>
              <span className="badge-outline">COMPATIBILITY VERIFIED</span>
            </div>
          </div>

          {/* RIGHT: Complete Configuration Breakdown & Cart CTA */}
          <div
            className="surface-panel"
            style={{
              padding: '32px',
              borderRadius: '20px',
              border: '1px solid var(--border-active)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <span className="eyebrow">
                <Sparkles size={13} /> STEP 04 — FINAL PREVIEW & SUMMARY
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 4px' }}>
                Customized Modular Sneaker
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Review your configuration, edit individual components, or transfer to cart.
              </p>
            </div>

            {/* Configuration Summary Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Shoe Spec */}
              <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                    Shoe Chassis (EU {shoeSize})
                  </span>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{activeShoeModel.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: shoeColor, border: '1px solid #fff' }} />
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{shoeMaterial}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit3 size={12} /> Edit Shoe
                </button>
              </div>

              {/* Sole Spec */}
              <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
                    Modular Replacement Sole
                  </span>
                  <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{activeSoleVariant.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: outsoleColor, border: '1px solid #fff' }} />
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{activeSoleCategory.name} · {surfaceFinish}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit3 size={12} /> Edit Sole
                </button>
              </div>

              {/* Personalization Details */}
              {(shoePersonalization || soleEngraving) && (
                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)', fontSize: '0.8rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Personalization
                  </span>
                  {shoePersonalization && (
                    <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                      Shoe Upper: "{shoePersonalization}"
                    </div>
                  )}
                  {soleEngraving && (
                    <div style={{ color: 'var(--signal-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Sole Engraving: "{soleEngraving}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Total Price & Final Add to Cart Button */}
            <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Configured Price:</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                  ₹{calculatedPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ShoppingBag size={18} /> ADD CUSTOMIZED SHOE TO CART
                </button>

                <button
                  type="button"
                  onClick={handleSaveDesign}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '11px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Bookmark size={15} /> Save Design to Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ArrowRight, Sliders, ShieldCheck, Sparkles, RefreshCw, Zap, Layers, ChevronDown } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero3DCanvas from './components/Hero3DCanvas';
import ProblemComparisonSlider from './components/ProblemComparisonSlider';
import TwistLockMechanismDemo from './components/TwistLockMechanismDemo';
import SoleCollections from './components/SoleCollections';
import ShoeScanningExperience from './components/ShoeScanningExperience';
import ReFitUniversalSection from './components/ReFitUniversalSection';
import CustomSoleStudio from './components/CustomSoleStudio';
import MaterialsEngineering from './components/MaterialsEngineering';
import SustainabilitySection from './components/SustainabilitySection';
import ShoesCatalog from './components/ShoesCatalog';
import PricingBusinessModel from './components/PricingBusinessModel';
import HowItWorksAndUseCases from './components/HowItWorksAndUseCases';
import AboutAndFAQ from './components/AboutAndFAQ';
import ContactSection from './components/ContactSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';

function MainAppContent() {
  const { activeTab, setActiveTab } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customizerTier, setCustomizerTier] = useState('standard');

  const handleCustomizeSole = (tier) => {
    setCustomizerTier(tier || 'standard');
    setActiveTab('customize');
    const elem = document.getElementById('customize');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            {/* 1. IMMERSIVE HERO SECTION */}
            <section
              id="home"
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
                        <Sparkles size={13} /> SDG 12 · SDG 13 · SDG 8
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
                      <span className="text-signal">LESS WASTE.</span>
                    </h1>

                    <p
                      style={{
                        marginTop: '22px',
                        fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6
                      }}
                    >
                      Meet LoopStep — footwear engineered around a replaceable sole system. Keep the shoe you love, switch the sole you need, and take every step further without throwing away the whole pair.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '32px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const elem = document.getElementById('technology');
                          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                          else setActiveTab('technology');
                        }}
                        className="btn-primary"
                        style={{ padding: '14px 28px' }}
                      >
                        Explore the Technology <ArrowRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCustomizeSole('standard')}
                        className="btn-secondary"
                        style={{ padding: '14px 26px' }}
                      >
                        <Sliders size={16} /> Customize Your Sole
                      </button>
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
                      onExploreTech={() => {
                        const elem = document.getElementById('technology');
                        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onCustomize={handleCustomizeSole}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. THE PROBLEM (Why Replace the Whole Shoe?) */}
            <ProblemComparisonSlider />

            {/* 3. SIGNATURE FEATURE (Twist-Lock System 6-Step Demo) */}
            <TwistLockMechanismDemo />

            {/* 4. THREE TERRAIN-SPECIFIC SOLES & MATRIX */}
            <SoleCollections onCustomizeSole={handleCustomizeSole} />

            {/* 5. 3D SHOE SCANNING & SMART FITMENT */}
            <ShoeScanningExperience onProceedToCustomizer={(specs) => handleCustomizeSole('standard')} />

            {/* 6. REFIT UNIVERSAL SHOE CONVERSION */}
            <ReFitUniversalSection />

            {/* 7. CUSTOM SOLE STUDIO (Configurator) */}
            <CustomSoleStudio initialTier={customizerTier} />

            {/* 8. COMPLETE SHOES CATALOG */}
            <ShoesCatalog onCustomizeSole={handleCustomizeSole} />

            {/* 9. MATERIALS & ENGINEERING TRANSPARENCY */}
            <MaterialsEngineering />

            {/* 10. SUSTAINABILITY & CIRCULAR FOOTWEAR */}
            <SustainabilitySection />

            {/* 11. PRICING & BUSINESS MODEL */}
            <PricingBusinessModel />

            {/* 12. HOW IT WORKS & USE CASES */}
            <HowItWorksAndUseCases />

            {/* 13. ABOUT & FAQ */}
            <AboutAndFAQ />

            {/* 14. CONTACT & CLOSING CTA */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

import React, { useState } from 'react';
import { Leaf, Globe, HeartHandshake, Droplets, Wind, Scale, ArrowRight, ShieldCheck } from 'lucide-react';
import { SUSTAINABILITY_METRICS } from '../data/mockData';

export default function SustainabilitySection() {
  const [activeYears, setActiveYears] = useState(3);
  const [solesPerYear, setSolesPerYear] = useState(2);
  const [pairsReplaced, setPairsReplaced] = useState(2);

  // Calculations based on abstract figures
  // Conventional: 1 whole pair = 14.5 kg CO2, 0.85 kg landfill waste, 1,200L water, ₹3,000
  // LoopStep: 1 replacement sole = 2.6 kg CO2, 0.22 kg waste, 250L water, ₹200–500 (avg ₹350)
  const totalSolesSwapped = activeYears * solesPerYear;
  const wholeShoesAvoided = totalSolesSwapped; // each swap avoids 1 whole shoe replacement
  const co2SavedKg = Math.round(wholeShoesAvoided * (14.5 - 2.6));
  const landfillSavedKg = Math.round(wholeShoesAvoided * (0.85 - 0.22) * 10) / 10;
  const waterSavedLiters = wholeShoesAvoided * (1200 - 250);
  const moneySavedINR = wholeShoesAvoided * (3000 - 350);
  const solesDonated = wholeShoesAvoided; // 1:1 donation pledge

  return (
    <section id="sustainability" style={{ padding: '90px 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
          <span className="eyebrow">
            <Leaf size={13} /> Circular Footwear Model
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            LESS WASTE. <span className="text-signal">MORE MILES.</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Footwear accounts for roughly 1.4% of all global greenhouse gas emissions. LoopStep replaces the linear "take-make-dispose" model with a circular, repairable system aligned with the United Nations Sustainable Development Goals.
          </p>
        </div>

        {/* 3 SDG Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {SUSTAINABILITY_METRICS.sdgFocus.map((sdg) => (
            <div key={sdg.code} className="surface-panel" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="eyebrow" style={{ backgroundColor: 'rgba(198, 241, 53, 0.1)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                  {sdg.code}
                </span>
                {sdg.code === 'SDG 12' && <Scale size={20} color="var(--primary)" />}
                {sdg.code === 'SDG 13' && <Globe size={20} color="var(--primary)" />}
                {sdg.code === 'SDG 8' && <HeartHandshake size={20} color="var(--primary)" />}
              </div>

              <h3 style={{ fontSize: '1.25rem', marginTop: '18px' }}>{sdg.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.6 }}>
                {sdg.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 1:1 Social Impact Model Feature */}
        <div
          className="surface-panel"
          style={{
            padding: '36px',
            marginBottom: '60px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(198, 241, 53, 0.3)',
            background: 'linear-gradient(135deg, rgba(18,24,30,0.9) 0%, rgba(12,17,21,0.95) 100%)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ backgroundColor: 'rgba(0, 255, 102, 0.1)', borderColor: 'var(--signal-green)', color: 'var(--signal-green)' }}>
                1:1 Social Livelihood Pledge
              </span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '12px' }}>One Pair Sold. One Spare Sole Donated.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '10px', lineHeight: 1.6 }}>
                For every pair of LoopStep shoes purchased, we provide one spare replacement sole directly to cobblers and repair micro-enterprises in underserved communities. This supports local circular employment while ensuring low-income individuals have durable, repairable footwear.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dim)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>MICRO-ENTERPRISES</span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                  100% Direct
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Community cobbler partnerships</p>
              </div>

              <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dim)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>CIRCULAR RETURN</span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-green)', marginTop: '4px' }}>
                  10% Credit
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Discount on next sole with return</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Lifecycle Impact Calculator */}
        <div className="surface-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
            <span className="eyebrow">Personal Impact Modeling</span>
            <h3 style={{ fontSize: '1.8rem', marginTop: '10px' }}>Calculate Your Environmental & Financial Savings</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              See how many whole shoes, kilograms of CO2, liters of fresh water, and Indian rupees you save by switching to LoopStep.
            </p>
          </div>

          {/* Calculator Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                <span>Years of Shoe Ownership:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{activeYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={activeYears}
                onChange={(e) => setActiveYears(Number(e.target.value))}
                style={{ width: '100%', marginTop: '10px', accentColor: 'var(--primary)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                <span>Replacement Soles Swapped Per Year:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{solesPerYear} Swaps/Yr</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                value={solesPerYear}
                onChange={(e) => setSolesPerYear(Number(e.target.value))}
                style={{ width: '100%', marginTop: '10px', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          {/* Output Metric Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            <div style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <Globe size={24} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                {co2SavedKg} kg
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>CO2 Emissions Avoided</p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <Droplets size={24} color="var(--signal-cyan)" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--signal-cyan)' }}>
                {waterSavedLiters.toLocaleString()} L
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fresh Water Conserved</p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <Scale size={24} color="var(--signal-amber)" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--signal-amber)' }}>
                {landfillSavedKg} kg
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Landfill Waste Prevented</p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <HeartHandshake size={24} color="var(--signal-green)" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--signal-green)' }}>
                ₹{moneySavedINR.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Pocket Money Saved</p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '26px' }}>
            Illustrative calculations based on lifecycle footwear assessments (14.5 kg CO2 per conventional sneaker vs. 2.6 kg per modular sole). Modeled targets pending independent laboratory audit.
          </p>
        </div>
      </div>
    </section>
  );
}

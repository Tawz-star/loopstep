import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, BarChart3, HelpCircle, Layers, CheckCircle } from 'lucide-react';
import { BUSINESS_MODEL } from '../data/mockData';

export default function PricingBusinessModel() {
  const [projectedPairs, setProjectedPairs] = useState(5000);
  const [swapsPerPair, setSwapsPerPair] = useState(3);

  // Financial model calculations
  const totalSwaps = projectedPairs * swapsPerPair;
  // Complete shoe revenue: ₹3,000 * projectedPairs, profit: ₹760 * projectedPairs
  const shoeRevenue = projectedPairs * 3000;
  const shoeProfit = projectedPairs * 760;

  // Weighted sole price (avg ~₹400), weighted profit (avg ~₹270)
  const soleRevenue = totalSwaps * 400;
  const soleProfit = totalSwaps * 270;

  const totalGrossRevenue = shoeRevenue + soleRevenue;
  const totalNetProfit = shoeProfit + soleProfit;
  const totalSolesDonated = projectedPairs;

  return (
    <section id="business" style={{ padding: '90px 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
          <span className="eyebrow">
            <DollarSign size={13} /> Unit Economics & Feasibility
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            TRANSPARENT <span className="text-signal">BUSINESS MODEL</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Unlike traditional footwear brands reliant on planned obsolescence, LoopStep’s business model thrives on circular repeat-sole subscriptions and affordable modular replacement.
          </p>
        </div>

        {/* Complete Shoe Unit Economics Breakdown */}
        <div
          className="surface-panel"
          style={{
            padding: '36px',
            marginBottom: '50px',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '30px' }}>
            <div>
              <span className="eyebrow" style={{ backgroundColor: 'rgba(198, 241, 53, 0.1)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                Complete Shoe Pair Economics
              </span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '10px' }}>LoopStep Complete Pair · ₹3,000 MSRP</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>NET PROFIT MARGIN:</span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--signal-green)' }}>
                ~25.3%
              </p>
            </div>
          </div>

          {/* Cost Bar Visualization */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ height: '32px', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', backgroundColor: '#0f1418' }}>
              <div style={{ width: '58%', backgroundColor: '#3b82f6', display: 'grid', placeItems: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#fff' }} title="Manufacturing Cost: ₹1,740 (58%)">
                MFG ₹1,740 (58%)
              </div>
              <div style={{ width: '16.7%', backgroundColor: '#8b5cf6', display: 'grid', placeItems: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#fff' }} title="Operating Expenses: ₹500 (16.7%)">
                OPEX ₹500 (17%)
              </div>
              <div style={{ width: '25.3%', backgroundColor: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#000', fontWeight: 700 }} title="Estimated Profit: ₹760 (25.3%)">
                PROFIT ₹760 (25.3%)
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Manufacturing Cost: ₹1,740</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} /> Operating Expenses: ₹500</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} /> Net Profit: ₹760</span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Selling Price</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>₹3,000</p>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Cost</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--signal-amber)', marginTop: '4px' }}>₹2,240</p>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Net Profit</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--signal-green)', marginTop: '4px' }}>₹760</p>
            </div>
          </div>
        </div>

        {/* Replacement Products Profit Structure */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow">Recurring Revenue Engine</span>
            <h3 style={{ fontSize: '1.6rem', marginTop: '8px' }}>High-Margin Replacement Sole Units</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Unlike low-margin one-time footwear sales, modular sole replacements deliver consistent ~65% gross margins.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {BUSINESS_MODEL.replacementProducts.map((p) => (
              <div key={p.name} className="surface-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.15rem' }}>{p.name}</h4>
                  <span className="badge-outline" style={{ borderColor: 'var(--signal-green)', color: 'var(--signal-green)' }}>
                    {p.margin} Margin
                  </span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Manufacturing Cost:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>₹{p.mfgCost}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Selling Price:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>₹{p.sellingPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-dim)', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-main)' }}>Estimated Profit:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--signal-green)' }}>₹{p.profit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Scenario Revenue Simulator */}
        <div className="surface-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <div>
              <span className="eyebrow">Scalability Scenario Simulator</span>
              <h3 style={{ fontSize: '1.6rem', marginTop: '8px' }}>Projected Revenue & Social Impact</h3>
            </div>
            <span className="badge-outline">MODELING TOOL</span>
          </div>

          {/* Interactive Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '36px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                <span>Complete Shoe Pairs Sold:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{projectedPairs.toLocaleString()} Pairs</span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={1000}
                value={projectedPairs}
                onChange={(e) => setProjectedPairs(Number(e.target.value))}
                style={{ width: '100%', marginTop: '10px', accentColor: 'var(--primary)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                <span>Sole Swaps Per Customer (Over 3 Yrs):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{swapsPerPair} Swaps</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={swapsPerPair}
                onChange={(e) => setSwapsPerPair(Number(e.target.value))}
                style={{ width: '100%', marginTop: '10px', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          {/* Projected Outcomes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gross Revenue</span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                ₹{(totalGrossRevenue / 100000).toFixed(1)} <span style={{ fontSize: '0.9rem' }}>Lakh</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Shoe + sole repeat transactions</p>
            </div>

            <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Net Profit</span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-green)', marginTop: '4px' }}>
                ₹{(totalNetProfit / 100000).toFixed(1)} <span style={{ fontSize: '0.9rem' }}>Lakh</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Blended ~31% operating margin</p>
            </div>

            <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Community Soles Donated</span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-cyan)', marginTop: '4px' }}>
                {totalSolesDonated.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>1:1 shoe-repair pledge fulfilled</p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '24px' }}>
            Financial model based on LoopStep Hackathon Abstract. Figures represent project feasibility projections.
          </p>
        </div>
      </div>
    </section>
  );
}

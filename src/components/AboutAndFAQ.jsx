import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Sparkles, HelpCircle, Target, Users, ShieldCheck } from 'lucide-react';
import { FAQ_LIST } from '../data/mockData';

export default function AboutAndFAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_LIST.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* About & Mission Section */}
      <section id="about" style={{ padding: '90px 0', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
            <span className="eyebrow">Our Mission & Engineering Vision</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
              RETHINKING FOOTWEAR <span className="text-signal">FROM THE GROUND UP</span>
            </h2>
            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              LoopStep was born from a fundamental mechanical engineering observation: the component that touches the ground wears out six times faster than the upper wrapping the foot.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', marginBottom: '60px' }}>
            <div>
              <span className="eyebrow">The Engineering Hypothesis</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '12px' }}>Mechanical Elegance Over Complexity</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '14px' }}>
                Modern smart footwear is riddled with fragile motors, lithium-ion batteries, and Bluetooth electronics that break, require charging, and end up as hazardous electronic waste.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '14px' }}>
                LoopStep takes inspiration from time-tested mechanical couplings: camera bayonet mounts, ski bindings, and cycling cleats. A simple 45-degree rotation with a reinforced sprung detent delivers 7,000 N of retention force with zero electronics or wires.
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>NO BATTERIES</span>
                <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>NO GLUE FOR REPLACEMENTS</span>
                <span className="badge-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>10-SECOND SWAP</span>
              </div>
            </div>

            <div className="surface-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontSize: '1.3rem' }}>Five Pillars of LoopStep</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
                {[
                  { title: 'Modular Architecture', desc: 'Decoupling wear components from structural chassis.' },
                  { title: 'Material Circularity', desc: 'Recycled marine plastic uppers and 100% recyclable sole rubber.' },
                  { title: 'Affordable Upgrades', desc: 'New soles from ₹200 instead of ₹3,000+ for whole pairs.' },
                  { title: 'Universal ReFit Concept', desc: 'Extending modularity to existing legacy footwear.' },
                  { title: '1:1 Community Impact', desc: 'Donating soles to cobbler micro-enterprises with every sale.' }
                ].map((p, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                      0{i + 1}
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{p.title}: </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" style={{ padding: '90px 0', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-dim)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">Knowledge Base</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginTop: '14px', lineHeight: 1.15 }}>
              FREQUENTLY ASKED <span className="text-signal">QUESTIONS</span>
            </h2>
            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1rem' }}>
              Everything you need to know about the twist-lock mechanism, sole options, ReFit conversion, and sustainability.
            </p>

            {/* Search Input */}
            <div style={{ position: 'relative', maxWidth: '420px', margin: '24px auto 0' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="surface-panel"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                    overflow: 'hidden',
                    transition: '0.2s'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      color: isOpen ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 22px', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, borderTop: '1px solid var(--border-dim)', paddingTop: '16px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

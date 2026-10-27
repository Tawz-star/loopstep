import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ContactSection() {
  const { submitInquiry, setActiveTab } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Enquiry',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    submitInquiry(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: 'General Enquiry',
        subject: '',
        message: ''
      });
    }, 4000);
  };

  return (
    <section id="contact" style={{ padding: '90px 0', background: 'var(--bg-base)' }}>
      <div className="container">
        {/* Bold Closing Hero CTA */}
        <div
          className="surface-panel deep-glow"
          style={{
            padding: '60px 30px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '70px',
            border: '1px solid var(--border-active)',
            background: 'radial-gradient(circle at 50% 30%, #151d24 0%, #0c1014 90%)'
          }}
        >
          <span className="eyebrow" style={{ margin: '0 auto 16px' }}>
            <Sparkles size={13} /> The Modular Movement
          </span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            KEEP THE SHOE. <br />
            <span className="text-signal">CHANGE THE STEP.</span>
          </h2>
          <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '20px auto 0', lineHeight: 1.6 }}>
            Discover a different approach to footwear — designed for flexibility, personalization, and a more circular future.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', marginTop: '36px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('shoes')}
              className="btn-primary"
            >
              Explore the Collection <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('technology')}
              className="btn-secondary"
            >
              Discover the Sole System
            </button>
          </div>
        </div>

        {/* Contact Form & Investor Portal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'start' }}>
          <div>
            <span className="eyebrow">Connect With Us</span>
            <h3 style={{ fontSize: '2rem', marginTop: '12px' }}>Get in Touch with the LoopStep Team</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '14px' }}>
              We welcome dialogue with investors, hackathon evaluators, sustainability researchers, and retail cobbler micro-enterprises interested in our 1:1 donation partnership.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
              <div className="surface-panel" style={{ padding: '16px 20px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>HEADQUARTERS</span>
                <p style={{ fontSize: '0.9rem', color: '#fff', marginTop: '2px' }}>LoopStep Innovations Lab · Bengaluru, India</p>
              </div>

              <div className="surface-panel" style={{ padding: '16px 20px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>PARTNERSHIPS</span>
                <p style={{ fontSize: '0.9rem', color: '#fff', marginTop: '2px' }}>partnerships@loopstepfootwear.com</p>
              </div>

              <div className="surface-panel" style={{ padding: '16px 20px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>INVESTOR RELATIONS</span>
                <p style={{ fontSize: '0.9rem', color: '#fff', marginTop: '2px' }}>investors@loopstepfootwear.com</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="surface-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle2 size={48} color="var(--signal-green)" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.4rem' }}>Message Transmitted</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                  Thank you for reaching out! Our engineering and circularity teams will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Inquiry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Investor Inquiry">Investor / Funding Inquiry</option>
                    <option value="Hackathon Judge">Hackathon Evaluation / Judge</option>
                    <option value="Cobbler Micro-Enterprise">Cobbler Micro-Enterprise Partner (1:1 SDG 8)</option>
                    <option value="Bulk ReFit Order">Bulk ReFit Adapter Order</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your interest, query, or proposed collaboration..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                  <Send size={16} /> Send Message to LoopStep
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

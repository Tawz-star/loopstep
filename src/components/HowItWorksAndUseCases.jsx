import React from 'react';
import { Footprints, Sliders, RotateCw, Compass, ArrowRight, Activity, Mountain, Briefcase, Heart, Wrench, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function HowItWorksAndUseCases() {
  const { setActiveTab } = useStore();

  const STAGES = [
    {
      num: '01',
      title: 'Choose',
      desc: 'Select your LoopStep sneaker silhouette (Terra, Drift, Ridge) and your primary sole profile.',
      icon: Footprints
    },
    {
      num: '02',
      title: 'Customize',
      desc: 'Personalize base colorways, tread traction patterns, durometer hardness, and laser engraving in the 3D Studio.',
      icon: Sliders
    },
    {
      num: '03',
      title: 'Twist & Replace',
      desc: 'Rotate the worn sole 45° counter-clockwise to release, click in your replacement, and turn 45° clockwise.',
      icon: RotateCw
    },
    {
      num: '04',
      title: 'Step Forward',
      desc: 'Take every step with fresh traction while keeping the broken-in upper you love. Return worn rubber for 10% credit.',
      icon: Compass
    }
  ];

  const USE_CASES = [
    {
      title: 'Athletes & Runners',
      tagline: 'High rebound, zero wasted uppers',
      icon: Activity,
      sole: 'Sports Edition (12mm)',
      desc: 'Runners burn through outsoles every 500 km. LoopStep saves your broken-in upper and lets you slap on fresh carbon traction pods for ₹500.'
    },
    {
      title: 'Hikers & Outdoors',
      tagline: 'Jagged rock grip & mud clearance',
      icon: Mountain,
      sole: 'Trail Edition (15mm)',
      desc: 'Deep 5mm geometric lugs with ballistic rock protection shield your feet on backcountry trails without requiring a separate heavy boot.'
    },
    {
      title: 'Everyday Commuters',
      tagline: 'Lightweight city comfort',
      icon: Briefcase,
      sole: 'Standard Edition (8mm)',
      desc: 'City pavements wear down heel striking points quickly. Refresh your everyday sneakers for just ₹200 and walk quietly in plush comfort.'
    },
    {
      title: 'Eco-Conscious Consumers',
      tagline: 'True circular consumption',
      icon: Heart,
      sole: 'All Editions (1:1 Pledge)',
      desc: 'Cut shoe landfill waste by 70% and participate in our 1:1 donation model providing replacement soles to community repair micro-enterprises.'
    },
    {
      title: 'Existing Sneaker Owners',
      tagline: 'Right to repair for any brand',
      icon: Wrench,
      sole: 'ReFit Universal Kit (₹50)',
      desc: 'Have a favorite worn pair of Nike, Adidas, or Converse? Bond our ReFit adapter plate to convert them into modular twist-lock shoes forever.'
    }
  ];

  return (
    <>
      {/* 4-Stage How LoopStep Works */}
      <section style={{ padding: '90px 0', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
            <span className="eyebrow">The 4-Step Experience</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
              HOW LOOPSTEP <span className="text-signal">WORKS</span>
            </h2>
            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Footwear renewal designed to be as intuitive as clicking a ski binding or camera lens.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {STAGES.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.num} className="surface-panel" style={{ padding: '32px 24px', position: 'relative' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      opacity: 0.85
                    }}
                  >
                    {st.num}
                  </span>

                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center', marginTop: '16px' }}>
                    <Icon size={20} color="var(--primary)" />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginTop: '16px' }}>{st.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px', lineHeight: 1.5 }}>
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Customers & Use Cases */}
      <section style={{ padding: '90px 0', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
            <span className="eyebrow">Real World Applications</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
              TAILORED FOR <span className="text-signal">EVERY TERRAIN</span>
            </h2>
            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Different lifestyles place distinct demands on footwear outsoles. LoopStep adapts to each environment rather than forcing one compromised sole on everything.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              return (
                <div key={uc.title} className="surface-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center' }}>
                        <Icon size={22} color="var(--primary)" />
                      </div>
                      <span className="badge-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                        {uc.sole}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginTop: '18px' }}>{uc.title}</h3>
                    <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: '2px' }}>
                      {uc.tagline}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.5 }}>
                      {uc.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

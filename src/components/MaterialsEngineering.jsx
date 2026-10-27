import React, { useState } from 'react';
import { ShieldCheck, Cpu, Box, Flame, Activity, Layers, CheckCircle } from 'lucide-react';
import { ENGINEERING_SPECS } from '../data/mockData';

export default function MaterialsEngineering() {
  const [selectedHotspot, setSelectedHotspot] = useState(0);

  const HOTSPOTS = [
    {
      title: 'PA66-GF30 Twist-Lock Ring',
      material: 'Polyamide 66 + 30% Micro-Glass Fiber',
      role: 'Structural Core & Locking Interface',
      specs: '170–200 MPa Tensile · 180–250 MPa Compressive · 7,000 N Load Rating',
      desc: 'The same composite polymer used in heavy-duty automotive engine mounts and ski bindings. Extremely low creep deformation, high fatigue endurance across 10,000+ lock/unlock cycles, and absolute thermal stability between -40°C and 120°C.'
    },
    {
      title: 'Recycled Ocean-Plastic Mesh',
      material: '100% Post-Consumer Marine PET Yarn',
      role: 'Breathable, High-Flex Upper Body',
      specs: '3,000+ Running km Wear Resistance · Hydrophobic Treatment',
      desc: 'Intercepted coastal plastic bottles and discarded fishing nets mechanically flaked, extruded into micro-filaments, and woven into high-tensile zoned knit. Conforms dynamically to foot expansion during running while reducing virgin petroleum demand.'
    },
    {
      title: 'Natural Rubber Lateral Cage',
      material: 'FSC-Certified Vulcanized Hevea Rubber',
      role: 'Torsional Midfoot Support & Lace Anchor',
      specs: 'Bio-Based Polymer · Zero Phthalate Plasticizers',
      desc: 'Provides lateral stability during sharp athletic cuts, anchoring the eyestay harness directly into the midsole without adding rigid plastic weight.'
    },
    {
      title: 'Compression-Molded EVA Midsole',
      material: 'Recycled Ethylene-Vinyl Acetate (EVA)',
      role: 'Impact Energy Absorption Core',
      specs: '50% Kinetic Energy Rebound · 50 Shore A Durometer',
      desc: 'Lightweight foam core encapsulating the upper half of the PA66 twist-lock receiver plate, dampening heel strike shocks and preventing vibration transfer to the foot arch.'
    },
    {
      title: 'Interchangeable Outsole Base',
      material: 'Bio-Blended Carbon Rubber & TPU',
      role: 'Ground Contact Traction & Wear Surface',
      specs: 'Wave, Hex, or 5mm Lug Lugs · 65% Recycled Rubber Compound',
      desc: 'The only component that wears down during everyday activity. Formulated for aggressive grip on wet asphalt, gym courts, or alpine scree, and 100% recyclable upon return.'
    }
  ];

  return (
    <section id="engineering" style={{ padding: '90px 0', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-dim)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
          <span className="eyebrow">
            <Cpu size={13} /> Engineering Transparency
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '14px', lineHeight: 1.15 }}>
            MATERIALS & <span className="text-signal">MECHANICAL METRICS</span>
          </h2>
          <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every component in LoopStep is engineered for physical durability, non-destructive disassembly, and material circularity. No hidden adhesives, no planned obsolescence.
          </p>
        </div>

        {/* Engineering Performance Metric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '50px'
          }}
        >
          <div className="surface-panel" style={{ padding: '22px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>TENSILE STRENGTH</span>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
              170–200 <span style={{ fontSize: '0.95rem' }}>MPa</span>
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>PA66-GF30 locking teeth yield resistance</p>
          </div>

          <div className="surface-panel" style={{ padding: '22px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>TESTED LOAD LIMIT</span>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-green)', marginTop: '4px' }}>
              ~7,000 <span style={{ fontSize: '0.95rem' }}>N</span>
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>Safe vertical & shear load (~713 kgf)</p>
          </div>

          <div className="surface-panel" style={{ padding: '22px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>OPERATING TEMP</span>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-amber)', marginTop: '4px' }}>
              -40° to 120° <span style={{ fontSize: '0.95rem' }}>C</span>
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>Sub-zero mountain ice to desert tarmac</p>
          </div>

          <div className="surface-panel" style={{ padding: '22px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>MECHANICAL CYCLES</span>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--signal-cyan)', marginTop: '4px' }}>
              10,000+ <span style={{ fontSize: '0.95rem' }}>Locks</span>
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>Design cycle rating with zero tooth wear</p>
          </div>
        </div>

        {/* Interactive Hotspot Component Explorer */}
        <div
          className="surface-panel"
          style={{
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}
        >
          {/* Left Hotspot Navigator */}
          <div>
            <span className="eyebrow">Component Explorer</span>
            <h3 style={{ fontSize: '1.8rem', marginTop: '10px' }}>Explore the Layer Stack</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              Select a layer to inspect its raw material sourcing, physical role, and mechanical test specifications.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
              {HOTSPOTS.map((spot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedHotspot(idx)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${selectedHotspot === idx ? 'var(--primary)' : 'var(--border-dim)'}`,
                    backgroundColor: selectedHotspot === idx ? 'rgba(198, 241, 53, 0.08)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: '0.2s'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.92rem', fontWeight: 700, color: selectedHotspot === idx ? 'var(--primary)' : 'var(--text-main)' }}>
                      0{idx + 1} · {spot.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {spot.material}
                    </p>
                  </div>
                  {selectedHotspot === idx && <ShieldCheck size={18} color="var(--primary)" />}
                </button>
              ))}
            </div>
          </div>

          {/* Right Selected Component Deep-Dive Card */}
          <div
            style={{
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-light)'
            }}
          >
            <span className="badge-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
              SPEC SHEET 0{selectedHotspot + 1}
            </span>

            <h4 style={{ fontSize: '1.6rem', marginTop: '12px' }}>{HOTSPOTS[selectedHotspot].title}</h4>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)', marginTop: '4px' }}>
              {HOTSPOTS[selectedHotspot].role}
            </p>

            <div
              style={{
                marginTop: '18px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(14, 19, 24, 0.9)',
                border: '1px solid var(--border-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-main)'
              }}
            >
              METRIC: {HOTSPOTS[selectedHotspot].specs}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '18px' }}>
              {HOTSPOTS[selectedHotspot].desc}
            </p>
          </div>
        </div>

        {/* Upper Sourcing Material Breakdown */}
        <div style={{ marginTop: '50px' }}>
          <h4 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Complete Bill of Sustainable Materials</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {ENGINEERING_SPECS.upperMaterials.map((m, i) => (
              <div key={i} className="surface-panel" style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{m.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{m.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '30px' }}>
          Reported engineering values derived from the LoopStep Project Abstract & presentation prototype benchmarks. Component properties and system performance are distinct.
        </p>
      </div>
    </section>
  );
}

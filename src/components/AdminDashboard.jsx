import React, { useState } from 'react';
import { Lock, Unlock, Package, DollarSign, Users, ShieldAlert, Check, RefreshCw, Eye } from 'lucide-react';
import { COMPLETE_SHOES, SOLE_EDITIONS, REFIT_ADAPTER } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function AdminDashboard() {
  const { orders, inquiries, customPrices, updateProductPrice } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Price edit form state
  const [priceEdits, setPriceEdits] = useState({
    'sole-standard': customPrices['sole-standard'] || 200,
    'sole-sports': customPrices['sole-sports'] || 500,
    'sole-trail': customPrices['sole-trail'] || 700,
    'refit-adapter-kit': customPrices['refit-adapter-kit'] || 50
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput === 'loopstep') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSavePrice = (id) => {
    updateProductPrice(id, priceEdits[id]);
  };

  if (!isAuthenticated) {
    return (
      <section style={{ padding: '120px 0', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div className="surface-panel" style={{ padding: '36px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(198, 241, 53, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Lock size={26} color="var(--primary)" />
            </div>

            <h3 style={{ fontSize: '1.5rem' }}>Admin Access Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              Authorized administrators only. Default demo PIN: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>2026</span>
            </p>

            <form onSubmit={handleLogin} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="password"
                placeholder="Enter PIN (2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}
              />

              {pinError && (
                <p style={{ color: 'var(--signal-red)', fontSize: '0.78rem' }}>Invalid PIN. Please enter 2026.</p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '70px 0', minHeight: '80vh', background: 'var(--bg-dark)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div>
            <span className="eyebrow">
              <Unlock size={13} /> Secure Management Console
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px' }}>LoopStep Admin Dashboard</h2>
          </div>

          <button type="button" onClick={() => setIsAuthenticated(false)} className="btn-secondary btn-sm">
            Sign Out
          </button>
        </div>

        {/* Catalog Price Management */}
        <div className="surface-panel" style={{ padding: '30px', marginBottom: '36px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>Real-time Catalog Price Override</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Modify live prices for replacement soles and ReFit adapter. Changes persist directly into browser state.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {SOLE_EDITIONS.map((ed) => (
              <div key={ed.id} style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ed.name}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    type="number"
                    value={priceEdits[`sole-${ed.id}`] ?? ed.price}
                    onChange={(e) => setPriceEdits({ ...priceEdits, [`sole-${ed.id}`]: e.target.value })}
                    style={{ width: '100px', fontFamily: 'var(--font-mono)' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSavePrice(`sole-${ed.id}`)}
                    className="btn-primary btn-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}

            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Universal ReFit Adapter Kit</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="number"
                  value={priceEdits['refit-adapter-kit'] ?? 50}
                  onChange={(e) => setPriceEdits({ ...priceEdits, 'refit-adapter-kit': e.target.value })}
                  style={{ width: '100px', fontFamily: 'var(--font-mono)' }}
                />
                <button
                  type="button"
                  onClick={() => handleSavePrice('refit-adapter-kit')}
                  className="btn-primary btn-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Orders Record */}
        <div className="surface-panel" style={{ padding: '30px', marginBottom: '36px', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>Active Orders Record ({orders.length})</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER ID</th>
                <th style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>CUSTOMER</th>
                <th style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ITEMS</th>
                <th style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL</th>
                <th style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{ord.id}</td>
                  <td style={{ padding: '12px 14px', color: '#fff' }}>{ord.customer}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {ord.items?.map((it) => `${it.name} (x${it.quantity})`).join(', ') || 'Item'}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>₹{ord.total}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge-outline" style={{ color: 'var(--signal-green)', borderColor: 'var(--signal-green)' }}>
                      {ord.status || 'Confirmed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Inquiries Feed */}
        <div className="surface-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>Customer & Partner Inquiries ({inquiries.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {inquiries.map((inq) => (
              <div key={inq.id} style={{ padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <p style={{ fontWeight: 600, color: '#fff' }}>{inq.name}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({inq.email})</span>
                  </div>
                  <span className="badge-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    {inq.category || inq.type || 'General'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '8px' }}>
                  {inq.message}
                </p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '6px', display: 'block' }}>
                  Received: {inq.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Banknote, Truck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, total, placeOrder, clearCart } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment Method, 3: Confirmation
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    street: '42 Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    paymentMethod: 'UPI'
  });

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const handleNextToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOrder = () => {
    const order = placeOrder({
      name: formData.name,
      email: formData.email,
      address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      paymentMethod: formData.paymentMethod
    });

    setConfirmedOrder(order);
    setStep(3);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="surface-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '36px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-active)',
          boxShadow: 'var(--shadow-heavy)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span className="eyebrow">Demonstration Checkout Sandbox</span>
          <h3 style={{ fontSize: '1.6rem', marginTop: '8px' }}>
            {step === 1 ? 'Shipping Destination' : step === 2 ? 'Select Payment' : 'Order Placed Successfully'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {step < 3 ? 'Interactive mock transaction flow for hackathon demonstration.' : 'Thank you for choosing circular footwear.'}
          </p>
        </div>

        {/* STEP 1: SHIPPING FORM */}
        {step === 1 && (
          <form onSubmit={handleNextToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Delivery Address *</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>PIN *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '12px', padding: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Payable Amount:</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
                ₹{total}
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Continue to Payment Options <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Choose demonstration payment instrument:
            </p>

            {[
              { id: 'UPI', label: 'UPI / QR Code', icon: Smartphone, desc: 'Instant demo simulated payment' },
              { id: 'Card', label: 'Credit or Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
              { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Verified upon doorstep delivery' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: p.id })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${formData.paymentMethod === p.id ? 'var(--primary)' : 'var(--border-dim)'}`,
                  backgroundColor: formData.paymentMethod === p.id ? 'rgba(198, 241, 53, 0.08)' : 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <p.icon size={22} color={formData.paymentMethod === p.id ? 'var(--primary)' : 'var(--text-muted)'} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.92rem', color: formData.paymentMethod === p.id ? 'var(--primary)' : 'var(--text-main)' }}>
                    {p.label}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</p>
                </div>
                {formData.paymentMethod === p.id && <CheckCircle2 size={18} color="var(--primary)" />}
              </button>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>
                Back
              </button>
              <button type="button" onClick={handleCompleteOrder} className="btn-primary" style={{ flex: 2 }}>
                Confirm Demo Order (₹{total})
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED */}
        {step === 3 && confirmedOrder && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 102, 0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="var(--signal-green)" />
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)' }}>
              ORDER ID: {confirmedOrder.id}
            </p>
            <h4 style={{ fontSize: '1.6rem', marginTop: '6px' }}>Shipment Registered!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
              A confirmation receipt has been simulated for {confirmedOrder.customer} ({confirmedOrder.email}).
            </p>

            {/* Tracking Card */}
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>CARRIER TRACKING:</span>
                <span style={{ color: 'var(--signal-green)' }}>{confirmedOrder.tracking}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '8px' }}>
                Delivery to: {confirmedOrder.address}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '6px', fontWeight: 600 }}>
                1:1 Community Sole Donated on your behalf.
              </p>
            </div>

            <button type="button" onClick={onClose} className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Return to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

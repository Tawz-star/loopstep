import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Tag, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import CheckoutModal from '../components/CheckoutModal';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    recycleDiscountActive,
    setRecycleDiscountActive,
    appliedPromo,
    setAppliedPromo,
    clearCart
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'LOOP15') {
      setAppliedPromo('LOOP15');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try LOOP15 for 15% off.');
    }
  };

  const discountAmount = recycleDiscountActive ? Math.round(subtotal * 0.1) : 0;
  const promoAmount = appliedPromo === 'LOOP15' ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount - promoAmount);

  return (
    <div style={{ padding: '40px 0 90px' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)' }}>Shopping Cart</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Your Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
              Review your modular footwear items, custom 3D sole configurations, and checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div
            style={{
              padding: '60px 20px',
              borderRadius: '24px',
              backgroundColor: 'rgba(15, 20, 26, 0.8)',
              border: '1px solid var(--border-dim)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--text-dim)'
              }}
            >
              <ShoppingBag size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '8px auto 24px' }}>
              Looks like you haven't added any modular shoes or configured 3D soles yet.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Link to="/sole-studio" className="btn-primary" style={{ padding: '12px 24px' }}>
                Open 3D Sole Studio
              </Link>
              <Link to="/shop" className="btn-secondary" style={{ padding: '12px 22px' }}>
                Explore Shop
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'start'
            }}
          >
            {/* Left: Cart Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  style={{
                    display: 'flex',
                    gap: '18px',
                    padding: '20px',
                    borderRadius: '18px',
                    backgroundColor: 'rgba(15, 20, 26, 0.8)',
                    border: '1px solid var(--border-dim)'
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '12px',
                      backgroundColor: '#0a0d11',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.image || '/models/loopstep-configured-sole.png'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          {item.category || 'Footwear'}
                        </span>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 4px' }}>{item.name}</h3>
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Custom 3D Specs Badge if available */}
                    {item.customDetails && (
                      <div
                        style={{
                          margin: '8px 0',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-dim)',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: '#fff' }}>Configured 3D Sole:</span>
                          <span style={{ color: 'var(--primary)' }}>{item.customDetails.category}</span>
                          <span>·</span>
                          <span>Tread: {item.customDetails.treadPattern}</span>
                        </div>
                        {item.customDetails.laserEngraving && item.customDetails.laserEngraving !== 'NONE' && (
                          <div>Laser Engraving: <code>{item.customDetails.laserEngraving}</code></div>
                        )}
                      </div>
                    )}

                    {/* Quantity & Delete Controls */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-dim)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem'
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary Card */}
            <div
              style={{
                padding: '28px',
                borderRadius: '20px',
                backgroundColor: 'rgba(15, 20, 26, 0.95)',
                border: '1px solid var(--border-dim)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹{subtotal}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Carbon-Neutral Shipping</span>
                  <span style={{ color: 'var(--signal-green)', fontWeight: 600 }}>FREE</span>
                </div>

                {recycleDiscountActive && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--signal-green)' }}>
                    <span>Sole Return Credit (10%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                    <span>Coupon ({appliedPromo})</span>
                    <span>-₹{promoAmount}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-dim)',
                    fontSize: '1.25rem',
                    fontWeight: 800
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{finalTotal}</span>
                </div>
              </div>

              {/* Recycle Old Sole Option */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={recycleDiscountActive}
                  onChange={(e) => setRecycleDiscountActive(e.target.checked)}
                  style={{ accentColor: 'var(--signal-blue)', marginTop: '3px' }}
                />
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                    I will send back a worn sole (-10% Credit)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    Includes prepaid return mailer. Recycled rubber feeds our 1:1 donation initiative.
                  </span>
                </div>
              </label>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Promo Code (Try LOOP15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-dim)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    fontSize: '0.8rem'
                  }}
                />
                <button
                  type="submit"
                  className="btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '0.8rem' }}
                >
                  Apply
                </button>
              </form>
              {promoError && <span style={{ fontSize: '0.72rem', color: 'var(--signal-amber)' }}>{promoError}</span>}

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="btn-primary"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Proceed to Checkout <ArrowRight size={17} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <ShieldCheck size={14} color="var(--primary)" /> 30-Day Fit Guarantee · Free Sole Swaps
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      </div>
    </div>
  );
}

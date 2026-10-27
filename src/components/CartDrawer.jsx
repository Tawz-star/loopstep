import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartDrawer({ onCheckout }) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    recycleDiscountActive,
    setRecycleDiscountActive,
    recycleDiscount,
    promoCode,
    setPromoCode,
    appliedPromo,
    setAppliedPromo,
    promoDiscount,
    total,
    isCartOpen,
    setIsCartOpen
  } = useStore();

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'LOOP15') {
      setAppliedPromo('LOOP15');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-heavy)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-dim)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Modular Cart</h3>
            <span className="badge-outline">{cart.length} items</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '40px 0' }}>
              <ShoppingBag size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                Explore complete shoes or pick terrain-specific replacement soles.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-dim)'
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#0a0d10',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={item.image || '/images/sole-standard.jpg'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 600 }}>{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ color: 'var(--text-dim)', padding: '2px' }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {item.edition || item.category} {item.size ? `· EU ${item.size}` : ''}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-light)',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', width: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-light)',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-dim)', backgroundColor: 'var(--bg-surface)' }}>
            {/* Recycle Return Incentive Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: recycleDiscountActive ? 'rgba(0, 255, 102, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${recycleDiscountActive ? 'var(--signal-green)' : 'var(--border-dim)'}`,
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <input
                type="checkbox"
                checked={recycleDiscountActive}
                onChange={(e) => setRecycleDiscountActive(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--signal-green)' }}
              />
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600, color: recycleDiscountActive ? 'var(--signal-green)' : 'var(--text-main)' }}>
                  Returning a worn sole for circular recycling?
                </span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  Receive a 10% instant rebate on this order.
                </p>
              </div>
            </label>

            {/* Promo Code Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="PROMO CODE (e.g. LOOP15)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
              <button type="button" onClick={handleApplyPromo} className="btn-secondary btn-sm">
                Apply
              </button>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{subtotal}</span>
              </div>

              {recycleDiscountActive && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--signal-green)' }}>
                  <span>Sole Recycle Rebate (10%):</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-₹{recycleDiscount}</span>
                </div>
              )}

              {appliedPromo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                  <span>Promo {appliedPromo} (15%):</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-₹{promoDiscount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Carbon Neutral Delivery:</span>
                <span style={{ color: 'var(--signal-green)', fontFamily: 'var(--font-mono)' }}>FREE</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-dim)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: '#fff'
                }}
              >
                <span>Estimated Total:</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>₹{total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                if (onCheckout) onCheckout();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
            >
              Proceed to Demo Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Sliders, Filter, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { COMPLETE_SHOES, SOLE_EDITIONS, REFIT_ADAPTER } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export default function ShopPage() {
  const { addToCart, showToast } = useStore();
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'shoes', 'soles', 'refit'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  // Combine catalog items
  const allProducts = [
    ...COMPLETE_SHOES.map((s) => ({ ...s, type: 'shoes', categoryLabel: 'Complete Modular Shoe' })),
    ...SOLE_EDITIONS.map((s) => ({ ...s, type: 'soles', categoryLabel: 'Replacement Twist-Lock Sole' })),
    {
      id: REFIT_ADAPTER.id,
      name: REFIT_ADAPTER.name,
      price: REFIT_ADAPTER.price,
      image: REFIT_ADAPTER.image,
      type: 'refit',
      categoryLabel: 'Universal Conversion Kit',
      desc: 'Retrofit PA66 twist-lock adapter plate and 3M structural adhesive to convert any existing shoe.',
      colors: ['Matte Black', 'Chalk White'],
      defaultColor: 'Matte Black'
    }
  ];

  // Filtering
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = filterCategory === 'all' || product.type === filterCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.desc && product.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id] || (product.type === 'refit' ? 'Universal' : 42);
    addToCart({
      id: `${product.id}-${size}`,
      name: `${product.name} (${size})`,
      price: product.price,
      image: product.image,
      category: product.categoryLabel,
      size,
      quantity: 1
    });
  };

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            <ShoppingBag size={13} /> OFFICIAL STORE
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 800, marginTop: '10px', letterSpacing: '-0.02em' }}>
            LoopStep Modular Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '12px' }}>
            Buy complete shoes, stock up on replacement soles from ₹200, or convert your own favorite pairs with ReFit™.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: 'rgba(15, 20, 26, 0.8)',
            border: '1px solid var(--border-dim)',
            marginBottom: '36px'
          }}
        >
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { id: 'all', label: 'All Products' },
              { id: 'shoes', label: 'Complete Shoes' },
              { id: 'soles', label: 'Replacement Soles' },
              { id: 'refit', label: 'ReFit™ Adapters' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: filterCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                  backgroundColor: filterCategory === cat.id ? 'rgba(198, 241, 53, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: filterCategory === cat.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '10px',
                border: '1px solid var(--border-dim)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '0.84rem'
              }}
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || (product.type === 'refit' ? 'Universal' : 42);
            return (
              <div
                key={product.id}
                className="card-interactive"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-dim)'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '240px', backgroundColor: '#0a0d11', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(12, 16, 20, 0.85)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)'
                    }}
                  >
                    {product.categoryLabel}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(12, 16, 20, 0.85)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: 'var(--primary)'
                    }}
                  >
                    ₹{product.price}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>{product.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {product.desc}
                  </p>

                  {/* Size Selector for Shoes / Soles */}
                  {product.type !== 'refit' && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Size: EU {currentSize}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {[39, 40, 41, 42, 43, 44, 45].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleSizeSelect(product.id, s)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: currentSize === s ? '1px solid var(--primary)' : '1px solid var(--border-dim)',
                              backgroundColor: currentSize === s ? 'rgba(198, 241, 53, 0.15)' : 'rgba(255,255,255,0.02)',
                              color: currentSize === s ? 'var(--primary)' : 'var(--text-muted)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '11px', fontSize: '0.84rem' }}
                    >
                      <ShoppingBag size={15} /> Add to Cart
                    </button>

                    {(product.type === 'soles' || product.type === 'shoes') && (
                      <Link
                        to="/sole-studio"
                        state={{
                          scannedSpecs: {
                            category: product.type === 'soles' ? product.id : 'standard'
                          }
                        }}
                        className="btn-secondary"
                        style={{ padding: '11px 14px', fontSize: '0.84rem' }}
                        title="Customize in 3D"
                      >
                        <Sliders size={15} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

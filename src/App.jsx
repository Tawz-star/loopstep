import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

// Pages
import HomePage from './pages/HomePage';
import TechnologyPage from './pages/TechnologyPage';
import ScanPage from './pages/ScanPage';
import SoleStudioPage from './pages/SoleStudioPage';
import ReFitPage from './pages/ReFitPage';
import SolesPage from './pages/SolesPage';
import ShopPage from './pages/ShopPage';
import SustainabilityPage from './pages/SustainabilityPage';
import MaterialsPage from './pages/MaterialsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

// Helper to scroll to top on every route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function MainAppShell() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)'
      }}
    >
      <ScrollToTop />

      {/* Persistent Premium Navbar */}
      <Navbar />

      {/* Routed Pages */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/3d-scan" element={<ScanPage />} />
          <Route path="/sole-studio" element={<SoleStudioPage />} />
          <Route path="/customize" element={<SoleStudioPage />} />
          <Route path="/refit" element={<ReFitPage />} />
          <Route path="/soles" element={<SolesPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Quick Slide-Over Cart Drawer */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Global Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <MainAppShell />
      </BrowserRouter>
    </StoreProvider>
  );
}

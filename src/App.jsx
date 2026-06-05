import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import ContactUs from './pages/ContactUs';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import AdminComplaints from './pages/AdminComplaints';
import AdminComplaintDetails from './pages/AdminComplaintDetails';
import AdminStock from './pages/AdminStock';
import Admin2FASetup from './pages/Admin2FASetup';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import { API_BASE_URL } from './apiConfig';

// ── PREMIUM SPLASH SCREEN ──────────────────────────────────
const SplashScreen = ({ onReady }) => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate loading dots
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return p + Math.random() * 8;
      });
    }, 200);

    // Warm up backend + wait minimum 1.5s for UX
    const warmup = async () => {
      const startTime = Date.now();
      try {
        await fetch(`${API_BASE_URL}/api/health`, { method: 'GET', cache: 'no-store' });
      } catch (e) {
        // Backend might be starting — that's ok
      }
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1500 - elapsed);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          clearInterval(dotInterval);
          clearInterval(progressInterval);
          onReady();
        }, 400);
      }, remaining);
    };

    warmup();
    return () => {
      clearInterval(dotInterval);
      clearInterval(progressInterval);
    };
  }, [onReady]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'linear-gradient(135deg, #1a0010 0%, #3d0020 50%, #600030 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        animation: 'pulse 3s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '5%',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,26,74,0.15) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite 1s',
      }} />

      {/* Logo */}
      <div style={{
        width: '90px', height: '90px', borderRadius: '50%',
        background: 'white', marginBottom: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(212,175,55,0.3)',
        border: '3px solid rgba(212,175,55,0.4)',
        overflow: 'hidden',
      }}>
        <img src="/logo.png" alt="Bharti Glooms" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Brand name */}
      <h1 style={{
        color: 'white', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
        fontWeight: 900, letterSpacing: '4px', margin: '0 0 6px',
        textTransform: 'uppercase', fontFamily: "'Playfair Display', serif",
      }}>
        Bharti Glooms
      </h1>
      <p style={{
        color: 'rgba(212,175,55,0.8)', fontSize: '0.8rem',
        letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 48px',
      }}>
        Premium Ethnic Wear
      </p>

      {/* Progress bar */}
      <div style={{
        width: 'min(280px, 70vw)', height: '3px',
        background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
        marginBottom: '20px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '10px',
          background: 'linear-gradient(90deg, #D4AF37, #f0c040)',
          width: `${progress}%`,
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(212,175,55,0.5)',
        }} />
      </div>

      <p style={{
        color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem',
        letterSpacing: '1px',
      }}>
        Loading collection{dots}
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ── APP LAYOUT ─────────────────────────────────────────────
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/complaints/view/:id" element={<AdminComplaintDetails />} />
        <Route path="/admin/stock/:status" element={<AdminStock />} />
        <Route path="/admin/orders/:status" element={<AdminOrders />} />
        <Route path="/admin/orders/view/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/invoice/:id" element={<Invoice />} />
        <Route path="/admin/2fa-setup" element={<Admin2FASetup />} />
      </Routes>
    </>
  );
};

// ── MAIN APP ───────────────────────────────────────────────
function App() {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      {!isReady && <SplashScreen onReady={() => setIsReady(true)} />}
      <div style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <Router>
          <WishlistProvider>
            <CartProvider>
              <AppLayout />
            </CartProvider>
          </WishlistProvider>
        </Router>
      </div>
    </>
  );
}

export default App;

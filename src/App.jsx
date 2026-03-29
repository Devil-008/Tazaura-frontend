import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoaderProvider } from './context/LoaderContext';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';

import Landing from './pages/Landing/Landing';
import ProductList from './pages/ProductList/ProductList';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import AdminDashboard from './pages/admin/AdminDashboard';

// ── Protected route wrapper ─────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// ── Global error event → auto-toast ────────────────────────────────────
function GlobalErrorListener() {
  useEffect(() => {
    const handler = (e) => toast.error(e.detail, { id: 'api-error' });
    window.addEventListener('api:error', handler);
    return () => window.removeEventListener('api:error', handler);
  }, []);
  return null;
}

function AppInner() {
  return (
    <BrowserRouter>
      <GlobalErrorListener />
      <Loader />
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--clr-surface)',
            color: 'var(--clr-text)',
            border: '1px solid var(--clr-border)',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#636B2F', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <AuthProvider>
          <CartProvider>
            <AppInner />
          </CartProvider>
        </AuthProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
}

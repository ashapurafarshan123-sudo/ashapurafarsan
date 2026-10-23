import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { Footer } from './components/Footer';

// Route Guards
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { GuestRoute } from './components/auth/GuestRoute';

// Lazy-loaded Public Routes
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy-loaded Auth Routes
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Lazy-loaded Customer Account Routes
const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const AccountOverview = lazy(() => import('./pages/account/AccountOverview'));
const AccountOrders = lazy(() => import('./pages/account/AccountOrders'));
const OrderDetail = lazy(() => import('./pages/account/OrderDetail'));
const AccountProfile = lazy(() => import('./pages/account/AccountProfile'));
const AccountAddresses = lazy(() => import('./pages/account/AccountAddresses'));

// Lazy-loaded Admin Routes
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Page loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-cream-50">
    <div className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
  </div>
);

// App Layout Shell (Hides storefront header/footer when in dedicated admin workspace)
const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-brown-900 selection:bg-orange-500 selection:text-white">
      {/* Show storefront header on public & account routes */}
      {!isAdminPath && <Header />}

      {/* Main Content Area */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Authentication Routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Customer Account Dashboard */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountOverview />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="profile" element={<AccountProfile />} />
              <Route path="addresses" element={<AccountAddresses />} />
            </Route>

            {/* Admin Management Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Slide-in Cart Drawer on storefront */}
      {!isAdminPath && <CartDrawer />}

      {/* Sticky Mobile Order Bar (<640px) on storefront */}
      {!isAdminPath && <StickyMobileBar />}

      {/* Global Footer on storefront */}
      {!isAdminPath && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppShell />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};
export default App;

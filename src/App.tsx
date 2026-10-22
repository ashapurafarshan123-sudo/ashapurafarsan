import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { Footer } from './components/Footer';

// Lazy-loaded routes per performance requirements
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));

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

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-cream-50 text-brown-900 selection:bg-orange-500 selection:text-white">
            {/* Header */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/place-order" element={<PlaceOrder />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>

            {/* Slide-in Cart Drawer */}
            <CartDrawer />

            {/* Sticky Mobile Order Bar (<640px) */}
            <StickyMobileBar />

            {/* Global Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
};
export default App;

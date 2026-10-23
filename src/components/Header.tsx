import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Menu, X, Search, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { totalItems, openDrawer } = useCart();
  const { user, profile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 25;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Place Order', path: '/place-order' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Dynamic user account destination
  const userAccountPath = isAdmin ? '/admin' : user ? '/account' : '/login';
  const userAriaLabel = isAdmin
    ? 'Admin Dashboard'
    : user
    ? `Customer Account (${profile?.full_name || user.email})`
    : 'Sign in to your customer account';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-transparent border-b-0 shadow-none pt-2 sm:pt-3.5 pb-1 px-3 sm:px-6 md:px-8 pointer-events-none'
          : 'bg-cream-100 border-b border-line shadow-[0_2px_12px_rgba(120,70,20,0.03)] pt-0 pb-0 px-0 pointer-events-auto'
      }`}
    >
      <div
        className={`transition-all duration-300 ease-out flex items-center justify-between relative pointer-events-auto ${
          isScrolled
            ? 'max-w-[1240px] mx-auto h-[56px] sm:h-[66px] px-3.5 sm:px-6 bg-[rgba(255,251,245,0.97)] backdrop-blur-md rounded-2xl sm:rounded-full border border-[#E6D0B4] shadow-[0_12px_36px_rgba(58,27,16,0.14)]'
            : 'container-custom w-full h-[66px] sm:h-[78px] bg-transparent border-none rounded-none shadow-none'
        }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo compact={isScrolled} />
        </div>

        {/* Center-Left: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[26px] xl:gap-[30px] h-full" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive: active }) =>
                  `relative h-full flex items-center text-[13px] font-sans transition-colors focus:outline-none focus-visible:text-orange-600 ${
                    active
                      ? 'text-orange-600 font-semibold'
                      : 'text-brown-900 font-medium hover:text-orange-600'
                  }`
                }
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 -left-1.5 -right-1.5 h-[2.5px] bg-orange-600 rounded-t-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Search Bar */}
        <div
          className={`hidden xl:block transition-all duration-300 ${
            isScrolled ? 'w-[290px]' : 'w-[335px]'
          }`}
        >
          <SearchBar />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3.5">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="xl:hidden p-1.5 xs:p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-brown-900 hover:text-orange-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label="Toggle search bar"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* User Icon -> /account, /admin, or /login */}
          <Link
            to={userAccountPath}
            className="relative p-1.5 xs:p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-brown-900 hover:text-orange-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label={userAriaLabel}
            title={userAriaLabel}
          >
            {isAdmin ? (
              <ShieldCheck size={20} strokeWidth={1.8} className="text-orange-600" />
            ) : (
              <User size={20} strokeWidth={1.5} />
            )}
            {user && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-500 border border-white" />
            )}
          </Link>

          {/* Cart Icon with Red Badge */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative p-1.5 xs:p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-brown-900 hover:text-orange-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label={`Open shopping cart with ${totalItems} items`}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <AnimatePresence>
              {totalItems >= 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute top-1 right-1 w-[16px] h-[16px] rounded-full bg-badge-red text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm pointer-events-none"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 xs:p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-brown-900 hover:text-orange-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Search Row Bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`xl:hidden absolute left-0 right-0 shadow-xl z-30 ${
                isScrolled
                  ? 'top-full mt-2.5 bg-[#FFFBF5]/95 backdrop-blur-md rounded-2xl border border-line p-3'
                  : 'top-[78px] bg-cream-100 border-b border-line px-4 py-3'
              }`}
            >
              <SearchBar onSearchSubmitted={() => setMobileSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`lg:hidden absolute left-0 right-0 shadow-2xl z-30 flex flex-col gap-4 ${
                isScrolled
                  ? 'top-full mt-2.5 bg-cream-50/98 backdrop-blur-md rounded-2xl border border-line p-5'
                  : 'top-[78px] bg-cream-50 border-b border-line px-6 py-6'
              }`}
            >
              <nav className="flex flex-col gap-2.5" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `py-2 text-[14.5px] border-b border-line/40 transition-colors font-sans ${
                        isActive ? 'text-orange-600 font-semibold pl-2' : 'text-brown-900 font-medium'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {/* Account / Admin Link in Mobile Drawer */}
                <div className="pt-2 border-t border-line/60">
                  {isAdmin ? (
                    <NavLink
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-[14.5px] text-orange-600 font-bold"
                    >
                      <ShieldCheck size={16} />
                      <span>Admin Management Dashboard</span>
                    </NavLink>
                  ) : user ? (
                    <NavLink
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-[14.5px] text-orange-600 font-bold"
                    >
                      <User size={16} />
                      <span>My Account ({profile?.full_name || 'Customer'})</span>
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-[14.5px] text-brown-900 font-semibold hover:text-orange-600"
                    >
                      <User size={16} />
                      <span>Sign In / Register</span>
                    </NavLink>
                  )}
                </div>
              </nav>

              <div className="pt-2 text-xs text-brown-500 font-sans">
                <p className="font-semibold text-brown-900">Ashapura Farsan</p>
                <p>Shop No 15, Shantipark, Mira Road</p>
                <p className="mt-1">Call / WhatsApp: +91 79 7733 8814</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
export default Header;

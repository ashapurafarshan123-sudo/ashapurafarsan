import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag, end: false },
    { name: 'Products & Pricing', path: '/admin/products', icon: Package, end: false },
    { name: 'Customer Accounts', path: '/admin/customers', icon: Users, end: false },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings, end: false },
  ];

  const adminName = profile?.full_name || user?.email?.split('@')[0] || 'Store Administrator';

  return (
    <>
      <SEO
        title="Admin Portal - Ashapura Farsan"
        description="Secure management portal for Ashapura Farsan store operators."
      />

      <div className="min-h-screen bg-cream-50 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-brown-900 text-white border-b border-brown-800 sticky top-0 z-40">
          <div className="container-custom flex items-center justify-between h-14 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-white/80 hover:text-white rounded-lg focus:outline-none"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-peach-100">Ashapura</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-600 text-white flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-peach-200 hover:text-white transition-colors"
              >
                <span>View Live Store</span>
                <ExternalLink size={12} />
              </Link>

              <div className="h-4 w-px bg-white/20 hidden sm:block" />

              <span className="text-white/80 hidden md:inline">{adminName}</span>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors font-semibold"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Workspace Body */}
        <div className="flex-1 container-custom py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside
            className={`lg:col-span-3 ${
              mobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white border border-line rounded-card p-3 shadow-card sticky top-20">
              <div className="p-2 mb-2 border-b border-line">
                <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
                  Store Administration
                </p>
              </div>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'text-brown-700 hover:bg-cream-100 hover:text-orange-600'
                        }`
                      }
                    >
                      <Icon size={16} />
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}

                <div className="pt-2 border-t border-line mt-3 sm:hidden">
                  <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-brown-700 hover:bg-cream-100"
                  >
                    <ExternalLink size={15} />
                    <span>View Storefront</span>
                  </Link>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Work Area */}
          <main className="lg:col-span-9 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
export default AdminLayout;

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { ShoppingBag, User, MapPin, LogOut, Package, ShieldCheck } from 'lucide-react';

export const AccountLayout: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Account Overview', path: '/account', icon: User, end: true },
    { name: 'My Orders', path: '/account/orders', icon: Package, end: false },
    { name: 'Profile Details', path: '/account/profile', icon: User, end: false },
    { name: 'Saved Addresses', path: '/account/addresses', icon: MapPin, end: false },
  ];

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer';

  return (
    <>
      <SEO
        title="My Account - Ashapura Farsan"
        description="Manage your Ashapura Farsan customer account, track current and past farsan deliveries, and update profile settings."
      />

      <div className="bg-cream-50 min-h-[85vh] py-8 sm:py-12">
        <div className="container-custom max-w-6xl">
          {/* Header Bar */}
          <div className="bg-white border border-line rounded-card p-6 sm:p-7 shadow-card mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-peach-100 border border-orange-200 text-orange-600 font-serif font-bold text-xl flex items-center justify-center">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-brown-900 text-xl sm:text-2xl">
                    Namaste, {displayName}
                  </h1>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 border border-amber-300">
                      <ShieldCheck size={12} />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-brown-500 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="px-4 py-2 bg-brown-900 hover:bg-brown-800 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  <span>Admin Panel</span>
                </NavLink>
              )}
              <NavLink
                to="/shop"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>Shop Now</span>
              </NavLink>
            </div>
          </div>

          {/* Main Grid: Sidebar & Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <div className="bg-white border border-line rounded-card p-3 shadow-card sticky top-24">
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-orange-600 text-white shadow-sm'
                              : 'text-brown-700 hover:bg-cream-100 hover:text-orange-600'
                          }`
                        }
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}

                  <div className="pt-2 border-t border-line mt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Nested Content Panel */}
            <main className="lg:col-span-9">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
export default AccountLayout;

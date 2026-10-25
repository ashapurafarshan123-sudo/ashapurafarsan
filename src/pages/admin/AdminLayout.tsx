import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquareText,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, profile, signOut, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.error) {
        setPasswordStatus({ type: 'error', text: res.error });
      } else {
        setPasswordStatus({ type: 'success', text: 'Password successfully updated! Your next sign in will require this new password.' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 2500);
      }
    } catch {
      setPasswordStatus({ type: 'error', text: 'An unexpected error occurred while updating password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package, end: false },
    { name: 'Website Orders', path: '/admin/website-orders', icon: ShoppingBag, end: false },
    { name: 'WhatsApp Orders', path: '/admin/whatsapp-orders', icon: MessageSquareText, end: false },
    { name: 'Discounts', path: '/admin/discounts', icon: Tag, end: false },
    { name: 'Sales & Reports', path: '/admin/reports', icon: BarChart3, end: false },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings, end: false },
  ];

  const adminName = profile?.full_name || user?.email?.split('@')[0] || 'Store Administrator';

  return (
    <>
      <SEO
        title="Admin Portal — Ashapura Farsan"
        description="Secure management portal for Ashapura Farsan store operators."
      />

      <div className="min-h-screen bg-cream-50 flex flex-col font-sans">
        {/* Top Header Bar */}
        <header className="bg-brown-900 text-white border-b border-brown-800 sticky top-0 z-40 shadow-sm">
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
                <span className="font-serif font-bold text-lg text-peach-100">Ashapura Farsan</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-600 text-white flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={12} />
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-peach-200 hover:text-white transition-colors py-1 px-2.5 rounded-md hover:bg-white/5"
              >
                <span>Live Storefront</span>
                <ExternalLink size={12} />
              </Link>

              <div className="h-4 w-px bg-white/20 hidden sm:block" />

              {/* Change Password Button */}
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(true);
                  setPasswordStatus(null);
                }}
                className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white py-1 px-2.5 rounded-md hover:bg-white/10 transition-colors"
                title="Change Admin Password"
              >
                <KeyRound size={13} />
                <span>Password</span>
              </button>

              <span className="text-white/80 hidden lg:inline font-medium">{adminName}</span>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-red-700/80 text-white flex items-center gap-1.5 transition-colors font-semibold"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Workspace Body */}
        <div className="flex-1 container-custom py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside
            className={`lg:col-span-3 ${
              mobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white border border-line rounded-card p-3.5 shadow-card sticky top-20">
              <div className="px-3 py-2 mb-2 border-b border-line flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
                    Store Operator
                  </p>
                  <p className="text-xs font-semibold text-brown-900 truncate max-w-[170px]">
                    {user?.email || 'Admin'}
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500" title="Connected to Supabase" />
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

                {/* Change Password Mobile Link */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowPasswordModal(true);
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-brown-700 hover:bg-cream-100 hover:text-orange-600 transition-colors w-full text-left md:hidden"
                >
                  <KeyRound size={16} />
                  <span>Change Password</span>
                </button>

                {/* Direct Logout Nav Link */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors w-full text-left mt-2 border-t border-line pt-3"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>

                <div className="pt-2 border-t border-line mt-2 sm:hidden">
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm">
          <div className="bg-white border border-line rounded-card max-w-md w-full p-6 shadow-card space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-orange-600" />
                <h3 className="font-serif font-bold text-brown-900 text-base">Change Administrator Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-brown-400 hover:text-brown-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-brown-600">
              Update your account password securely via Supabase Auth. Use a strong password containing at least 6 characters.
            </p>

            {passwordStatus && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  passwordStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {passwordStatus.type === 'success' ? (
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                )}
                <span>{passwordStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brown-800 mb-1 uppercase tracking-wider text-[11px]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    required
                    className="w-full px-3 py-2 pr-9 bg-cream-50/50 border border-line rounded-lg text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brown-400 hover:text-brown-700"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brown-800 mb-1 uppercase tracking-wider text-[11px]">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-brown-800 font-semibold rounded-lg border border-line transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;


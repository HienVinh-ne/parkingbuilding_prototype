import React, { useState } from 'react';
import { Role, View, User } from '../types';
import { Car, User as UserIcon, Lock, Eye, EyeOff, QrCode, CreditCard, Sparkles, UserCheck, ShieldAlert, Key } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: Role, view: View, user: User) => void;
  onNavigateToRegister: () => void;
  usersList: User[];
}

export default function LoginScreen({
  onLoginSuccess,
  onNavigateToRegister,
  usersList,
}: LoginScreenProps) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState<string>('');

  const handleDemoRoleClick = (role: string) => {
    setSelectedDemoRole(role);
    setErrorMsg('');

    const roleData: Record<string, { email: string; pass: string; label: string }> = {
      guest: { email: '', pass: '', label: 'Chế độ: Khách vãng lai' },
      driver: { email: 'driver@pbms.vn', pass: 'driver123', label: 'Chế độ: Chủ xe' },
      staff: { email: 'staff_zone_a@pbms.vn', pass: 'staff123', label: 'Chế độ: Nhân viên' },
      manager: { email: 'manager_hcm@pbms.vn', pass: 'manager123', label: 'Chế độ: Quản lý' },
      admin: { email: 'root_admin@pbms.vn', pass: 'admin123', label: 'Chế độ: Quản trị viên' },
    };

    setIdentity(roleData[role].email);
    setPassword(roleData[role].pass);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Find user mapping
      let matchedRole: Role = 'guest';
      let matchedUser: User | undefined;

      if (selectedDemoRole === 'guest' || (!identity && !password)) {
        matchedRole = 'guest';
        matchedUser = {
          id: 'GUEST_TEMP',
          name: 'Khách Vãng Lai',
          email: 'guest@pbms.vn',
          phone: '',
          licensePlate: '',
          role: 'guest',
          joinedDate: '02/07/2026',
          status: 'ACTIVE',
          balance: 0,
        };
      } else {
        // Find corresponding user
        if (identity.includes('admin') || selectedDemoRole === 'admin') {
          matchedRole = 'admin';
          matchedUser = usersList.find((u) => u.role === 'admin');
        } else if (identity.includes('manager') || selectedDemoRole === 'manager') {
          matchedRole = 'manager';
          matchedUser = usersList.find((u) => u.role === 'manager');
        } else if (identity.includes('staff') || selectedDemoRole === 'staff') {
          matchedRole = 'staff';
          matchedUser = usersList.find((u) => u.role === 'staff');
        } else {
          matchedRole = 'driver';
          matchedUser = usersList.find((u) => u.role === 'driver');
        }
      }

      if (!matchedUser) {
        matchedUser = {
          id: 'U999',
          name: 'Người Dùng PBMS',
          email: identity || 'user@pbms.vn',
          phone: '0900000000',
          licensePlate: '59A-123.45',
          role: matchedRole,
          joinedDate: '02/07/2026',
          status: 'ACTIVE',
          balance: 500000,
        };
      }

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        const nextView: View = matchedRole === 'driver' || matchedRole === 'guest' ? 'DASHBOARD_CLIENT' : 'ADMIN_DASHBOARD';
        onLoginSuccess(matchedRole, nextView, matchedUser!);
      }, 800);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-on-background relative overflow-x-hidden">
      {/* Top Glow Background Decor */}
      <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent -z-10"></div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 w-full max-w-md mx-auto">
        {/* Brand Identity Section */}
        <header className="text-center mb-8 w-full animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
            <Car className="text-white w-9 h-9" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">PBMS Hệ Thống Gửi Xe</h1>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Quản lý tòa nhà và bãi đỗ xe thông minh</p>
        </header>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-xl border border-slate-100 transition-all duration-300">
          <h2 className="text-lg font-bold text-on-surface mb-5">Đăng nhập</h2>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Input Group: Email/Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant ml-1" htmlFor="identity">
                Email hoặc Số điện thoại
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserIcon size={18} />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-on-surface placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  id="identity"
                  name="identity"
                  placeholder="Nhập tài khoản của bạn"
                  required={selectedDemoRole !== 'guest'}
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant ml-1" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-on-surface placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required={selectedDemoRole !== 'guest' && selectedDemoRole !== ''}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className="w-4.5 h-4.5 bg-slate-50 border border-slate-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <span className="ml-2 text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a href="#" className="text-xs font-semibold text-secondary hover:text-primary transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              className={`w-full py-3 bg-primary text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-all mt-2 flex items-center justify-center gap-2 ${
                loading || success ? 'opacity-90 pointer-events-none' : 'hover:bg-primary/95'
              }`}
              type="submit"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : success ? (
                <>
                  <UserCheck size={18} />
                  <span>Đăng nhập thành công!</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoRoleClick('guest')}
              className="flex items-center justify-center py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-on-surface-variant transition-colors gap-1.5"
            >
              <QrCode className="text-primary" size={16} />
              Mã QR
            </button>
            <button
              onClick={() => handleDemoRoleClick('guest')}
              className="flex items-center justify-center py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-on-surface-variant transition-colors gap-1.5"
            >
              <CreditCard className="text-rose-500" size={16} />
              Thẻ từ
            </button>
          </div>
        </div>
      </main>

      {/* Prototype Role Switcher inside card footer */}
      <section className="mt-auto px-4 pb-12 w-full max-w-md mx-auto">
        <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="text-secondary" size={14} />
            PROTOTYPE ROLE SWITCHER
          </h3>
          <div className="grid grid-cols-5 gap-1.5" id="roleSwitcher">
            {[
              { id: 'guest', label: 'GUEST', icon: UserIcon },
              { id: 'driver', label: 'DRIVER', icon: Car },
              { id: 'staff', label: 'STAFF', icon: Key },
              { id: 'manager', label: 'MANAGER', icon: UserCheck },
              { id: 'admin', label: 'ADMIN', icon: ShieldAlert },
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = selectedDemoRole === role.id;
              return (
                <button
                  key={role.id}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border hover:border-primary transition-all active:scale-95 group ${
                    isSelected
                      ? 'bg-blue-100 border-primary shadow-sm ring-2 ring-primary/10 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  onClick={() => handleDemoRoleClick(role.id)}
                  type="button"
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span className={`text-[8px] font-extrabold mt-1 uppercase tracking-tighter ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-on-surface-variant/80 italic text-center mt-3 font-medium">
            {selectedDemoRole
              ? `Chế độ: ${
                  selectedDemoRole === 'driver'
                    ? 'Chủ xe'
                    : selectedDemoRole === 'staff'
                    ? 'Nhân viên hiện trường'
                    : selectedDemoRole === 'manager'
                    ? 'Quản lý chi nhánh'
                    : selectedDemoRole === 'admin'
                    ? 'Quản trị viên hệ thống'
                    : 'Khách vãng lai'
                }. Click Đăng nhập để vào.`
              : 'Chọn vai trò để xem trước luồng hệ thống.'}
          </p>
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="pb-safe pt-2 text-center">
        <p className="text-[10px] text-slate-400 font-bold">© 2024 PBMS Smart Solution v2.4.0</p>
      </footer>
    </div>
  );
}

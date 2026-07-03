import React, { useState } from 'react';
import { User } from '../types';
import { Car, User as UserIcon, Phone, Mail, FileText, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, HelpCircle, Globe, CheckCircle } from 'lucide-react';

interface RegisterScreenProps {
  onRegisterSuccess: (newUser: User) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Vui lòng chấp nhận Điều khoản và Chính sách bảo mật để tiếp tục.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu và Xác nhận mật khẩu không khớp.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser: User = {
        id: `U${Math.floor(Math.random() * 900) + 100}`,
        name: fullName || 'Tài xế mới',
        email: email || 'newdriver@pbms.vn',
        phone: phone || '0901234567',
        licensePlate: licensePlate.toUpperCase() || '59A-123.45',
        role: 'driver',
        joinedDate: '02/07/2026',
        status: 'ACTIVE',
        balance: 50000, // free 50,000 credit on signup
      };

      setLoading(false);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        onRegisterSuccess(newUser);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="bg-background font-sans text-on-background min-h-screen flex flex-col items-center justify-center overflow-x-hidden relative">
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-surface"></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-md px-4 py-8 flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="mt-4 mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-3 shadow-lg shadow-primary/25">
            <Car className="text-white w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">Chào mừng tài xế mới</h1>
          <p className="text-on-surface-variant text-xs mt-1.5 font-medium">Hệ thống PBMS - Quản lý gửi xe thông minh</p>
        </header>

        {/* Registration Form Card */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-5 shadow-xl shadow-slate-900/5">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative border-b-2 border-slate-200 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined absolute left-2 top-3 text-slate-400">
                <UserIcon size={18} />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-slate-400 font-sans focus:outline-none"
                id="full-name"
                placeholder="Họ và Tên"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div className="relative border-b-2 border-slate-200 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined absolute left-2 top-3 text-slate-400">
                <Phone size={18} />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-slate-400 font-sans focus:outline-none"
                id="phone"
                placeholder="Số điện thoại"
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="relative border-b-2 border-slate-200 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined absolute left-2 top-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-slate-400 font-sans focus:outline-none"
                id="email"
                placeholder="Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* License Plate */}
            <div className="relative border-b-2 border-slate-200 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined absolute left-2 top-3 text-slate-400">
                <FileText size={18} />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-slate-400 font-mono focus:outline-none uppercase"
                id="license-plate"
                placeholder="Biển số xe (VD: 59A-123.45)"
                required
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative border-b-2 border-slate-200 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined absolute left-2 top-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                className="w-full pl-9 pr-10 py-2.5 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-slate-400 font-sans focus:outline-none"
                id="password"
                placeholder="Mật khẩu"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-2 top-3 text-slate-400 hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative border-b-2 border-slate-200 focus-within:border-secondary transition-all">
              <span className="material-symbols-outlined absolute left-2 top-3 text-slate-400">
                <ShieldCheck size={18} />
              </span>
              <input
                className="w-full pl-9 pr-10 py-2.5 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-slate-400 font-sans focus:outline-none"
                id="confirm-password"
                placeholder="Xác nhận mật khẩu"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="absolute right-2 top-3 text-slate-400 hover:text-primary transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 mt-2">
              <input
                className="mt-1 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label className="text-xs text-on-surface-variant leading-relaxed cursor-pointer" htmlFor="terms">
                Tôi đồng ý với{' '}
                <a className="text-secondary font-bold hover:underline" href="#">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a className="text-secondary font-bold hover:underline" href="#">
                  Chính sách bảo mật
                </a>
                .
              </label>
            </div>

            {/* Register Button */}
            <button
              className="mt-3 w-full bg-primary hover:bg-primary/95 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Đăng ký ngay</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <footer className="mt-6 text-center pb-8 flex-grow flex flex-col justify-end">
          <p className="text-sm text-on-surface-variant font-medium">
            Đã có tài khoản?{' '}
            <button onClick={onNavigateToLogin} className="text-primary font-bold hover:underline ml-1">
              Đăng nhập
            </button>
          </p>

          <div className="mt-8 flex justify-center items-center gap-4 opacity-70">
            <div className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 shadow-sm">
              <HelpCircle size={16} />
            </div>
            <div className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 shadow-sm">
              <Globe size={16} />
            </div>
          </div>
        </footer>
      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 transform transition-transform duration-500 ease-out" id="toast">
          <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white">
            <div className="bg-emerald-500/10 p-1.5 rounded-full text-emerald-400">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400">Đăng ký thành công!</p>
              <p className="text-[10px] text-slate-300">Chào mừng bạn đến với hệ thống PBMS.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

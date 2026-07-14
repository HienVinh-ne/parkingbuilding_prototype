import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import { User } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

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
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!termsAccepted) {
      setMessage('Vui lòng đồng ý điều khoản dịch vụ để tiếp tục.');
      return;
    }

    if (password.length < 6) {
      setMessage('Mật khẩu cần có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      const newUser: User = {
        id: `U${Math.floor(Math.random() * 900) + 100}`,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        licensePlate: licensePlate.trim().toUpperCase(),
        role: 'driver',
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        status: 'ACTIVE',
        balance: 50000,
      };

      setLoading(false);
      setMessage('Đăng ký thành công. Đang chuyển vào hệ thống...');
      window.setTimeout(() => onRegisterSuccess(newUser), 800);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6">
        <header className="mb-5">
          <button onClick={onNavigateToLogin} className="mb-5 flex items-center gap-2 text-xs font-bold text-slate-500" type="button">
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <Car size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-primary">Tạo tài khoản tài xế</h1>
              <p className="mt-1 text-xs font-medium text-slate-500">Nhận 50.000 VNĐ vào ví demo sau khi đăng ký.</p>
            </div>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field icon={<UserIcon size={18} />} label="Họ và tên" value={fullName} onChange={setFullName} placeholder="Nguyễn Văn A" required />
            <Field icon={<Phone size={18} />} label="Số điện thoại" value={phone} onChange={setPhone} placeholder="0901234567" type="tel" required />
            <Field icon={<Mail size={18} />} label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
            <Field icon={<FileText size={18} />} label="Biển số xe" value={licensePlate} onChange={setLicensePlate} placeholder="59A-123.45" required mono />

            <PasswordField
              label="Mật khẩu"
              value={password}
              onChange={setPassword}
              show={showPassword}
              setShow={setShowPassword}
            />
            <PasswordField
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              icon={<ShieldCheck size={18} />}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs font-medium leading-5 text-slate-600">
              <input
                checked={termsAccepted}
                onChange={() => setTermsAccepted((value) => !value)}
                className="mt-1"
                type="checkbox"
              />
              <span>
                Tôi đồng ý với điều khoản dịch vụ, chính sách bảo mật và quy định sử dụng bãi xe của PBMS.
              </span>
            </label>

            {message && (
              <div className={`rounded-xl p-3 text-xs font-bold ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-white shadow-md transition hover:bg-primary/95 disabled:opacity-75"
              disabled={loading}
              type="submit"
            >
              {loading ? <><span className="ui-spinner" aria-hidden="true" />Đang tạo tài khoản</> : <><span>Đăng ký ngay</span><ArrowRight size={17} /></>}
            </button>
          </form>
        </section>

        <footer className="mt-5 text-center text-sm font-medium text-slate-500">
          Đã có tài khoản?
          <button onClick={onNavigateToLogin} className="ml-1 font-black text-primary hover:underline" type="button">
            Đăng nhập
          </button>
        </footer>

        {message.includes('thành công') && (
          <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-600" size={20} />
              <div>
                <p className="text-sm font-black text-slate-800">Đăng ký thành công</p>
                <p className="text-xs font-medium text-slate-500">Ví demo đã được cộng 50.000 VNĐ.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  mono,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/15 ${mono ? 'font-mono uppercase' : ''}`}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  setShow,
  icon = <Lock size={18} />,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  setShow: (value: boolean) => void;
  icon?: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm font-semibold outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/15"
          placeholder="Tối thiểu 6 ký tự"
          required
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
          onClick={() => setShow(!show)}
          type="button"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

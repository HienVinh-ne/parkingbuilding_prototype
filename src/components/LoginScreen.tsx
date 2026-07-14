import { FormEvent, useState } from 'react';
import { Role, User, View } from '../types';
import {
  Car,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Lock,
  QrCode,
  ShieldAlert,
  Sparkles,
  User as UserIcon,
  UserCheck,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: Role, view: View, user: User) => void;
  onNavigateToRegister: () => void;
  usersList: User[];
}

const demoRoles: Array<{ id: Role; label: string; icon: typeof UserIcon; email: string; password: string; name: string }> = [
  { id: 'guest', label: 'Khách', icon: UserIcon, email: '', password: '', name: 'Khách vãng lai' },
  { id: 'driver', label: 'Tài xế', icon: Car, email: 'driver@pbms.vn', password: 'driver123', name: 'Chủ xe' },
  { id: 'staff', label: 'Nhân viên', icon: Key, email: 'staff_zone_a@pbms.vn', password: 'staff123', name: 'Nhân viên' },
  { id: 'manager', label: 'Quản lý', icon: UserCheck, email: 'manager_hcm@pbms.vn', password: 'manager123', name: 'Quản lý' },
  { id: 'admin', label: 'Admin', icon: ShieldAlert, email: 'root_admin@pbms.vn', password: 'admin123', name: 'Quản trị' },
];

export default function LoginScreen({
  onLoginSuccess,
  onNavigateToRegister,
  usersList,
}: LoginScreenProps) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>('driver');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fillDemo = (role: Role) => {
    const demo = demoRoles.find((item) => item.id === role)!;
    setSelectedRole(role);
    setIdentity(demo.email);
    setPassword(demo.password);
  };

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const role = selectedRole || 'driver';
      const matchedUser =
        role === 'guest'
          ? createGuest()
          : usersList.find((user) => user.email === identity || user.role === role) || createFallbackUser(role, identity);

      setLoading(false);
      setSuccess(true);

      window.setTimeout(() => {
        const nextView: View = role === 'driver' || role === 'guest' ? 'DASHBOARD_CLIENT' : 'ADMIN_DASHBOARD';
        onLoginSuccess(role, nextView, matchedUser);
      }, 500);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
          <section className="hidden lg:block">
            <div className="max-w-lg">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <Car size={30} />
              </div>
              <h1 className="text-4xl font-black leading-tight text-primary">PBMS Smart Parking</h1>
              <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                Quản lý đặt chỗ, thanh toán VNPAY, vé QR và vận hành bãi xe trong một giao diện gọn gàng.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <HeroMetric value="24/7" label="Giám sát" />
                <HeroMetric value="QR" label="Vé điện tử" />
                <HeroMetric value="VNPAY" label="Thanh toán" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
            <header className="mb-5 text-center lg:text-left">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white lg:mx-0">
                <Car size={28} />
              </div>
              <h2 className="text-xl font-black text-primary">Đăng nhập</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Chọn vai trò demo hoặc nhập tài khoản của bạn.</p>
            </header>

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-slate-500">Email hoặc số điện thoại</span>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                    placeholder="driver@pbms.vn"
                    required={selectedRole !== 'guest'}
                    value={identity}
                    onChange={(event) => setIdentity(event.target.value)}
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-slate-500">Mật khẩu</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm font-semibold outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                    placeholder="Nhập mật khẩu"
                    required={selectedRole !== 'guest'}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-500">
                  <input checked={rememberMe} onChange={() => setRememberMe((value) => !value)} type="checkbox" />
                  Ghi nhớ đăng nhập
                </label>
                <button className="text-xs font-bold text-secondary hover:text-primary" type="button">
                  Quên mật khẩu?
                </button>
              </div>

              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-white shadow-md transition hover:bg-primary/95 disabled:opacity-80"
                disabled={loading || success}
                type="submit"
              >
                {loading ? <><span className="ui-spinner" aria-hidden="true" />Đang xử lý</> : success ? <><CheckCircle2 size={18} /> Đăng nhập thành công</> : 'Đăng nhập'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Demo nhanh</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {demoRoles.map((role) => {
                const Icon = role.icon;
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => fillDemo(role.id)}
                    className={`flex min-h-16 flex-col items-center justify-center rounded-xl border p-2 transition ${
                      active ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                    type="button"
                  >
                    <Icon size={17} />
                    <span className="mt-1 text-[9px] font-black">{role.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => fillDemo('guest')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600" type="button">
                <QrCode size={16} className="text-primary" />
                Quét QR
              </button>
              <button onClick={() => fillDemo('guest')} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600" type="button">
                <CreditCard size={16} className="text-rose-500" />
                Thẻ từ
              </button>
            </div>

            <p className="mt-5 text-center text-sm font-medium text-slate-500">
              Chưa có tài khoản?
              <button onClick={onNavigateToRegister} className="ml-1 font-black text-primary hover:underline" type="button">
                Đăng ký ngay
              </button>
            </p>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <Sparkles size={13} className="text-secondary" />
              PBMS prototype v2.4
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-lg font-black text-primary">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}

function createGuest(): User {
  return {
    id: 'GUEST_TEMP',
    name: 'Khách vãng lai',
    email: 'guest@pbms.vn',
    phone: '',
    licensePlate: '',
    role: 'guest',
    joinedDate: '02/07/2026',
    status: 'ACTIVE',
    balance: 0,
  };
}

function createFallbackUser(role: Role, identity: string): User {
  return {
    id: 'U999',
    name: 'Người dùng PBMS',
    email: identity || 'user@pbms.vn',
    phone: '0900000000',
    licensePlate: '59A-123.45',
    role,
    joinedDate: '02/07/2026',
    status: 'ACTIVE',
    balance: 500000,
  };
}

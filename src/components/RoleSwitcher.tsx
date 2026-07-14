import { Role, View } from '../types';
import { Car, HelpCircle, Key, Shield, Sparkles, User } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: Role;
  currentView: View;
  onSwitch: (role: Role, view: View) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const roles: { role: Role; view: View; label: string; icon: typeof User; surface: string }[] = [
  { role: 'guest', view: 'LOGIN', label: 'Khách', icon: HelpCircle, surface: 'Mobile App' },
  { role: 'driver', view: 'DASHBOARD_CLIENT', label: 'Tài xế', icon: Car, surface: 'Driver App' },
  { role: 'staff', view: 'ADMIN_DASHBOARD', label: 'Nhân viên', icon: Key, surface: 'Gate Portal' },
  { role: 'manager', view: 'ADMIN_DASHBOARD', label: 'Quản lý', icon: Shield, surface: 'Manager Portal' },
  { role: 'admin', view: 'ADMIN_DASHBOARD', label: 'Admin', icon: Shield, surface: 'Admin Portal' },
];

export default function RoleSwitcher({
  currentRole,
  currentView,
  onSwitch,
  isOpen,
  setIsOpen,
}: RoleSwitcherProps) {
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-3 z-50 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2.5 text-xs font-black text-primary shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-2xl sm:right-5 sm:px-4 sm:py-3"
        id="btn-role-switcher"
        type="button"
      >
        <Sparkles size={16} />
        Đổi vai trò
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 max-h-[70dvh] overflow-y-auto rounded-xl border border-slate-200 bg-white/95 p-4 font-sans shadow-2xl backdrop-blur-xl sm:left-auto sm:right-5 sm:w-[340px]">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <p className="text-sm font-black text-primary">Prototype Role Switcher</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">Dùng để demo nhanh, không thuộc navigation thật.</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 hover:bg-slate-200"
          type="button"
        >
          Ẩn
        </button>
      </div>

      <div className="grid gap-2">
        {roles.map((item) => {
          const Icon = item.icon;
          const selected = currentRole === item.role;

          return (
            <button
              key={item.role}
              onClick={() => onSwitch(item.role, item.view)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                selected ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              type="button"
            >
              <span className="flex items-center gap-2 text-xs font-black">
                <Icon size={15} />
                {item.label}
              </span>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500">{item.surface}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 border-t border-slate-100 pt-3 text-center text-[10px] font-bold text-slate-400">
        Đang xem: <span className="text-primary">{currentRole}</span> · {currentView}
      </p>
    </div>
  );
}

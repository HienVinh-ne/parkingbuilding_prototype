import { Role, View } from '../types';
import { Shield, Sparkles, User, Key, HelpCircle } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: Role;
  currentView: View;
  onSwitch: (role: Role, view: View) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

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
        className="fixed bottom-24 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400 hover:scale-105 active:scale-95 transition-all animate-bounce"
        id="btn-role-switcher"
      >
        <Sparkles size={18} />
        <span className="text-xs font-bold font-sans uppercase tracking-wider">Chọn vai trò</span>
      </button>
    );
  }

  const roles: { role: Role; view: View; label: string; icon: any; color: string }[] = [
    { role: 'guest', view: 'LOGIN', label: 'Khách (Guest)', icon: HelpCircle, color: 'bg-slate-100 border-slate-300 text-slate-700' },
    { role: 'driver', view: 'DASHBOARD_CLIENT', label: 'Chủ Xe (Driver)', icon: User, color: 'bg-sky-100 border-sky-400 text-sky-700' },
    { role: 'staff', view: 'ADMIN_DASHBOARD', label: 'Nhân Viên (Staff)', icon: Key, color: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
    { role: 'manager', view: 'ADMIN_DASHBOARD', label: 'Quản Lý (Manager)', icon: Shield, color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { role: 'admin', view: 'ADMIN_DASHBOARD', label: 'Quản Trị Viên (Admin)', icon: Shield, color: 'bg-indigo-100 border-indigo-400 text-indigo-700' },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-primary/20 shadow-2xl p-4 font-sans animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Sparkles size={16} />
          <span>PROTOTYPE ROLE SWITCHER</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Ẩn
        </button>
      </div>

      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
        Chọn một vai trò để kiểm tra đầy đủ tất cả các giao diện của hệ thống PBMS:
      </p>

      <div className="flex flex-col gap-2">
        {roles.map((item) => {
          const Icon = item.icon;
          const isSelected = currentRole === item.role;
          return (
            <button
              key={item.role}
              onClick={() => {
                onSwitch(item.role, item.view);
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-md font-bold'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Icon size={14} />
                </div>
                <span>{item.label}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-tight ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.view === 'ADMIN_DASHBOARD' ? 'Web Admin' : 'Mobile App'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-center text-slate-400">
        Đang hiển thị: <span className="font-bold text-primary capitalize">{currentRole}</span> ({currentView})
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { User, ParkingSlot, SystemLog, Transaction, Role } from '../types';
import { ADMIN_AVATAR } from '../mockData';
import {
  LayoutDashboard, Map, Receipt, Group, BarChart3, Settings, LogOut, RefreshCw, Plus, Search,
  Database, Video, Wallet, Mail, AlertTriangle, CheckCircle, Activity, Shield, TrendingUp, Clock, Info, UserPlus, Eye, Filter, Trash2
} from 'lucide-react';

interface AdminDashboardProps {
  initialUsers: User[];
  initialSlots: ParkingSlot[];
  initialLogs: SystemLog[];
  initialTransactions: Transaction[];
  currentRole: Role;
  onLogout: () => void;
}

export default function AdminDashboard({
  initialUsers,
  initialSlots,
  initialLogs,
  initialTransactions,
  currentRole,
  onLogout,
}: AdminDashboardProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'transactions' | 'users' | 'reports' | 'settings'>('dashboard');

  // Local state for dynamic interactivity
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const [userSearch, setUserSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [mapFloorFilter, setMapFloorFilter] = useState('Tầng 1');

  // Editing slot details
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);
  const [newSlotPlate, setNewSlotPlate] = useState('');
  const [newSlotHours, setNewSlotHours] = useState(3);

  // Add User Form Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'staff' | 'manager' | 'admin' | 'driver'>('staff');

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phone.includes(userSearch)
    );
  }, [users, userSearch]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.licensePlate.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.slotId.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(txSearch.toLowerCase())
    );
  }, [transactions, txSearch]);

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          // Log system activity
          const newLog: SystemLog = {
            id: `L_${Date.now()}`,
            type: 'warning',
            title: 'Cập nhật trạng thái người dùng',
            description: `Admin thay đổi trạng thái ${u.name} thành ${newStatus}`,
            timeStr: 'Vừa xong',
          };
          setLogs((prevLogs) => [newLog, ...prevLogs]);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: User = {
      id: `U00${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || '0901234567',
      licensePlate: 'Chưa cập nhật',
      role: newUserRole,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      status: 'ACTIVE',
      balance: 0,
    };

    setUsers((prev) => [...prev, newUser]);
    
    // Log activity
    const newLog: SystemLog = {
      id: `L_${Date.now()}`,
      type: 'success',
      title: 'Tạo tài khoản mới',
      description: `Đã thêm thành viên ${newUserName} với vai trò ${newUserRole}`,
      timeStr: 'Vừa xong',
    };
    setLogs((prevLogs) => [newLog, ...prevLogs]);

    // reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setShowAddUserModal(false);
  };

  const handleUpdateSlotStatus = (slotId: string, status: 'available' | 'reserved' | 'occupied') => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          let currentSession = undefined;
          if (status === 'occupied') {
            currentSession = {
              licensePlate: newSlotPlate.toUpperCase() || '59A-123.45',
              checkInTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              estimatedHours: newSlotHours,
              fee: newSlotHours * (s.vehicleType === 'oto' ? 20000 : 5000),
            };
          }
          
          // Log activity
          const newLog: SystemLog = {
            id: `L_${Date.now()}`,
            type: status === 'occupied' ? 'info' : 'success',
            title: 'Cập nhật trạng thái slot',
            description: `Slot ${slotId} đổi sang trạng thái ${status === 'occupied' ? 'Đã đỗ' : status === 'reserved' ? 'Đã đặt' : 'Còn trống'}`,
            timeStr: 'Vừa xong',
          };
          setLogs((prevLogs) => [newLog, ...prevLogs]);

          return { ...s, status, currentSession };
        }
        return s;
      })
    );
    setEditingSlot(null);
    setNewSlotPlate('');
  };

  // Occupancy rate calculation
  const occupancyRate = useMemo(() => {
    const total = slots.length;
    const occupied = slots.filter((s) => s.status === 'occupied').length;
    return Math.round((occupied / total) * 100);
  }, [slots]);

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen font-sans flex flex-col md:flex-row relative">
      
      {/* Sidebar (Desktop only) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-sidebar-width bg-[#00236f] py-6 px-4 border-r border-slate-800 z-40 text-white">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-2">
            <Video className="text-secondary w-6 h-6" />
            <h1 className="text-lg font-black tracking-tight uppercase">PBMS Hệ Thống</h1>
          </div>
          <div className="mt-5 flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-300">
              <img className="w-full h-full object-cover" src={ADMIN_AVATAR} alt="Admin profile" />
            </div>
            <div>
              <p className="font-bold text-xs">Quản Trị Viên</p>
              <p className="text-[10px] text-white/60 font-semibold tracking-wider uppercase">{currentRole} Portal</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {[
            { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
            { id: 'map', label: 'Sơ đồ bãi xe', icon: Map },
            { id: 'transactions', label: 'Giao dịch bãi xe', icon: Receipt },
            { id: 'users', label: 'Quản lý người dùng', icon: Group },
            { id: 'reports', label: 'Báo cáo doanh thu', icon: BarChart3 },
            { id: 'settings', label: 'Cấu hình hệ thống', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-xs font-bold text-left ${
                  isSelected
                    ? 'bg-[#39b8fd] text-[#004666] border-l-4 border-[#006591] shadow-lg shadow-[#39b8fd]/10 font-black scale-[1.01]'
                    : 'text-white/85 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-white/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-xs"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>

      {/* Top Navigation Bar (Mobile only) */}
      <header className="md:hidden flex justify-between items-center w-full px-4 h-16 bg-[#00236f] text-white fixed top-0 z-50 shadow-md">
        <div className="font-bold text-sm uppercase tracking-wider">PBMS Hệ Thống Gửi Xe</div>
        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="text-white hover:text-slate-200 p-1">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow md:ml-sidebar-width pt-20 md:pt-8 px-4 md:px-8 pb-24 md:pb-8 min-h-screen">
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header section */}
            <header className="flex justify-between items-end bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
              <div>
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  Bảng điều khiển
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-dot-pulse inline-block"></span>
                    Hệ thống ổn định
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Chào mừng trở lại, Admin. Hệ thống giám sát đỗ xe đang trực tuyến.</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => alert('Đang đồng bộ dữ liệu với cảm biến bãi xe...')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-primary shadow-sm"
                >
                  <RefreshCw size={14} />
                  Làm mới
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold shadow-md shadow-primary/10"
                >
                  <UserPlus size={14} />
                  Thêm báo cáo
                </button>
              </div>
            </header>

            {/* Bento KPI Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database status card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-blue-50 text-primary rounded-xl">
                    <Database size={18} />
                  </div>
                  <div className="status-dot-pulse"></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cơ sở dữ liệu</h3>
                  <p className="text-lg font-black text-slate-800 mt-0.5">Hoạt động</p>
                  <p className="text-[10px] text-secondary mt-1.5 flex items-center gap-1 font-semibold">
                    <Activity size={12} />
                    Thời gian phản hồi: 12ms
                  </p>
                </div>
              </div>

              {/* LPR Status card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Video size={18} />
                  </div>
                  <div className="status-dot-pulse"></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhận diện LPR</h3>
                  <p className="text-lg font-black text-slate-800 mt-0.5">Trực tuyến</p>
                  <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <CheckCircle size={12} />
                    Độ chính xác: 99.4%
                  </p>
                </div>
              </div>

              {/* VNPAY status card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <Wallet size={18} />
                  </div>
                  <div className="status-dot-pulse"></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cổng VNPAY</h3>
                  <p className="text-lg font-black text-slate-800 mt-0.5">Kết nối</p>
                  <p className="text-[10px] text-amber-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <TrendingUp size={12} />
                    GD thành công: 242
                  </p>
                </div>
              </div>

              {/* Mail Server status card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                    <Mail size={18} />
                  </div>
                  <div className="status-dot-pulse"></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Server</h3>
                  <p className="text-lg font-black text-slate-800 mt-0.5">Sẵn sàng</p>
                  <p className="text-[10px] text-rose-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <Clock size={12} />
                    Đã gửi: 1.2k hôm nay
                  </p>
                </div>
              </div>
            </section>

            {/* Split layout: Users List vs System Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User management table preview */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Quản lý người dùng</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all w-40"
                        placeholder="Tìm người dùng..."
                        type="text"
                      />
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="p-1.5 bg-primary text-white rounded-lg hover:scale-105 active:scale-95 transition-all"
                      title="Thêm thành viên"
                    >
                      <UserPlus size={14} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/60 text-slate-400 uppercase font-bold text-[9px] tracking-wider border-b border-slate-200/50">
                      <tr>
                        <th className="p-3.5">Người dùng</th>
                        <th className="p-3.5">Vai trò</th>
                        <th className="p-3.5">Trạng thái</th>
                        <th className="p-3.5">Ngày tham gia</th>
                        <th className="p-3.5 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-black text-xs">
                                  {user.name.split(' ').pop()?.substring(0, 2).toUpperCase() || 'TX'}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-800">{user.name}</div>
                                  <div className="text-[10px] text-slate-400 font-semibold">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold capitalize">{user.role}</span>
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                                  user.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200/50'
                                }`}
                              >
                                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Ngoại tuyến'}
                              </button>
                            </td>
                            <td className="p-3.5 font-mono text-slate-500 font-bold">{user.joinedDate}</td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => alert(`Chi tiết người dùng: ${user.name} - Biển số xe: ${user.licensePlate}`)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-primary transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            Không tìm thấy tài khoản nào khớp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent system logs preview */}
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Nhật ký hệ thống</h3>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full status-dot-pulse"></span>
                </div>

                <div className="p-4 flex-grow space-y-4 max-h-[300px] overflow-y-auto">
                  {logs.map((log) => {
                    const colorMap = {
                      success: 'bg-emerald-500',
                      info: 'bg-blue-500',
                      warning: 'bg-amber-500',
                      error: 'bg-rose-500',
                    };
                    return (
                      <div key={log.id} className="flex gap-3 text-xs">
                        <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${colorMap[log.type]}`}></div>
                        <div>
                          <p className="font-extrabold text-slate-800 leading-tight">{log.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{log.description}</p>
                          <span className="text-[9px] font-mono text-slate-400 font-semibold">{log.timeStr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => alert('Nhật ký đã được đồng bộ hóa đầy đủ với máy chủ.')}
                    className="text-xs font-bold text-secondary hover:underline"
                  >
                    Xem tất cả nhật ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PARKING MAP & SLOT CONTROL */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <header className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-primary">Sơ đồ bãi đỗ xe</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Giám sát các chỗ đậu xe và chỉnh sửa trạng thái vật lý trực tiếp.
                </p>
              </div>

              {/* Floor selector tab */}
              <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
                {['Tầng 1', 'Tầng 2', 'Tầng hầm'].map((floor) => (
                  <button
                    key={floor}
                    onClick={() => {
                      setMapFloorFilter(floor);
                      setEditingSlot(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mapFloorFilter === floor ? 'bg-primary text-white shadow-md' : 'text-slate-400'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map grid view */}
              <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                      Khu Vực Bãi Xe - {mapFloorFilter}
                    </h3>
                    <span className="text-xs font-extrabold text-secondary bg-blue-50 px-2.5 py-1 rounded-lg">
                      Tỉ lệ lấp đầy: {occupancyRate}%
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col gap-5">
                    {/* Top Slots */}
                    <div className="grid grid-cols-4 gap-3">
                      {slots
                        .filter((s) => s.floor === mapFloorFilter)
                        .slice(0, 4)
                        .map((slot) => {
                          const isEditing = editingSlot?.id === slot.id;
                          const bgClass =
                            slot.status === 'available'
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : slot.status === 'reserved'
                              ? 'bg-amber-50 border-amber-400 text-amber-800'
                              : 'bg-rose-50 border-rose-300 text-rose-800';

                          return (
                            <button
                              key={slot.id}
                              onClick={() => setEditingSlot(slot)}
                              className={`h-20 rounded-xl border-2 flex flex-col items-center justify-between p-2 font-bold transition-all ${bgClass} ${
                                isEditing ? 'ring-4 ring-primary scale-105 shadow-md' : 'hover:scale-[1.02]'
                              }`}
                            >
                              <span className="text-xs">{slot.id}</span>
                              <span className="text-[9px] font-mono uppercase truncate w-full text-center">
                                {slot.status === 'occupied' ? slot.currentSession?.licensePlate : slot.status === 'reserved' ? 'Đã Đặt' : 'Còn trống'}
                              </span>
                              <span className="text-[7px] text-slate-400 font-semibold uppercase tracking-wider">
                                {slot.vehicleType === 'oto' ? 'Ô tô' : 'Xe máy'}
                              </span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Lane */}
                    <div className="h-10 border-y-2 border-dashed border-slate-300 flex items-center justify-between px-6 text-slate-400 text-[9px] font-mono font-black tracking-widest select-none uppercase">
                      <span>◀ LỐI VÀO DRIVEWAY</span>
                      <span>◀ LỐI RA DRIVEWAY</span>
                    </div>

                    {/* Bottom Slots */}
                    <div className="grid grid-cols-4 gap-3">
                      {slots
                        .filter((s) => s.floor === mapFloorFilter)
                        .slice(4)
                        .map((slot) => {
                          const isEditing = editingSlot?.id === slot.id;
                          const bgClass =
                            slot.status === 'available'
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                              : slot.status === 'reserved'
                              ? 'bg-amber-50 border-amber-400 text-amber-800'
                              : 'bg-rose-50 border-rose-300 text-rose-800';

                          return (
                            <button
                              key={slot.id}
                              onClick={() => setEditingSlot(slot)}
                              className={`h-20 rounded-xl border-2 flex flex-col items-center justify-between p-2 font-bold transition-all ${bgClass} ${
                                isEditing ? 'ring-4 ring-primary scale-105 shadow-md' : 'hover:scale-[1.02]'
                              }`}
                            >
                              <span className="text-xs">{slot.id}</span>
                              <span className="text-[9px] font-mono uppercase truncate w-full text-center">
                                {slot.status === 'occupied' ? slot.currentSession?.licensePlate : slot.status === 'reserved' ? 'Đã Đặt' : 'Còn trống'}
                              </span>
                              <span className="text-[7px] text-slate-400 font-semibold uppercase tracking-wider">
                                {slot.vehicleType === 'oto' ? 'Ô tô' : 'Xe máy'}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slot modification controls card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                {editingSlot ? (
                  <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                    <div className="pb-3 border-b border-slate-150">
                      <h4 className="font-extrabold text-sm text-primary">Điều khiển Slot {editingSlot.id}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">({editingSlot.floor})</p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-slate-500 uppercase tracking-wide text-[9px]">Trạng thái hiện tại:</p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateSlotStatus(editingSlot.id, 'available')}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                            editingSlot.status === 'available'
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm font-extrabold'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          Giải phóng (Trống)
                        </button>
                        <button
                          onClick={() => handleUpdateSlotStatus(editingSlot.id, 'reserved')}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                            editingSlot.status === 'reserved'
                              ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-sm font-extrabold'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          Đặt trước
                        </button>
                      </div>
                    </div>

                    {/* Occupy Form */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide text-[9px]">Mô phỏng đỗ xe lập tức:</h5>
                      <div className="space-y-2">
                        <input
                          value={newSlotPlate}
                          onChange={(e) => setNewSlotPlate(e.target.value)}
                          placeholder="Nhập biển số (VD: 51G-123.45)"
                          className="w-full text-xs font-mono uppercase tracking-wider px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                        />
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold">Thời gian ước tính:</span>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={newSlotHours}
                            onChange={(e) => setNewSlotHours(parseInt(e.target.value))}
                            className="w-16 text-center text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                          />
                          <span className="text-[10px] text-slate-400 font-bold">giờ</span>
                        </div>
                        <button
                          onClick={() => handleUpdateSlotStatus(editingSlot.id, 'occupied')}
                          className="w-full py-2.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle size={14} />
                          <span>Ghi nhận Xe Đỗ</span>
                        </button>
                      </div>
                    </div>

                    {editingSlot.status === 'occupied' && editingSlot.currentSession && (
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 text-xs">
                        <p className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Thông tin phiên hiện tại</p>
                        <p className="font-mono text-xs font-extrabold uppercase text-slate-800">Biển xe: {editingSlot.currentSession.licensePlate}</p>
                        <p className="text-slate-500 font-semibold text-[10px]">Thời điểm check-in: {editingSlot.currentSession.checkInTime}</p>
                        <p className="text-slate-500 font-semibold text-[10px]">Thời lượng dự kiến: {editingSlot.currentSession.estimatedHours} giờ</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 flex-grow py-12 gap-2 text-center">
                    <Info size={28} className="text-secondary" />
                    <p className="text-xs font-bold">Vui lòng nhấp vào một vị trí đỗ xe trong sơ đồ để xem thông tin chi tiết hoặc cập nhật trạng thái.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: TRANSACTIONS LIST */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-4 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Giao dịch bãi xe</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Danh sách các hóa đơn thanh toán đặt chỗ đỗ xe qua VNPAY & ví điện tử.</p>
              </div>
              <div className="relative">
                <input
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all w-48 font-semibold"
                  placeholder="Tìm biển số, mã hóa đơn..."
                  type="text"
                />
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/60 text-slate-400 uppercase font-bold text-[9px] tracking-wider border-b border-slate-150">
                  <tr>
                    <th className="p-3.5">Mã Giao dịch</th>
                    <th className="p-3.5">Biển số xe</th>
                    <th className="p-3.5">Vị trí</th>
                    <th className="p-3.5">Số tiền</th>
                    <th className="p-3.5">Phương thức</th>
                    <th className="p-3.5">Thời gian</th>
                    <th className="p-3.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-3.5 font-mono font-extrabold text-primary">{tx.id}</td>
                        <td className="p-3.5 font-mono uppercase font-bold">{tx.licensePlate}</td>
                        <td className="p-3.5 font-bold">Slot {tx.slotId}</td>
                        <td className="p-3.5 font-black text-slate-800">{tx.amount.toLocaleString('vi-VN')} VNĐ</td>
                        <td className="p-3.5 font-semibold">{tx.method}</td>
                        <td className="p-3.5 text-slate-400 font-bold">{tx.timeStr}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                            Thành công
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Không tìm thấy lịch sử giao dịch nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: USER MGMT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-4 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Quản lý người dùng</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Quản lý thông tin, vai trò, số dư ví và trạng thái của tất cả nhân viên và tài xế.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold shadow-md shadow-primary/10 w-fit"
              >
                <UserPlus size={14} />
                Thêm Thành Viên
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/60 text-slate-400 uppercase font-bold text-[9px] tracking-wider border-b border-slate-150">
                  <tr>
                    <th className="p-3.5">Họ &amp; Tên</th>
                    <th className="p-3.5">Vai trò</th>
                    <th className="p-3.5">Số điện thoại</th>
                    <th className="p-3.5">Biển số</th>
                    <th className="p-3.5">Số dư ví</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-3.5">
                        <div>
                          <p className="font-extrabold text-slate-800">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold uppercase text-secondary text-[10px]">{u.role}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-500">{u.phone}</td>
                      <td className="p-3.5 font-mono uppercase font-bold text-slate-600">{u.licensePlate}</td>
                      <td className="p-3.5 font-black text-slate-800">{u.balance.toLocaleString('vi-VN')} VNĐ</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa tài khoản ${u.name}?`)) {
                              setUsers((prev) => prev.filter((usr) => usr.id !== u.id));
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                          title="Xóa thành viên"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: REPORTS / CHARTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <header className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
              <h2 className="text-xl font-extrabold text-primary">Báo cáo doanh thu &amp; Hiệu suất</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Số liệu phân tích tuần về doanh thu và công suất sử dụng bãi xe PBMS.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Revenue custom SVG chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Doanh thu tuần này (VNĐ)</h4>
                  <span className="text-sm font-black text-primary">Tổng: 11.900.000 VNĐ</span>
                </div>
                
                {/* SVG Visualizing bar chart */}
                <div className="h-60 w-full flex items-end justify-between pt-6 border-b border-slate-200 px-2">
                  {[
                    { day: 'T2', val: 12 },
                    { day: 'T3', val: 14.5 },
                    { day: 'T4', val: 13 },
                    { day: 'T5', val: 16 },
                    { day: 'T6', val: 18.5 },
                    { day: 'T7', val: 24 },
                    { day: 'CN', val: 21 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-8 group cursor-pointer">
                      <div className="text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {bar.val}M
                      </div>
                      <div
                        style={{ height: `${bar.val * 7}px` }}
                        className="w-full bg-primary hover:bg-[#39b8fd] rounded-t-lg transition-all shadow-md shadow-primary/5"
                      ></div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occupancy Rate line chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Tần suất lấp đầy bãi xe (%)</h4>
                  <span className="text-sm font-black text-secondary">Trung bình: 82%</span>
                </div>

                {/* Custom Line/Area chart inside SVG */}
                <div className="h-60 w-full relative pt-6 border-b border-slate-200 flex items-end">
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39b8fd" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#39b8fd" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 80 Q 15 70, 30 75 T 60 40 T 90 20 T 100 10 L 100 100 L 0 100 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0 80 Q 15 70, 30 75 T 60 40 T 90 20 T 100 10"
                      fill="none"
                      stroke="#006591"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="flex justify-between w-full z-10 px-2 pb-1 text-[10px] font-bold text-slate-400">
                    <span>Thứ 2</span>
                    <span>Thứ 4</span>
                    <span>Thứ 6</span>
                    <span>Chủ Nhật</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Cấu hình bãi xe thông minh</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Thiết lập tham số phần cứng bãi đỗ xe và định giá.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing settings */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[9px] border-b pb-1.5">Bảng giá xe giờ đỗ</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Đơn giá Ô tô (/giờ):</span>
                    <input
                      type="number"
                      defaultValue="20000"
                      className="w-28 text-center bg-slate-50 border border-slate-200 rounded-xl py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Đơn giá Xe máy (/giờ):</span>
                    <input
                      type="number"
                      defaultValue="5000"
                      className="w-28 text-center bg-slate-50 border border-slate-200 rounded-xl py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Hardware connection */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[9px] border-b pb-1.5">Cấu hình thiết bị camera</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">IP LPR Camera 1 (Lối vào):</span>
                    <input
                      type="text"
                      defaultValue="192.168.1.101"
                      className="w-40 text-center bg-slate-50 border border-slate-200 rounded-xl py-1.5 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">IP LPR Camera 2 (Lối ra):</span>
                    <input
                      type="text"
                      defaultValue="192.168.1.102"
                      className="w-40 text-center bg-slate-50 border border-slate-200 rounded-xl py-1.5 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Cấu hình bãi xe đã được lưu và cập nhật đồng bộ toàn bộ cảm biến bãi đỗ!');
              }}
              className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold shadow-md shadow-primary/10 mt-4"
            >
              Lưu cấu hình hệ thống
            </button>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b pb-2">Thêm Nhân viên / Tài xế</h4>
            
            <form onSubmit={handleAddNewUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Họ và tên</label>
                <input
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nhập tên"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</label>
                <input
                  required
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Số điện thoại</label>
                <input
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="Nhập sđt"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vai trò</label>
                <select
                  value={newUserRole}
                  onChange={(e: any) => setNewUserRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="staff">Nhân viên (Staff)</option>
                  <option value="manager">Quản lý (Manager)</option>
                  <option value="admin">Quản trị (Admin)</option>
                  <option value="driver">Tài xế (Driver)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 transition-all shadow-md"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation bar at bottom (Mobile only, hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 pb-safe bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center ${activeTab === 'dashboard' ? 'text-primary font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[9px] mt-0.5">Trang chủ</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center ${activeTab === 'map' ? 'text-primary font-bold' : 'text-slate-400'}`}
        >
          <Map size={18} />
          <span className="text-[9px] mt-0.5">Sơ đồ bãi xe</span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center justify-center ${activeTab === 'transactions' ? 'text-primary font-bold' : 'text-slate-400'}`}
        >
          <Receipt size={18} />
          <span className="text-[9px] mt-0.5">Lịch sử GD</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex flex-col items-center justify-center ${activeTab === 'users' ? 'text-primary font-bold' : 'text-slate-400'}`}
        >
          <Group size={18} />
          <span className="text-[9px] mt-0.5">Nhân sự</span>
        </button>
      </nav>
    </div>
  );
}

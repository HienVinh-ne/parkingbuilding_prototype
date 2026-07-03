import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { User, ParkingSlot, SystemLog, Transaction, Role } from '../types';
import { ADMIN_AVATAR, REVENUE_DATA_WEEK } from '../mockData';
import {
  BarChart3,
  Camera,
  Car,
  Database,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Map,
  Receipt,
  ScanLine,
  Search,
  Settings,
  Shield,
  Trash2,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'gate' | 'map' | 'transactions' | 'users' | 'reports' | 'settings';

interface AdminDashboardProps {
  initialUsers: User[];
  initialSlots: ParkingSlot[];
  initialLogs: SystemLog[];
  initialTransactions: Transaction[];
  currentRole: Role;
  onLogout: () => void;
}

const ROLE_LABEL: Record<Role, string> = {
  guest: 'Khách',
  driver: 'Tài xế',
  staff: 'Nhân viên',
  manager: 'Quản lý',
  admin: 'Quản trị viên',
};

const ROLE_TABS: Record<Role, AdminTab[]> = {
  guest: [],
  driver: [],
  staff: ['gate', 'dashboard', 'map', 'transactions'],
  manager: ['dashboard', 'map', 'transactions', 'users', 'reports'],
  admin: ['dashboard', 'gate', 'map', 'transactions', 'users', 'reports', 'settings'],
};

const NAV_ITEMS: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; helper: string }> = [
  { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, helper: 'Tổng quan vận hành' },
  { id: 'gate', label: 'Cổng check-in/out', icon: DoorOpen, helper: 'Xử lý xe ra vào' },
  { id: 'map', label: 'Sơ đồ bãi xe', icon: Map, helper: 'Theo dõi và cập nhật slot' },
  { id: 'transactions', label: 'Giao dịch bãi xe', icon: Receipt, helper: 'Tra cứu thanh toán' },
  { id: 'users', label: 'Quản lý người dùng', icon: Users, helper: 'Tài xế và nhân sự' },
  { id: 'reports', label: 'Báo cáo doanh thu', icon: BarChart3, helper: 'Doanh thu và công suất' },
  { id: 'settings', label: 'Cấu hình hệ thống', icon: Settings, helper: 'Giá, camera, cảnh báo' },
];

const SLOT_STATUS = {
  available: { label: 'Trống', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', card: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  reserved: { label: 'Đã đặt', badge: 'bg-amber-50 text-amber-700 border-amber-100', card: 'border-amber-200 bg-amber-50 text-amber-800' },
  occupied: { label: 'Đang đỗ', badge: 'bg-rose-50 text-rose-700 border-rose-100', card: 'border-rose-200 bg-rose-50 text-rose-800' },
};

export default function AdminDashboard({
  initialUsers,
  initialSlots,
  initialLogs,
  initialTransactions,
  currentRole,
  onLogout,
}: AdminDashboardProps) {
  const allowedTabs = ROLE_TABS[currentRole] || ROLE_TABS.staff;
  const [activeTab, setActiveTab] = useState<AdminTab>(allowedTabs[0] || 'dashboard');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [userSearch, setUserSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [mapFloorFilter, setMapFloorFilter] = useState('Tầng 1');
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);
  const [newSlotPlate, setNewSlotPlate] = useState('');
  const [newSlotHours, setNewSlotHours] = useState(2);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'staff' | 'manager' | 'admin' | 'driver'>('staff');
  const [gateMode, setGateMode] = useState<'checkin' | 'checkout'>('checkin');
  const [manualPlate, setManualPlate] = useState('59A-123.45');
  const [gateToast, setGateToast] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const canManageUsers = allowedTabs.includes('users');
  const canConfigure = allowedTabs.includes('settings');
  const visibleNavItems = NAV_ITEMS.filter((item) => allowedTabs.includes(item.id));

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const query = userSearch.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(userSearch) ||
          user.licensePlate.toLowerCase().includes(query)
        );
      }),
    [users, userSearch]
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        const query = txSearch.toLowerCase();
        return tx.id.toLowerCase().includes(query) || tx.licensePlate.toLowerCase().includes(query) || tx.slotId.toLowerCase().includes(query);
      }),
    [transactions, txSearch]
  );

  const floorSlots = useMemo(() => slots.filter((slot) => slot.floor === mapFloorFilter), [slots, mapFloorFilter]);
  const occupancyRate = Math.round((slots.filter((slot) => slot.status !== 'available').length / slots.length) * 100);
  const totalRevenue = transactions.filter((tx) => tx.status === 'success').reduce((sum, tx) => sum + tx.amount, 0);
  const todayTransactions = transactions.filter((tx) => tx.timeStr.includes('Hôm nay')).length;

  const handleAddNewUser = (event: FormEvent) => {
    event.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !canManageUsers) return;

    const newUser: User = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '0901234567',
      licensePlate: newUserRole === 'driver' ? 'Chưa cập nhật' : 'N/A',
      role: newUserRole,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      status: 'ACTIVE',
      balance: newUserRole === 'driver' ? 100000 : 0,
    };

    setUsers((prev) => [newUser, ...prev]);
    addLog('success', 'Tạo tài khoản mới', `Đã thêm ${newUser.name} với vai trò ${ROLE_LABEL[newUser.role]}`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserRole('staff');
    setShowAddUserModal(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    if (!canManageUsers) return;
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        addLog('warning', 'Cập nhật trạng thái người dùng', `${user.name} đã chuyển sang ${status === 'ACTIVE' ? 'hoạt động' : 'khóa'}`);
        return { ...user, status };
      })
    );
  };

  const handleUpdateSlotStatus = (slotId: string, status: ParkingSlot['status']) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;

        const currentSession =
          status === 'occupied'
            ? {
                licensePlate: newSlotPlate.trim().toUpperCase() || '59A-123.45',
                checkInTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                estimatedHours: newSlotHours,
                fee: newSlotHours * (slot.vehicleType === 'oto' ? 20000 : 5000),
              }
            : undefined;

        addLog('info', 'Cập nhật slot', `Slot ${slotId} chuyển sang ${SLOT_STATUS[status].label}`);
        return { ...slot, status, currentSession };
      })
    );
    setEditingSlot(null);
    setNewSlotPlate('');
    setNewSlotHours(2);
  };

  const addLog = (type: SystemLog['type'], title: string, description: string) => {
    setLogs((prev) => [{ id: `L_${Date.now()}`, type, title, description, timeStr: 'Vừa xong' }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className={`hidden shrink-0 border-r border-blue-950/20 bg-primary text-white transition-all md:sticky md:top-0 md:flex md:h-screen md:flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Camera className="text-sky-300" size={22} />
              {!sidebarCollapsed && <h1 className="truncate text-base font-black uppercase tracking-tight">PBMS Hệ Thống</h1>}
            </div>
            <button
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-black text-white/70 hover:bg-white/20"
              title={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              type="button"
            >
              {sidebarCollapsed ? '>>' : '<<'}
            </button>
          </div>

          {!sidebarCollapsed && <div className="mt-5 rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <img className="h-11 w-11 rounded-xl object-cover" src={ADMIN_AVATAR} alt="Admin profile" />
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{ROLE_LABEL[currentRole]}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-white/60">{currentRole} portal</p>
              </div>
            </div>
          </div>}
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const selected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-black transition ${
                  selected ? 'bg-sky-300 text-blue-950 shadow-lg shadow-sky-950/10' : 'text-white/82 hover:bg-white/10 hover:text-white'
                }`}
                type="button"
              >
                <Icon size={16} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3">
          {!sidebarCollapsed && <RoleHelp role={currentRole} />}
          <button
            onClick={onLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-black text-white/80 transition hover:bg-rose-500/10 hover:text-rose-300"
            type="button"
          >
            <LogOut size={16} />
            {!sidebarCollapsed && 'Đăng xuất'}
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 text-white shadow-md md:hidden">
        <div className="text-sm font-black uppercase">PBMS Hệ Thống</div>
        <button onClick={onLogout} className="rounded-lg p-2 hover:bg-white/10" type="button">
          <LogOut size={18} />
        </button>
      </header>

      <main className="min-w-0 flex-1 px-4 pb-24 pt-20 md:px-6 md:py-6 lg:px-8">
        {activeTab === 'gate' && (
          <Page title="Cổng Check-in / Check-out" subtitle="Bảng thao tác nhanh cho nhân viên cổng, ưu tiên tốc độ và ít nhập liệu.">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr_320px]">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black text-primary">Camera Capture</h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">LPR Online</span>
                </div>
                <div className="flex aspect-video items-center justify-center rounded-xl border border-slate-200 bg-slate-900 text-white">
                  <div className="text-center">
                    <ScanLine className="mx-auto text-sky-300" size={42} />
                    <p className="mt-3 text-sm font-black">AI đang nhận diện biển số</p>
                    <p className="mt-1 text-xs text-white/60">Camera cổng A · 192.168.1.101</p>
                  </div>
                </div>
                <label className="mt-4 block text-xs font-black text-slate-500">
                  Nhập biển số thủ công
                  <input
                    autoFocus
                    value={manualPlate}
                    onChange={(event) => setManualPlate(event.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-2xl font-black uppercase tracking-wide text-primary outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </label>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                  <button onClick={() => setGateMode('checkin')} className={`rounded-lg py-3 text-xs font-black ${gateMode === 'checkin' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`} type="button">Check-in</button>
                  <button onClick={() => setGateMode('checkout')} className={`rounded-lg py-3 text-xs font-black ${gateMode === 'checkout' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`} type="button">Check-out</button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <GateInfo label="Biển số" value={manualPlate || 'Chưa nhận diện'} strong />
                  <GateInfo label="Loại xe" value="Ô tô" />
                  <GateInfo label="Slot gợi ý" value={gateMode === 'checkin' ? 'A-102' : 'A-101'} />
                  <GateInfo label="Thanh toán" value={gateMode === 'checkin' ? 'Đã đặt trước' : 'Đã thanh toán'} status="success" />
                  <GateInfo label="Phí dự kiến" value={gateMode === 'checkin' ? '60.000 VNĐ' : '80.000 VNĐ'} />
                  <GateInfo label="Trạng thái cổng" value="Sẵn sàng mở" status="warning" />
                </div>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-800">
                  Nếu AI nhận diện sai hoặc không tìm thấy đặt chỗ, nhân viên có thể sửa biển số thủ công trước khi xác nhận.
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-black text-primary">Gate Control</h3>
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <DoorOpen className="mx-auto text-emerald-700" size={40} />
                  <p className="mt-2 text-sm font-black text-emerald-800">Barrier sẵn sàng</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">Mở trong 5 giây sau xác nhận</p>
                </div>
                <button
                  onClick={() => {
                    const message = gateMode === 'checkin' ? 'Check-in thành công, barrier đã mở.' : 'Check-out thành công, đã đóng phiên gửi xe.';
                    setGateToast(message);
                    addLog('success', gateMode === 'checkin' ? 'Xác nhận check-in' : 'Xác nhận check-out', `${manualPlate} · ${message}`);
                    window.setTimeout(() => setGateToast(''), 2400);
                  }}
                  className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-white shadow-md transition hover:bg-primary/95"
                  type="button"
                >
                  <DoorOpen size={18} />
                  {gateMode === 'checkin' ? 'Xác nhận Check-in' : 'Xác nhận Check-out'}
                </button>
                <button className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-black text-rose-700" type="button">
                  Báo sự cố camera / LPR
                </button>
              </section>
            </div>

            {gateToast && (
              <div className="fixed bottom-24 right-5 z-50 rounded-xl border border-emerald-200 bg-white p-4 text-sm font-black text-emerald-700 shadow-2xl">
                {gateToast}
              </div>
            )}
          </Page>
        )}

        {activeTab === 'dashboard' && (
          <Page title="Bảng điều khiển" subtitle={`Tổng quan vận hành dành cho ${ROLE_LABEL[currentRole].toLowerCase()}.`}>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard icon={<Database size={18} />} label="Tổng slot" value={slots.length.toString()} hint={`${occupancyRate}% đang sử dụng`} />
              <KpiCard icon={<Car size={18} />} label="Slot trống" value={slots.filter((slot) => slot.status === 'available').length.toString()} hint="Có thể đặt ngay" tone="emerald" />
              <KpiCard icon={<Wallet size={18} />} label="Doanh thu" value={`${totalRevenue.toLocaleString('vi-VN')} VNĐ`} hint={`${todayTransactions} GD hôm nay`} tone="amber" />
              <KpiCard icon={<Shield size={18} />} label="Vai trò" value={ROLE_LABEL[currentRole]} hint={visibleNavItems.map((item) => item.label).join(', ')} tone="rose" />
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <PanelHeader title="Người dùng gần đây" action={canManageUsers ? <button onClick={() => setShowAddUserModal(true)} className="rounded-lg bg-primary px-3 py-2 text-xs font-black text-white">Thêm</button> : null} />
                <div className="overflow-x-auto">
                  <UserTable users={users.slice(0, 6)} canManage={canManageUsers} onToggleStatus={handleToggleUserStatus} onDelete={(id) => setUsers((prev) => prev.filter((user) => user.id !== id))} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <PanelHeader title="Nhật ký hệ thống" />
                <div className="space-y-3 p-4">
                  {logs.slice(0, 6).map((log) => (
                    <div key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs font-black text-slate-800">{log.title}</p>
                      <p className="mt-1 text-[11px] font-medium leading-5 text-slate-500">{log.description}</p>
                      <p className="mt-2 text-[10px] font-bold text-slate-400">{log.timeStr}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Page>
        )}

        {activeTab === 'map' && (
          <Page title="Sơ đồ bãi xe" subtitle="Theo dõi trạng thái từng slot và cập nhật xe vào bãi.">
            <div className="flex flex-wrap gap-2">
              {['Tầng 1', 'Tầng 2', 'Tầng 3'].map((floor) => (
                <button
                  key={floor}
                  onClick={() => setMapFloorFilter(floor)}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition ${mapFloorFilter === floor ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-600'}`}
                  type="button"
                >
                  {floor}
                </button>
              ))}
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
                {floorSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setEditingSlot(slot);
                      setNewSlotPlate(slot.currentSession?.licensePlate || '');
                    }}
                    className={`min-h-24 rounded-xl border p-3 text-left transition hover:shadow-md ${SLOT_STATUS[slot.status].card}`}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black">{slot.id}</span>
                      <Car size={16} />
                    </div>
                    <p className="mt-2 text-[11px] font-black uppercase">{SLOT_STATUS[slot.status].label}</p>
                    <p className="mt-1 truncate text-[10px] font-semibold opacity-80">{slot.currentSession?.licensePlate || (slot.vehicleType === 'oto' ? 'Ô tô' : 'Xe máy')}</p>
                  </button>
                ))}
              </div>
            </section>
          </Page>
        )}

        {activeTab === 'transactions' && (
          <Page title="Giao dịch bãi xe" subtitle="Tra cứu thanh toán theo mã giao dịch, biển số hoặc slot.">
            <SearchBox value={txSearch} onChange={setTxSearch} placeholder="Tìm giao dịch, biển số, slot..." />
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <TransactionTable transactions={filteredTransactions} />
            </section>
          </Page>
        )}

        {activeTab === 'users' && (
          <Page title="Quản lý người dùng" subtitle="Quản lý tài xế, nhân viên, quản lý và trạng thái tài khoản.">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchBox value={userSearch} onChange={setUserSearch} placeholder="Tìm người dùng, email, SĐT, biển số..." />
              <button onClick={() => setShowAddUserModal(true)} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-black text-white" type="button">
                <UserPlus size={16} />
                Thêm người dùng
              </button>
            </div>
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <UserTable users={filteredUsers} canManage={canManageUsers} onToggleStatus={handleToggleUserStatus} onDelete={(id) => setUsers((prev) => prev.filter((user) => user.id !== id))} />
            </section>
          </Page>
        )}

        {activeTab === 'reports' && (
          <Page title="Báo cáo doanh thu & hiệu suất" subtitle="Dữ liệu mock theo tuần, phục vụ trình bày và kiểm thử UI.">
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <ChartCard
                title="Doanh thu tuần này"
                total={`${REVENUE_DATA_WEEK.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('vi-VN')} VNĐ`}
                max={Math.max(...REVENUE_DATA_WEEK.map((item) => item.revenue))}
                data={REVENUE_DATA_WEEK.map((item) => ({ label: item.day.replace('Thứ ', 'T'), value: item.revenue, display: `${Math.round(item.revenue / 100000) / 10}M` }))}
              />
              <ChartCard
                title="Công suất sử dụng"
                total={`${Math.round(REVENUE_DATA_WEEK.reduce((sum, item) => sum + item.occupancy, 0) / REVENUE_DATA_WEEK.length)}% trung bình`}
                max={100}
                data={REVENUE_DATA_WEEK.map((item) => ({ label: item.day.replace('Thứ ', 'T'), value: item.occupancy, display: `${item.occupancy}%` }))}
                tone="secondary"
              />
            </section>
          </Page>
        )}

        {activeTab === 'settings' && (
          <Page title="Cấu hình hệ thống" subtitle="Chỉ quản trị viên được thay đổi tham số vận hành.">
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <SettingsPanel title="Bảng giá">
                <SettingInput label="Đơn giá ô tô / giờ" value="20000" suffix="VNĐ" disabled={!canConfigure} />
                <SettingInput label="Đơn giá xe máy / giờ" value="5000" suffix="VNĐ" disabled={!canConfigure} />
                <SettingInput label="Thời gian giữ chỗ tối đa" value="15" suffix="phút" disabled={!canConfigure} />
              </SettingsPanel>
              <SettingsPanel title="Thiết bị">
                <SettingInput label="Camera lối vào" value="192.168.1.101" disabled={!canConfigure} />
                <SettingInput label="Camera lối ra" value="192.168.1.102" disabled={!canConfigure} />
                <SettingInput label="Cảnh báo công suất" value="90" suffix="%" disabled={!canConfigure} />
              </SettingsPanel>
            </section>
            <button
              onClick={() => alert('Cấu hình hệ thống đã được lưu trong bản demo.')}
              className="w-fit rounded-xl bg-primary px-5 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canConfigure}
              type="button"
            >
              Lưu cấu hình
            </button>
          </Page>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white px-2 py-2 md:hidden">
        {visibleNavItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[9px] font-black ${activeTab === item.id ? 'text-primary' : 'text-slate-400'}`} type="button">
              <Icon size={17} />
              {item.label.split(' ')[0]}
            </button>
          );
        })}
      </nav>

      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-black text-primary">Cập nhật slot {editingSlot.id}</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">{editingSlot.floor} · Zone {editingSlot.zone}</p>
            <div className="mt-4 space-y-3">
              <input value={newSlotPlate} onChange={(event) => setNewSlotPlate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold uppercase outline-none focus:border-secondary" placeholder="Biển số xe" />
              <input value={newSlotHours} min={1} max={24} onChange={(event) => setNewSlotHours(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-secondary" type="number" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button onClick={() => handleUpdateSlotStatus(editingSlot.id, 'available')} className="rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-black text-emerald-700" type="button">Trống</button>
              <button onClick={() => handleUpdateSlotStatus(editingSlot.id, 'reserved')} className="rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-black text-amber-700" type="button">Đã đặt</button>
              <button onClick={() => handleUpdateSlotStatus(editingSlot.id, 'occupied')} className="rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-black text-rose-700" type="button">Đang đỗ</button>
            </div>
            <button onClick={() => setEditingSlot(null)} className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-xs font-black text-slate-500" type="button">Đóng</button>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={handleAddNewUser} className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-black text-primary">Thêm người dùng</h3>
            <div className="mt-4 space-y-3">
              <input required value={newUserName} onChange={(event) => setNewUserName(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-secondary" placeholder="Họ và tên" />
              <input required type="email" value={newUserEmail} onChange={(event) => setNewUserEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-secondary" placeholder="Email" />
              <input value={newUserPhone} onChange={(event) => setNewUserPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-secondary" placeholder="Số điện thoại" />
              <select value={newUserRole} onChange={(event) => setNewUserRole(event.target.value as typeof newUserRole)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-secondary">
                <option value="driver">Tài xế</option>
                <option value="staff">Nhân viên</option>
                <option value="manager">Quản lý</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setShowAddUserModal(false)} className="rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-500" type="button">Hủy</button>
              <button className="rounded-xl bg-primary py-3 text-xs font-black text-white" type="submit">Thêm mới</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Page({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-primary">{title}</h2>
        <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function RoleHelp({ role }: { role: Role }) {
  const help: Record<Role, string> = {
    guest: '',
    driver: '',
    staff: 'Nhân viên: xem tổng quan, xử lý sơ đồ bãi xe và tra cứu giao dịch.',
    manager: 'Quản lý: thêm quyền quản lý người dùng và xem báo cáo doanh thu.',
    admin: 'Admin: toàn quyền cấu hình hệ thống, người dùng, báo cáo và vận hành.',
  };
  return <p className="rounded-xl bg-white/10 p-3 text-[11px] font-semibold leading-5 text-white/70">{help[role]}</p>;
}

function KpiCard({ icon, label, value, hint, tone = 'blue' }: { icon: ReactNode; label: string; value: string; hint: string; tone?: 'blue' | 'emerald' | 'amber' | 'rose' }) {
  const toneClass = {
    blue: 'bg-blue-50 text-primary',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  }[tone];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-xl font-black text-slate-800">{value}</p>
      <p className="mt-1 line-clamp-2 text-[11px] font-semibold text-slate-500">{hint}</p>
    </div>
  );
}

function PanelHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 p-4">
      <h3 className="text-sm font-black text-primary">{title}</h3>
      {action}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" placeholder={placeholder} />
    </div>
  );
}

function GateInfo({
  label,
  value,
  strong,
  status,
}: {
  label: string;
  value: string;
  strong?: boolean;
  status?: 'success' | 'warning';
}) {
  const statusClass =
    status === 'success'
      ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
      : status === 'warning'
        ? 'border-amber-100 bg-amber-50 text-amber-700'
        : 'border-slate-200 bg-slate-50 text-slate-800';

  return (
    <div className={`rounded-xl border p-4 ${statusClass}`}>
      <p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p>
      <p className={`${strong ? 'font-mono text-2xl' : 'text-base'} mt-1 font-black`}>{value}</p>
    </div>
  );
}

function UserTable({ users, canManage, onToggleStatus, onDelete }: { users: User[]; canManage: boolean; onToggleStatus: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <table className="w-full min-w-[760px] text-left text-xs">
      <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-400">
        <tr>
          <th className="p-3">Người dùng</th>
          <th className="p-3">Vai trò</th>
          <th className="p-3">SĐT</th>
          <th className="p-3">Biển số</th>
          <th className="p-3">Số dư</th>
          <th className="p-3">Trạng thái</th>
          <th className="p-3 text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-slate-50/60">
            <td className="p-3">
              <p className="font-black text-slate-800">{user.name}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{user.email}</p>
            </td>
            <td className="p-3 font-black text-secondary">{ROLE_LABEL[user.role]}</td>
            <td className="p-3 font-mono font-bold text-slate-600">{user.phone}</td>
            <td className="p-3 font-mono font-bold uppercase text-slate-600">{user.licensePlate}</td>
            <td className="p-3 font-black text-slate-800">{user.balance.toLocaleString('vi-VN')} VNĐ</td>
            <td className="p-3">
              <button onClick={() => onToggleStatus(user.id)} disabled={!canManage} className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase disabled:cursor-not-allowed ${user.status === 'ACTIVE' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`} type="button">
                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
              </button>
            </td>
            <td className="p-3 text-center">
              <button onClick={() => onDelete(user.id)} disabled={!canManage} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30" type="button">
                <Trash2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <table className="w-full min-w-[760px] text-left text-xs">
      <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-400">
        <tr>
          <th className="p-3">Mã GD</th>
          <th className="p-3">Biển số</th>
          <th className="p-3">Slot</th>
          <th className="p-3">Số tiền</th>
          <th className="p-3">Phương thức</th>
          <th className="p-3">Thời gian</th>
          <th className="p-3">Trạng thái</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {transactions.map((tx) => (
          <tr key={tx.id} className="hover:bg-slate-50/60">
            <td className="p-3 font-mono font-black text-primary">{tx.id}</td>
            <td className="p-3 font-mono font-bold uppercase">{tx.licensePlate}</td>
            <td className="p-3 font-black">{tx.slotId}</td>
            <td className="p-3 font-black">{tx.amount.toLocaleString('vi-VN')} VNĐ</td>
            <td className="p-3 font-semibold">{tx.method}</td>
            <td className="p-3 font-semibold text-slate-500">{tx.timeStr}</td>
            <td className="p-3">
              <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${tx.status === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : tx.status === 'pending' ? 'border-amber-100 bg-amber-50 text-amber-700' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
                {tx.status === 'success' ? 'Thành công' : tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChartCard({ title, total, data, max, tone = 'primary' }: { title: string; total: string; data: Array<{ label: string; value: number; display: string }>; max: number; tone?: 'primary' | 'secondary' }) {
  const color = tone === 'primary' ? 'bg-primary' : 'bg-secondary';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-black text-slate-800">{title}</h3>
        <span className="text-sm font-black text-primary">{total}</span>
      </div>
      <div className="mt-6 flex h-64 items-end justify-between gap-3 border-b border-slate-200 px-2">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-black text-slate-500">{item.display}</span>
            <div className={`w-full max-w-10 rounded-t-lg ${color}`} style={{ height: `${Math.max(12, (item.value / max) * 205)}px` }} />
            <span className="text-[10px] font-bold text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-black text-primary">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function SettingInput({ label, value, suffix, disabled }: { label: string; value: string; suffix?: string; disabled?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <input defaultValue={value} disabled={disabled} className="w-36 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right font-mono outline-none disabled:opacity-60" />
        {suffix && <span className="w-8 text-slate-400">{suffix}</span>}
      </div>
    </label>
  );
}

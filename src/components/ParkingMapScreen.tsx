import { useMemo, useState } from 'react';
import { ParkingSlot, Role, User } from '../types';
import ProgressSteps from './ui/ProgressSteps';
import {
  Bike,
  Car,
  ChevronRight,
  Clock,
  History,
  Layers,
  LogOut,
  MapPin,
  Navigation,
  User as UserIcon,
  CreditCard,
} from 'lucide-react';

interface ParkingMapScreenProps {
  slots: ParkingSlot[];
  onSelectSlot: (slot: ParkingSlot) => void;
  onNavigateToHistory: () => void;
  onNavigateToMembership: () => void;
  currentRole: Role;
  currentUser: User | null;
  onLogout: () => void;
}

const floors = ['Tầng 1', 'Tầng 2', 'Tầng 3'];
const slotFilters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'available', label: 'Chỗ trống' },
  { id: 'reserved', label: 'Đã đặt' },
  { id: 'occupied', label: 'Đang sử dụng' },
] as const;

const statusMeta = {
  available: {
    label: 'Trống',
    card: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100',
    dot: 'bg-emerald-500',
  },
  reserved: {
    label: 'Đã đặt',
    card: 'bg-amber-50 border-amber-300 text-amber-800',
    dot: 'bg-amber-500',
  },
  occupied: {
    label: 'Đang đỗ',
    card: 'bg-rose-50 border-rose-300 text-rose-800',
    dot: 'bg-rose-500',
  },
};

export default function ParkingMapScreen({
  slots,
  onSelectSlot,
  onNavigateToHistory,
  onNavigateToMembership,
  currentRole,
  currentUser,
  onLogout,
}: ParkingMapScreenProps) {
  const [selectedFloor, setSelectedFloor] = useState(floors[0]);
  const [activeSlot, setActiveSlot] = useState<ParkingSlot | null>(null);
  const [slotFilter, setSlotFilter] = useState<(typeof slotFilters)[number]['id']>('all');

  const filteredSlots = useMemo(
    () => slots.filter((slot) => slot.floor === selectedFloor && (slotFilter === 'all' || slot.status === slotFilter)),
    [slots, selectedFloor, slotFilter]
  );

  const stats = useMemo(
    () => ({
      total: slots.length,
      available: slots.filter((slot) => slot.status === 'available').length,
      reserved: slots.filter((slot) => slot.status === 'reserved').length,
      occupied: slots.filter((slot) => slot.status === 'occupied').length,
    }),
    [slots]
  );

  const occupancy = Math.round(((stats.occupied + stats.reserved) / stats.total) * 100);

  return (
    <div className="min-h-screen bg-background text-on-background font-sans pb-28">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Car size={21} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold">PBMS Parking</h1>
              <p className="truncate text-[11px] font-medium text-white/75">Đặt chỗ gửi xe nhanh và rõ ràng</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToMembership}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 transition hover:bg-white/10 hover:text-white"
              title="Thẻ tháng của tôi"
              type="button"
            >
              <CreditCard size={19} />
            </button>
            <button
              onClick={onNavigateToHistory}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 transition hover:bg-white/10 hover:text-white"
              title="Lịch sử đặt chỗ"
              type="button"
            >
              <History size={19} />
            </button>
            <button
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-bold transition hover:bg-white/20"
              title="Đăng xuất"
              type="button"
            >
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'KH'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-4 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <ProgressSteps active={1} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Xin chào</p>
                <h2 className="mt-1 text-xl font-black text-primary">{currentUser?.name || 'Khách vãng lai'}</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Vai trò: {currentRole === 'guest' ? 'Khách' : currentRole} · Số dư ví:{' '}
                  {(currentUser?.balance || 0).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Trống" value={stats.available} tone="text-emerald-600" />
                <Stat label="Đã đặt" value={stats.reserved} tone="text-amber-600" />
                <Stat label="Đang đỗ" value={stats.occupied} tone="text-rose-600" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${occupancy}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Công suất sử dụng</span>
              <span>{occupancy}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={17} className="text-secondary" />
                <h3 className="text-sm font-extrabold text-slate-800">Chọn tầng</h3>
              </div>
              <div className="hidden items-center gap-3 text-[11px] font-bold text-slate-500 sm:flex">
                {Object.entries(statusMeta).map(([status, meta]) => (
                  <span key={status} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {floors.map((floor) => {
                const available = slots.filter((slot) => slot.floor === floor && slot.status === 'available').length;
                const selected = selectedFloor === floor;

                return (
                  <button
                    key={floor}
                    onClick={() => {
                      setSelectedFloor(floor);
                      setActiveSlot(null);
                    }}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      selected
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                    type="button"
                  >
                    <span className="block text-sm font-black">{floor}</span>
                    <span className={`mt-1 block text-[11px] font-semibold ${selected ? 'text-white/75' : 'text-slate-500'}`}>
                      {available} chỗ trống
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">Bộ lọc nhanh</h3>
              <span className="text-[11px] font-bold text-slate-400">{filteredSlots.length} vị trí</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slotFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSlotFilter(filter.id);
                    setActiveSlot(null);
                  }}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-black transition ${
                    slotFilter === filter.id
                      ? 'border-secondary bg-blue-50 text-secondary'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Sơ đồ {selectedFloor}</h3>
                <p className="text-[11px] font-medium text-slate-500">Chạm vào ô để xem chi tiết hoặc đặt trước.</p>
              </div>
              <Navigation size={18} className="text-secondary" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <SlotGrid slots={filteredSlots.slice(0, 4)} activeSlot={activeSlot} setActiveSlot={setActiveSlot} />
              <div className="my-3 flex h-11 items-center justify-between rounded-lg border-y border-dashed border-slate-300 px-4 text-[10px] font-black uppercase tracking-wide text-slate-400">
                <span>Lối vào</span>
                <span>Làn xe trung tâm</span>
                <span>Lối ra</span>
              </div>
              <SlotGrid slots={filteredSlots.slice(4, 8)} activeSlot={activeSlot} setActiveSlot={setActiveSlot} />
              {filteredSlots.length === 0 && (
                <div className="ui-empty-state py-8">
                  <span className="ui-icon-well"><MapPin size={21} /></span>
                  <p className="mt-4 text-sm font-extrabold text-slate-800">Không tìm thấy vị trí phù hợp</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">Hãy thử chọn tầng khác hoặc thay đổi bộ lọc trạng thái.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <SlotDetails activeSlot={activeSlot} onSelectSlot={onSelectSlot} />
        </aside>
      </main>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-slate-200 bg-white px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(15,23,42,0.06)] md:hidden">
        <button className="flex flex-col items-center rounded-full bg-blue-50 px-4 py-1 text-primary" type="button">
          <Car size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Đặt chỗ</span>
        </button>
        <button onClick={onNavigateToHistory} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <History size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Lịch sử</span>
        </button>
        <button onClick={onNavigateToMembership} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <CreditCard size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Thẻ tháng</span>
        </button>
        <button onClick={onLogout} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <UserIcon size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Tài khoản</span>
        </button>
      </nav>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="min-w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className={`text-lg font-black ${tone}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}

function SlotGrid({
  slots,
  activeSlot,
  setActiveSlot,
}: {
  slots: ParkingSlot[];
  activeSlot: ParkingSlot | null;
  setActiveSlot: (slot: ParkingSlot) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const meta = statusMeta[slot.status];
        const selected = activeSlot?.id === slot.id;
        const VehicleIcon = slot.vehicleType === 'oto' ? Car : Bike;

        return (
          <button
            key={slot.id}
            onClick={() => setActiveSlot(slot)}
            className={`parking-space flex aspect-[1.05] min-h-16 flex-col items-center justify-center gap-1 rounded-lg border-2 p-1 text-center transition ${meta.card} ${
              selected ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            type="button"
          >
            <VehicleIcon size={16} />
            <span className="text-xs font-black">{slot.id}</span>
            <span className="text-[9px] font-bold uppercase">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SlotDetails({
  activeSlot,
  onSelectSlot,
}: {
  activeSlot: ParkingSlot | null;
  onSelectSlot: (slot: ParkingSlot) => void;
}) {
  if (!activeSlot) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm">
        <MapPin className="mx-auto text-secondary" size={28} />
        <h3 className="mt-3 text-sm font-extrabold text-slate-800">Chọn một chỗ đỗ</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          Chi tiết vị trí, phí dự kiến và nút đặt chỗ sẽ hiển thị tại đây.
        </p>
      </div>
    );
  }

  const meta = statusMeta[activeSlot.status];
  const hourlyRate = activeSlot.vehicleType === 'oto' ? 20000 : 5000;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${meta.card}`}>
            {meta.label}
          </span>
          <h3 className="mt-3 text-2xl font-black text-primary">Vị trí {activeSlot.id}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">{activeSlot.floor} · Khu vực {activeSlot.zone}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-primary">
          {activeSlot.vehicleType === 'oto' ? <Car size={24} /> : <Bike size={24} />}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-xs">
        <Info label="Loại xe" value={activeSlot.vehicleType === 'oto' ? 'Ô tô' : 'Xe máy'} />
        <Info label="Đơn giá" value={`${hourlyRate.toLocaleString('vi-VN')} VNĐ/giờ`} />
        {activeSlot.currentSession && (
          <>
            <Info label="Biển số" value={activeSlot.currentSession.licensePlate} />
            <Info label="Vào lúc" value={activeSlot.currentSession.checkInTime} />
          </>
        )}
      </div>

      {activeSlot.status === 'available' ? (
        <button
          onClick={() => onSelectSlot(activeSlot)}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-primary/10 transition hover:bg-primary/95 active:scale-[0.98]"
          type="button"
        >
          Tiếp tục đặt chỗ
          <ChevronRight size={18} />
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-800">
          <div className="flex items-center gap-2 font-black">
            <Clock size={15} />
            Chỗ này hiện chưa thể đặt
          </div>
          <p className="mt-1">Vui lòng chọn một ô màu xanh để tiếp tục đặt trước.</p>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { ParkingSlot, Role } from '../types';
import { Car, MapPin, Sparkles, Navigation, Layers, ChevronRight, CheckCircle2, History, User as UserIcon } from 'lucide-react';

interface ParkingMapScreenProps {
  slots: ParkingSlot[];
  onSelectSlot: (slot: ParkingSlot) => void;
  onNavigateToHistory: () => void;
  currentRole: Role;
  currentUser: any;
  onLogout: () => void;
}

export default function ParkingMapScreen({
  slots,
  onSelectSlot,
  onNavigateToHistory,
  currentRole,
  currentUser,
  onLogout,
}: ParkingMapScreenProps) {
  const [selectedFloor, setSelectedFloor] = useState<string>('Tầng 1');
  const [activeSlot, setActiveSlot] = useState<ParkingSlot | null>(null);

  const filteredSlots = useMemo(
    () => slots.filter((slot) => slot.floor === selectedFloor),
    [slots, selectedFloor]
  );

  const stats = useMemo(
    () => ({
      total: slots.length,
      available: slots.filter((s) => s.status === 'available').length,
      occupied: slots.filter((s) => s.status === 'occupied').length,
      reserved: slots.filter((s) => s.status === 'reserved').length,
    }),
    [slots]
  );

  const handleSlotClick = (slot: ParkingSlot) => {
    setActiveSlot(slot);
  };

  return (
    <div className="bg-background min-h-screen text-on-background flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="bg-primary text-white h-16 flex items-center justify-between px-4 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Car size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">PBMS Smart Solution</h1>
            <p className="text-[9px] text-white/80 uppercase tracking-widest">Hệ thống gửi xe thông minh</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToHistory}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center relative"
            title="Lịch sử đặt chỗ"
          >
            <History size={18} />
          </button>
          <div className="flex items-center gap-2 border-l border-white/20 pl-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{currentUser?.name || 'Khách'}</p>
              <p className="text-[9px] text-white/60">Số dư: {(currentUser?.balance || 0).toLocaleString('vi-VN')} VNĐ</p>
            </div>
            <button
              onClick={onLogout}
              className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold shadow-inner hover:scale-105 active:scale-95 transition-all text-xs"
            >
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'K'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow p-4 max-w-md mx-auto w-full flex flex-col gap-4">
        {/* Floor selector cards */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Layers size={14} className="text-secondary" />
              Chọn Tầng Đỗ Xe
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Tầng 1', 'Tầng 2', 'Tầng hầm'].map((floor) => {
              const isSelected = selectedFloor === floor;
              const count = slots.filter((s) => s.floor === floor && s.status === 'available').length;
              return (
                <button
                  key={floor}
                  onClick={() => {
                    setSelectedFloor(floor);
                    setActiveSlot(null);
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>{floor}</div>
                  <div className={`text-[9px] mt-0.5 font-semibold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {count} chỗ trống
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm flex justify-around text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 status-dot-pulse"></div>
            <span>Còn trống</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span>Đã đỗ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Đã đặt trước</span>
          </div>
        </div>

        {/* Parking Lot Grid Visualizer */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Sơ đồ chi tiết - {selectedFloor}
            </h3>

            {/* Simulated Road and grid */}
            <div className="border border-slate-200/60 rounded-xl p-3 bg-slate-50/50 flex flex-col gap-4 relative overflow-hidden">
              {/* Top Row Slots */}
              <div className="grid grid-cols-4 gap-2.5">
                {filteredSlots.slice(0, 4).map((slot) => {
                  const isSelected = activeSlot?.id === slot.id;
                  const bgClass =
                    slot.status === 'available'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                      : slot.status === 'reserved'
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-rose-100 border-rose-300 text-rose-800';

                  return (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      className={`h-16 rounded-lg border-2 flex flex-col items-center justify-between p-1.5 font-bold transition-all relative ${bgClass} ${
                        isSelected ? 'ring-4 ring-primary ring-offset-1 scale-105 shadow-md' : 'hover:scale-[1.02]'
                      }`}
                    >
                      <span className="text-xs">{slot.id}</span>
                      <span className="text-[7px] uppercase tracking-wider">
                        {slot.status === 'available' ? 'Trống' : slot.status === 'reserved' ? 'Đã Đặt' : 'Đã Đỗ'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Central Drive Lane */}
              <div className="h-10 border-y-2 border-dashed border-slate-300 flex items-center justify-between px-6 text-slate-400 text-[10px] font-mono select-none uppercase tracking-widest font-extrabold">
                <span>◀ LỐI VÀO DRIVEWAY</span>
                <span>◀ LỐI RA DRIVEWAY</span>
              </div>

              {/* Bottom Row Slots */}
              <div className="grid grid-cols-4 gap-2.5">
                {filteredSlots.slice(4).map((slot) => {
                  const isSelected = activeSlot?.id === slot.id;
                  const bgClass =
                    slot.status === 'available'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                      : slot.status === 'reserved'
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-rose-100 border-rose-300 text-rose-800';

                  return (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      className={`h-16 rounded-lg border-2 flex flex-col items-center justify-between p-1.5 font-bold transition-all relative ${bgClass} ${
                        isSelected ? 'ring-4 ring-primary ring-offset-1 scale-105 shadow-md' : 'hover:scale-[1.02]'
                      }`}
                    >
                      <span className="text-xs">{slot.id}</span>
                      <span className="text-[7px] uppercase tracking-wider">
                        {slot.status === 'available' ? 'Trống' : slot.status === 'reserved' ? 'Đã Đặt' : 'Đã Đỗ'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center italic mt-4">
            * Nhấp vào một ô màu xanh lá cây để đặt trước chỗ đậu xe của bạn.
          </p>
        </div>

        {/* Selected slot Drawer / Details */}
        {activeSlot ? (
          <div className="bg-white p-4 rounded-2xl border-2 border-primary/10 shadow-lg animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  Chi tiết vị trí
                </span>
                <h4 className="text-base font-extrabold text-primary mt-1">
                  Slot {activeSlot.id} <span className="text-xs text-slate-400">({activeSlot.floor})</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Biểu phí dự kiến</span>
                <span className="text-xs font-bold text-emerald-600">20.000 VNĐ / giờ</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <Car size={14} className="text-secondary" />
                <span>Loại xe: Ô tô & Xe máy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-500" />
                <span>Khu vực đỗ: Zone {activeSlot.zone}</span>
              </div>
            </div>

            {activeSlot.status === 'available' ? (
              <button
                onClick={() => onSelectSlot(activeSlot)}
                className="mt-4 w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-[0.98] transition-all text-xs uppercase"
              >
                <span>Tiếp Tục Đặt Chỗ</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="font-semibold">
                  {activeSlot.status === 'reserved'
                    ? 'Chỗ này đã được đặt trước bởi tài xế khác.'
                    : 'Chỗ này hiện tại đang có phương tiện đỗ.'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-center gap-3 text-slate-400">
            <Sparkles size={18} className="text-secondary" />
            <span className="text-xs font-semibold">Nhấn chọn một ô đậu xe trống để bắt đầu đặt chỗ</span>
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav for Client App */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 pb-safe border-t border-slate-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
        <button
          className="flex flex-col items-center justify-center text-primary font-bold bg-blue-50 rounded-full px-4 py-1 transition-all"
          type="button"
        >
          <Car size={18} fill="currentColor" />
          <span className="text-[10px] font-bold mt-0.5">Đặt Chỗ</span>
        </button>
        <button
          onClick={onNavigateToHistory}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-all px-4"
          type="button"
        >
          <History size={18} />
          <span className="text-[10px] font-bold mt-0.5">Lịch sử</span>
        </button>
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-all px-4"
          type="button"
        >
          <UserIcon size={18} />
          <span className="text-[10px] font-bold mt-0.5">Cá nhân</span>
        </button>
      </nav>
    </div>
  );
}

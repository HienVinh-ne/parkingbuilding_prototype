import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ParkingSlot, Reservation, User } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Calendar,
  Car,
  Clock,
  CreditCard,
  Landmark,
  MapPin,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { PARKING_IMAGE } from '../mockData';
import ProgressSteps from './ui/ProgressSteps';

interface ReservationScreenProps {
  selectedSlot: ParkingSlot;
  currentUser: User | null;
  onBack: () => void;
  onProceedToPayment: (reservation: Reservation) => void;
}

export default function ReservationScreen({
  selectedSlot,
  currentUser,
  onBack,
  onProceedToPayment,
}: ReservationScreenProps) {
  const [selectedPlate, setSelectedPlate] = useState('59A-123.45');
  const [vehicleType, setVehicleType] = useState<'oto' | 'xemay'>(selectedSlot.vehicleType);
  const [duration, setDuration] = useState(3);

  useEffect(() => {
    if (currentUser?.licensePlate) {
      setSelectedPlate(currentUser.licensePlate);
    }
  }, [currentUser]);

  const hourlyRate = vehicleType === 'oto' ? 20000 : 5000;
  const totalFee = duration * hourlyRate;

  const times = useMemo(() => {
    const start = new Date();
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    const formatTime = (date: Date) =>
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return {
      start: `${formatTime(start)} - Hôm nay`,
      end: `${formatTime(end)} (${duration} giờ)`,
    };
  }, [duration]);

  const handleProceed = () => {
    const reservation: Reservation = {
      id: `PB-${Math.floor(Math.random() * 9000) + 1000}-2026`,
      slotId: selectedSlot.id,
      floor: selectedSlot.floor,
      licensePlate: selectedPlate.toUpperCase(),
      vehicleType,
      startTime: times.start,
      endTime: times.end,
      durationHours: duration,
      totalFee,
      status: 'UPCOMING',
      dateStr: new Date().toLocaleDateString('vi-VN'),
    };

    onProceedToPayment(reservation);
  };

  return (
    <div className="min-h-screen bg-background pb-32 text-on-background">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="rounded-xl p-2 transition hover:bg-white/10" type="button">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-sm font-extrabold">Xác nhận đặt chỗ</h1>
              <p className="text-[11px] font-medium text-white/70">Kiểm tra thông tin trước khi thanh toán</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold sm:flex">
            <UserIcon size={15} />
            {currentUser?.name || 'Khách'}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-4 px-4 py-4 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <ProgressSteps active={3} />
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-40">
              <img className="h-full w-full object-cover" src={PARKING_IMAGE} alt="Bãi đỗ xe" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-white/75">Vị trí đã chọn</p>
                  <h2 className="text-2xl font-black">Vị trí {selectedSlot.id}</h2>
                  <p className="text-xs font-semibold text-white/80">{selectedSlot.floor} · Khu vực {selectedSlot.zone}</p>
                </div>
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
                  <MapPin size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-800">Thông tin xe</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Biển số xe</span>
                <select
                  value={selectedPlate}
                  onChange={(event) => setSelectedPlate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm font-bold outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                >
                  <option value={currentUser?.licensePlate || '59A-123.45'}>
                    {(currentUser?.licensePlate || '59A-123.45').toUpperCase()} (Mặc định)
                  </option>
                  <option value="51B-678.90">51B-678.90 (Xe gia đình)</option>
                  <option value="51G-888.88">51G-888.88 (Xe dự phòng)</option>
                </select>
              </label>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Loại xe</span>
                <div className="grid grid-cols-2 gap-2">
                  <VehicleButton active={vehicleType === 'oto'} icon={<Car size={16} />} label="Ô tô" onClick={() => setVehicleType('oto')} />
                  <VehicleButton active={vehicleType === 'xemay'} icon={<Bike size={16} />} label="Xe máy" onClick={() => setVehicleType('xemay')} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800">Thời lượng gửi xe</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">Có thể chọn từ 1 đến 24 giờ.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-primary">{duration} giờ</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="mt-5 h-2 w-full cursor-pointer accent-secondary"
            />
            <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-400">
              <span>1 giờ</span>
              <span>12 giờ</span>
              <span>24 giờ</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm font-black">Giữ chỗ ngay sau khi thanh toán</p>
                <p className="mt-1 text-xs font-semibold leading-5">
                  Vé điện tử và mã QR sẽ được tạo tự động. Bạn có thể xem lại trong lịch sử đặt chỗ.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800">Tóm tắt</h3>
            <div className="mt-4 space-y-3 border-y border-slate-100 py-4">
              <SummaryItem icon={<MapPin size={15} />} label="Vị trí" value={`${selectedSlot.id} · ${selectedSlot.floor}`} />
              <SummaryItem icon={<Car size={15} />} label="Biển số" value={selectedPlate.toUpperCase()} />
              <SummaryItem icon={<Calendar size={15} />} label="Bắt đầu" value={times.start} />
              <SummaryItem icon={<Clock size={15} />} label="Kết thúc" value={times.end} />
              <SummaryItem icon={<Landmark size={15} />} label="Đơn giá" value={`${hourlyRate.toLocaleString('vi-VN')} VNĐ/giờ`} />
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Tổng ước tính</span>
                <span>{duration}h</span>
              </div>
              <p className="mt-1 text-2xl font-black text-primary">{totalFee.toLocaleString('vi-VN')} VNĐ</p>
            </div>

            <button
              onClick={handleProceed}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-primary/10 transition hover:bg-primary/95 active:scale-[0.98]"
              type="button"
            >
              <CreditCard size={17} />
              Thanh toán ngay
              <ArrowRight size={17} />
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function VehicleButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-xs font-black transition ${
        active ? 'border-secondary bg-blue-50 text-secondary' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
      }`}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function SummaryItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-xs">
      <div className="mt-0.5 text-secondary">{icon}</div>
      <div>
        <p className="font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import { ParkingSlot, Reservation, User } from '../types';
import { ArrowLeft, User as UserIcon, Car, Bike, Landmark, Info, Calendar, Clock, DollarSign, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { PARKING_IMAGE } from '../mockData';

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
  // Setup interactive states
  const [selectedPlate, setSelectedPlate] = useState('59A-123.45');
  const [vehicleType, setVehicleType] = useState<'oto' | 'xemay'>('oto');
  const [duration, setDuration] = useState<number>(3); // default 3 hours

  // Sync plate on start
  useEffect(() => {
    if (currentUser && currentUser.licensePlate) {
      setSelectedPlate(currentUser.licensePlate);
    }
  }, [currentUser]);

  // Hourly rate based on vehicle type
  const hourlyRate = vehicleType === 'oto' ? 20000 : 5000;
  const totalEstimation = duration * hourlyRate;

  // Generate current times for display
  const [startTimeStr, setStartTimeStr] = useState('14:30 - Hôm nay');
  const [endTimeStr, setEndTimeStr] = useState('17:30 (3 giờ)');

  useEffect(() => {
    const start = new Date();
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const startStr = `${pad(start.getHours())}:${pad(start.getMinutes())} - Hôm nay`;
    const endStr = `${pad(end.getHours())}:${pad(end.getMinutes())} (${duration} giờ)`;
    
    setStartTimeStr(startStr);
    setEndTimeStr(endStr);
  }, [duration, vehicleType]);

  const handleProceed = () => {
    const reservation: Reservation = {
      id: `PB-${Math.floor(Math.random() * 9000) + 1000}-2026`,
      slotId: selectedSlot.id,
      floor: selectedSlot.floor,
      licensePlate: selectedPlate,
      vehicleType: vehicleType,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationHours: duration,
      totalFee: totalEstimation,
      status: 'UPCOMING',
      dateStr: new Date().toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }),
    };
    onProceedToPayment(reservation);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans relative pb-32">
      {/* Top Header */}
      <header className="bg-primary shadow-md flex justify-between items-center w-full px-4 h-16 text-white sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-white/15 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm sm:text-base font-bold">Đặt chỗ đỗ xe</h1>
        </div>
        <div>
          <button className="p-1 hover:bg-white/15 rounded-full transition-colors flex items-center justify-center">
            <UserIcon size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 max-w-md mx-auto w-full flex flex-col gap-5">
        {/* Selected Slot info */}
        <section className="relative z-10">
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-200/60">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Vị trí đã chọn
              </span>
              <h2 className="text-xl font-extrabold text-primary mt-0.5">
                {selectedSlot.id} <span className="text-xs font-semibold text-slate-400">({selectedSlot.floor})</span>
              </h2>
            </div>
            <div className="bg-secondary-container p-2.5 rounded-full flex items-center justify-center text-on-secondary-container">
              <span className="font-extrabold text-lg">P</span>
            </div>
          </div>
        </section>

        {/* Configuration Form */}
        <section className="relative z-10 flex flex-col gap-4">
          {/* License Plate Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Biển số xe</label>
            <div className="relative">
              <select
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary appearance-none text-sm font-semibold font-mono"
              >
                <option value="59A-123.45">59A-123.45 (Chính chủ)</option>
                <option value="51B-678.90">51B-678.90 (Xe gia đình)</option>
                <option value="51G-888.88">51G-888.88 (Xe dự phòng)</option>
              </select>
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Vehicle Type selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Loại xe</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVehicleType('oto')}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-xs border transition-all ${
                  vehicleType === 'oto'
                    ? 'border-2 border-secondary bg-sky-50 text-secondary'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Car size={16} />
                <span>Ô tô</span>
              </button>
              <button
                type="button"
                onClick={() => setVehicleType('xemay')}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-xs border transition-all ${
                  vehicleType === 'xemay'
                    ? 'border-2 border-secondary bg-sky-50 text-secondary'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Bike size={16} />
                <span>Xe máy</span>
              </button>
            </div>
          </div>

          {/* Booking Duration */}
          <div className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Thời lượng gửi xe</span>
              <span className="text-primary font-mono text-sm">{duration} giờ</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full accent-secondary mt-2 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>1 giờ</span>
              <span>12 giờ</span>
              <span>24 giờ</span>
            </div>
          </div>
        </section>

        {/* Price Estimation Info block */}
        <section className="relative z-10">
          <div className="bg-blue-50/80 border border-blue-100 p-3.5 rounded-xl flex items-center gap-3.5 shadow-inner">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Landmark size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Phí tạm tính</p>
              <p className="text-sm font-extrabold text-primary">{hourlyRate.toLocaleString('vi-VN')} VNĐ / giờ</p>
            </div>
          </div>
        </section>

        {/* Summary Card with Dashed Border */}
        <section className="relative z-10">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col gap-3.5 bg-white">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tóm tắt đặt chỗ
            </h3>
            
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <MapPinIcon size={12} />
                  Vị trí &amp; Tầng
                </p>
                <p className="font-extrabold text-slate-800">{selectedSlot.id} ({selectedSlot.floor})</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Car size={12} />
                  Biển số
                </p>
                <p className="font-mono font-extrabold text-slate-800 uppercase">{selectedPlate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Calendar size={12} />
                  Thời gian bắt đầu
                </p>
                <p className="font-extrabold text-slate-800">{startTimeStr}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Clock size={12} />
                  Dự kiến kết thúc
                </p>
                <p className="font-extrabold text-slate-800">{endTimeStr}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Context Image */}
        <section className="relative z-10">
          <div className="w-full h-36 rounded-2xl overflow-hidden shadow-md border border-slate-200 relative group">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={PARKING_IMAGE}
              alt="UNDERGROUND PARKING A-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <ImageIcon size={10} className="text-secondary" />
              <span>Camera Vị trí đỗ A-102</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-4 py-4 pb-safe flex flex-col gap-3.5 z-40">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tổng ước tính ({duration}h)
          </span>
          <span className="text-lg font-black text-primary">
            {totalEstimation.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
        <button
          onClick={handleProceed}
          className="w-full bg-primary hover:bg-primary/95 text-white h-12.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-primary/10"
        >
          <span>Tiếp tục thanh toán</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function MapPinIcon({ size }: { size: number }) {
  return (
    <svg className={`w-${size} h-${size}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

import { useState, useMemo } from 'react';
import { MembershipCard, ParkingSlot, User, Role } from '../types';
import {
  Bike,
  Car,
  ChevronRight,
  CreditCard,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Ticket,
  Wallet,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  CalendarCheck,
  ArrowLeft
} from 'lucide-react';

interface MembershipScreenProps {
  cards: MembershipCard[];
  slots: ParkingSlot[];
  currentUser: User | null;
  currentRole: Role;
  onBack: () => void;
  onRegisterMembership: (newCard: any, paymentMethod: string) => void;
  onCancelMembership: (cardId: string) => void;
}

const VEHICLE_PLANS = [
  { id: 'xe-dap', key: 'Bicycle', label: 'Xe đạp', Icon: Bike, price: 120000, accent: 'emerald', description: 'Dành cho xe đạp điện, xe đạp thể thao' },
  { id: 'xemay', key: 'Motorbike', label: 'Xe máy', Icon: Bike, price: 250000, accent: 'indigo', description: 'Dành cho xe số, xe ga, xe phân khối lớn' },
  { id: 'oto', key: 'Car', label: 'Ô tô', Icon: Car, price: 1500000, accent: 'rose', description: 'Dành cho xe ô tô từ 4 - 7 chỗ ngồi' },
];

const DURATIONS = [
  { value: 1, label: '1 Tháng', discount: null },
  { value: 6, label: '6 Tháng', discount: 'Giảm 5%' },
  { value: 12, label: '12 Tháng', discount: 'Giảm 10%' },
];

const accentCls: Record<string, { icon: string; bar: string; border: string }> = {
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    bar: 'bg-emerald-500',
    border: 'border-emerald-200'
  },
  indigo: {
    icon: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
    bar: 'bg-indigo-500',
    border: 'border-indigo-200'
  },
  rose: {
    icon: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
    bar: 'bg-rose-500',
    border: 'border-rose-200'
  },
};

export default function MembershipScreen({
  cards,
  slots,
  currentUser,
  currentRole,
  onBack,
  onRegisterMembership,
  onCancelMembership,
}: MembershipScreenProps) {
  const [selectedType, setSelectedType] = useState<'oto' | 'xemay' | 'xe-dap'>('oto');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [licenseVehicles, setLicenseVehicles] = useState<string[]>(['']);
  const [paymentMethod, setPaymentMethod] = useState<string>('WALLET');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Filter active cards by user status (in prototype we show cards)
  const activeCards = useMemo(() => cards.filter(c => c.status === 'ACTIVE'), [cards]);
  const activeTypeIds = useMemo(() => new Set(activeCards.map(c => c.vehicleType)), [activeCards]);

  // Determine available plans to register
  const availablePlans = useMemo(() => VEHICLE_PLANS.filter(p => !activeTypeIds.has(p.id as any)), [activeTypeIds]);

  // Auto-select first available plan if current one is active
  useMemo(() => {
    if (activeTypeIds.has(selectedType as any) && availablePlans.length > 0) {
      setSelectedType(availablePlans[0].id as any);
    }
  }, [activeTypeIds, availablePlans]);

  // Get current active plan details
  const currentPlan = useMemo(() => VEHICLE_PLANS.find(p => p.id === selectedType), [selectedType]);

  // Limit license plates: Car -> 3, others -> 1
  const maxVehicles = selectedType === 'oto' ? 3 : 1;

  // Filter available slots for target vehicle type
  const availableSlots = useMemo(() => {
    const typeFilter = selectedType === 'xe-dap' ? 'xemay' : selectedType;
    return slots.filter(s => s.status === 'available' && s.vehicleType === typeFilter);
  }, [slots, selectedType]);

  // Handle slot selection default
  useMemo(() => {
    if (availableSlots.length > 0 && (!selectedSlotId || !availableSlots.some(s => s.id === selectedSlotId))) {
      setSelectedSlotId(availableSlots[0].id);
    }
  }, [availableSlots]);

  // Calculate pricing
  const basePrice = (currentPlan?.price || 0) * selectedDuration;
  const discountPct = selectedDuration === 6 ? 0.05 : selectedDuration === 12 ? 0.10 : 0;
  const totalPrice = basePrice * (1 - discountPct);

  // Plate handlers
  const handleUpdatePlate = (index: number, val: string) => {
    setLicenseVehicles(prev => prev.map((item, idx) => idx === index ? val.toUpperCase() : item));
  };

  const handleAddPlate = () => {
    if (licenseVehicles.length < maxVehicles) {
      setLicenseVehicles(prev => [...prev, '']);
    }
  };

  const handleRemovePlate = (index: number) => {
    setLicenseVehicles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Submit handler
  const handleSubmit = () => {
    setErrorMessage('');

    if (!selectedSlotId) {
      setErrorMessage('Vui lòng chọn một Vị trí cố định để tiếp tục.');
      return;
    }

    const plates = licenseVehicles.map(p => p.trim()).filter(Boolean);
    if (plates.length === 0) {
      setErrorMessage('Vui lòng điền ít nhất một Biển số xe.');
      return;
    }

    const uniquePlates = new Set(plates);
    if (uniquePlates.size !== plates.length) {
      setErrorMessage('Biển số xe bị trùng lặp. Vui lòng nhập các biển số khác nhau.');
      return;
    }

    // Deduct user wallet if wallet is selected
    if (paymentMethod === 'WALLET' && currentUser && currentUser.balance < totalPrice) {
      setErrorMessage('Số dư trong ví không đủ. Vui lòng nạp thêm tiền hoặc chọn VNPAY.');
      return;
    }

    const now = new Date();
    const end = new Date();
    end.setMonth(now.getMonth() + selectedDuration);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())} - ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

    const newCard = {
      id: `MEM-${Math.floor(Math.random() * 9000) + 1000}`,
      ticketCode: `MEM-${selectedSlotId}-${selectedDuration}M`,
      startTime: formatDate(now),
      endTime: formatDate(end),
      vehicleType: selectedType,
      durationMonths: selectedDuration,
      price: totalPrice,
      slots: [{ slotId: selectedSlotId, slotName: `Slot ${selectedSlotId}`, slotStatus: 'Reserved' }],
      vehicles: plates,
      status: 'ACTIVE' as const
    };

    onRegisterMembership(newCard, paymentMethod);
  };

  const handleCancelClick = (cardId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy thẻ thành viên này? Hành động này không thể hoàn tác và vị trí đỗ xe cố định sẽ được giải phóng ngay lập tức.')) {
      onCancelMembership(cardId);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800 pb-20">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-4">
          <button onClick={onBack} className="mr-3 rounded-xl p-2 transition hover:bg-white/10" type="button">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold">Membership của tôi</h1>
            <p className="text-[11px] font-medium text-white/75">Quản lý thẻ thành viên và gửi xe cố định</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* ACTIVE MEMBERSHIP VIEWS */}
        {activeCards.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Membership đang hoạt động</h2>
                <p className="text-xs text-slate-500 font-medium">Bạn có quyền ra vào bãi xe và đỗ xe tại vị trí cố định của mình.</p>
              </div>
            </div>

            {activeCards.map((card) => {
              const plan = VEHICLE_PLANS.find(p => p.id === card.vehicleType) || VEHICLE_PLANS[0];
              const cls = accentCls[plan.accent];
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(card.ticketCode)}&bgcolor=ffffff&color=0f172a&margin=10`;

              return (
                <div key={card.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg">
                  {/* Header */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${cls.icon}`}>
                        {plan.id === 'xe-dap' || plan.id === 'xemay' ? <Bike size={24} /> : <Car size={24} />}
                      </div>
                      <div>
                        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                          <ShieldCheck size={10} />
                          THẺ THÀNH VIÊN
                        </div>
                        <h3 className="text-lg font-black text-slate-900">
                          Thẻ {plan.label} · {card.durationMonths} Tháng
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          Mã thẻ: <span className="font-mono text-primary font-bold">{card.ticketCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 sm:text-right">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Thời hạn sử dụng</p>
                        <p className="mt-1 text-xs font-extrabold text-slate-800">Từ: {card.startTime}</p>
                        <p className="text-xs font-semibold text-slate-500">Đến: {card.endTime}</p>
                      </div>
                      <button
                        onClick={() => handleCancelClick(card.id)}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition"
                      >
                        <X size={13} />
                        Hủy thẻ thành viên
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid gap-4 p-5 md:grid-cols-3 bg-slate-50/50">
                    {/* QR code */}
                    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4 text-center">
                      <span className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Mã QR Check-In</span>
                      <img src={qrUrl} alt={card.ticketCode} className="h-32 w-32 object-contain border rounded-lg p-1" />
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1">
                        <Ticket size={12} className="text-slate-400" />
                        <span className="font-mono text-[10px] font-black tracking-wider text-slate-700">{card.ticketCode}</span>
                      </div>
                    </div>

                    {/* Vị trí đỗ cố định */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <span className="block mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Vị trí đỗ cố định</span>
                      <div className="space-y-3">
                        {card.slots.map((s) => (
                          <div key={s.slotId} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                            <CalendarCheck size={16} className="text-emerald-500 shrink-0" />
                            <div>
                              <span className="text-sm font-extrabold text-slate-900">{s.slotName}</span>
                              <span className="block text-[10px] font-semibold text-slate-400">Đã kích hoạt cố định</span>
                            </div>
                            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">
                              {s.slotStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Biển số xe đăng ký */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <span className="block mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Biển số đăng ký</span>
                      <div className="grid gap-2">
                        {card.vehicles.map((plate) => (
                          <div key={plate} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                            <CheckCircle size={14} className="text-indigo-500" />
                            <span className="font-mono text-xs font-black tracking-wider text-slate-800">{plate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* REGISTRATION SECTION */}
        {availablePlans.length > 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Đăng ký Membership mới</h2>
                <p className="text-xs text-slate-500 font-medium">Thuê bao đỗ xe tháng giúp tiết kiệm chi phí và luôn có chỗ đỗ cố định.</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Form Input column */}
              <div className="lg:col-span-2 space-y-5">
                {/* 1. Chọn loại xe */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">1. Chọn phương tiện</span>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {VEHICLE_PLANS.map((item) => {
                      const itemCls = accentCls[item.accent];
                      const isSelected = selectedType === item.id;
                      const isActive = activeTypeIds.has(item.id as any);

                      return (
                        <button
                          key={item.id}
                          disabled={isActive}
                          onClick={() => {
                            setSelectedType(item.id as any);
                            setLicenseVehicles(['']);
                            setErrorMessage('');
                          }}
                          className={`relative rounded-xl border-2 p-4 text-left transition ${
                            isSelected
                              ? 'border-primary bg-blue-50/50 shadow-sm'
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                          } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          type="button"
                        >
                          {isSelected && <CheckCircle size={16} className="absolute right-3 top-3 text-primary" />}
                          <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border ${itemCls.icon}`}>
                            {item.id === 'xe-dap' || item.id === 'xemay' ? <Bike size={20} /> : <Car size={20} />}
                          </div>
                          <p className="text-sm font-black text-slate-900">{item.label}</p>
                          <p className="mt-1 text-[11px] font-semibold text-slate-400 leading-4">
                            {isActive ? 'Đã kích hoạt thẻ' : item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Chọn thời hạn */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">2. Chọn thời hạn thuê</span>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATIONS.map((dur) => {
                      const isSelected = selectedDuration === dur.value;
                      return (
                        <button
                          key={dur.value}
                          onClick={() => setSelectedDuration(dur.value)}
                          className={`relative rounded-xl border-2 py-3 text-center transition cursor-pointer ${
                            isSelected ? 'border-primary bg-blue-50/40' : 'border-slate-200 bg-slate-50/30 hover:border-slate-300'
                          }`}
                          type="button"
                        >
                          {dur.discount && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white whitespace-nowrap">
                              {dur.discount}
                            </span>
                          )}
                          <p className="text-sm font-black text-slate-800">{dur.label}</p>
                          <p className="mt-0.5 text-[9px] font-semibold text-slate-400">Cố định slot đỗ</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Chọn vị trí đỗ cố định */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">3. Chọn Vị trí cố định (Slot đỗ)</span>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    {availableSlots.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500">Danh sách vị trí còn trống:</label>
                        <select
                          value={selectedSlotId}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-black outline-none focus:border-primary"
                        >
                          {availableSlots.map(s => (
                            <option key={s.id} value={s.id}>
                              Slot {s.id} ({s.floor} · Khu vực {s.zone})
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] font-medium text-slate-400 leading-4">
                          * Thẻ thành viên sẽ gắn liền với vị trí cố định đã chọn. Vị trí này sẽ luôn để dành riêng cho xe của bạn trong thời gian thẻ hiệu lực.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
                        <AlertCircle size={16} />
                        <span className="text-xs font-bold">Không còn slot trống nào tương thích với loại xe đã chọn.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Biển số đăng ký */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">4. Đăng ký biển số xe</span>
                    {licenseVehicles.length < maxVehicles && (
                      <button
                        onClick={handleAddPlate}
                        className="text-xs font-black text-primary hover:underline cursor-pointer"
                        type="button"
                      >
                        + Thêm xe khác
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {licenseVehicles.map((plate, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={plate}
                          onChange={(e) => handleUpdatePlate(index, e.target.value)}
                          placeholder="VD: 59A-123.45"
                          className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-mono font-bold tracking-wide uppercase outline-none focus:border-primary focus:bg-white"
                        />
                        {licenseVehicles.length > 1 && (
                          <button
                            onClick={() => handleRemovePlate(index)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 cursor-pointer"
                            type="button"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 leading-4">
                    * Gói dịch vụ này cho phép đăng ký tối đa {maxVehicles} biển số xe khác nhau.
                  </p>
                </div>
              </div>

              {/* Bill summary column */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Tóm tắt thanh toán</span>

                  {currentPlan && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${accentCls[currentPlan.accent].icon}`}>
                          {selectedType === 'xe-dap' || selectedType === 'xemay' ? <Bike size={18} /> : <Car size={18} />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">Gói {currentPlan.label}</p>
                          <p className="text-[10px] font-semibold text-slate-400">Đăng ký mới · {selectedDuration} Tháng</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-y border-slate-200 py-3 text-xs font-bold text-slate-600">
                        <div className="flex justify-between">
                          <span>Đơn giá tháng</span>
                          <span>{currentPlan.price.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thời hạn</span>
                          <span>{selectedDuration} tháng</span>
                        </div>
                        {discountPct > 0 && (
                          <div className="flex justify-between text-rose-600">
                            <span>Ưu đãi thời hạn</span>
                            <span>-{Math.round(discountPct * 100)}%</span>
                          </div>
                        )}
                      </div>

                      {/* Payment Method Select */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hình thức thanh toán</span>
                        <div className="grid gap-2">
                          <button
                            onClick={() => setPaymentMethod('WALLET')}
                            className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-black transition cursor-pointer ${
                              paymentMethod === 'WALLET'
                                ? 'border-primary bg-blue-50 text-primary'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                            type="button"
                          >
                            <Wallet size={14} />
                            Ví tài xế (Số dư: {(currentUser?.balance || 0).toLocaleString('vi-VN')} đ)
                          </button>
                          <button
                            onClick={() => setPaymentMethod('VNPAY')}
                            className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-black transition cursor-pointer ${
                              paymentMethod === 'VNPAY'
                                ? 'border-primary bg-blue-50 text-primary'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                            type="button"
                          >
                            <CreditCard size={14} />
                            Cổng VNPay (Thẻ ngân hàng)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm font-extrabold text-slate-900">Tổng cộng</span>
                    <span className="text-xl font-black text-primary">{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>

                  {errorMessage && (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs font-bold text-rose-700">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/10 transition hover:bg-primary/95 active:scale-[0.98] cursor-pointer"
                    type="button"
                  >
                    <CheckCircle size={15} />
                    Xác nhận thanh toán
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
            Tất cả các gói phương tiện của bạn đã được đăng ký hoạt động đầy đủ.
          </div>
        )}
      </main>
    </div>
  );
}

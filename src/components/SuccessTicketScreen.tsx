import { Reservation } from '../types';
import { CalendarClock, Check, History, Home, Map, QrCode, ShieldAlert, User, Car } from 'lucide-react';
import { TICKET_QR_IMAGE } from '../mockData';
import ProgressSteps from './ui/ProgressSteps';

interface SuccessTicketScreenProps {
  reservation: Reservation;
  onNavigateHome: () => void;
  onNavigateToHistory: () => void;
}

export default function SuccessTicketScreen({
  reservation,
  onNavigateHome,
  onNavigateToHistory,
}: SuccessTicketScreenProps) {
  return (
    <div className="min-h-screen bg-background pb-28 text-on-background">
      <main className="mx-auto flex w-full max-w-sm flex-col items-center px-4 py-6">
        <ProgressSteps active={5} className="mb-6 w-full" />
        <div className="animate-success mb-5 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-lg shadow-emerald-100">
            <Check size={34} strokeWidth={3} />
          </div>
          <h1 className="mt-3 text-xl font-black text-primary">Đặt chỗ thành công</h1>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
            Xuất trình vé này tại cổng vào bãi xe để được xác nhận nhanh.
          </p>
        </div>

        <section className="ticket-shape w-full overflow-hidden border border-slate-200 bg-white shadow-xl">
          <div className="p-5 pb-10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mã vé</p>
                <p className="mt-1 font-mono text-sm font-black text-primary">{reservation.id}</p>
              </div>
              <img className="h-16 w-16 rounded-lg border bg-white p-1 shadow-sm" src={TICKET_QR_IMAGE} alt="Mã QR vé" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <TicketInfo label="Vị trí đỗ" value={`Vị trí ${reservation.slotId}`} subValue={reservation.floor} />
              <TicketInfo label="Biển số" value={reservation.licensePlate} mono />
              <TicketInfo label="Loại xe" value={reservation.vehicleType === 'oto' ? 'Ô tô' : 'Xe máy'} />
              <TicketInfo label="Tổng phí" value={`${reservation.totalFee.toLocaleString('vi-VN')} VNĐ`} />
              <div className="col-span-2 rounded-xl bg-blue-50 p-3 text-primary">
                <div className="flex items-center gap-2">
                  <CalendarClock size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wide">Hiệu lực</span>
                </div>
                <p className="mt-2 text-sm font-black">{reservation.startTime}</p>
                <p className="mt-1 text-xs font-semibold text-primary/70">Kết thúc dự kiến: {reservation.endTime}</p>
              </div>
            </div>
          </div>

          <div className="dash-line" />

          <div className="border-t border-slate-100 bg-slate-50 p-5 pt-8">
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-3 text-center">
              <QrCode className="mx-auto text-primary" size={28} />
              <div className="mt-3 flex h-10 items-center justify-center gap-[2px] opacity-80">
                {Array.from({ length: 28 }).map((_, index) => {
                  const width = index % 4 === 0 ? 'w-1.5' : index % 3 === 0 ? 'w-0.5' : 'w-1';
                  return <div key={index} className={`h-full bg-slate-900 ${width}`} />;
                })}
              </div>
              <p className="mt-2 font-mono text-[10px] font-bold tracking-wider text-slate-500">{reservation.id}</p>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[9px] font-bold uppercase tracking-wide text-slate-400">
              <ShieldAlert size={10} className="text-secondary" />
              PBMS bảo mật thông tin vé và phương tiện.
            </p>
          </div>
        </section>

        <div className="mt-5 grid w-full gap-3">
          <button
            onClick={() => alert('Đang mở sơ đồ chỉ đường trong bãi xe...')}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black uppercase text-white shadow-md transition hover:bg-primary/95"
            type="button"
          >
            <Map size={16} />
            Xem bản đồ bãi xe
          </button>
          <button
            onClick={onNavigateHome}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-black uppercase text-primary shadow-sm transition hover:bg-slate-50"
            type="button"
          >
            <Home size={16} />
            Về trang chủ
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-slate-200 bg-white px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(15,23,42,0.06)] md:hidden">
        <button onClick={onNavigateHome} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <Car size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Đặt chỗ</span>
        </button>
        <button onClick={onNavigateToHistory} className="flex flex-col items-center rounded-full bg-blue-50 px-4 py-1 text-primary" type="button">
          <History size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Lịch sử</span>
        </button>
        <button onClick={onNavigateHome} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <User size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Tài khoản</span>
        </button>
      </nav>
    </div>
  );
}

function TicketInfo({
  label,
  value,
  subValue,
  mono,
}: {
  label: string;
  value: string;
  subValue?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-black text-slate-800 ${mono ? 'font-mono uppercase' : ''}`}>{value}</p>
      {subValue && <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{subValue}</p>}
    </div>
  );
}

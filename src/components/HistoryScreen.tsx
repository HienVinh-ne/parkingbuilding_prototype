import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Reservation, User } from '../types';
import { ArrowLeft, CalendarClock, Car, CheckSquare, History, Home, MapPin, Receipt, Trash2, User as UserIcon, CreditCard } from 'lucide-react';

interface HistoryScreenProps {
  reservations: Reservation[];
  currentUser: User | null;
  onCancelReservation: (id: string) => void;
  onNavigateHome: () => void;
  onNavigateToMembership: () => void;
  onSelectReservationDetails: (reservation: Reservation) => void;
}

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function HistoryScreen({
  reservations,
  currentUser,
  onCancelReservation,
  onNavigateHome,
  onNavigateToMembership,
  onSelectReservationDetails,
}: HistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const grouped = useMemo(
    () => ({
      upcoming: reservations.filter((item) => item.status === 'UPCOMING'),
      completed: reservations.filter((item) => item.status === 'COMPLETED'),
      cancelled: reservations.filter((item) => item.status === 'CANCELLED'),
    }),
    [reservations]
  );

  const activeItems = grouped[activeTab];

  const handleCancelClick = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt chỗ này không? Chỗ đỗ sẽ được mở lại ngay.')) {
      onCancelReservation(id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28 text-on-background">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={onNavigateHome} className="rounded-xl p-2 transition hover:bg-white/10" type="button">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-sm font-extrabold">Lịch sử đặt chỗ</h1>
              <p className="text-[11px] font-medium text-white/70">{currentUser?.name || 'Khách'}</p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xs font-black">
            {currentUser?.name?.slice(0, 2).toUpperCase() || 'KH'}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4">
        <div className="sticky top-16 z-30 bg-background py-3">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            <TabButton active={activeTab === 'upcoming'} label="Sắp tới" count={grouped.upcoming.length} onClick={() => setActiveTab('upcoming')} />
            <TabButton active={activeTab === 'completed'} label="Hoàn thành" count={grouped.completed.length} onClick={() => setActiveTab('completed')} />
            <TabButton active={activeTab === 'cancelled'} label="Đã hủy" count={grouped.cancelled.length} onClick={() => setActiveTab('cancelled')} />
          </div>
        </div>

        <section className="space-y-3">
          {activeItems.length > 0 ? (
            activeItems.map((reservation) => (
              <div key={reservation.id}>
                {renderReservationCard(
                  reservation,
                  () => handleCancelClick(reservation.id),
                  () => onSelectReservationDetails(reservation)
                )}
              </div>
            ))
          ) : (
            <div className="ui-empty-state">
              <span className="ui-icon-well"><History size={22} /></span>
              <p className="mt-4 text-sm font-extrabold text-slate-800">Chưa có lượt đặt chỗ</p>
              <p className="mx-auto mt-2 max-w-xs text-xs font-medium leading-5 text-slate-500">Các vé phù hợp với trạng thái này sẽ xuất hiện tại đây sau khi bạn đặt chỗ.</p>
              <button onClick={onNavigateHome} className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-xs font-extrabold text-white" type="button">
                Đặt chỗ ngay
              </button>
            </div>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-slate-200 bg-white px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(15,23,42,0.06)] md:hidden">
        <button onClick={onNavigateHome} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <Home size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Trang chủ</span>
        </button>
        <button className="flex flex-col items-center rounded-full bg-blue-50 px-4 py-1 text-primary" type="button">
          <History size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Lịch sử</span>
        </button>
        <button onClick={onNavigateToMembership} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <CreditCard size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Thẻ tháng</span>
        </button>
        <button onClick={onNavigateHome} className="flex flex-col items-center px-4 py-1 text-slate-400" type="button">
          <UserIcon size={18} />
          <span className="mt-0.5 text-[10px] font-bold">Tài khoản</span>
        </button>
      </nav>
    </div>
  );
}

function TabButton({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg py-2.5 text-xs font-black transition ${active ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
      type="button"
    >
      {label} ({count})
    </button>
  );
}

function renderReservationCard(reservation: Reservation, onCancel: () => void, onView: () => void) {
  const status =
    reservation.status === 'UPCOMING'
      ? { label: 'Đã đặt', className: 'bg-blue-50 text-secondary border-blue-100' }
      : reservation.status === 'COMPLETED'
        ? { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
        : { label: 'Đã hủy', className: 'bg-slate-100 text-slate-500 border-slate-200' };

  return (
    <article className="interactive-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{reservation.dateStr}</p>
          <h3 className="mt-1 text-base font-black text-slate-800">
            Vị trí {reservation.slotId} · {reservation.floor}
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${status.className}`}>{status.label}</span>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-4">
        <Detail icon={<Car size={14} />} label="Biển số" value={reservation.licensePlate} mono />
        <Detail icon={<CalendarClock size={14} />} label="Bắt đầu" value={reservation.startTime} />
        <Detail icon={<CheckSquare size={14} />} label="Thời lượng" value={`${reservation.durationHours} giờ`} />
        <Detail icon={<Receipt size={14} />} label="Tổng phí" value={`${reservation.totalFee.toLocaleString('vi-VN')} VNĐ`} />
      </div>

      <div className="mt-4 flex gap-2">
        {reservation.status === 'UPCOMING' && (
          <button
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-50"
            type="button"
          >
            <Trash2 size={14} />
            Hủy
          </button>
        )}
        <button
          onClick={onView}
          className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-black text-white transition hover:bg-primary/95"
          type="button"
        >
          <MapPin size={14} />
          Xem vé
        </button>
      </div>
    </article>
  );
}

function Detail({ icon, label, value, mono }: { icon: ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </p>
      <p className={`mt-1 font-extrabold text-slate-700 ${mono ? 'font-mono uppercase' : ''}`}>{value}</p>
    </div>
  );
}

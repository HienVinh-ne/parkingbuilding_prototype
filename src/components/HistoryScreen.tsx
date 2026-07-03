import { useMemo, useState } from 'react';
import { Reservation, User } from '../types';
import { RefreshCw, Settings, User as UserIcon, Car, CheckSquare, Receipt, ArrowLeft, Trash2, MapPin } from 'lucide-react';

interface HistoryScreenProps {
  reservations: Reservation[];
  currentUser: User | null;
  onCancelReservation: (id: string) => void;
  onNavigateHome: () => void;
  onSelectReservationDetails: (reservation: Reservation) => void;
}

export default function HistoryScreen({
  reservations,
  currentUser,
  onCancelReservation,
  onNavigateHome,
  onSelectReservationDetails,
}: HistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const upcomingReservations = useMemo(
    () => reservations.filter((r) => r.status === 'UPCOMING'),
    [reservations]
  );

  const completedReservations = useMemo(
    () => reservations.filter((r) => r.status === 'COMPLETED'),
    [reservations]
  );

  const handleCancelClick = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt chỗ này không? Chỗ đỗ sẽ được giải phóng lập tức.')) {
      onCancelReservation(id);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="bg-primary text-white h-16 flex justify-between items-center px-4 fixed top-0 w-full z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={onNavigateHome} className="p-1 hover:bg-white/10 rounded-full transition-colors md:hidden">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-sm sm:text-base">Lịch sử</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white flex items-center justify-center">
            <RefreshCw size={18} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white flex items-center justify-center">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-extrabold shadow-inner text-xs">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'TX'}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mt-16 max-w-lg mx-auto w-full px-4 pt-4">
        
        {/* Tab Switcher */}
        <div className="sticky top-16 bg-background z-30 py-3">
          <div className="flex bg-slate-100 rounded-2xl p-1 relative">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all relative z-10 ${
                activeTab === 'upcoming' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
              }`}
            >
              Sắp tới ({upcomingReservations.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all relative z-10 ${
                activeTab === 'completed' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
              }`}
            >
              Đã hoàn thành ({completedReservations.length})
            </button>
          </div>
        </div>

        {/* Tab Content: Upcoming */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {upcomingReservations.length > 0 ? (
              upcomingReservations.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[9px] font-extrabold text-primary tracking-wider uppercase mb-0.5">
                        DỰ KIẾN: {item.startTime}
                      </p>
                      <h3 className="text-sm font-extrabold text-slate-800">
                        Slot {item.slotId} - {item.floor}
                      </h3>
                    </div>
                    <span className="bg-blue-50 text-secondary px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                      ĐÃ ĐẶT
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-4 text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <Car size={14} className="text-primary" />
                    <span className="font-mono font-bold uppercase">{item.licensePlate}</span>
                    <span className="text-slate-300">|</span>
                    <span>{item.vehicleType === 'oto' ? 'Xe Ô tô' : 'Xe máy'}</span>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleCancelClick(item.id)}
                      className="flex-1 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={12} />
                      <span>Hủy</span>
                    </button>
                    <button
                      onClick={() => onSelectReservationDetails(item)}
                      className="flex-[2] py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/95 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                    >
                      <MapPin size={12} />
                      <span>Xem Vé đỗ xe</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60 p-4">
                <Car size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">Không có đặt chỗ nào sắp diễn ra.</p>
                <button onClick={onNavigateHome} className="text-xs text-primary font-bold mt-2 hover:underline">
                  Đặt chỗ đỗ ngay!
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Completed */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {completedReservations.length > 0 ? (
              completedReservations.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                        {item.dateStr}
                      </p>
                      <h3 className="text-sm font-extrabold text-slate-800">
                        Vị trí {item.slotId} - {item.floor}
                      </h3>
                    </div>
                    <span className="text-slate-400 font-mono font-bold text-xs">
                      #{item.id.split('-')[1] || item.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 mb-4 bg-slate-50/50 px-2 rounded-xl">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Thời lượng</p>
                      <p className="text-xs font-extrabold text-slate-700">{item.endTime.split('(')[1]?.replace(')', '') || '3 giờ'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Tổng phí</p>
                      <p className="text-sm font-black text-primary">{item.totalFee.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                      <CheckSquare className="text-emerald-500" size={14} />
                      <span>Đã thanh toán</span>
                    </div>
                    <button
                      onClick={() => alert(`Hóa đơn cho vé ${item.id} được gửi đến email ${currentUser?.email}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-primary font-bold text-[10px] uppercase hover:bg-blue-50 hover:text-secondary transition-colors"
                    >
                      <Receipt size={12} />
                      <span>Xem hóa đơn</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60 p-4">
                <p className="text-xs font-semibold">Bạn chưa có lịch sử đỗ xe nào trước đây.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav for Client App */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 pb-safe border-t border-slate-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
        <button onClick={onNavigateHome} className="flex flex-col items-center justify-center text-slate-400 px-4 py-1" type="button">
          <Car size={18} />
          <span className="text-[10px] font-bold mt-0.5">Đặt Chỗ</span>
        </button>
        {/* Active view: History */}
        <button className="flex flex-col items-center justify-center text-primary font-bold bg-blue-50 rounded-full px-4 py-1 transition-all" type="button">
          <History size={18} />
          <span className="text-[10px] font-bold mt-0.5">Lịch sử</span>
        </button>
        <button onClick={onNavigateHome} className="flex flex-col items-center justify-center text-slate-400 px-4 py-1" type="button">
          <UserIcon size={18} />
          <span className="text-[10px] font-bold mt-0.5">Cá nhân</span>
        </button>
      </nav>
    </div>
  );
}

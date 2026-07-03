import { Reservation } from '../types';
import { Check, Map, Home, ShieldAlert, History, User, Car } from 'lucide-react';
import { TICKET_QR_IMAGE } from '../mockData';

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
    <div className="bg-background text-on-background font-sans antialiased min-h-screen flex flex-col pb-24">
      <main className="flex-grow flex flex-col items-center px-4 pt-6 pb-8 max-w-sm mx-auto w-full">
        
        {/* Animated Success Head */}
        <div className="animate-success flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center shadow-lg shadow-blue-200 mb-3">
            <Check size={36} className="stroke-[3]" />
          </div>
          <h1 className="text-lg font-bold text-primary text-center">Thanh toán thành công!</h1>
          <p className="text-xs text-slate-500 text-center mt-1 font-medium">Vui lòng xuất trình vé này tại cổng vào bãi xe.</p>
        </div>

        {/* Ticket Shape Card */}
        <div className="ticket-shape w-full shadow-xl overflow-hidden border border-slate-200 bg-white">
          <div className="p-5 pb-10 flex flex-col">
            <div className="w-full flex justify-between items-start mb-5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MÃ VÉ</span>
                <span className="font-mono text-sm font-extrabold text-primary">{reservation.id}</span>
              </div>
              <img
                className="w-14 h-14 border p-1 rounded-lg bg-white shadow-sm"
                src={TICKET_QR_IMAGE}
                alt="Ticket QR"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-y-5 gap-x-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">VỊ TRÍ ĐỖ</span>
                <span className="text-sm font-extrabold text-slate-800">Slot {reservation.slotId}</span>
                <span className="text-[10px] text-slate-400 font-semibold block">{reservation.floor}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">BIỂN SỐ XE</span>
                <span className="font-mono text-sm font-extrabold text-slate-800 uppercase">{reservation.licensePlate}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">HIỆU LỰC TỪ</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-4 h-4 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-700">{reservation.startTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dotted cutting tear-off line */}
          <div className="dash-line"></div>

          {/* Bottom Barcode section */}
          <div className="p-5 pt-8 flex flex-col items-center bg-slate-50 border-t border-slate-100">
            <div className="w-full bg-white p-3 border border-dashed border-slate-200 rounded-lg flex flex-col items-center shadow-sm">
              
              {/* CSS Barcode simulation */}
              <div className="w-full h-10 flex items-center justify-center opacity-80 gap-[2px]" style={{ width: '80%' }}>
                {Array.from({ length: 26 }).map((_, i) => {
                  const width = i % 3 === 0 ? 'w-1.5' : i % 5 === 0 ? 'w-0.5' : 'w-1';
                  return <div key={i} className={`h-full bg-slate-900 ${width}`} />;
                })}
              </div>

              <span className="mt-2 font-mono text-[10px] font-bold text-slate-500 tracking-wider">
                {reservation.id}
              </span>
            </div>
            
            <p className="text-[9px] font-semibold text-slate-400 mt-4 text-center tracking-wide uppercase flex items-center gap-1.5">
              <ShieldAlert size={10} className="text-secondary" />
              Hệ thống PBMS cam kết bảo mật thông tin khách hàng.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons below card */}
        <div className="w-full mt-6 space-y-3">
          <button
            onClick={() => alert('Đang mở sơ đồ chỉ đường GPS...')}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all text-xs uppercase"
          >
            <Map size={16} />
            <span>Xem bản đồ bãi xe</span>
          </button>
          
          <button
            onClick={onNavigateHome}
            className="w-full bg-white border border-slate-200 text-primary hover:bg-slate-50 font-bold py-3 rounded-xl active:scale-98 transition-all flex items-center justify-center gap-2 text-xs uppercase shadow-sm"
          >
            <Home size={16} />
            <span>Về trang chủ</span>
          </button>
        </div>
      </main>

      {/* Navigation bar at bottom */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 pb-safe border-t border-slate-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
        <button onClick={onNavigateHome} className="flex flex-col items-center justify-center text-slate-400 px-4 py-1" type="button">
          <Car size={18} />
          <span className="text-[10px] font-bold mt-0.5">Trang chủ</span>
        </button>
        <button onClick={onNavigateHome} className="flex flex-col items-center justify-center text-slate-400 px-4 py-1" type="button">
          <Car size={18} />
          <span className="text-[10px] font-bold mt-0.5">Đặt chỗ</span>
        </button>
        {/* Active view: History is selected in screenshot 3 */}
        <button onClick={onNavigateToHistory} className="flex flex-col items-center justify-center text-primary font-bold bg-blue-50 rounded-full px-4 py-1" type="button">
          <History size={18} />
          <span className="text-[10px] font-bold mt-0.5">Lịch sử</span>
        </button>
        <button onClick={onNavigateHome} className="flex flex-col items-center justify-center text-slate-400 px-4 py-1" type="button">
          <User size={18} />
          <span className="text-[10px] font-bold mt-0.5">Cá nhân</span>
        </button>
      </nav>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { ArrowLeft, Landmark, CheckCircle, Shield, QrCode, Smartphone, XCircle, Clock } from 'lucide-react';
import { VNPAY_QR_IMAGE } from '../mockData';

interface VnpayScreenProps {
  reservation: Reservation;
  onBack: () => void;
  onCancel: () => void;
  onPaymentSuccess: () => void;
}

export default function VnpayScreen({
  reservation,
  onBack,
  onCancel,
  onPaymentSuccess,
}: VnpayScreenProps) {
  // Countdown Timer (299 seconds = 4:59)
  const [timeLeft, setTimeLeft] = useState(299);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Simulate payment completion automatically after 8 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      triggerSuccess();
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  const triggerSuccess = () => {
    if (successTriggered) return;
    setSuccessTriggered(true);
    // Wait for the success toast animation to play before redirecting
    setTimeout(() => {
      onPaymentSuccess();
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-sans overflow-x-hidden relative flex flex-col pb-16">
      {/* Transactional Shell Header */}
      <header className="bg-primary text-white h-16 flex items-center px-4 fixed top-0 w-full z-50 shadow-md">
        <button className="mr-4 p-2 hover:bg-white/10 rounded-full active:scale-95 transition-all" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-sm sm:text-base">Thanh toán VNPAY</h1>
      </header>

      {/* Main Container */}
      <main className="pt-20 pb-24 px-4 flex-grow flex flex-col items-center max-w-md mx-auto w-full">
        
        {/* Merchant Identity Card */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">
            <span className="font-extrabold text-base">P</span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 mb-1">PBMS - Hệ Thống Gửi Xe</h2>
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <CheckCircle className="text-secondary w-3.5 h-3.5" />
            <span>Đơn vị chấp nhận thanh toán</span>
          </div>
          <div className="mt-5 pt-5 border-t border-dashed border-slate-200 w-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Số tiền thanh toán</p>
            <p className="font-mono text-2xl font-black text-primary">
              {reservation.totalFee.toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
        </div>

        {/* QR Code Interactive Section */}
        <div className="relative w-full bg-white rounded-2xl p-6 shadow-lg border border-primary/10 flex flex-col items-center">
          
          {/* VNPAY Branding */}
          <div className="flex items-center gap-1.5 mb-5 select-none">
            <div className="bg-rose-600 text-white font-black px-2 py-0.5 rounded italic text-xs tracking-tighter shadow-sm">VN</div>
            <div className="bg-blue-600 text-white font-black px-2 py-0.5 rounded italic text-xs tracking-tighter shadow-sm">PAY</div>
            <span className="text-xs font-black text-slate-400 ml-1">QR</span>
          </div>

          {/* QR Container with Scanner Animation */}
          <div className="relative p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="relative w-52 h-52">
              <img
                className="w-full h-full object-contain"
                src={VNPAY_QR_IMAGE}
                alt="VNPAY QR CODE"
                referrerPolicy="no-referrer"
              />
              {/* Scanner effect line */}
              <div className="qr-scanner-line absolute left-0 w-full h-0.5 bg-secondary shadow-[0_0_8px_rgba(0,101,145,0.8)]"></div>
            </div>
          </div>

          <div className="mt-4 text-center max-w-[240px]">
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Quét mã QR bằng ứng dụng ngân hàng hoặc ví <span className="font-extrabold text-primary">VNPAY</span> để thanh toán
            </p>
          </div>

          {/* Timer Display */}
          <div className="mt-6 flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full border border-rose-200/50">
            <Clock size={16} />
            <span className="font-mono text-xs font-black" id="timer">
              Giao dịch hết hạn trong {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Help Info List */}
        <div className="w-full mt-6 space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="bg-blue-50 p-2 rounded-lg text-primary">
              <Smartphone size={16} />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-700">Bước 1</p>
              <p className="text-[11px] text-slate-500 font-medium">Mở ứng dụng ngân hàng hoặc ví VNPAY trên điện thoại</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="bg-blue-50 p-2 rounded-lg text-primary">
              <QrCode size={16} />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-700">Bước 2</p>
              <p className="text-[11px] text-slate-500 font-medium">Chọn tính năng "Quét mã" và quét mã QR ở trên</p>
            </div>
          </div>
        </div>

        {/* Manual simulator button to bypass the 8s automatic redirect immediately if needed */}
        <button
          onClick={triggerSuccess}
          className="mt-6 text-[10px] font-bold text-slate-300 hover:text-slate-400 select-none uppercase tracking-widest hover:underline"
        >
          [ Mô phỏng đã quét thanh toán thành công ]
        </button>

        {/* Action Area */}
        <div className="w-full mt-6">
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-100"
          >
            <XCircle size={16} />
            <span>Hủy giao dịch</span>
          </button>
          <p className="text-center mt-3.5 text-[10px] font-bold text-slate-400 tracking-wider">
            Hỗ trợ: 1900 5555 77
          </p>
        </div>
      </main>

      {/* Success Toast (Renders when success is triggered) */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border-l-4 border-emerald-500 p-4 shadow-2xl rounded-r-xl transition-all duration-500 z-[100] ${
          successTriggered ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
        id="successToast"
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white rounded-full p-1 shadow-md shadow-emerald-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">Thanh toán thành công</p>
            <p className="text-xs text-slate-500 font-medium">Hệ thống đang chuyển hướng vé...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Reservation } from '../types';
import { ArrowLeft, CheckCircle, Clock, Landmark, QrCode, Shield, Smartphone, XCircle } from 'lucide-react';
import { VNPAY_QR_IMAGE } from '../mockData';
import ProgressSteps from './ui/ProgressSteps';

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
  const [timeLeft, setTimeLeft] = useState(299);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || successTriggered) return;
    const interval = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => window.clearInterval(interval);
  }, [timeLeft, successTriggered]);

  useEffect(() => {
    const timeout = window.setTimeout(() => triggerSuccess(), 8000);
    return () => window.clearTimeout(timeout);
  }, []);

  const triggerSuccess = () => {
    if (successTriggered) return;
    setSuccessTriggered(true);
    window.setTimeout(onPaymentSuccess, 1200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-12 text-on-background">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-md items-center px-4">
          <button className="mr-3 rounded-xl p-2 transition hover:bg-white/10" onClick={onBack} type="button">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold">Thanh toán VNPAY</h1>
            <p className="text-[11px] font-medium text-white/70">Giao dịch giữ chỗ {reservation.id}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 py-4">
        <ProgressSteps active={4} />
        <section className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <Landmark size={22} />
          </div>
          <h2 className="mt-3 text-sm font-black text-slate-800">PBMS Parking</h2>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase text-slate-500">
            <Shield size={13} className="text-emerald-600" />
            Đơn vị chấp nhận thanh toán
          </p>
          <div className="mt-5 border-t border-dashed border-slate-200 pt-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Số tiền</p>
            <p className="mt-1 text-3xl font-black text-primary">{reservation.totalFee.toLocaleString('vi-VN')} VNĐ</p>
          </div>
        </section>

        <section className="rounded-xl border border-primary/10 bg-white p-5 text-center shadow-sm">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            <span className="rounded bg-rose-600 px-2 py-0.5 text-xs font-black italic text-white">VN</span>
            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-black italic text-white">PAY</span>
            <span className="text-xs font-black text-slate-400">QR</span>
          </div>

          <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="relative h-56 w-56 overflow-hidden rounded-xl bg-white">
              <img className="h-full w-full object-contain p-2" src={VNPAY_QR_IMAGE} alt="Mã QR VNPAY" />
              <div className="qr-scanner-line absolute left-0 h-0.5 w-full bg-secondary shadow-[0_0_8px_rgba(0,101,145,0.8)]" />
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-xs text-xs font-semibold leading-5 text-slate-600">
            Mở ứng dụng ngân hàng hoặc ví VNPAY, chọn quét mã QR và xác nhận số tiền thanh toán.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-700">
            <Clock size={16} />
            <span className="font-mono text-xs font-black">Hết hạn sau {formatTime(timeLeft)}</span>
          </div>
        </section>

        <section className="grid gap-3">
          <GuideStep icon={<Smartphone size={16} />} title="Bước 1" text="Mở ứng dụng ngân hàng hoặc ví điện tử có hỗ trợ VNPAY." />
          <GuideStep icon={<QrCode size={16} />} title="Bước 2" text="Quét mã, kiểm tra thông tin và xác nhận thanh toán." />
        </section>

        <button
          onClick={triggerSuccess}
          className="w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-xs font-black uppercase text-emerald-700 transition hover:bg-emerald-100"
          type="button"
        >
          Mô phỏng thanh toán thành công
        </button>

        <button
          onClick={onCancel}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-3 text-sm font-extrabold text-rose-600 shadow-sm transition hover:bg-rose-50"
          type="button"
        >
          <XCircle size={17} />
          Hủy giao dịch
        </button>
      </main>

      <div
        className={`fixed bottom-6 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-xl border border-emerald-200 bg-white p-4 shadow-2xl transition-all ${
          successTriggered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-500 p-1.5 text-white">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">Thanh toán thành công</p>
            <p className="text-xs font-medium text-slate-500">Đang tạo vé điện tử cho bạn...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideStep({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">{icon}</div>
      <div>
        <p className="text-xs font-black text-slate-800">{title}</p>
        <p className="mt-0.5 text-[11px] font-medium leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

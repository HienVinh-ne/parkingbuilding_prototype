import { Check } from 'lucide-react';

const STEPS = ['Chọn chỗ', 'Biển số', 'Xác nhận', 'Thanh toán', 'Hoàn tất'];

export default function ProgressSteps({ active, className = '' }: { active: number; className?: string }) {
  return (
    <nav aria-label="Tiến trình đặt chỗ" className={`ui-card px-3 py-4 sm:px-4 ${className}`}>
      <ol className="grid grid-cols-5">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const complete = stepNumber < active;
          const current = stepNumber === active;

          return (
            <li
              key={step}
              aria-current={current ? 'step' : undefined}
              className="relative flex min-w-0 flex-col items-center text-center"
            >
              {index > 0 && (
                <span className={`absolute right-1/2 top-3.5 h-px w-full ${stepNumber <= active ? 'bg-secondary/50' : 'bg-slate-200'}`} />
              )}
              <span
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-extrabold transition-all duration-300 ${
                  complete
                    ? 'border-secondary bg-secondary text-white'
                    : current
                      ? 'border-primary bg-primary text-white ring-4 ring-primary/10'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {complete ? <Check size={13} strokeWidth={3} /> : stepNumber}
              </span>
              <span className={`mt-2 truncate text-[9px] font-bold sm:text-[10px] ${current ? 'text-primary' : complete ? 'text-slate-600' : 'text-slate-400'}`}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

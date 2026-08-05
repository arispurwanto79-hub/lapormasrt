import type { ReportStatus, ReportPriority } from '@/lib/supabase';
import { Clock, Loader2, CheckCircle2, AlertCircle, Flame, ArrowUp, Minus, AlertTriangle } from 'lucide-react';

export function StatusBadge({ status, size = 'md' }: { status: ReportStatus; size?: 'sm' | 'md' }) {
  const config = {
    menunggu: {
      label: 'Menunggu Verifikasi',
      cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20',
      icon: Clock,
      dot: 'bg-amber-500',
    },
    diproses: {
      label: 'Diproses',
      cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20',
      icon: Loader2,
      dot: 'bg-blue-500',
    },
    selesai: {
      label: 'Selesai',
      cls: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20',
      icon: CheckCircle2,
      dot: 'bg-primary-500',
    },
  }[status];

  const Icon = config.icon;
  const sz = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`badge ${config.cls} ${sz}`}>
      <Icon className={`w-3 h-3 ${status === 'diproses' ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ReportPriority }) {
  const config = {
    rendah: { label: 'Rendah', cls: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300', icon: Minus },
    sedang: { label: 'Sedang', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300', icon: ArrowUp },
    tinggi: { label: 'Tinggi', cls: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300', icon: AlertTriangle },
    urgent: { label: 'Urgent', cls: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300', icon: Flame },
  }[priority];
  const Icon = config.icon;
  return (
    <span className={`badge ${config.cls}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

export function StatusProgress({ status }: { status: ReportStatus }) {
  const steps = [
    { key: 'menunggu', label: 'Menunggu', color: 'bg-amber-400' },
    { key: 'diproses', label: 'Diproses', color: 'bg-blue-500' },
    { key: 'selesai', label: 'Selesai', color: 'bg-primary-500' },
  ];
  const activeIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              i <= activeIdx
                ? `${step.color} text-white shadow-lg`
                : 'bg-slate-200 dark:bg-white/10 text-slate-400'
            }`}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < activeIdx ? step.color : 'bg-slate-200 dark:bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        {steps.map((s) => (
          <span key={s.key} className="flex-1 first:text-left last:text-right text-center">{s.label}</span>
        ))}
      </div>
    </div>
  );
}

export function ProgressBar({ status }: { status: ReportStatus }) {
  const config = {
    menunggu: { pct: 33, color: 'bg-amber-400', glow: 'shadow-amber-400/50' },
    diproses: { pct: 66, color: 'bg-blue-500', glow: 'shadow-blue-500/50' },
    selesai: { pct: 100, color: 'bg-primary-500', glow: 'shadow-primary-500/50' },
  }[status];

  return (
    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
      <div
        className={`h-full ${config.color} rounded-full shadow-lg ${config.glow} transition-all duration-700 ease-out`}
        style={{ width: `${config.pct}%` }}
      />
    </div>
  );
}

export { AlertCircle };

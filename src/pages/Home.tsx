import { useEffect, useState } from 'react';
import {
  MapPin, ArrowRight, FileText, ShieldCheck, Wrench, CheckCircle2,
  ClipboardList, Clock, CheckCircle, Users, Construction, Droplets,
  Trash2, Shield, Lightbulb, MessageSquare, Star, Sparkles, TrendingUp,
} from 'lucide-react';
import type { Report, ReportStatus } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { StatusBadge, ProgressBar } from '@/components/Status';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const iconMap: Record<string, typeof Construction> = {
  Construction, Droplets, Trash2, Shield, Lightbulb, MessageSquare,
};

export default function Home({ onNavigate }: HomeProps) {
  const [stats, setStats] = useState({ total: 0, diproses: 0, selesai: 0, users: 0 });
  const [sampleReports, setSampleReports] = useState<Report[]>([]);

  useEffect(() => {
    (async () => {
      const { count: total } = await supabase.from('reports').select('*', { count: 'exact', head: true });
      const { count: diproses } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'diproses');
      const { count: selesai } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'selesai');
      const { data } = await supabase.from('reports').select('*, category:categories(*)').order('created_at', { ascending: false }).limit(3);
      setStats({ total: total ?? 0, diproses: diproses ?? 0, selesai: selesai ?? 0, users: 128 });
      if (data) setSampleReports(data as unknown as Report[]);
    })();
  }, []);

  const heroTickets: { status: ReportStatus; ticket: string }[] = [
    { status: 'menunggu', ticket: 'LPR-2026-001' },
    { status: 'diproses', ticket: 'LPR-2026-002' },
    { status: 'selesai', ticket: 'LPR-2026-003' },
  ];

  const statusLabel: Record<ReportStatus, string> = {
    menunggu: 'Menunggu Verifikasi',
    diproses: 'Diproses',
    selesai: 'Selesai',
  };

  const alurSteps = [
    { icon: FileText, title: 'Isi Form Pengaduan', desc: 'Warga mengisi formulir pengaduan secara daring dengan data lengkap.', color: 'from-primary-500 to-primary-600' },
    { icon: ShieldCheck, title: 'Laporan Diverifikasi', desc: 'Pengurus RT memverifikasi keabsahan laporan yang masuk.', color: 'from-accent-400 to-primary-500' },
    { icon: Wrench, title: 'Diproses Pengurus RT', desc: 'Tindak lanjut dilakukan oleh pengurus RT sesuai kategori.', color: 'from-blue-400 to-primary-500' },
    { icon: CheckCircle2, title: 'Pengaduan Selesai', desc: 'Laporan ditindaklanjuti dan status diperbarui menjadi selesai.', color: 'from-primary-600 to-primary-800' },
  ];

  const statCards = [
    { icon: ClipboardList, label: 'Total Pengaduan', value: stats.total, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { icon: Clock, label: 'Sedang Diproses', value: stats.diproses, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { icon: CheckCircle, label: 'Selesai', value: stats.selesai, color: 'text-accent-600', bg: 'bg-accent-50 dark:bg-accent-500/10' },
    { icon: Users, label: 'Pengguna Terdaftar', value: stats.users, color: 'text-primary-700', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  ];

  const features = [
    { icon: FileText, title: 'Pengaduan Daring', desc: 'Ajukan laporan kapan saja, 24 jam.' },
    { icon: ShieldCheck, title: 'Verifikasi Aman', desc: 'Setiap laporan diverifikasi pengurus RT.' },
    { icon: TrendingUp, title: 'Pantau Status', desc: 'Pantau proses tindak lanjut real-time.' },
    { icon: Star, title: 'Transparan', desc: 'Riwayat laporan terbuka untuk warga.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background ornaments */}
        <div className="absolute inset-0 bg-grid-green opacity-60 dark:opacity-20" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-300/30 dark:bg-primary-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-accent-300/20 dark:bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-up">
            <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Layanan Resmi Warga
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance">
              <span className="gradient-text">LAPOR MAS RT</span>
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200">
              Sistem Pengaduan, Aspirasi, dan Saran Warga
            </p>

            <p className="mt-5 text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl text-balance">
              Lapor Mas RT merupakan layanan digital yang memudahkan warga Dusun Gabusan RT 22 dalam menyampaikan pengaduan, usulan, kritik, maupun aspirasi kepada pengurus RT secara cepat, aman, transparan, dan dapat dipantau proses tindak lanjutnya.
            </p>

            {/* Location */}
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="font-medium">Dusun Gabusan RT 22, Desa Tanon, Kabupaten Sragen</span>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('buat')} className="btn-primary group">
                Buat Laporan Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('alur')} className="btn-secondary">
                Lihat Alur Pengaduan
              </button>
            </div>
          </div>

          {/* Right - Status Card */}
          <div className="animate-fade-up animate-delay-200">
            <div className="glass-card rounded-30 p-6 sm:p-8 relative">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-accent-400/30 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">Pengaduan Anda</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Status tindak lanjut terkini</p>
                </div>
                <div className="w-12 h-12 rounded-20 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {heroTickets.map((t, i) => (
                  <div
                    key={t.ticket}
                    className="p-4 rounded-20 bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg animate-fade-up"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{t.ticket}</span>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">{statusLabel[t.status]}</div>
                    <ProgressBar status={t.status} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('cek')}
                className="mt-5 w-full py-3 rounded-20 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                Cek Status Tiket Lainnya
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ALUR PENGADUAN */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-fade-up">
            <span className="badge bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-300 mb-3">
              Proses Jelas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Alur Pengaduan Warga
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Empat langkah sederhana dari pengaduan hingga penyelesaian.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alurSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative glass-card rounded-30 p-6 hover:-translate-y-2 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute top-4 right-4 text-6xl font-extrabold text-primary-100 dark:text-white/5 select-none">
                    {i + 1}
                  </div>
                  <div className={`relative w-14 h-14 rounded-20 bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-white mb-2 relative">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative">{step.desc}</p>
                  {i < alurSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 z-10">
                      <ArrowRight className="w-6 h-6 text-primary-300 dark:text-primary-500/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-30 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-8 sm:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Statistik Layanan</h2>
                <p className="mt-3 text-primary-200">Data pengaduan Dusun Gabusan RT 22</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="glass-card rounded-30 p-6 text-center hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className={`w-14 h-14 rounded-20 ${s.bg} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-7 h-7 ${s.color}`} />
                      </div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{s.value}</div>
                      <div className="text-sm text-primary-200 mt-1">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-fade-up">
            <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 mb-3">
              Keunggulan Layanan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Fitur Unggulan Lapor Mas RT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card rounded-30 p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-20 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="glass-card rounded-30 p-8 sm:p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
                Punya keluhan atau aspirasi?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Sampaikan sekarang juga. Suara Anda kami dengar dan tindak lanjuti.
              </p>
              <button onClick={() => onNavigate('buat')} className="btn-primary group">
                Buat Pengaduan Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent reports preview */}
          {sampleReports.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Laporan Terbaru</h3>
                <button onClick={() => onNavigate('riwayat')} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleReports.map((r, i) => {
                  const Icon = r.category ? (iconMap[r.category.icon] ?? FileText) : FileText;
                  return (
                    <div
                      key={r.id}
                      className="glass-card rounded-30 p-5 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">{r.ticket_number}</span>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-20 bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-white truncate">{r.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{r.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

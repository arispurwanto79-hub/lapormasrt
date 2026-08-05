import { useEffect, useState, useMemo } from 'react';
import {
  ClipboardList, Loader2, Search, FileText, ArrowRight,
  Construction, Droplets, Trash2, Shield, Lightbulb, MessageSquare,
} from 'lucide-react';
import { supabase, type Report, type ReportStatus } from '@/lib/supabase';
import { StatusBadge, PriorityBadge } from '@/components/Status';

interface RiwayatProps {
  onNavigate: (page: string) => void;
}

const iconMap: Record<string, typeof Construction> = {
  Construction, Droplets, Trash2, Shield, Lightbulb, MessageSquare,
};

const filters: { key: ReportStatus | 'semua'; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'selesai', label: 'Selesai' },
];

export default function Riwayat({ onNavigate }: RiwayatProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReportStatus | 'semua'>('semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('reports')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });
      if (data) setReports(data as unknown as Report[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (filter !== 'semua' && r.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.ticket_number.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reports, filter, search]);

  const counts = useMemo(() => ({
    semua: reports.length,
    menunggu: reports.filter((r) => r.status === 'menunggu').length,
    diproses: reports.filter((r) => r.status === 'diproses').length,
    selesai: reports.filter((r) => r.status === 'selesai').length,
  }), [reports]);

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 mb-4">
            <ClipboardList className="w-3.5 h-3.5" />
            Transparansi Layanan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text mb-3">
            Riwayat Laporan Warga
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Daftar pengaduan warga Dusun Gabusan RT 22. Transparan untuk semua warga.
          </p>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 animate-fade-up animate-delay-100">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2.5 rounded-20 text-sm font-semibold transition-all flex items-center gap-2 ${
                  filter === f.key
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-white/10'
                }`}
              >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filter === f.key ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
                }`}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative lg:ml-auto lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input-field pl-10"
              placeholder="Cari tiket, judul, nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-30 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">Tidak ada laporan ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, i) => {
              const Icon = r.category ? (iconMap[r.category.icon] ?? FileText) : FileText;
              return (
                <div
                  key={r.id}
                  className="glass-card rounded-30 p-5 hover:-translate-y-1 transition-all duration-300 animate-fade-up cursor-pointer group"
                  style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
                  onClick={() => onNavigate('cek')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">{r.ticket_number}</span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-20 bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white line-clamp-1">{r.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{r.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={r.priority} />
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Detail <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

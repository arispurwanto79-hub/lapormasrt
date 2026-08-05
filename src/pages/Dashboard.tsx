import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, ClipboardList, QrCode, Users, Tag, BarChart3,
  Database, RotateCcw, History, Settings, KeyRound, LogOut, Menu, X,
  Search, Eye, Edit3, Trash2, Download, Upload, CheckCircle2, Clock,
  TrendingUp, Filter, Plus, Save, AlertCircle, ShieldCheck, ScanLine, Loader2,
} from 'lucide-react';
import { supabase, type Report, type Category, type ActivityLog, type ReportStatus } from '@/lib/supabase';
import { StatusBadge, StatusProgress, PriorityBadge } from '@/components/Status';
import { generateQrDataUrl } from '@/lib/qr';

interface DashboardProps {
  onLogout: () => void;
  userEmail: string | null;
}

type Tab =
  | 'dashboard' | 'pengaduan' | 'scan' | 'warga' | 'kategori'
  | 'statistik' | 'backup' | 'restore' | 'riwayat-aktivitas'
  | 'pengaturan' | 'reset-password';

const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pengaduan', label: 'Pengaduan', icon: ClipboardList },
  { id: 'scan', label: 'Scan QR', icon: ScanLine },
  { id: 'warga', label: 'Data Warga', icon: Users },
  { id: 'kategori', label: 'Kategori', icon: Tag },
  { id: 'statistik', label: 'Statistik', icon: BarChart3 },
  { id: 'backup', label: 'Backup Database', icon: Database },
  { id: 'restore', label: 'Restore Database', icon: RotateCcw },
  { id: 'riwayat-aktivitas', label: 'Riwayat Aktivitas', icon: History },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  { id: 'reset-password', label: 'Reset Password', icon: KeyRound },
];

export default function Dashboard({ onLogout, userEmail }: DashboardProps) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const loadData = async () => {
    const [{ data: rData }, { data: cData }, { data: aData }] = await Promise.all([
      supabase.from('reports').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    if (rData) setReports(rData as unknown as Report[]);
    if (cData) setCategories(cData as Category[]);
    if (aData) setActivities(aData as ActivityLog[]);
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => ({
    total: reports.length,
    menunggu: reports.filter((r) => r.status === 'menunggu').length,
    diproses: reports.filter((r) => r.status === 'diproses').length,
    selesai: reports.filter((r) => r.status === 'selesai').length,
  }), [reports]);

  const logActivity = async (action: string, detail?: string) => {
    await supabase.from('activity_log').insert({ action, detail, admin_email: userEmail });
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-[#0a1f12] border-r border-slate-200 dark:border-white/10 z-40 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-20 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-primary-800 dark:text-white">LAPOR MAS RT</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-20 text-sm font-semibold transition-all ${
                  tab === item.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-20 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass border-b border-slate-200/60 dark:border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-slate-800 dark:text-white capitalize">
              {navItems.find((n) => n.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{userEmail ?? 'Admin'}</div>
              <div className="text-[10px] text-slate-400">Administrator RT 22</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
              {(userEmail?.[0] ?? 'A').toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 max-w-7xl">
          {tab === 'dashboard' && <DashboardView stats={stats} reports={reports.slice(0, 5)} />}
          {tab === 'pengaduan' && <PengaduanView reports={reports} onUpdate={loadData} logActivity={logActivity} />}
          {tab === 'scan' && <ScanView reports={reports} />}
          {tab === 'warga' && <WargaView reports={reports} />}
          {tab === 'kategori' && <KategoriView categories={categories} onUpdate={loadData} logActivity={logActivity} />}
          {tab === 'statistik' && <StatistikView reports={reports} />}
          {tab === 'backup' && <BackupView logActivity={logActivity} />}
          {tab === 'restore' && <RestoreView logActivity={logActivity} />}
          {tab === 'riwayat-aktivitas' && <ActivityView activities={activities} />}
          {tab === 'pengaturan' && <PengaturanView userEmail={userEmail} />}
          {tab === 'reset-password' && <ResetPasswordView />}
        </div>
      </main>
    </div>
  );
}

/* ============ DASHBOARD ============ */
function DashboardView({ stats, reports }: { stats: { total: number; menunggu: number; diproses: number; selesai: number }; reports: Report[] }) {
  const cards = [
    { label: 'Total Pengaduan', value: stats.total, icon: ClipboardList, color: 'from-primary-500 to-primary-700' },
    { label: 'Menunggu', value: stats.menunggu, icon: Clock, color: 'from-amber-400 to-amber-600' },
    { label: 'Diproses', value: stats.diproses, icon: TrendingUp, color: 'from-blue-400 to-blue-600' },
    { label: 'Selesai', value: stats.selesai, icon: CheckCircle2, color: 'from-accent-400 to-primary-600' },
  ];

  // Monthly chart data (last 6 months)
  const monthly = useMemo(() => {
    const now = new Date();
    const months: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('id-ID', { month: 'short' });
      const count = reports.filter((r) => {
        const rd = new Date(r.created_at);
        return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
      }).length;
      months.push({ label, count });
    }
    return months;
  }, [reports]);

  const maxCount = Math.max(...monthly.map((m) => m.count), 1);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="glass-card rounded-30 p-5 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-20 bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-white tabular-nums">{c.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* Chart + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly chart */}
        <div className="lg:col-span-2 glass-card rounded-30 p-6">
          <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1">Grafik Bulanan</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Jumlah pengaduan 6 bulan terakhir</p>
          <div className="flex items-end justify-between gap-3 h-48">
            {monthly.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{m.count}</div>
                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-t-20 overflow-hidden flex items-end" style={{ height: '140px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-20 transition-all duration-700"
                    style={{ height: `${(m.count / maxCount) * 100}%`, minHeight: m.count > 0 ? '8px' : '0' }}
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <div className="glass-card rounded-30 p-6">
          <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">Laporan Terbaru</h3>
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">Belum ada laporan.</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-20 bg-slate-50 dark:bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">{r.ticket_number}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{r.title}</p>
                  </div>
                  <StatusBadge status={r.status} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ PENGADUAN ============ */
function PengaduanView({ reports, onUpdate, logActivity }: { reports: Report[]; onUpdate: () => void; logActivity: (a: string, d?: string) => void }) {
  const [filter, setFilter] = useState<ReportStatus | 'semua'>('semua');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Report | null>(null);

  const filtered = reports.filter((r) => {
    if (filter !== 'semua' && r.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.ticket_number.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = async (report: Report, status: ReportStatus, note?: string, officer?: string) => {
    await supabase.from('reports').update({
      status,
      officer_note: note ?? report.officer_note,
      officer_name: officer ?? report.officer_name,
    }).eq('id', report.id);
    logActivity('Update Status', `${report.ticket_number} -> ${status}`);
    setEditing(null);
    onUpdate();
  };

  const deleteReport = async (report: Report) => {
    if (!confirm(`Hapus laporan ${report.ticket_number}?`)) return;
    await supabase.from('reports').delete().eq('id', report.id);
    logActivity('Hapus Laporan', report.ticket_number);
    onUpdate();
  };

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-2">
          {(['semua', 'menunggu', 'diproses', 'selesai'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-20 text-xs font-semibold capitalize transition-all ${
                filter === f ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'glass-card text-slate-600 dark:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input-field pl-10 py-2.5" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-left text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Tiket</th>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Pelapor</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold hidden lg:table-cell">Prioritas</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">Tidak ada data.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 dark:text-primary-400">{r.ticket_number}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white max-w-xs truncate">{r.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 hidden md:table-cell">{r.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><PriorityBadge priority={r.priority} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(r)} className="w-8 h-8 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteReport(r)} className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 flex items-center justify-center transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <EditModal report={editing} onClose={() => setEditing(null)} onSave={updateStatus} />
      )}
    </div>
  );
}

function EditModal({ report, onClose, onSave }: { report: Report; onClose: () => void; onSave: (r: Report, s: ReportStatus, n?: string, o?: string) => void }) {
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [note, setNote] = useState(report.officer_note ?? '');
  const [officer, setOfficer] = useState(report.officer_name ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-card rounded-30 p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Laporan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Tiket</p>
            <p className="font-mono font-bold text-primary-600 dark:text-primary-400">{report.ticket_number}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Judul</p>
            <p className="font-semibold text-slate-800 dark:text-white">{report.title}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['menunggu', 'diproses', 'selesai'] as ReportStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-20 text-xs font-semibold capitalize transition-all ${
                    status === s ? 'ring-2 ring-primary-500' : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                  }`}
                >
                  <StatusBadge status={s} size="sm" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Catatan Petugas</label>
            <textarea className="input-field min-h-[80px]" placeholder="Catatan tindak lanjut..." value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Nama Petugas</label>
            <input className="input-field" placeholder="Pak RT / Petugas..." value={officer} onChange={(e) => setOfficer(e.target.value)} />
          </div>

          <button onClick={() => onSave(report, status, note, officer)} className="btn-primary w-full">
            <Save className="w-4 h-4" /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ SCAN QR ============ */
function ScanView({ reports }: { reports: Report[] }) {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<Report | null>(null);

  const search = () => {
    const r = reports.find((x) => x.ticket_number.toLowerCase() === query.trim().toLowerCase());
    setFound(r ?? null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass-card rounded-30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-20 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Scan / Cari QR Tiket</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Masukkan nomor tiket untuk melihat detail</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            className="input-field font-mono"
            placeholder="LPR-2026-0001"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button onClick={search} className="btn-primary shrink-0">Cari</button>
        </div>
      </div>

      {found && (
        <div className="glass-card rounded-30 p-6 animate-scale-in">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono font-extrabold text-primary-600 dark:text-primary-400">{found.ticket_number}</span>
                <StatusBadge status={found.status} size="sm" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{found.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{found.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400">Nama:</span> <span className="font-medium text-slate-800 dark:text-white">{found.name}</span></div>
                <div><span className="text-slate-400">HP:</span> <span className="font-medium text-slate-800 dark:text-white">{found.phone}</span></div>
                <div><span className="text-slate-400">Alamat:</span> <span className="font-medium text-slate-800 dark:text-white">{found.address}</span></div>
                <div><span className="text-slate-400">Prioritas:</span> <PriorityBadge priority={found.priority} /></div>
              </div>
              <div className="mt-4 p-4 rounded-20 bg-slate-50 dark:bg-white/5">
                <StatusProgress status={found.status} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-20 bg-white border border-slate-200">
                <img src={generateQrDataUrl(found.ticket_number, 160)} alt="QR" className="w-32 h-32" />
              </div>
              <a href={generateQrDataUrl(found.ticket_number, 400)} download={`${found.ticket_number}-qr.png`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                <Download className="w-3 h-3" /> Unduh QR
              </a>
            </div>
          </div>
        </div>
      )}

      {query && !found && (
        <div className="glass-card rounded-30 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 dark:text-white/10 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Tiket tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}

/* ============ WARGA ============ */
function WargaView({ reports }: { reports: Report[] }) {
  const warga = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; address: string; count: number; lastReport: string }>();
    reports.forEach((r) => {
      const key = r.phone;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
        if (new Date(r.created_at) > new Date(existing.lastReport)) existing.lastReport = r.created_at;
      } else {
        map.set(key, { name: r.name, phone: r.phone, address: r.address, count: 1, lastReport: r.created_at });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [reports]);

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="glass-card rounded-30 p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white">Data Warga Pelapor</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{warga.length} warga terdaftar</p>
        </div>
        <Users className="w-8 h-8 text-primary-500" />
      </div>

      <div className="glass-card rounded-30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-left text-xs text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">HP</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Alamat</th>
                <th className="px-4 py-3 font-semibold">Jumlah Laporan</th>
                <th className="px-4 py-3 font-semibold hidden lg:table-cell">Laporan Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {warga.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">Belum ada data warga.</td></tr>
              ) : (
                warga.map((w) => (
                  <tr key={w.phone} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{w.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{w.phone}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 hidden md:table-cell">{w.address}</td>
                    <td className="px-4 py-3"><span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300">{w.count}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">{new Date(w.lastReport).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============ KATEGORI ============ */
function KategoriView({ categories, onUpdate, logActivity }: { categories: Category[]; onUpdate: () => void; logActivity: (a: string, d?: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', icon: 'MessageSquare' });

  const add = async () => {
    if (!newCat.name || !newCat.slug) return;
    await supabase.from('categories').insert({
      name: newCat.name,
      slug: newCat.slug,
      description: newCat.description || null,
      icon: newCat.icon,
    });
    logActivity('Tambah Kategori', newCat.name);
    setNewCat({ name: '', slug: '', description: '', icon: 'MessageSquare' });
    setAdding(false);
    onUpdate();
  };

  const remove = async (c: Category) => {
    if (!confirm(`Hapus kategori "${c.name}"?`)) return;
    await supabase.from('categories').delete().eq('id', c.id);
    logActivity('Hapus Kategori', c.name);
    onUpdate();
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{categories.length} kategori</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      {adding && (
        <div className="glass-card rounded-30 p-6 animate-scale-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Nama kategori" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
            <input className="input-field" placeholder="slug (contoh: jalan-infrastruktur)" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} />
            <input className="input-field sm:col-span-2" placeholder="Deskripsi" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={add} className="btn-primary"><Save className="w-4 h-4" /> Simpan</button>
            <button onClick={() => setAdding(false)} className="btn-secondary">Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="glass-card rounded-30 p-5 group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-20 bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <button onClick={() => remove(c)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 flex items-center justify-center transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-3">{c.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.description ?? '-'}</p>
            <p className="text-[10px] font-mono text-slate-400 mt-2">/{c.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ STATISTIK ============ */
function StatistikView({ reports }: { reports: Report[] }) {
  const byStatus = {
    menunggu: reports.filter((r) => r.status === 'menunggu').length,
    diproses: reports.filter((r) => r.status === 'diproses').length,
    selesai: reports.filter((r) => r.status === 'selesai').length,
  };
  const byPriority = {
    rendah: reports.filter((r) => r.priority === 'rendah').length,
    sedang: reports.filter((r) => r.priority === 'sedang').length,
    tinggi: reports.filter((r) => r.priority === 'tinggi').length,
    urgent: reports.filter((r) => r.priority === 'urgent').length,
  };

  const renderBar = (label: string, value: number, total: number, color: string) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <span className="text-sm font-bold text-slate-800 dark:text-white">{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-30 p-6">
          <h3 className="font-bold text-base text-slate-800 dark:text-white mb-5">Berdasarkan Status</h3>
          <div className="space-y-4">
            {renderBar('Menunggu', byStatus.menunggu, reports.length, 'bg-amber-400')}
            {renderBar('Diproses', byStatus.diproses, reports.length, 'bg-blue-500')}
            {renderBar('Selesai', byStatus.selesai, reports.length, 'bg-primary-500')}
          </div>
        </div>
        <div className="glass-card rounded-30 p-6">
          <h3 className="font-bold text-base text-slate-800 dark:text-white mb-5">Berdasarkan Prioritas</h3>
          <div className="space-y-4">
            {renderBar('Rendah', byPriority.rendah, reports.length, 'bg-slate-400')}
            {renderBar('Sedang', byPriority.sedang, reports.length, 'bg-blue-500')}
            {renderBar('Tinggi', byPriority.tinggi, reports.length, 'bg-orange-500')}
            {renderBar('Urgent', byPriority.urgent, reports.length, 'bg-red-500')}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-30 p-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">Ringkasan</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-20 bg-slate-50 dark:bg-white/5 text-center">
            <div className="text-2xl font-extrabold text-slate-800 dark:text-white">{reports.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="p-4 rounded-20 bg-amber-50 dark:bg-amber-500/10 text-center">
            <div className="text-2xl font-extrabold text-amber-600">{byStatus.menunggu}</div>
            <div className="text-xs text-slate-500">Menunggu</div>
          </div>
          <div className="p-4 rounded-20 bg-blue-50 dark:bg-blue-500/10 text-center">
            <div className="text-2xl font-extrabold text-blue-600">{byStatus.diproses}</div>
            <div className="text-xs text-slate-500">Diproses</div>
          </div>
          <div className="p-4 rounded-20 bg-primary-50 dark:bg-primary-500/10 text-center">
            <div className="text-2xl font-extrabold text-primary-600">{byStatus.selesai}</div>
            <div className="text-xs text-slate-500">Selesai</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ BACKUP / RESTORE ============ */
function BackupView({ logActivity }: { logActivity: (a: string, d?: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const backup = async () => {
    setLoading(true);
    const { data } = await supabase.from('reports').select('*');
    const { data: cats } = await supabase.from('categories').select('*');
    const blob = new Blob([JSON.stringify({ reports: data, categories: cats, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lapor-mas-rt-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('Backup Database', new Date().toISOString());
    setLoading(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div className="animate-fade-up">
      <div className="glass-card rounded-30 p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-30 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Database className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Backup Database</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Unduh salinan lengkap data pengaduan dan kategori dalam format JSON.
        </p>
        <button onClick={backup} disabled={loading} className="btn-primary mx-auto">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : <><Download className="w-4 h-4" /> Unduh Backup</>}
        </button>
        {done && <p className="mt-4 text-sm text-primary-600 dark:text-primary-400 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Backup berhasil diunduh!</p>}
      </div>
    </div>
  );
}

function RestoreView({ logActivity }: { logActivity: (a: string, d?: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const restore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMsg(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.categories?.length) {
        await supabase.from('categories').upsert(data.categories, { onConflict: 'slug' });
      }
      if (data.reports?.length) {
        await supabase.from('reports').upsert(data.reports, { onConflict: 'ticket_number' });
      }
      logActivity('Restore Database', `${data.reports?.length ?? 0} laporan, ${data.categories?.length ?? 0} kategori`);
      setMsg('Restore berhasil! Muat ulang halaman untuk melihat data.');
    } catch {
      setMsg('File backup tidak valid.');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-up">
      <div className="glass-card rounded-30 p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-30 bg-gradient-to-br from-accent-400 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <RotateCcw className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Restore Database</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Pulihkan data dari file backup JSON. Data dengan tiket/kategori yang sama akan diperbarui.
        </p>
        <label className="btn-primary mx-auto cursor-pointer">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : <><Upload className="w-4 h-4" /> Pilih File Backup</>}
          <input type="file" accept="application/json" className="hidden" onChange={restore} />
        </label>
        {msg && <p className="mt-4 text-sm text-primary-600 dark:text-primary-400">{msg}</p>}
      </div>
    </div>
  );
}

/* ============ ACTIVITY ============ */
function ActivityView({ activities }: { activities: ActivityLog[] }) {
  return (
    <div className="animate-fade-up">
      <div className="glass-card rounded-30 p-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">Riwayat Aktivitas Admin</h3>
        {activities.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Belum ada aktivitas.</p>
        ) : (
          <div className="space-y-2">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                  <History className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{a.action}</p>
                  {a.detail && <p className="text-xs text-slate-500 dark:text-slate-400">{a.detail}</p>}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {a.admin_email ?? 'admin'} · {new Date(a.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ PENGATURAN ============ */
function PengaturanView({ userEmail }: { userEmail: string | null }) {
  return (
    <div className="animate-fade-up space-y-4">
      <div className="glass-card rounded-30 p-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">Informasi Akun</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 rounded-20 bg-slate-50 dark:bg-white/5">
            <span className="text-slate-500">Email</span>
            <span className="font-semibold text-slate-800 dark:text-white">{userEmail ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-20 bg-slate-50 dark:bg-white/5">
            <span className="text-slate-500">Peran</span>
            <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300">Administrator</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-20 bg-slate-50 dark:bg-white/5">
            <span className="text-slate-500">Wilayah</span>
            <span className="font-semibold text-slate-800 dark:text-white">RT 22 Dusun Gabusan</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-30 p-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-2">Informasi Aplikasi</h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <p><span className="text-slate-400">Nama:</span> LAPOR MAS RT</p>
          <p><span className="text-slate-400">Versi:</span> 1.0.0</p>
          <p><span className="text-slate-400">Lokasi:</span> Dusun Gabusan RT 22, Desa Tanon, Kabupaten Sragen</p>
        </div>
      </div>
    </div>
  );
}

/* ============ RESET PASSWORD ============ */
function ResetPasswordView() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const reset = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#login`,
    });
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="animate-fade-up">
      <div className="glass-card rounded-30 p-8 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-30 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2 text-center">Reset Password</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
          Kirim email reset password ke akun admin.
        </p>
        {done ? (
          <p className="text-center text-sm text-primary-600 dark:text-primary-400 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Email reset telah dikirim!
          </p>
        ) : (
          <div className="flex gap-2">
            <input className="input-field" placeholder="admin@gaban22.id" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={reset} disabled={loading} className="btn-primary shrink-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

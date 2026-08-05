import { useState } from 'react';
import {
  Search, Ticket, Loader2, AlertCircle, MapPin, User, Phone,
  Tag, Calendar, MessageSquare, Camera, Shield, QrCode, Download,
} from 'lucide-react';
import { supabase, type Report } from '@/lib/supabase';
import { StatusBadge, StatusProgress, PriorityBadge } from '@/components/Status';
import { generateQrDataUrl } from '@/lib/qr';

export default function Cek() {
  const [ticket, setTicket] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Report | null>(null);

  const search = async () => {
    if (!ticket.trim() || !phone.trim()) {
      setError('Mohon isi nomor tiket dan nomor HP.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const { data, error: err } = await supabase
      .from('reports')
      .select('*, category:categories(*)')
      .eq('ticket_number', ticket.trim().toUpperCase())
      .eq('phone', phone.trim())
      .maybeSingle();

    setLoading(false);

    if (err) {
      setError('Terjadi kesalahan. Coba lagi.');
      return;
    }
    if (!data) {
      setError('Tiket tidak ditemukan. Periksa kembali nomor tiket dan HP Anda.');
      return;
    }
    setResult(data as unknown as Report);
  };

  const timeline = result ? buildTimeline(result) : [];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 mb-4">
            <Ticket className="w-3.5 h-3.5" />
            Lacak Pengaduan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text mb-3">
            Cek Tiket Pengaduan
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Masukkan nomor tiket dan nomor HP Anda untuk melihat status pengaduan.
          </p>
        </div>

        {/* Search form */}
        <div className="glass-card rounded-30 p-6 sm:p-8 mb-8 animate-fade-up animate-delay-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Ticket className="w-4 h-4 text-primary-500" />
                Nomor Tiket
              </label>
              <input
                className="input-field font-mono"
                placeholder="LPR-2026-0001"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Phone className="w-4 h-4 text-primary-500" />
                Nomor HP
              </label>
              <input
                className="input-field"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-20 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={search}
            disabled={loading}
            className="btn-primary mt-5 w-full sm:w-auto group disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Mencari...</>
            ) : (
              <>Cek Status <Search className="w-4 h-4 group-hover:scale-110 transition-transform" /></>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-6 animate-fade-up">
            {/* Ticket header + QR */}
            <div className="glass-card rounded-30 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-mono text-xl font-extrabold text-primary-700 dark:text-primary-300">
                      {result.ticket_number}
                    </span>
                    <StatusBadge status={result.status} />
                    <PriorityBadge priority={result.priority} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.description}</p>

                  {/* Status progress */}
                  <div className="mt-6 p-4 rounded-20 bg-slate-50 dark:bg-white/5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Progress Pengaduan</p>
                    <StatusProgress status={result.status} />
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="p-3 rounded-20 bg-white border border-slate-200 dark:border-white/10">
                    <img
                      src={generateQrDataUrl(result.ticket_number, 160)}
                      alt={`QR ${result.ticket_number}`}
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <QrCode className="w-3 h-3" /> Pindai untuk detail
                  </p>
                  <a
                    href={generateQrDataUrl(result.ticket_number, 400)}
                    download={`${result.ticket_number}-qr.png`}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Unduh QR
                  </a>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-30 p-6 sm:p-8">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Timeline Pengaduan
              </h3>
              <div className="space-y-4">
                {timeline.map((t, i) => {
                  const reached = i <= timeline.findIndex((x) => x.key === result.status);
                  return (
                    <div key={t.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          reached ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                        }`}>
                          <t.icon className="w-4 h-4" />
                        </div>
                        {i < timeline.length - 1 && (
                          <div className={`w-0.5 h-8 ${reached ? 'bg-primary-400' : 'bg-slate-200 dark:bg-white/10'}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className={`font-semibold text-sm ${reached ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                          {t.label}
                        </p>
                        {t.time && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.time}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Info */}
              <div className="glass-card rounded-30 p-6">
                <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">Informasi Pelapor</h3>
                <div className="space-y-3 text-sm">
                  <DetailRow icon={User} label="Nama" value={result.name} />
                  <DetailRow icon={Phone} label="HP" value={result.phone} />
                  <DetailRow icon={MapPin} label="Alamat" value={result.address} />
                  <DetailRow icon={Tag} label="Kategori" value={result.category?.name ?? '-'} />
                  {result.location && <DetailRow icon={MapPin} label="Lokasi" value={result.location} />}
                </div>
              </div>

              {/* Officer note */}
              <div className="glass-card rounded-30 p-6">
                <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  Catatan Petugas
                </h3>
                {result.officer_note ? (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed p-3 rounded-20 bg-slate-50 dark:bg-white/5">
                      {result.officer_note}
                    </p>
                    {result.officer_name && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                        Ditangani oleh: <span className="font-semibold text-slate-700 dark:text-slate-200">{result.officer_name}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">Belum ada catatan dari petugas.</p>
                )}
              </div>
            </div>

            {/* Photo */}
            {result.photo_url && (
              <div className="glass-card rounded-30 p-6 sm:p-8">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary-500" />
                  Foto Pengaduan
                </h3>
                <img src={result.photo_url} alt="Foto pengaduan" className="rounded-20 max-h-96 mx-auto" />
              </div>
            )}
          </div>
        )}

        {/* Empty state hint */}
        {!result && !loading && !error && (
          <div className="glass-card rounded-30 p-8 text-center animate-fade-up animate-delay-200">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Masukkan nomor tiket dan HP untuk melihat detail pengaduan Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="text-slate-500 dark:text-slate-400">{label}: </span>
        <span className="font-medium text-slate-800 dark:text-slate-200">{value}</span>
      </div>
    </div>
  );
}

function buildTimeline(r: Report) {
  const fmt = (d: string) => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  const steps = [
    { key: 'menunggu', label: 'Laporan Diterima', icon: MessageSquare, time: fmt(r.created_at) },
    { key: 'diproses', label: 'Laporan Diproses', icon: Loader2, time: r.status !== 'menunggu' ? fmt(r.updated_at) : null },
    { key: 'selesai', label: 'Pengaduan Selesai', icon: MessageSquare, time: r.completed_at ? fmt(r.completed_at) : null },
  ];
  return steps;
}

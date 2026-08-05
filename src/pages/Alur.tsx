import {
  FileText, ShieldCheck, Wrench, CheckCircle2, ArrowRight, Clock,
  Search, Bell, MessageCircle, Award, QrCode,
} from 'lucide-react';

interface AlurProps {
  onNavigate: (page: string) => void;
}

export default function Alur({ onNavigate }: AlurProps) {
  const steps = [
    {
      icon: FileText,
      title: 'Isi Form Pengaduan',
      desc: 'Warga mengisi formulir pengaduan secara daring dengan melengkapi data diri, kategori, deskripsi, dan dapat melampirkan foto serta lokasi kejadian.',
      duration: '± 5 menit',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: ShieldCheck,
      title: 'Laporan Diverifikasi',
      desc: 'Pengurus RT memverifikasi keabsahan laporan yang masuk. Laporan yang valid akan diterima dan diteruskan untuk ditindaklanjuti.',
      duration: '1-2 hari kerja',
      color: 'from-accent-400 to-primary-500',
    },
    {
      icon: Wrench,
      title: 'Diproses Pengurus RT',
      desc: 'Tindak lanjut dilakukan oleh pengurus RT sesuai kategori laporan. Proses dapat berupa koordinasi, penanganan langsung, atau eskalasi ke pihak terkait.',
      duration: '2-7 hari kerja',
      color: 'from-blue-400 to-primary-500',
    },
    {
      icon: CheckCircle2,
      title: 'Pengaduan Selesai',
      desc: 'Laporan ditindaklanjuti hingga selesai. Status diperbarui dan warga dapat melihat catatan penyelesaian dari petugas.',
      duration: 'Sesuai kompleksitas',
      color: 'from-primary-600 to-primary-800',
    },
  ];

  const features = [
    { icon: Search, title: 'Lacak Tiket', desc: 'Pantau status dengan nomor tiket' },
    { icon: Bell, title: 'Notifikasi Status', desc: 'Update otomatis setiap tahap' },
    { icon: MessageCircle, title: 'Catatan Petugas', desc: 'Transparansi tindak lanjut' },
    { icon: QrCode, title: 'QR Code Tiket', desc: 'Pindai untuk detail cepat' },
    { icon: Award, title: 'Laporan Terbuka', desc: 'Riwayat publik untuk warga' },
    { icon: Clock, title: 'Layanan 24 Jam', desc: 'Pengaduan kapan saja' },
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 mb-4">
            <Clock className="w-3.5 h-3.5" />
            Panduan Lengkap
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text mb-4">
            Alur Pengaduan Warga
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
            Pahami setiap tahap pengaduan Anda dari awal hingga selesai. Proses yang jelas memastikan setiap laporan ditindaklanjuti dengan baik.
          </p>
        </div>

        {/* Timeline steps */}
        <div className="relative">
          {/* Vertical line for mobile, horizontal connector for desktop */}
          <div className="hidden lg:block absolute top-28 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 dark:from-white/10 dark:via-white/20 dark:to-white/10" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="glass-card rounded-30 p-6 h-full hover:-translate-y-2 transition-all duration-300">
                    {/* Number badge */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`relative w-16 h-16 rounded-20 bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-surface-dark border-2 border-primary-500 flex items-center justify-center text-xs font-extrabold text-primary-700">
                          {i + 1}
                        </div>
                      </div>
                      <div className="lg:hidden">
                        <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.duration}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{step.desc}</p>
                    <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
                      <Clock className="w-3.5 h-3.5" />
                      {step.duration}
                    </div>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-2">
                      <ArrowRight className="w-6 h-6 text-primary-400 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional features grid */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">Fitur Pendukung</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Yang membuat layanan ini lebih mudah dan transparan</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card rounded-30 p-6 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="w-12 h-12 rounded-20 bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="glass-card rounded-30 p-8 sm:p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-3">Sudah memahami alurnya?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Mulai sampaikan pengaduan Anda sekarang.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => onNavigate('buat')} className="btn-primary group">
                Buat Pengaduan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('cek')} className="btn-secondary">
                Cek Tiket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

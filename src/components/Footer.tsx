import { MapPin, Phone, Mail, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'alur', label: 'Alur Pengaduan' },
    { id: 'buat', label: 'Buat Pengaduan' },
    { id: 'cek', label: 'Cek Tiket' },
    { id: 'riwayat', label: 'Riwayat Laporan' },
    { id: 'login', label: 'Login Admin' },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Main footer */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-950 to-[#0a2414] text-white">
        {/* Decorative blur orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-20 bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-accent-300" />
                </div>
                <div>
                  <div className="font-extrabold text-lg tracking-tight">LAPOR MAS RT</div>
                  <div className="text-xs text-primary-300">Dusun Gabusan RT 22</div>
                </div>
              </div>
              <p className="text-sm text-primary-200/80 leading-relaxed">
                Layanan digital pengaduan, aspirasi, dan saran warga Dusun Gabusan RT 22, Desa Tanon, Kabupaten Sragen. Cepat, aman, dan transparan.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold text-base mb-4 text-white">Menu Cepat</h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => onNavigate(link.id)}
                      className="text-sm text-primary-200/80 hover:text-accent-300 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-base mb-4 text-white">Kontak Pengurus</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-primary-200/80">
                  <MapPin className="w-4 h-4 text-accent-300 mt-0.5 shrink-0" />
                  <span>Dusun Gabusan RT 22<br />Desa Tanon, Kabupaten Sragen<br />Jawa Tengah</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-200/80">
                  <Phone className="w-4 h-4 text-accent-300 shrink-0" />
                  <a href="https://wa.me/6281329200985" className="hover:text-accent-300 transition-colors">0813-2920-0985</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-200/80">
                  <Mail className="w-4 h-4 text-accent-300 shrink-0" />
                  <span>lapormasrt@gaban22.id</span>
                </li>
              </ul>
            </div>

            {/* Hours / Info */}
            <div>
              <h4 className="font-bold text-base mb-4 text-white">Jam Layanan</h4>
              <div className="space-y-2 text-sm text-primary-200/80">
                <div className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="text-white font-medium">08.00 - 16.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu</span>
                  <span className="text-white font-medium">08.00 - 12.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Minggu</span>
                  <span className="text-white font-medium">Tutup</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-20 bg-white/5 border border-white/10">
                <p className="text-xs text-primary-200/70">
                  Pengaduan daring tersedia 24 jam. Verifikasi dilakukan pada jam kerja.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-200/70">
              Copyright &copy; 2026 Lapor Mas RT. Seluruh hak dilindungi.
            </p>
            <p className="text-xs text-primary-300/60 flex items-center gap-1.5">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-accent-300 fill-accent-300" /> untuk warga Dusun Gabusan
            </p>
          </div>
        </div>
      </div>

      {/* Developer Credit - subtle, at the very bottom */}
      <div className="bg-[#06190d] text-white/70 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Dikembangkan oleh</p>
          <div className="flex flex-col items-center gap-1">
            {/* GIGA INNOVATION Logo (text-based mark) */}
            <div className="flex items-center gap-2.5" style={{ minWidth: '120px' }}>
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400 via-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="font-extrabold text-white text-sm tracking-tighter">GI</span>
                <div className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
              </div>
              <div className="text-left leading-none">
                <div className="font-extrabold text-sm tracking-tight text-white" style={{ letterSpacing: '0.02em' }}>
                  GIGA INNOVATION
                </div>
                <div className="text-[10px] text-white/50 mt-0.5 italic">
                  Inovasi Untuk Solusi Terbaik
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/6281329200985"
              className="text-[11px] text-white/40 hover:text-accent-300 transition-colors mt-1"
            >
              0813-2920-0985
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

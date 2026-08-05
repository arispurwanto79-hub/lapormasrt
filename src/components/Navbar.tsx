import { useEffect, useState } from 'react';
import { Menu, X, Moon, Sun, ShieldCheck, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  theme: string;
  toggleTheme: () => void;
}

const menuItems = [
  { id: 'home', label: 'Beranda' },
  { id: 'alur', label: 'Alur Pengaduan' },
  { id: 'buat', label: 'Buat Pengaduan' },
  { id: 'cek', label: 'Cek Tiket' },
  { id: 'riwayat', label: 'Riwayat Laporan' },
];

export default function Navbar({ currentPage, onNavigate, theme, toggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-primary-900/5 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-20 bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full border-2 border-white dark:border-surface-dark animate-pulse-slow" />
          </div>
          <div className="text-left leading-tight">
            <div className="font-extrabold text-lg text-primary-800 dark:text-white tracking-tight">
              LAPOR MAS RT
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Dusun Gabusan RT 22
            </div>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-4 py-2 rounded-20 text-sm font-semibold transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-primary-50 dark:bg-white/10 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-20 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => handleNav('login')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-20 text-sm font-semibold text-white bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all duration-300 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            Login Admin
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-20 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-4 sm:mx-6 glass-card rounded-30 p-4 animate-scale-in">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-4 py-3 rounded-20 text-left text-sm font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-primary-50 dark:bg-white/10 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('login')}
              className="mt-2 px-4 py-3 rounded-20 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary-700 to-primary-600"
            >
              Login Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

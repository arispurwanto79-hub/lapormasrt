import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Alur from '@/pages/Alur';
import Buat from '@/pages/Buat';
import Cek from '@/pages/Cek';
import Riwayat from '@/pages/Riwayat';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

type Page = 'home' | 'alur' | 'buat' | 'cek' | 'riwayat' | 'login' | 'dashboard';

export default function App() {
  const { theme, toggle } = useTheme();
  const [page, setPage] = useState<Page>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const navigate = (p: string) => {
    const target = p as Page;
    if (target === 'dashboard' && !session) {
      setPage('login');
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setPage('dashboard');
    window.scrollTo({ top: 0 });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setPage('home');
    window.scrollTo({ top: 0 });
  };

  // Admin pages: no navbar/footer
  if (page === 'dashboard' && session && authChecked) {
    return <Dashboard onLogout={handleLogout} userEmail={session.user.email ?? null} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark">
      <Navbar currentPage={page} onNavigate={navigate} theme={theme} toggleTheme={toggle} />
      <main className="flex-1">
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'alur' && <Alur onNavigate={navigate} />}
        {page === 'buat' && <Buat onNavigate={navigate} />}
        {page === 'cek' && <Cek />}
        {page === 'riwayat' && <Riwayat onNavigate={navigate} />}
        {page === 'login' && <Login onNavigate={navigate} onLogin={handleLogin} />}
        {page === 'dashboard' && !session && authChecked && (
          <Login onNavigate={navigate} onLogin={handleLogin} />
        )}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

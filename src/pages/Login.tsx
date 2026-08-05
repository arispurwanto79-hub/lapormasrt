import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Mohon isi email dan password.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (err) {
      setError('Email atau password salah. Pastikan akun admin sudah terdaftar.');
      return;
    }
    onLogin();
  };

  const resetPassword = async () => {
    if (!email.trim()) {
      setError('Masukkan email terlebih dahulu untuk reset password.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#login`,
    });
    setLoading(false);
    if (err) {
      setError('Gagal mengirim email reset. Coba lagi.');
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-16 h-16 rounded-30 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight gradient-text mb-2">Login Admin</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Masuk ke dashboard pengurus RT</p>
        </div>

        <div className="glass-card rounded-30 p-6 sm:p-8 animate-fade-up animate-delay-100">
          {resetSent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Email Reset Terkirim</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Periksa email Anda untuk instruksi reset password.
              </p>
              <button onClick={() => setResetSent(false)} className="btn-secondary">
                Kembali ke Login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 rounded-20 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Mail className="w-4 h-4 text-primary-500" /> Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="admin@gaban22.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Lock className="w-4 h-4 text-primary-500" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-field pr-11"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submit()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={submit}
                  disabled={loading}
                  className="btn-primary w-full group disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Masuk...</>
                  ) : (
                    <>Masuk Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>

                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Lupa Password?
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="mt-6 w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          &larr; Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

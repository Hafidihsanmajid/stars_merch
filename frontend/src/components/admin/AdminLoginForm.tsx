'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/products';

  const { login, isLoading } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Silakan masukkan alamat email admin.');
      return;
    }

    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    const result = await login({
      email: trimmedEmail,
      password,
    });

    if (result.success) {
      setSuccessMessage(result.message || 'Login berhasil. Mengalihkan...');
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 500);
    } else {
      setErrorMessage(result.message || 'Autentikasi gagal. Periksa kembali email dan password.');
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail('admin@starsmerch.com');
    setPassword('secretpassword');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-zinc-800/20 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Bar with Return to Store */}
      <div className="absolute top-6 left-6 sm:left-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Toko</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Header Badge & Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-black text-2xl shadow-xl shadow-black/80 mb-4 tracking-tighter">
            ★
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              STARS MERCH PORTAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            ADMINISTRATOR ACCESS
          </h1>
          <p className="mt-2 text-xs text-zinc-400 max-w-xs mx-auto">
            Masuk dengan kredensial staf untuk mengelola katalog, inventaris stok, dan varian pakaian.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2"
              >
                Email Administrator
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@starsmerch.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="admin-password" 
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                >
                  Kata Sandi
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-11 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Memvalidasi Kredensial...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Card */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Kredensial Default Demo
                </span>
                <button
                  type="button"
                  onClick={handleUseDemoCredentials}
                  className="text-[10px] font-bold text-white hover:text-emerald-400 underline underline-offset-2 transition-colors"
                >
                  Isi Otomatis
                </button>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                <div>Email: <span className="text-zinc-200">admin@starsmerch.com</span></div>
                <div>Pass: <span className="text-zinc-200">secretpassword</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <p className="mt-6 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>Dilindungi otentikasi Bearer Token Laravel Sanctum & Session Guard</span>
        </p>
      </div>
    </div>
  );
}

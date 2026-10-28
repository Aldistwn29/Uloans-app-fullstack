// src/features/auth/components/LoginForm.jsx
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Props:
 *   onSubmit(credentials) — dipanggil dengan { email, password }
 *   isLoading             — boolean, nonaktifkan tombol saat request berjalan
 *   error                 — string | null, pesan error dari API
 */
export default function LoginForm({ onSubmit, isLoading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  }

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-8 sm:p-10 shadow-md flex flex-col gap-6">
      {/* Judul */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-semibold text-[var(--color-on-surface)]">
          Masuk ke Akun Anda
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Silakan masukkan kredensial akun terdaftar Anda untuk melanjutkan.
        </p>
      </div>

      {/* Indikator keamanan */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[var(--color-surface-container-high)]">
        <Lock size={16} className="text-[var(--color-secondary)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
          Pastikan URL domain sah dan koneksi tersertifikasi aman sebelum memasukkan
          kredensial.
        </p>
      </div>

      {/* Error dari API */}
      {error && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-sm"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="text-sm font-semibold text-[var(--color-on-surface)]"
          >
            Alamat Surel / ID Nasabah
          </label>
          <div className="relative flex items-center">
            <Mail
              size={18}
              className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none"
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full h-11 pl-11 pr-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-sm rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-password"
            className="text-sm font-semibold text-[var(--color-on-surface)]"
          >
            Kata Sandi
          </label>
          <div className="relative flex items-center">
            <Lock
              size={18}
              className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none"
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-11 pr-11 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-sm rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              className="absolute right-3.5 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember me & lupa password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-xs text-[var(--color-on-surface-variant)]">
              Ingat saya di perangkat ini
            </span>
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline transition-colors"
          >
            Lupa kata sandi?
          </button>
        </div>

        {/* Tombol submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-on-primary-fixed)] active:scale-[0.99] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Memverifikasi Kredensial...</span>
            </>
          ) : (
            <>
              <span>Masuk</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Link ke register */}
      <div className="flex items-center justify-center gap-1.5 text-sm text-[var(--color-on-surface-variant)]">
        <span>Belum memiliki akun nasabah?</span>
        <Link
          to="/register"
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline transition-colors"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}

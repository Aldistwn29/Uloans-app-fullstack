// src/features/auth/components/RegisterForm.jsx
import { useState } from 'react';
import { User, Mail, Lock, LockKeyhole, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordStrengthBar from './PasswordStrengthBar';

/**
 * Props:
 *   onSubmit(payload) — dipanggil dengan { name, email, password }
 *   isLoading         — boolean
 *   error             — string | null
 */
export default function RegisterForm({ onSubmit, isLoading, error }) {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [agreeTerms, setAgreeTerms]         = useState(false);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit =
    name.trim().length >= 2 &&
    email.length > 0 &&
    password.length >= 6 &&
    passwordsMatch &&
    agreeTerms;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), email, password });
  }

  const EyeIcon = ({ show }) =>
    show ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" x2="22" y1="2" y2="22"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    );

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-8 sm:p-10 shadow-md flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-on-surface)]">
            Daftar Akun Nasabah Baru
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Lengkapi data diri untuk memulai registrasi akun ULoans.
          </p>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 bg-[var(--color-surface-container)] px-3 py-1.5 rounded-full shrink-0">
          <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-semibold flex items-center justify-center">1</span>
          <span className="text-[11px] font-semibold text-[var(--color-primary)]">Data Akun</span>
          <span className="text-[var(--color-outline)] text-xs">/</span>
          <span className="w-5 h-5 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] text-[11px] font-semibold flex items-center justify-center">2</span>
          <span className="text-[11px] font-semibold text-[var(--color-on-surface-variant)]">Aktivasi</span>
        </div>
      </div>

      {/* Error API */}
      {error && (
        <div role="alert" className="p-3 rounded-lg bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Nama */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-name" className="text-xs font-semibold text-[var(--color-on-surface)]">
            Nama Lengkap <span className="text-[var(--color-error)]">*</span>
          </label>
          <div className="relative flex items-center">
            <User size={16} className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none" />
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap sesuai KTP"
              className="w-full h-11 pl-10 pr-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-sm rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-email" className="text-xs font-semibold text-[var(--color-on-surface)]">
            Alamat Surel (Email) <span className="text-[var(--color-error)]">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail size={16} className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
              className="w-full h-11 pl-10 pr-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-sm rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          </div>
        </div>

        {/* Password grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-xs font-semibold text-[var(--color-on-surface)]">
              Kata Sandi Baru <span className="text-[var(--color-error)]">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="w-full h-11 pl-10 pr-10 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-sm rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                className="absolute right-3 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors p-0.5"
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-semibold text-[var(--color-on-surface)]">
              Konfirmasi Kata Sandi <span className="text-[var(--color-error)]">*</span>
            </label>
            <div className="relative flex items-center">
              <LockKeyhole size={16} className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none" />
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi"
                className={`w-full h-11 pl-10 pr-10 bg-[var(--color-surface-container-lowest)] border text-[var(--color-on-surface)] text-sm rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-[var(--color-secondary)] focus:ring-[var(--color-secondary)]/20'
                      : 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20'
                    : 'border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                className="absolute right-3 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors p-0.5"
              >
                <EyeIcon show={showConfirm} />
              </button>
            </div>
          </div>
        </div>

        <PasswordStrengthBar password={password} confirmPassword={confirmPassword} />

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer"
          />
          <span className="text-xs text-[var(--color-on-surface)] leading-snug">
            Saya menyetujui{' '}
            <span className="text-[var(--color-primary)] font-semibold hover:underline cursor-pointer">
              Syarat &amp; Ketentuan Layanan
            </span>{' '}
            serta{' '}
            <span className="text-[var(--color-primary)] font-semibold hover:underline cursor-pointer">
              Kebijakan Privasi
            </span>{' '}
            ULoans.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="w-full h-11 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[var(--color-on-primary-fixed)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memproses Data Nasabah...</span>
              </>
            ) : (
              <>
                <span>Daftar Akun Sekarang</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Link ke login */}
      <div className="pt-4 border-t border-[var(--color-surface-container-high)] text-center">
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Sudah memiliki akun nasabah?{' '}
          <Link
            to="/login"
            className="text-[var(--color-primary)] font-semibold hover:underline inline-flex items-center gap-1 ml-0.5 transition-colors"
          >
            Masuk Sekarang
            <LogIn size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}

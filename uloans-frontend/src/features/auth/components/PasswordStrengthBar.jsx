// src/features/auth/components/PasswordStrengthBar.jsx

/**
 * Props:
 *   password        — string
 *   confirmPassword — string (opsional, untuk cek kecocokan)
 */
export default function PasswordStrengthBar({ password = '', confirmPassword }) {
  const hasLength   = password.length >= 6;
  const hasAlphaNum = /[0-9]/.test(password) && /[a-zA-Z]/.test(password);
  const hasSpecial  = /[^a-zA-Z0-9]/.test(password);

  let level = 0;
  if (password.length > 0) {
    if (hasLength && hasAlphaNum && hasSpecial) level = 3;
    else if (hasLength && hasAlphaNum) level = 2;
    else level = 1;
  }

  const labels     = ['', 'Lemah', 'Cukup', 'Kuat'];
  const barColors  = ['', 'bg-[var(--color-error)]', 'bg-[var(--color-tertiary-container)]', 'bg-[var(--color-secondary)]'];
  const labelColors = ['', 'text-[var(--color-error)]', 'text-[var(--color-tertiary)]', 'text-[var(--color-secondary)]'];

  const passwordsMatch    = confirmPassword !== undefined && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword !== undefined && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="p-3 bg-[var(--color-surface-container)] rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-on-surface-variant)]">Kekuatan Kata Sandi:</span>
        <span className={`text-xs font-semibold ${level > 0 ? labelColors[level] : 'text-[var(--color-on-surface-variant)]'}`}>
          {level > 0 ? labels[level] : 'Belum diisi'}
        </span>
      </div>

      {/* Bar */}
      <div className="w-full h-1.5 bg-[var(--color-surface-container-highest)] rounded-full flex gap-1 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${level >= i ? barColors[level] : 'bg-transparent'}`}
          />
        ))}
      </div>

      {/* Requirements */}
      <div className="flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)] pt-0.5">
        <span className={hasLength ? 'text-[var(--color-secondary)]' : ''}>
          {hasLength ? '✓' : '○'} Min. 6 karakter
        </span>
        <span className={hasAlphaNum ? 'text-[var(--color-secondary)]' : ''}>
          {hasAlphaNum ? '✓' : '○'} Huruf &amp; angka
        </span>
        {confirmPassword !== undefined && (
          <span className={`ml-auto font-semibold ${passwordsMatch ? 'text-[var(--color-secondary)]' : passwordsMismatch ? 'text-[var(--color-error)]' : ''}`}>
            {passwordsMatch && 'Kata sandi cocok ✓'}
            {passwordsMismatch && 'Belum cocok'}
          </span>
        )}
      </div>
    </div>
  );
}

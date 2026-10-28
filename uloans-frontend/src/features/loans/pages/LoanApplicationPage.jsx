import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLoan } from '../loans.service';
import { formatRupiah } from '../../../utils/format';

const TENOR_OPTIONS = [3, 6, 12, 24];

export default function LoanApplicationPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [tenor, setTenor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function validateForm() {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 500000) {
      return 'Jumlah pinjaman minimal Rp 500.000.';
    }

    if (!TENOR_OPTIONS.includes(Number(tenor))) {
      return 'Pilih tenor yang tersedia.';
    }

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await applyLoan({
        amount: Number(amount),
        tenor: Number(tenor),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message
          ?? 'Pengajuan pinjaman gagal. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="h-16 bg-[var(--color-surface-container-lowest)] shadow-sm flex items-center px-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          &larr; Kembali ke dashboard
        </button>
      </header>

      <main className="w-full max-w-xl mx-auto px-4 py-8">
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">
            Ajukan Pinjaman
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 mb-6">
            Isi jumlah dan tenor pinjaman yang kamu butuhkan.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-sm font-semibold">
                Jumlah pinjaman
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="500000"
                step="1000"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Contoh: 5000000"
                required
                className="rounded-lg border border-[var(--color-outline-variant)] px-4 py-3"
              />
              <span className="text-xs text-[var(--color-on-surface-variant)]">
                Minimal {formatRupiah(500000)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="tenor" className="text-sm font-semibold">
                Tenor pinjaman
              </label>
              <select
                id="tenor"
                name="tenor"
                value={tenor}
                onChange={(event) => setTenor(event.target.value)}
                required
                className="rounded-lg border border-[var(--color-outline-variant)] px-4 py-3 bg-white"
              >
                <option value="" disabled>Pilih tenor</option>
                {TENOR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} bulan
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p role="alert" className="text-sm text-[var(--color-error)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Mengirim pengajuan...' : 'Ajukan Pinjaman'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

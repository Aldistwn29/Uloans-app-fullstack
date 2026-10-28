import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelLoan, getLoanById } from '../loans.service';
import { formatDate, formatRupiah, getLoanStatusConfig } from '../../../utils/format';

export default function LoanDetailPage() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLoan() {
      try {
        const result = await getLoanById(loanId);
        setLoan(result.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { replace: true });
        } else {
          setError(err.response?.data?.message ?? 'Gagal memuat detail pinjaman.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchLoan();
  }, [loanId, navigate]);

  async function handleCancel() {
    setError(null);
    setIsCancelling(true);

    try {
      const result = await cancelLoan(loanId);
      setLoan(result.data);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Pinjaman gagal dibatalkan.');
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return <p className="p-8 text-center">Memuat detail pinjaman...</p>;
  }

  if (error && !loan) {
    return (
      <main className="min-h-screen bg-[var(--color-surface)] p-8 text-center">
        <p role="alert" className="text-sm text-[var(--color-error)]">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Kembali ke dashboard
        </button>
      </main>
    );
  }

  const status = getLoanStatusConfig(loan.status);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] p-4 sm:p-8">
      <section className="w-full max-w-xl mx-auto bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-sm">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          &larr; Kembali ke dashboard
        </button>
        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Pengajuan</p>
            <h1 className="text-2xl font-bold">#{loan.id}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.bgClass} ${status.textClass}`}>
            {status.label}
          </span>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--color-on-surface-variant)]">Jumlah pinjaman</dt>
            <dd className="font-bold">{formatRupiah(loan.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-on-surface-variant)]">Tenor</dt>
            <dd className="font-bold">{loan.tenor} bulan</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-on-surface-variant)]">Tanggal pengajuan</dt>
            <dd className="font-bold">{formatDate(loan.createdAt)}</dd>
          </div>
        </dl>

        {error && (
          <p role="alert" className="mt-6 text-sm text-[var(--color-error)]">{error}</p>
        )}

        {loan.status === 'PENDING' && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="mt-8 w-full rounded-xl border border-[var(--color-error)] px-5 py-3 text-sm font-semibold text-[var(--color-error)] hover:bg-[var(--color-error-container)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCancelling ? 'Membatalkan...' : 'Batalkan Pengajuan'}
          </button>
        )}
      </section>
    </main>
  );
}

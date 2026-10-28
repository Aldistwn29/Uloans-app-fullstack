// src/features/loans/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoans } from '../loans.service';
import { formatRupiah, formatDate, getLoanStatusConfig } from '../../../utils/format';
import { logout } from '../../auth/auth.service';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchLoans() {
      try {
        const result = await getLoans();
        setLoans(result.data ?? []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Gagal memuat data pinjaman.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchLoans();
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const filtered = filter === 'all'
    ? loans
    : loans.filter((l) => l.status === filter);

  const counts = {
    all: loans.length,
    PENDING: loans.filter((l) => l.status === 'PENDING').length,
    APPROVED: loans.filter((l) => l.status === 'APPROVED').length,
    CANCELLED: loans.filter((l) => l.status === 'CANCELLED').length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 h-16 bg-[var(--color-surface-container-lowest)] shadow-sm flex items-center justify-between px-6">
        <span className="text-lg font-bold text-[var(--color-primary)]">ULoans</span>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-[var(--color-error)] hover:underline"
        >
          Keluar
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* ── Welcome ── */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-on-surface)]">
              Dashboard Nasabah
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
              Pantau dan kelola pengajuan pinjaman Anda.
            </p>
          </div>
          <button
            onClick={() => navigate('/loans/apply')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold shadow hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            + Ajukan Pinjaman
          </button>
        </section>

        {/* ── Summary Cards ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: counts.all, color: 'text-[var(--color-primary)]' },
            { label: 'Menunggu', value: counts.PENDING, color: 'text-[var(--color-tertiary)]' },
            { label: 'Disetujui', value: counts.APPROVED, color: 'text-[var(--color-secondary)]' },
            { label: 'Dibatalkan', value: counts.CANCELLED, color: 'text-[var(--color-on-surface-variant)]' },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-[var(--color-surface-container-lowest)] rounded-xl p-5 shadow-sm flex flex-col gap-1"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                {card.label}
              </span>
              <span className={`text-3xl font-bold tabular-nums ${card.color}`}>
                {card.value}
              </span>
            </div>
          ))}
        </section>

        {/* ── Tabel Pinjaman ── */}
        <section className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-on-surface)]">
              Riwayat Pengajuan
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: `Semua (${counts.all})` },
              { key: 'PENDING', label: `Menunggu (${counts.PENDING})` },
              { key: 'APPROVED', label: `Disetujui (${counts.APPROVED})` },
              { key: 'CANCELLED', label: `Dibatalkan (${counts.CANCELLED})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  filter === tab.key
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* State: Loading */}
          {isLoading && (
            <div className="py-16 text-center text-sm text-[var(--color-on-surface-variant)]">
              Memuat data...
            </div>
          )}

          {/* State: Error */}
          {error && (
            <div className="py-6 text-center text-sm text-[var(--color-error)]">
              {error}
            </div>
          )}

          {/* State: Empty */}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl">📂</span>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                Belum ada pengajuan pinjaman.
              </p>
              <button
                onClick={() => navigate('/loans/apply')}
                className="mt-2 px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold"
              >
                Ajukan Sekarang
              </button>
            </div>
          )}

          {/* State: Data */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-lg">ID</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4 text-right">Jumlah</th>
                    <th className="py-3 px-4 text-center">Tenor</th>
                    <th className="py-3 px-4 text-center rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-surface-container-low)]">
                  {filtered.map((loan) => {
                    const status = getLoanStatusConfig(loan.status);
                    return (
                      <tr
                        key={loan.id}
                        onClick={() => navigate(`/loans/${loan.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            navigate(`/loans/${loan.id}`);
                          }
                        }}
                        role="link"
                        tabIndex={0}
                        className="hover:bg-[var(--color-surface-container-low)] transition-colors"
                      >
                        <td className="py-4 px-4 font-semibold text-[var(--color-primary)]">
                          #{loan.id}
                        </td>
                        <td className="py-4 px-4 text-[var(--color-on-surface-variant)] whitespace-nowrap">
                          {formatDate(loan.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right font-bold tabular-nums whitespace-nowrap">
                          {formatRupiah(loan.amount)}
                        </td>
                        <td className="py-4 px-4 text-center text-[var(--color-on-surface-variant)]">
                          {loan.tenor} bln
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${status.bgClass} ${status.textClass}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

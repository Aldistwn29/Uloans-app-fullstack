// src/pages/DashboardPlaceholder.jsx
// Halaman sementara — akan diganti dengan dashboard nasabah/admin
import { Link } from 'react-router-dom';

export default function DashboardPlaceholder() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg-page)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">ULoans Dashboard</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">
          Halaman ini sedang dalam pengembangan.
        </p>
      </div>
      <Link
        to="/login"
        className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-on-primary-fixed)] transition-colors"
      >
        Kembali ke Login
      </Link>
    </div>
  );
}

// src/features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, Zap, Building2 } from 'lucide-react';
import AuthBrandPanel from '../../../components/AuthBrandPanel';
import LoginForm from '../components/LoginForm';
import { login } from '../auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(credentials) {
    setError(null);
    setIsLoading(true);
    try {
      const result = await login(credentials);

      // Simpan token ke localStorage
      const token = result?.data?.token;
      if (token) {
        localStorage.setItem('uloans_token', token);
      }

      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message ?? 'Email atau kata sandi salah. Coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--color-surface)]">
      {/* Panel kiri — brand & keunggulan */}
      <AuthBrandPanel>
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary-fixed)]">
              Sistem Layanan Finansial Terpadu
            </span>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Solusi Pinjaman Digital Cepat, Aman &amp; Terpercaya
            </h1>
            <p className="text-sm text-[var(--color-surface-container-high)] leading-relaxed opacity-90">
              Akses pembiayaan modal usaha dan kebutuhan personal melalui platform
              underwriting otomatis dengan standar kepatuhan regulasi institusional.
            </p>
          </div>

          {/* Poin keunggulan */}
          <div className="flex flex-col gap-3 pt-2">
            {[
              {
                icon: <Laptop size={20} />,
                title: 'Proses Pengajuan 100% Online',
                desc: 'Unggah dokumen identitas dan agunan secara mandiri tanpa antrean fisik cabang.',
              },
              {
                icon: <Zap size={20} />,
                title: 'Keputusan Cepat & Transparan',
                desc: 'Pemeringkatan kredit berbasis algoritma risiko objektif dengan pelacakan status seketika.',
              },
              {
                icon: <Building2 size={20} />,
                title: 'Bunga Kompetitif & Tenor Fleksibel',
                desc: 'Struktur suku bunga efektif mulai 0.75% per bulan dengan tenor hingga 60 bulan.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[var(--color-tertiary-fixed)] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                  <p className="text-xs text-[var(--color-surface-container)] opacity-85 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AuthBrandPanel>

      {/* Panel kanan — form login */}
      <div className="w-full lg:w-7/12 xl:w-1/2 bg-[var(--color-surface-container-low)] flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md flex flex-col gap-4">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
          <p className="text-xs text-center text-[var(--color-on-surface-variant)] opacity-75">
            ULoans Sistem Layanan Perbankan Digital © 2025
          </p>
        </div>
      </div>
    </div>
  );
}

// src/features/auth/pages/Resgistrasi.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart3, CreditCard } from 'lucide-react';
import AuthBrandPanel from '../../../components/AuthBrandPanel';
import RegisterForm from '../components/RegisterForm';
import { register } from '../auth.service';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRegister(payload) {
    setError(null);
    setIsLoading(true);
    try {
      await register(payload);
      navigate('/login', {
        state: { message: 'Akun berhasil dibuat. Silakan masuk.' },
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        'Terjadi kesalahan. Periksa koneksi dan coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[var(--color-surface)]">
      {/* Panel kiri */}
      <AuthBrandPanel>
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-[var(--color-secondary-fixed)] w-fit">
            <ShieldCheck size={13} />
            Registrasi Resmi Terverifikasi
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight">
            Buka Akses Finansial &amp; Pengajuan Pinjaman Anda
          </h1>
          <p className="text-sm text-[var(--color-surface-variant)]/90 leading-relaxed">
            Daftar akun nasabah ULoans dalam beberapa langkah mudah untuk pengajuan
            kredit usaha dan personal dengan transparansi penuh.
          </p>

          <div className="flex flex-col gap-3 mt-2">
            {[
              {
                icon: <ShieldCheck size={18} />,
                title: 'Verifikasi Identitas Cepat & Aman',
                desc: 'Enkripsi data standar ISO 27001 dan kepatuhan penuh regulasi perbankan nasional.',
              },
              {
                icon: <BarChart3 size={18} />,
                title: 'Pantau Status Pinjaman Real-time',
                desc: 'Pelacakan transparan setiap tahapan analisis kredit langsung dari dasbor nasabah.',
              },
              {
                icon: <CreditCard size={18} />,
                title: 'Simulasi & Tenor Fleksibel',
                desc: 'Plafon kredit hingga Rp100.000.000 dengan kalkulasi angsuran transparan.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl bg-white/10 backdrop-blur-md flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-[var(--color-tertiary-fixed)] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                  <p className="text-xs text-[var(--color-surface-variant)]/80 mt-0.5 leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AuthBrandPanel>

      {/* Panel kanan — form register */}
      <div className="w-full lg:w-7/12 xl:w-1/2 bg-[var(--color-surface-container-lowest)] flex items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

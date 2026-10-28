// src/components/AuthBrandPanel.jsx
import { Headphones } from 'lucide-react';

const BJB_IMAGE = '/backgroudn-panel-bank-bjb.jpg';

/**
 * Panel kiri Login & Register.
 * Foto bank bjb full — teks diberi overlay gelap lokal agar tetap terbaca.
 */
export default function AuthBrandPanel({ children }) {
  return (
    <div className="w-full lg:w-5/12 xl:w-1/2 flex flex-col relative overflow-hidden min-h-[320px] lg:min-h-screen">

      {/* Background foto — full cover */}
      <img
        src={BJB_IMAGE}
        alt="Gedung Kantor Pusat bank bjb"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Konten di atas foto */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-12 lg:p-16 gap-6">

        {/* Logo — kotak gelap lokal */}
        <div className="inline-flex flex-col items-start gap-3 self-start bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-[var(--color-tertiary-fixed)] font-bold text-lg">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight drop-shadow">ULoans</span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-white/80">
                Digital Banking Platform
              </span>
            </div>
          </div>
          <div className="h-0.5 w-14 bg-[var(--color-tertiary-fixed)] rounded-full" />
        </div>

        {/* Konten utama dari halaman — wrapped overlay */}
        <div className="my-auto bg-black/50 backdrop-blur-sm rounded-2xl p-6">
          {children}
        </div>

        {/* Footer — kotak gelap lokal */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-white/80 self-start">
          <Headphones size={16} className="text-[var(--color-tertiary-fixed)]" />
          <span>
            Bantuan Layanan:{' '}
            <strong className="text-white font-medium">1500-880</strong>
          </span>
        </div>

      </div>
    </div>
  );
}

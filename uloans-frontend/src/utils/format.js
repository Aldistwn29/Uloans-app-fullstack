/**
 * Formatting utilities — currency, date, loan status.
 * Semua format finansial menggunakan locale id-ID dan IDR sesuai ui-guidelines.md.
 */

/**
 * Format angka sebagai Rupiah.
 * @param {number} amount
 * @returns {string} contoh: "Rp 1.000.000"
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format lokal Indonesia.
 * @param {string|Date} date
 * @returns {string} contoh: "28 Oktober 2026"
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Peta status backend ke label tampilan dan token warna.
 * Sesuai ui-guidelines.md — jangan infer status dari kalkulasi client-side.
 */
export const LOAN_STATUS_MAP = {
  PENDING: {
    label: 'Menunggu keputusan',
    bgClass: 'bg-[#FEF3C7]',
    textClass: 'text-[#92400E]',
  },
  APPROVED: {
    label: 'Disetujui',
    bgClass: 'bg-[#DCFCE7]',
    textClass: 'text-[#166534]',
  },
  REJECTED: {
    label: 'Ditolak',
    bgClass: 'bg-[#FEE2E2]',
    textClass: 'text-[#991B1B]',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    bgClass: 'bg-[#F1F5F9]',
    textClass: 'text-[#475569]',
  },
};

/**
 * Kembalikan config status, atau fallback jika status tidak dikenal.
 * @param {string} status — nilai enum dari backend
 */
export function getLoanStatusConfig(status) {
  return (
    LOAN_STATUS_MAP[status] ?? {
      label: status,
      bgClass: 'bg-[#F1F5F9]',
      textClass: 'text-[#475569]',
    }
  );
}

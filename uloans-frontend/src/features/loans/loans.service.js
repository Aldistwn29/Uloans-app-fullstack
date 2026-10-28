/**
 * Loans service — daftar pinjaman, ajukan, detail, batalkan.
 * Semua panggilan API terkait pinjaman melewati file ini.
 *
 * Base URL sudah /api/v1 dari api-client, jadi path di sini mulai dari /loans.
 */
import apiClient from '../../lib/api-client';

/** Ambil semua pinjaman milik user yang sedang login */
export async function getLoans() {
  const response = await apiClient.get('/loans');
  return response.data;
}

/** Ambil detail satu pinjaman berdasarkan ID */
export async function getLoanById(id) {
  const response = await apiClient.get(`/loans/${id}`);
  return response.data;
}

/** Ajukan pinjaman baru — payload: { amount, tenor } */
export async function applyLoan(payload) {
  const response = await apiClient.post('/loans', payload);
  return response.data;
}

/** Batalkan pinjaman dengan status PENDING */
export async function cancelLoan(id) {
  const response = await apiClient.post(`/loans/${id}/cancellation`);
  return response.data;
}

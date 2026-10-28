/**
 * Auth service — login, register, logout.
 * Semua panggilan API auth melewati file ini, bukan langsung di komponen.
 */
import apiClient from '../../lib/api-client';

const TOKEN_KEY = 'uloans_token';

/** Login — simpan token ke localStorage jika berhasil */
export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials);

  const token = response.data?.data?.token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  return response.data;
}

/** Register — buat akun baru, tidak otomatis login */
export async function register(payload) {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
}

/** Logout — hapus token dari localStorage */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Cek apakah user sedang login (ada token di localStorage) */
export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

/** Ambil token yang tersimpan */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

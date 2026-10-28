/**
 * Shared Axios API client.
 * Base URL dibaca dari environment variable VITE_API_URL.
 * Semua feature service menggunakan instance ini - jangan buat instance baru di component.
 */
import axios from 'axios';

// Base URL: http://localhost:8080/api/v1 sesuai docs/api-contract.md
// Override via VITE_API_URL di file .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - sisipkan token jika tersedia
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('uloans_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - normalisasi error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan suppress error - lempar kembali agar feature layer bisa handle
    return Promise.reject(error);
  }
);

export default apiClient;

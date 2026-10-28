/**
 * Profile service — ambil dan update profil nasabah.
 *
 * Base URL sudah /api/v1 dari api-client, jadi path di sini mulai dari /user.
 */
import apiClient from '../../lib/api-client';

/** Ambil profil user yang sedang login */
export async function getProfile() {
  const response = await apiClient.get('/user/profile');
  return response.data;
}

/** Update nama profil — payload: { name } */
export async function updateProfile(payload) {
  const response = await apiClient.put('/user/profile', payload);
  return response.data;
}

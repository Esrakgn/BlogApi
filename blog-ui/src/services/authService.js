import axiosClient from '../api/axiosClient';

export async function login(email, password) {
  return axiosClient.post('/auth/login', { email, password });
}

export async function register(data) {
  return axiosClient.post('/auth/register', data);
}

export async function forgotPassword(email) {
  return axiosClient.post('/auth/forgot-password', { email });
}

export async function getProfile() {
  return axiosClient.get('/auth/profile');
}

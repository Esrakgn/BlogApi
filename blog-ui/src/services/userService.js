import axiosClient from '../api/axiosClient';

export async function updateProfile(data) {
  return axiosClient.put('/users/profile', data);
}

export async function updateEmail(data) {
  return axiosClient.put('/users/email', data);
}

export async function updatePassword(data) {
  return axiosClient.put('/users/password', data);
}

export async function deleteAccount() {
  return axiosClient.delete('/users/profile');
}

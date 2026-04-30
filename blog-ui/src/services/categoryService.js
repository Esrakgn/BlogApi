import axiosClient from '../api/axiosClient';

export async function getCategories() {
  return axiosClient.get('/categories');
}

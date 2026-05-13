import axiosClient from '../api/axiosClient';

export async function getCategories() {
  return axiosClient.get('/categories');
}

export async function createCategory(data) {
  return axiosClient.post('/categories', data);
}

export async function deleteCategory(id) {
  return axiosClient.delete(`/categories/${id}`);
}

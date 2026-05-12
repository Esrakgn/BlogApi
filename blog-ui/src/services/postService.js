import axiosClient from '../api/axiosClient';

export async function getPosts(params) {
  return axiosClient.get('/posts', { params });
}

export async function getMyPosts(params) {
  return axiosClient.get('/posts/my', { params });
}

export async function getPostById(id) {
  return axiosClient.get(`/posts/${id}`);
}

export async function createPost(data) {
  return axiosClient.post('/posts', data);
}

export async function updatePost(id, data) {
  return axiosClient.put(`/posts/${id}`, data);
}

export async function deletePost(id) {
  return axiosClient.delete(`/posts/${id}`);
}

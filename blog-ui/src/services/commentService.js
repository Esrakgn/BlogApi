import axiosClient from '../api/axiosClient';

export async function getCommentsByPostId(postId) {
  return axiosClient.get(`/posts/${postId}/comments`);
}

export async function createComment(postId, data) {
  return axiosClient.post(`/posts/${postId}/comments`, data);
}

export async function updateComment(id, data) {
  return axiosClient.put(`/comments/${id}`, data);
}

export async function deleteComment(id) {
  return axiosClient.delete(`/comments/${id}`);
}

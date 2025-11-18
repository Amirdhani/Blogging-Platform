import api from './api';

const commentService = {
  getComments: async (blogId) => {
    const response = await api.get(`/comments/${blogId}`);
    return response.data;
  },

  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  likeComment: async (id) => {
    const response = await api.put(`/comments/${id}/like`);
    return response.data;
  },

  replyToComment: async (id, replyData) => {
    const response = await api.post(`/comments/${id}/reply`, replyData);
    return response.data;
  },
};

export default commentService;
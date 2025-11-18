import api from './api';

const blogService = {
  getBlogs: async (params) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  getBlog: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  likeBlog: async (id) => {
    const response = await api.put(`/blogs/${id}/like`);
    return response.data;
  },

  getMyBlogs: async (params) => {
    const response = await api.get('/blogs/my-blogs', { params });
    return response.data;
  },

  incrementViews: async (id) => {
    const response = await api.put(`/blogs/${id}/view`);
    return response.data;
  },

};

export default blogService;
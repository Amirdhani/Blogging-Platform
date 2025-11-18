import api from './api';

const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllBlogs: async (params) => {
    const response = await api.get('/admin/blogs', { params });
    return response.data;
  },

  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`/admin/users/${id}/toggle-status`);
    return response.data;
  },
};

export default adminService;

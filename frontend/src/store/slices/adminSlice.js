import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

const initialState = {
  stats: null,
  blogs: [],
  users: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
};

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getDashboardStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Get all blogs(admin)
export const getAllBlogs = createAsyncThunk(
  'admin/getAllBlogs',
  async (params, { rejectWithValue }) => {
    try {
      const data = await adminService.getAllBlogs(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Get all users (admin)
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await adminService.getAllUsers(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Delete blog (admin)
export const deleteBlogAdmin = createAsyncThunk(
  'admin/deleteBlogAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteBlog(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async (id, { rejectWithValue }) => {
    try {
      const data = await adminService.toggleUserStatus(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || {};

        state.stats.popularBlogs = action.payload.popularBlogs || [];
        state.stats.recentBlogs = action.payload.recentBlogs || [];
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all blogs
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload.blogs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      // Get all users
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      // Delete blog
      .addCase(deleteBlogAdmin.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      })
      // Toggle user status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
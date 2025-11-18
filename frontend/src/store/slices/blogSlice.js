import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../../services/blogService';

const initialState = {
  blogs: [],
  blog: null,
  myBlogs: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  filters: {
    search: '',
    category: '',
    tags: '',
    page: 1
  }
};

// Get all blogs
export const getBlogs = createAsyncThunk(
  'blog/getBlogs',
  async (params, { rejectWithValue }) => {
    try {
      const data = await blogService.getBlogs(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Get single blog
export const getBlog = createAsyncThunk(
  'blog/getBlog',
  async (id, { rejectWithValue }) => {
    try {
      const data = await blogService.getBlog(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Increment views
export const incrementBlogViews = createAsyncThunk(
  'blog/incrementViews',
  async (id, { rejectWithValue }) => {
    try {
      const data = await blogService.incrementViews(id);
      return { id, views: data.views };
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);


// Create blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const data = await blogService.createBlog(blogData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const data = await blogService.updateBlog(id, blogData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Like blog
export const likeBlog = createAsyncThunk(
  'blog/likeBlog',
  async (id, { rejectWithValue }) => {
    try {
      const data = await blogService.likeBlog(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Get my blogs
export const getMyBlogs = createAsyncThunk(
  'blog/getMyBlogs',
  async (params, { rejectWithValue }) => {
    try {
      const data = await blogService.getMyBlogs(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);


const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBlog: (state) => {
      state.blog = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        tags: '',
        page: 1
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get blogs
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get single blog
      .addCase(getBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload.blog;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload.blog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog._id === action.payload.blog._id);
        if (index !== -1) {
          state.blogs[index] = action.payload.blog;
        }
        if (state.blog && state.blog._id === action.payload.blog._id) {
          state.blog = action.payload.blog;
        }
      })
      // Delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.myBlogs = state.myBlogs.filter(blog => blog._id !== action.payload);
      })
      // Like blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        const { id, likes, isLiked } = action.payload;
        
        // Update in blogs array
        const blogIndex = state.blogs.findIndex(blog => blog._id === id);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].likes = Array.from({ length: likes }, (_, i) => ({ user: i }));
        }
        
        // Update current blog if viewing
        if (state.blog && state.blog._id === id) {
          state.blog.likes = Array.from({ length: likes }, (_, i) => ({ user: i }));
        }
      })
      // Get my blogs
      .addCase(getMyBlogs.fulfilled, (state, action) => {
        state.myBlogs = action.payload.blogs;
      })
      // Increment views
      .addCase(incrementBlogViews.fulfilled, (state, action) => {
        const { id, views } = action.payload;

        // update in blogs list
        const blogIndex = state.blogs.findIndex(blog => blog._id === id);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].views = views;
        }

        // update current blog
        if (state.blog && state.blog._id === id) {
          state.blog.views = views;
        }
      })

  },
});

export const { clearError, clearBlog, setFilters, resetFilters } = blogSlice.actions;
export default blogSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/commentService';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// Get comments
export const getComments = createAsyncThunk(
  'comment/getComments',
  async (blogId, { rejectWithValue }) => {
    try {
      const data = await commentService.getComments(blogId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Create comment
export const createComment = createAsyncThunk(
  'comment/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const data = await commentService.createComment(commentData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const data = await commentService.updateComment(id, { content });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (id, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Like comment
export const likeComment = createAsyncThunk(
  'comment/likeComment',
  async (id, { rejectWithValue }) => {
    try {
      const data = await commentService.likeComment(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Reply to comment
export const replyToComment = createAsyncThunk(
  'comment/replyToComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const data = await commentService.replyToComment(id, { content });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload.comment);
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload.comment._id);
        if (index !== -1) {
          state.comments[index] = action.payload.comment;
        }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload);
      })
      // Like comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const { id, likes, isLiked } = action.payload;
        const commentIndex = state.comments.findIndex(comment => comment._id === id);
        if (commentIndex !== -1) {
          state.comments[commentIndex].likes = Array.from({ length: likes }, (_, i) => ({ user: i }));
        }
      })
      // Reply to comment
      .addCase(replyToComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload.comment._id);
        if (index !== -1) {
          state.comments[index] = action.payload.comment;
        }
      });
  },
});

export const { clearError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
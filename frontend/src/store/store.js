import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import blogReducer from './slices/blogSlice';
import commentReducer from './slices/commentSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    comment: commentReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
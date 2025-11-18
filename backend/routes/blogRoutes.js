import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getMyBlogs,
  incrementBlogViews
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.get('/my-blogs', protect, getMyBlogs);

router.route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);
  

router.put('/:id/like', protect, likeBlog);

router.put('/:id/view', incrementBlogViews);


export default router;
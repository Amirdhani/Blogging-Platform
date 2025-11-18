import express from 'express';
import {
  getAllBlogs,
  getAllUsers,
  deleteBlogAdmin,
  toggleUserStatus,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/blogs', getAllBlogs);
router.get('/users', getAllUsers);
router.delete('/blogs/:id', deleteBlogAdmin);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;
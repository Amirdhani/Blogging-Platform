import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  replyToComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/:blogId')
  .get(getComments);

router.route('/')
  .post(protect, createComment);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.put('/:id/like', protect, likeComment);
router.post('/:id/reply', protect, replyToComment);

export default router;
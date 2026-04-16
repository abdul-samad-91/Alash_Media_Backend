import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.post('/', protect, authorize('admin', 'editor'), createBlog);
router.put('/:id', protect, authorize('admin', 'editor'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

export default router;

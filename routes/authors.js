import express from 'express';
import {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  getAuthorBySlug,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.get('/slug/:slug', getAuthorBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), createAuthor);
router.put('/:id', protect, authorize('admin'), updateAuthor);
router.delete('/:id', protect, authorize('admin'), deleteAuthor);

export default router;

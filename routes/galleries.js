import express from 'express';
import {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  addGalleryItem,
  removeGalleryItem,
  updateGalleryItem,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllGalleries);
router.get('/:id', getGalleryById);

// Admin routes
router.post('/', protect, authorize('admin'), createGallery);
router.put('/:id', protect, authorize('admin'), updateGallery);
router.delete('/:id', protect, authorize('admin'), deleteGallery);

// Gallery items management
router.post('/:id/items', protect, authorize('admin'), addGalleryItem);
router.put('/:id/items/:itemId', protect, authorize('admin'), updateGalleryItem);
router.delete('/:id/items/:itemId', protect, authorize('admin'), removeGalleryItem);

export default router;

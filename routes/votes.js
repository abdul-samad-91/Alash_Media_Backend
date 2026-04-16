import express from 'express';
import {
  createVote,
  getAllVotes,
  getVoteById,
  updateVote,
  deleteVote,
  castVote,
} from '../controllers/voteController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllVotes);
router.get('/:id', getVoteById);
router.post('/:id/cast', castVote);

// Admin routes
router.post('/', protect, authorize('admin'), createVote);
router.put('/:id', protect, authorize('admin'), updateVote);
router.delete('/:id', protect, authorize('admin'), deleteVote);

export default router;

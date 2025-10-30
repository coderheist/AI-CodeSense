import express from 'express';
import {
  saveReview,
  getUserHistory,
  getReviewById,
  deleteReview,
  registerUser,
  getUserStats,
} from '../controllers/userController.js';
import { verifyToken } from '../config/firebaseAdmin.js';

const router = express.Router();

// User Routes
router.post('/register', registerUser);
router.post('/save', saveReview);
router.get('/history/:userId', getUserHistory);
router.get('/review/:reviewId', getReviewById);
router.delete('/review/:reviewId', deleteReview);
router.get('/stats/:userId', getUserStats);

// Protected route example (uncomment to enable auth)
// router.post('/save', verifyToken, saveReview);

export default router;

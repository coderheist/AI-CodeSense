import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['review', 'testgen', 'summary', 'chat'],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  metadata: {
    linesOfCode: Number,
    complexity: String,
    duration: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
reviewSchema.index({ userId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

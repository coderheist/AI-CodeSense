import User from '../models/User.js';
import Review from '../models/Review.js';

// POST /api/user/save
export const saveReview = async (req, res) => {
  try {
    const { userId, type, language, code, aiResponse, metadata } = req.body;

    if (!userId || !type || !language || !code || !aiResponse) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const review = new Review({
      userId,
      type,
      language,
      code,
      aiResponse,
      metadata,
    });

    await review.save();

    res.json({
      success: true,
      message: 'Review saved successfully',
      reviewId: review._id,
    });
  } catch (error) {
    console.error('Save review error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/user/history/:userId
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, limit = 20, page = 1 } = req.query;

    const query = { userId };
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-code'); // Exclude full code for performance

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/user/review/:reviewId
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/user/review/:reviewId
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      return res.json({ success: true, user, isNew: false });
    }

    // Create new user
    user = new User({
      firebaseUid,
      email,
      displayName,
      photoURL,
    });

    await user.save();

    res.status(201).json({
      success: true,
      user,
      isNew: true,
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/user/stats/:userId
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Review.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Review.countDocuments({ userId });

    const statsByType = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        total,
        byType: statsByType,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

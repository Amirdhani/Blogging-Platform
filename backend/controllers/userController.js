import User from '../models/User.js';
import Blog from '../models/Blog.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'blogs',
        select: 'title excerpt createdAt views likes category',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blogCount = await Blog.countDocuments({ author: user._id, isPublished: true });
    const totalViews = await Blog.aggregate([
      { $match: { author: user._id, isPublished: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalLikes = await Blog.aggregate([
      { $match: { author: user._id, isPublished: true } },
      { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
    ]);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        stats: {
          blogCount,
          totalViews: totalViews[0]?.totalViews || 0,
          totalLikes: totalLikes[0]?.totalLikes || 0
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
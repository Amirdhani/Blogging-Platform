import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get popular blogs
    const popularBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ views: -1, 'likes.length': -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalComments,
        activeUsers
      },
      recentBlogs,
      popularBlogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all blogs for admin
// @route   GET /api/admin/blogs
// @access  Private/Admin
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('blogs', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete blog (Admin)
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
export const deleteBlogAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete image from cloudinary if exists
    if (blog.image) {
      const publicId = blog.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`blog-images/${publicId}`);
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });

    // Remove blog from user's blogs array
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id, likedBlogs: blog._id }
    });

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, category, search, tags, author, sortBy = 'createdAt:desc' } = req.query;
    const query = { isPublished: true };

    // Add filters
    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (author) {
      query.author = author;
    }

    // Parse sort option (e.g. "views:desc", "likes:desc", "comments:desc")
    let sort = { createdAt: -1 }; // fallback
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sort = { [field]: order === 'asc' ? 1 : -1 };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('comments')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

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

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
// @desc    Get single blog (without incrementing views)
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Increment blog views
// @route   PUT /api/blogs/:id/view
// @access  Public
export const incrementBlogViews = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      views: blog.views
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image } = req.body;

    let imageUrl = '';
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'blog-images',
        transformation: [
          { width: 800, height: 450, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
      imageUrl = result.secure_url;
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image: imageUrl,
      author: req.user.id
    });

    const createdBlog = await blog.save();

    // Add blog to user's blogs array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { blogs: createdBlog._id }
    });

    const populatedBlog = await Blog.findById(createdBlog._id)
      .populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      blog: populatedBlog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check user authorization
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, excerpt, category, tags, image } = req.body;

    let imageUrl = blog.image;
    if (image && image !== blog.image) {
      // Delete old image from cloudinary if exists
      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`blog-images/${publicId}`);
      }

      const result = await cloudinary.uploader.upload(image, {
        folder: 'blog-images',
        transformation: [
          { width: 800, height: 450, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
      imageUrl = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title || blog.title,
        content: content || blog.content,
        excerpt: excerpt || blog.excerpt,
        category: category || blog.category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : blog.tags,
        image: imageUrl
      },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({
      success: true,
      blog: updatedBlog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check user authorization
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
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

// @desc    Like/Unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const isLiked = blog.likes.find(like => like.user.toString() === req.user.id);

    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter(like => like.user.toString() !== req.user.id);
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { likedBlogs: blog._id }
      });
    } else {
      // Like
      blog.likes.push({ user: req.user.id });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { likedBlogs: blog._id }
      });
    }

    await blog.save();

    res.json({
      success: true,
      likes: blog.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
export const getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Blog.countDocuments({ author: req.user.id });

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
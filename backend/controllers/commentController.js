import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'name avatar')
      .populate('replies.author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { content, blogId } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      blog: blogId
    });

    const createdComment = await comment.save();

    // Add comment to blog
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: createdComment._id }
    });

    const populatedComment = await Comment.findById(createdComment._id)
      .populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check user authorization
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { content } = req.body;

    comment.content = content;
    comment.isEdited = true;

    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('author', 'name avatar');

    res.json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check user authorization
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove comment from blog
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: comment._id }
    });

    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike comment
// @route   PUT /api/comments/:id/like
// @access  Private
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isLiked = comment.likes.find(like => like.user.toString() === req.user.id);

    if (isLiked) {
      comment.likes = comment.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      comment.likes.push({ user: req.user.id });
    }

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reply to comment
// @route   POST /api/comments/:id/reply
// @access  Private
export const replyToComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const { content } = req.body;

    const reply = {
      content,
      author: req.user.id,
      createdAt: new Date()
    };

    comment.replies.push(reply);
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar')
      .populate('replies.author', 'name avatar');

    res.json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
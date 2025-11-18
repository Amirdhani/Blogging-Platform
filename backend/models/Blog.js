import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment', 'Sports', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  readTime: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(' ').length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Create index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
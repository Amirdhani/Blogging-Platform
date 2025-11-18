import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import moment from 'moment';
import toast from 'react-hot-toast';
import {
  FiCalendar,
  FiUser,
  FiHeart,
  FiMessageCircle,
  FiEye,
  FiClock,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiBookmark
} from 'react-icons/fi';

import { getBlog, likeBlog, deleteBlog, clearBlog, incrementBlogViews } from '../../store/slices/blogSlice';
import { getComments } from '../../store/slices/commentSlice';
import Loader from '../common/Loader';
import CommentList from '../comment/CommentList';
import CommentForm from '../comment/CommentForm';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const fetched = useRef(false);

  const { blog, loading, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!fetched.current && id) {
      // 1. First fetch blog details
      dispatch(getBlog(id)).then(() => {
        console.log('Incrementing views for:', id);
        // 2. Then increment views
        dispatch(incrementBlogViews(id));
      });

      // 3. Fetch comments
      dispatch(getComments(id));
      
      fetched.current = true;
    }

    return () => {
      dispatch(clearBlog());
    };
  }, [dispatch, id]);


  useEffect(() => {
    if (blog && user) {
      setIsLiked(blog.likes?.some(like => like.user === user._id) || false);
    }
  }, [blog, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this blog');
      navigate('/login');
      return;
    }

    try {
      const result = await dispatch(likeBlog(id)).unwrap();
      setIsLiked(result.isLiked);
      toast.success(result.isLiked ? 'Blog liked!' : 'Blog unliked!');
    } catch (error) {
      toast.error('Failed to like blog');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await dispatch(deleteBlog(id)).unwrap();
        toast.success('Blog deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  const isAuthor = user && blog.author._id === user._id;
  const canEdit = isAuthor || (user && user.role === 'admin');

  return (
    <>
      <Helmet>
        <title>{blog.title} - BlogHub</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Category and Actions */}
          <div className="flex items-center justify-between mb-4">
            <span className="badge-primary">{blog.category}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Share"
              >
                <FiShare2 />
              </button>
              
              {user && (
                <button
                  onClick={() => toast.success('Bookmarked!')}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  title="Bookmark"
                >
                  <FiBookmark />
                </button>
              )}

              {canEdit && (
                <>
                  <Link
                    to={`/edit-blog/${blog._id}`}
                    className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                    title="Edit"
                  >
                    <FiEdit />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <img
                src={blog.author.avatar || `https://ui-avatars.com/api/?name=${blog.author.name}&background=3b82f6&color=fff`}
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <Link
                  to={`/profile/${blog.author._id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {blog.author.name}
                </Link>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>

            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              {moment(blog.createdAt).format('MMMM DD, YYYY')}
            </div>

            <div className="flex items-center">
              <FiClock className="mr-1" />
              {blog.readTime} min read
            </div>

            <div className="flex items-center">
              <FiEye className="mr-1" />
              {blog.views} views
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(blog.content) 
          }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    // Handle tag click to filter blogs
                    navigate(`/?tags=${tag}`);
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Section */}
        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <FiHeart className={isLiked ? 'fill-current' : ''} />
                <span>{blog.likes?.length || 0}</span>
                <span className="hidden sm:inline">
                  {blog.likes?.length === 1 ? 'Like' : 'Likes'}
                </span>
              </button>

              <div className="flex items-center space-x-2 text-gray-600">
                <FiMessageCircle />
                <span>{blog.comments?.length || 0}</span>
                <span className="hidden sm:inline">
                  {blog.comments?.length === 1 ? 'Comment' : 'Comments'}
                </span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="btn-outline flex items-center space-x-2"
            >
              <FiShare2 />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <img
              src={blog.author.avatar || `https://ui-avatars.com/api/?name=${blog.author.name}&background=3b82f6&color=fff`}
              alt={blog.author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {blog.author.name}
              </h3>
              <p className="text-gray-600 mb-3">
                {blog.author.bio || 'A passionate writer sharing insights and stories.'}
              </p>
              <Link
                to={`/profile/${blog.author._id}`}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({blog.comments?.length || 0})
          </h2>
          
          {user ? (
            <CommentForm blogId={blog._id} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">Please login to leave a comment</p>
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            </div>
          )}
          
          <CommentList />
        </div>
      </article>
    </>
  );
};

export default BlogDetail;
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiHeart, FiMessageCircle, FiEye, FiClock } from 'react-icons/fi';
import moment from 'moment';

const BlogCard = ({ blog }) => {
  const {
    _id,
    title,
    excerpt,
    author,
    createdAt,
    image,
    category,
    tags,
    likes,
    comments,
    views,
    readTime
  } = blog;

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <article className="hover:shadow-lg transition-shadow duration-300 group rounded-2xl overflow-hidden">
      {/* Image */}
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="card-body">
        {/* Category and Tags */}
        <div className="flex items-center justify-between mb-3">
          <span className="badge-primary ml-1">{category}</span>
          <span className="text-xs text-gray-500 flex items-center mr-1">
            <FiClock className="mr-1" />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 ml-1">
          <Link to={`/blog/${_id}`}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-600 mb-4 ml-1 mr-1 line-clamp-3">
            {truncateText(excerpt)}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 ml-1 bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs ml-1 text-gray-500">+{tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center mb-4 ml-1">
          <img
            src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.name}&background=3b82f6&color=fff`}
            alt={author?.name}
            className="w-8 h-8 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{author?.name}</p>
            <p className="text-xs text-gray-500 flex items-center">
              <FiCalendar className="mr-1" />
              {moment(createdAt).format('MMM DD, YYYY')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 pb-2 ml-1 border-t border-gray-400">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FiHeart className="mr-1" />
              {likes?.length || 0}
            </span>
            <span className="flex items-center">
              <FiMessageCircle className="mr-1" />
              {comments?.length || 0}
            </span>
            <span className="flex items-center">
              <FiEye className="mr-1" />
              {views || 0}
            </span>
          </div>
          
          <Link
            to={`/blog/${_id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm mr-2"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
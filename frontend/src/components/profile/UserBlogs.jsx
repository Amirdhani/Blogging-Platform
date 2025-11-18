import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FiEdit, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';
import Loader from '../common/Loader';

const UserBlogs = () => {
  const { myBlogs, loading } = useSelector((state) => state.blog);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          My Blogs ({myBlogs.length})
        </h2>
      </div>

      {myBlogs.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiEdit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No blogs yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start sharing your thoughts and ideas with the world.
          </p>
          <Link
            to="/create-blog"
            className="btn-primary"
          >
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {myBlogs.map((blog) => (
            <div key={blog._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {blog.category}
                    </span>
                    {blog.isPublished ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    <Link 
                      to={`/blog/${blog._id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </h3>

                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiEye className="mr-1" size={14} />
                      {blog.views || 0}
                    </span>
                    <span className="flex items-center">
                      <FiHeart className="mr-1" size={14} />
                      {blog.likes?.length || 0}
                    </span>
                    <span className="flex items-center">
                      <FiMessageCircle className="mr-1" size={14} />
                      {blog.comments?.length || 0}
                    </span>
                    <span>
                      {moment(blog.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <Link
                    to={`/edit-blog/${blog._id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                    title="Edit blog"
                  >
                    <FiEdit size={16} />
                  </Link>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {blog.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{blog.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs;
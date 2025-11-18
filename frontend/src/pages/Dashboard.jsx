import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBlogs } from '../store/slices/blogSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import moment from 'moment';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { myBlogs, loading } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyBlogs());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <Link to="/create-blog" className="btn-primary flex items-center gap-2">
          <FiPlus />
          New Blog
        </Link>
      </div>

      {/* User stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-50 rounded-lg p-6 text-primary-800">
          <p className="text-xs font-semibold uppercase mb-2">Total Blogs</p>
          <p className="text-2xl font-bold">{myBlogs.length}</p>
        </div>
        <div className="bg-primary-50 rounded-lg p-6 text-primary-800">
          <p className="text-xs font-semibold uppercase mb-2">Total Likes</p>
          <p className="text-2xl font-bold">
            {myBlogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-primary-50 rounded-lg p-6 text-primary-800">
          <p className="text-xs font-semibold uppercase mb-2">Profile</p>
          <p className="text-2xl font-bold">{user?.name}</p>
        </div>
      </div>

      {/* Blog table/list */}
      {loading ? (
        <Loader size="large" />
      ) : (
        <>
          {myBlogs.length === 0 ? (
            <div className="text-center text-gray-500 pt-16">
              <p>You haven’t written any blog posts yet!</p>
              <Link to="/create-blog" className="btn-primary mt-4 inline-block">
                Start Writing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-white rounded-lg shadow-sm">
                <thead className="bg-primary-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left text-gray-700 hidden md:table-cell">Created</th>
                    <th className="px-4 py-3 text-left text-gray-700">Views</th>
                    <th className="px-4 py-3 text-left text-gray-700 hidden md:table-cell">Likes</th>
                    <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBlogs.map((blog) => (
                    <tr key={blog._id} className="border-b hover:bg-primary-50 transition">
                      <td className="px-4 py-3">
                        <Link to={`/blog/${blog._id}`} className="font-semibold text-primary-700 hover:underline">
                          {blog.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {moment(blog.createdAt).format('YYYY-MM-DD')}
                      </td>
                      <td className="px-4 py-3">{blog.views || 0}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{blog.likes?.length || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/edit-blog/${blog._id}`}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded"
                            title="Edit"
                          >
                            <FiEdit />
                          </Link>
                          {/* Ideally handleDelete would be here */}
                          <button
                            className="text-red-600 hover:text-red-800 p-2 rounded"
                            title="Delete"
                            onClick={() => toast.error('Delete action not yet implemented')}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
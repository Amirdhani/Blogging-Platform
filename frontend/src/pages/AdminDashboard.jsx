import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDashboardStats,
  getAllUsers,
  getAllBlogs,
  deleteBlogAdmin,
  toggleUserStatus
} from '../store/slices/adminSlice';
import Loader from '../components/common/Loader';
import { FiUsers, FiFileText, FiMessageCircle, FiEye, FiTrendingUp, FiEdit, FiTrash2, FiCheckCircle, FiXCircle, FiLock, FiUnlock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import moment from 'moment';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, users, blogs, loading } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getAllUsers());
    dispatch(getAllBlogs());
  }, [dispatch]);

  // Actions
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await dispatch(deleteBlogAdmin(id)).unwrap();
        toast.success('Blog deleted');
      } catch {
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleToggleUserStatus = async (id) => {
    try {
      await dispatch(toggleUserStatus(id)).unwrap();
      toast.success('User status updated');
    } catch {
      toast.error('Failed to update user');
    }
  };

  // Stats Cards...
  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="flex items-center bg-white shadow rounded-lg p-5">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        <Icon size={28} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-gray-600">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="mb-4 flex space-x-4">
        <button onClick={() => setActiveTab('stats')} className={`btn-outline ${activeTab==='stats' ? 'border-primary-600 text-primary-700' : ''}`}>Statistics</button>
        <button onClick={() => setActiveTab('users')} className={`btn-outline ${activeTab==='users' ? 'border-primary-600 text-primary-700' : ''}`}>Users</button>
        <button onClick={() => setActiveTab('blogs')} className={`btn-outline ${activeTab==='blogs' ? 'border-primary-600 text-primary-700' : ''}`}>Blogs</button>
      </div>

      {/* Loading*/}
      {loading && <Loader size="large" />}

      {/* Statistics */}
      {activeTab === 'stats' && stats && (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard icon={FiUsers} value={stats.totalUsers} label="Users" color="bg-blue-100 text-blue-600" />
            <StatCard icon={FiFileText} value={stats.totalBlogs} label="Blogs" color="bg-green-100 text-green-600" />
            <StatCard icon={FiMessageCircle} value={stats.totalComments} label="Comments" color="bg-purple-100 text-purple-600" />
            <StatCard icon={FiCheckCircle} value={stats.activeUsers} label="Active Users" color="bg-yellow-100 text-yellow-700" />
          </div>

          <div className="md:flex md:space-x-8">
            <div className="flex-1 mb-6 md:mb-0">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <FiTrendingUp className="mr-2" /> Popular Blogs
              </h2>
              <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.popularBlogs || []).map(blog => (
                      <tr key={blog._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{blog.title}</td>
                        <td className="p-3 text-right">{blog.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <FiEdit className="mr-2" /> Recent Blogs
              </h2>
              <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-right">Author</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.recentBlogs || []).map(blog => (
                      <tr key={blog._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{blog.title}</td>
                        <td className="p-3 text-right">{blog.author?.name || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow mb-12">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-primary-50">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Blogs</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`} alt={user.name} className="w-8 h-8 rounded-full" />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.blogs?.length || 0}</td>
                    <td className="p-3">
                      {user.isActive
                        ? <span className="inline-flex items-center text-green-700"><FiCheckCircle className="mr-1" />Active</span>
                        : <span className="inline-flex items-center text-red-600"><FiXCircle className="mr-1" />Inactive</span>
                      }
                    </td>
                    <td className="p-3">{moment(user.createdAt).format('YYYY-MM-DD')}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleUserStatus(user._id)}
                        className={`btn-outline p-1 rounded ${user.isActive ? 'hover:bg-red-50 text-red-600' : 'hover:bg-green-50 text-green-700'}`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive ? <FiLock /> : <FiUnlock />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blogs */}
      {activeTab === 'blogs' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Blogs ({blogs.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-primary-50">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Author</th>
                  <th className="p-3 text-right">Views</th>
                  <th className="p-3 text-right">Likes</th>
                  <th className="p-3 text-right">Comments</th>
                  <th className="p-3 text-right">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <span>{blog.title}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.name}&background=3b82f6&color=fff`} alt={blog.author?.name} className="w-7 h-7 rounded-full" />
                        <span>{blog.author?.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{blog.views}</td>
                    <td className="p-3 text-right">{blog.likes?.length || 0}</td>
                    <td className="p-3 text-right">{blog.comments?.length || 0}</td>
                    <td className="p-3 text-right">{moment(blog.createdAt).format('YYYY-MM-DD')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="btn-danger p-1 text-sm rounded hover:bg-red-100 hover:text-red-700"
                        title="Delete Blog"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
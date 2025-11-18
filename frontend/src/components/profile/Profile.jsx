import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiEdit2, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiMapPin,
  FiLink,
  FiSave,
  FiX,
  FiCamera,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiGithub
} from 'react-icons/fi';
import moment from 'moment';
import toast from 'react-hot-toast';

import { updateProfile } from '../../store/slices/authSlice';
import { getMyBlogs } from '../../store/slices/blogSlice';
import UserBlogs from './UserBlogs';
import Loader from '../common/Loader';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBlogs, loading } = useSelector((state) => state.blog);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    avatar: '',
    location: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    github: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Check if viewing own profile or another user's profile
  const isOwnProfile = !userId || (userId === user?._id);

  useEffect(() => {
    if (user && isOwnProfile) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.socialLinks?.twitter || '',
        facebook: user.socialLinks?.facebook || '',
        instagram: user.socialLinks?.instagram || '',
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user, isOwnProfile]);

  useEffect(() => {
    if (isOwnProfile) {
      dispatch(getMyBlogs());
    }
  }, [dispatch, isOwnProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarFile(reader.result);
      setAvatarPreview(reader.result);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
        avatar: avatarFile || profileData.avatar,
        location: profileData.location,
        website: profileData.website,
        socialLinks: {
          twitter: profileData.twitter,
          facebook: profileData.facebook,
          instagram: profileData.instagram,
          linkedin: profileData.linkedin,
          github: profileData.github
        }
      };

      await dispatch(updateProfile(updateData)).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.socialLinks?.twitter || '',
        facebook: user.socialLinks?.facebook || '',
        instagram: user.socialLinks?.instagram || '',
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || ''
      });
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
    }
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getSocialIcon = (platform) => {
    const icons = {
      twitter: FiTwitter,
      facebook: FiFacebook,
      instagram: FiInstagram,
      linkedin: FiLinkedin,
      github: FiGithub
    };
    return icons[platform] || FiLink;
  };

  const getSocialColor = (platform) => {
    const colors = {
      twitter: 'text-blue-400 hover:text-blue-500',
      facebook: 'text-blue-600 hover:text-blue-700',
      instagram: 'text-pink-500 hover:text-pink-600',
      linkedin: 'text-blue-700 hover:text-blue-800',
      github: 'text-gray-700 hover:text-gray-800'
    };
    return colors[platform] || 'text-gray-600 hover:text-gray-700';
  };

  const formatSocialUrl = (platform, username) => {
    if (!username) return '';
    
    const baseUrls = {
      twitter: 'https://twitter.com/',
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/',
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/'
    };

    // If already a full URL, return as is
    if (username.startsWith('http')) return username;
    
    // Remove @ symbol if present
    const cleanUsername = username.replace('@', '');
    
    return baseUrls[platform] + cleanUsername;
  };

  const profileStats = {
    totalBlogs: myBlogs?.length || 0,
    totalViews: myBlogs?.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0,
    totalLikes: myBlogs?.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0) || 0,
    memberSince: user?.createdAt
  };

  if (!user && isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{profileData.name || 'User'} - Profile | BlogHub</title>
        <meta name="description" content={profileData.bio || `${profileData.name}'s profile on BlogHub`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Cover/Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-48 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6 md:mb-0">
                <div className="relative mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={profileData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-32 h-32 rounded-full ${getRandomColor()} text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md`}
                    >
                      {getInitials(profileData.name)}
                    </div>
                  )}

                  {/* Camera icon (edit mode only) */}
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                      <FiCamera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Edit/Save buttons */}
                {isOwnProfile && (
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-green-700 transition"
                        >
                          <FiSave size={16} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-red-700 transition"
                        >
                          <FiX size={16} />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-outline flex items-center space-x-1"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-field"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Your location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={profileData.website}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Links
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['twitter', 'linkedin', 'github', 'instagram'].map((platform) => (
                          <div key={platform}>
                            <label className="block text-xs text-gray-600 mb-1 capitalize">
                              {platform}
                            </label>
                            <input
                              type="text"
                              name={platform}
                              value={profileData[platform]}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder={`@your${platform}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profileData.name || 'Anonymous User'}
                    </h1>
                    
                    {user?.email && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <FiMail className="mr-2" size={16} />
                        <span>{user.email}</span>
                      </div>
                    )}

                    {profileData.location && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <FiMapPin className="mr-2" size={16} />
                        <span>{profileData.location}</span>
                      </div>
                    )}

                    {profileStats.memberSince && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <FiCalendar className="mr-2" size={16} />
                        <span>Member since {moment(profileStats.memberSince).format('MMMM YYYY')}</span>
                      </div>
                    )}

                    {profileData.bio && (
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {profileData.bio}
                      </p>
                    )}

                    {/* Website Link */}
                    {profileData.website && (
                      <div className="mb-4">
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700"
                        >
                          <FiLink className="mr-1" size={16} />
                          {profileData.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex space-x-4">
                      {['twitter', 'facebook', 'instagram', 'linkedin', 'github'].map((platform) => {
                        const username = profileData[platform];
                        if (!username) return null;

                        const IconComponent = getSocialIcon(platform);
                        const colorClass = getSocialColor(platform);
                        const url = formatSocialUrl(platform, username);

                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${colorClass} transition-colors`}
                            title={`${platform}: ${username}`}
                          >
                            <IconComponent size={20} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Section */}
            {!isEditing && isOwnProfile && (
              <div className="border-t pt-6 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary-600">
                      {profileStats.totalBlogs}
                    </div>
                    <div className="text-sm text-gray-600">
                      {profileStats.totalBlogs === 1 ? 'Blog' : 'Blogs'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {profileStats.totalViews}
                    </div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {profileStats.totalLikes}
                    </div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {user?.role === 'admin' ? 'Admin' : 'Writer'}
                    </div>
                    <div className="text-sm text-gray-600">Role</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User's Blogs */}
          {isOwnProfile && <UserBlogs />}
        </div>
      </div>
    </>
  );
};

export default Profile;
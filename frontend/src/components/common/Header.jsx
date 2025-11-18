import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiHome, 
  FiUser, 
  FiEdit3, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiSettings,
  FiBookOpen
} from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = "", onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      } ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiEdit3 className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                BlogHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/">
              <FiHome className="text-lg inline mr-1 -mt-1" />
              Home
            </NavLink>
            
            {user && (
              <>
                <NavLink to="/dashboard">
                  <FiUser className="inline mr-1" />
                  Dashboard
                </NavLink>
                <NavLink to="/create-blog">
                  <FiEdit3 className="inline mr-1" />
                  Write
                </NavLink>
              </>
            )}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <button
                onClick={() => {
                  const el = document.getElementById("latest");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative ms-10 px-5 py-3 pl-9 border-2 border-white rounded-lg font-semibold 
                          text-black bg-purple hover:bg-purple-500 hover:text-white transition-colors"
              >
                <FiBookOpen
                  className="absolute left-3 mt-3.5 -translate-y-1/2 text-gray-900 
                            transition-colors duration-200 group-hover:text-white"
                />
                Click here to see latest blogs...
              </button>
            </div>
          </div>


          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                    alt={user.name}
                  />
                  <span className="hidden md:block text-gray-700 font-medium">
                    {user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="mr-3" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiEdit3 className="mr-3" />
                        My Blogs
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiSettings className="mr-3" />
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Search Bar (Mobile) */}
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="block">
                <FiHome className="inline mr-2" />
                Home
              </NavLink>
              
              {user ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block">
                    <FiUser className="inline mr-2" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/create-blog" onClick={() => setIsMenuOpen(false)} className="block">
                    <FiEdit3 className="inline mr-2" />
                    Write Blog
                  </NavLink>
                  <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className="block">
                    <FiUser className="inline mr-2" />
                    Profile
                  </NavLink>
                  {user.role === 'admin' && (
                    <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className="block">
                      <FiSettings className="inline mr-2" />
                      Admin Panel
                    </NavLink>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block btn-primary w-full text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isProfileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
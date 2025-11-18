import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { login, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - BlogHub</title>
        <meta name="description" content="Login to your BlogHub account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="border rounded-2xl max-w-md w-full space-y-8 -mt-40">
          <div>
            <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiMail className="text-white text-xl" />
            </div>
            <h2 className="mt-1 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              or{' '}
              <br />
              <Link
                to="/register"
                className="font-medium text-black hover:text-purple-500"
              >
                Create a new account
              </Link>
            </p>
          </div>

          <form className="mt-4 space-y-6 ms-10 md:ms-17" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="px-3 py-2 pl-10 w-65 md:w-80 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="px-3 py-2 pl-10 w-65 md:w-80 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-5 md:right-15 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-center pb-8 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-44 flex justify-center items-center border rounded-4xl py-3 mr-14 bg-purple-300 text-black font-semibold hover:bg-purple-500 hover:text-white transition"
              >
                {loading ? <Loader size="small" color="#fff" /> : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
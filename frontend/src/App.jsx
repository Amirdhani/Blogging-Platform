import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './components/blog/BlogDetail';
import Profile from './components/profile/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Redux
import { getCurrentUser } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route 
                path="/login" 
                element={!user ? <Login /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/register" 
                element={!user ? <Register /> : <Navigate to="/dashboard" />} 
              />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/create-blog" element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } />
              <Route path="/edit-blog/:id" element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <button 
                      onClick={() => window.history.back()}
                      className="btn-primary"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </Router>
    </HelmetProvider>
  );
};

export default App;
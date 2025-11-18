import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiEdit3, FiTrendingUp, FiUsers, FiStar } from 'react-icons/fi';
import BlogList from '../components/blog/BlogList';
import SearchFilter from '../components/blog/SearchFilter';
import { getBlogs } from '../store/slices/blogSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getBlogs({ page: 1, limit: 6 }));
  }, [dispatch]);

  const features = [
    {
      icon: <FiEdit3 className="h-8 w-8" />,
      title: 'Rich Text Editor',
      description: 'Write with our powerful editor featuring formatting, images, and more.'
    },
    {
      icon: <FiUsers className="h-8 w-8" />,
      title: 'Community Driven',
      description: 'Engage with readers through comments and build your audience.'
    },
    {
      icon: <FiTrendingUp className="h-8 w-8" />,
      title: 'Analytics & Insights',
      description: 'Track your blog performance with detailed analytics.'
    },
    {
      icon: <FiStar className="h-8 w-8" />,
      title: 'Professional Platform',
      description: 'Showcase your writing on a clean, professional platform.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>BlogHub - Share Your Stories</title>
        <meta name="description" content="A modern blogging platform for writers to share their stories, connect with readers, and build their audience." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-purple-800 from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Share Your Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Join thousands of writers who trust BlogHub to share their ideas, 
              connect with readers, and build their audience.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-purple px-8 py-3 border-2 border-white rounded-lg font-semibold text-white hover:bg-purple-100 hover:text-black transition-colors"
                >
                  Start Writing Today
                </Link>
                <Link
                  to="/login"
                  className="bg-purple px-8 py-3 border-2 border-white rounded-lg font-semibold text-white hover:bg-purple-100 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                to="/create-blog"
                className="bg-purple px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-purple-100 hover:text-black transition-colors inline-flex items-center gap-2"
              >
                <FiEdit3 />
                Write New Blog
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to start blogging
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to create, publish, and grow your blog.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Stories
            </h2>
            <p className="text-lg text-gray-600">
              Find blogs that inspire, educate, and entertain
            </p>
          </div>
          <SearchFilter />
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section id="latest" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Blogs
            </h2>
            <p className="text-lg text-gray-600">
              Fresh content from our community of writers
            </p>
          </div>
          <BlogList />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your blogging journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of writers and start sharing your unique perspective with the world.
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-purple-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <FiEdit3 />
              Get Started Free
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
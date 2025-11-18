import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEdit3, 
  FiTwitter, 
  FiFacebook, 
  FiInstagram, 
  FiLinkedin, 
  FiGithub,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'About Us', href: '/about' },
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Features', href: '/features' }
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Writing Guide', href: '/writing-guide' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'DMCA', href: '/dmca' }
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Report Bug', href: '/report-bug' },
      { name: 'Feature Request', href: '/feature-request' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com/bloghub', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com/bloghub', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/bloghub', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com/company/bloghub', color: 'hover:text-blue-700' },
    { name: 'GitHub', icon: FiGithub, href: 'https://github.com/bloghub', color: 'hover:text-gray-900' }
  ];

  const categories = [
    'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business'
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiEdit3 className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold text-white">BlogHub</span>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              BlogHub is a modern platform where writers share their stories, connect with readers, 
              and build their audience. Join thousands of creators who trust us with their content.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm">
                <FiMail className="mr-2 text-primary-400" />
                <span>contact@bloghub.com</span>
              </div>
              <div className="flex items-center text-sm">
                <FiPhone className="mr-2 text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm">
                <FiMapPin className="mr-2 text-primary-400" />
                <span>San Francisco, CA 94102</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 -mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-800 text-gray-400 transition-colors duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mb-4 md:mb-0">
              <p>© {currentYear} BlogHub. All rights reserved.</p>
              <span className="hidden sm:inline mx-2">|</span>
              <p className="flex items-center">
                Made with <FiHeart className="text-red-500 mx-1" size={14} /> by the BlogHub Team
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-gray-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 z-50 lg:hidden"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
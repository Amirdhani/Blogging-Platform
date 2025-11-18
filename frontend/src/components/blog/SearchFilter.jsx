import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { setFilters, getBlogs } from '../../store/slices/blogSlice';

const SearchFilter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.blog);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Education',
    'Entertainment',
    'Sports',
    'Other'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getBlogs({ ...filters, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    dispatch(setFilters(newFilters));
    dispatch(getBlogs(newFilters));
  };

  const clearFilters = () => {
    const clearedFilters = { search: '', category: 'All', tags: '', page: 1 };
    dispatch(setFilters(clearedFilters));
    dispatch(getBlogs(clearedFilters));
  };

  const hasActiveFilters = filters.search || (filters.category && filters.category !== 'All') || filters.tags;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs by title, content, or tags..."
            value={filters.search}
            onChange={(e) => dispatch(setFilters({ ...filters, search: e.target.value }))}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2 px-4"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-outline flex items-center gap-2"
        >
          <FiFilter />
          Advanced Filters
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
          >
            <FiX />
            Clear Filters
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange('category', category === 'All' ? '' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (filters.category === category) || (category === 'All' && !filters.category)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-6 space-y-4">
          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="react, javascript, tutorial"
              value={filters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="createdAt">Latest</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Commented</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-primary-600"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            
            {filters.category && filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="hover:text-primary-600"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            
            {filters.tags && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Tags: {filters.tags}
                <button
                  onClick={() => handleFilterChange('tags', '')}
                  className="hover:text-primary-600"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
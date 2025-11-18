import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogs } from '../../store/slices/blogSlice';
import BlogCard from './BlogCard';
import Loader from '../common/Loader';

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, totalPages, filters } = useSelector((state) => state.blog);
  const [page, setPage] = useState(1);

  const paginatingRef = useRef(false);

  useEffect(() => {
    dispatch(getBlogs({ ...filters, page }));
  }, [dispatch, filters, page]);

  useEffect(() => {
    if (paginatingRef.current) {
      window.scrollTo({ top: 1400, behavior: 'smooth' });
      paginatingRef.current = false; // reset
    }
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return;
    paginatingRef.current = true;   // mark that this change came from pagination
    setPage(newPage);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium border ${
                      page === pageNumber
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-4">
              <Loader size="medium" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
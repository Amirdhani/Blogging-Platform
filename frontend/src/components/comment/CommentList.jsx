import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, clearComments } from '../../store/slices/commentSlice';
import { useParams } from 'react-router-dom';
import CommentItem from './CommentItem';
import Loader from '../common/Loader';

const CommentList = () => {
  const { id: blogId } = useParams();
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);

  useEffect(() => {
    if (blogId) {
      dispatch(getComments(blogId));
    }

    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, blogId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Failed to load comments</p>
        <button
          onClick={() => dispatch(getComments(blogId))}
          className="mt-2 btn-outline text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No comments yet
        </h3>
        <p className="text-gray-500">
          Be the first to share your thoughts about this blog post.
        </p>
      </div>
    );
  }

  // Sort comments by creation date (newest first)
  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          blogId={blogId}
        />
      ))}
      
      {/* Load More Button (if needed) */}
      {comments.length >= 10 && (
        <div className="text-center pt-6">
          <button className="btn-outline">
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
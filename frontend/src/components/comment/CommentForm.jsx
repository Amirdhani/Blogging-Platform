import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/slices/commentSlice';
import { FiSend, FiSmile } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const CommentForm = ({ blogId, parentComment = null, onCancel = null, placeholder = "Write a comment..." }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.comment);

  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    if (content.length > 1000) {
      toast.error('Comment is too long (max 1000 characters)');
      return;
    }

    try {
      await dispatch(createComment({
        content: content.trim(),
        blogId,
        parentComment
      })).unwrap();

      setContent('');
      setIsExpanded(false);
      toast.success('Comment added!');
      
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      toast.error(error || 'Failed to add comment');
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsExpanded(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const insertEmoji = (emoji) => {
    setContent(prev => prev + emoji);
  };

  const commonEmojis = ['😊', '😂', '👏', '❤️', '🔥', '💯', '🤔', '👍'];

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white">
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Comment Input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              placeholder={placeholder}
              rows={isExpanded ? 4 : 2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200 placeholder-gray-500"
            />
            
            {/* Character Count */}
            {isExpanded && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {content.length}/1000
              </div>
            )}
          </div>

          {/* Expanded Actions */}
          {isExpanded && (
            <div className="mt-3 space-y-3">
              {/* Emoji Bar */}
              <div className="flex items-center space-x-1">
                <FiSmile className="text-gray-400" size={16} />
                <div className="flex space-x-1">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-lg"
                      title={`Add ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {parentComment ? 'Reply to comment' : 'Share your thoughts'}
                </div>
                
                <div className="flex items-center space-x-2">
                  {(content.trim() || onCancel) && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={!content.trim() || loading || content.length > 1000}
                    className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader size="small" color="#fff" />
                    ) : (
                      <>
                        <FiSend size={16} />
                        <span>{parentComment ? 'Reply' : 'Comment'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
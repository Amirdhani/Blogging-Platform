import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateComment, 
  deleteComment, 
  likeComment, 
  replyToComment 
} from '../../store/slices/commentSlice';
import { 
  FiHeart, 
  FiEdit2, 
  FiTrash2, 
  FiMoreHorizontal,
  FiCornerUpLeft,  // Replace FiReply with this
  FiMessageCircle  // Alternative option
} from 'react-icons/fi';
import moment from 'moment';
import toast from 'react-hot-toast';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, blogId, isReply = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);

  // Check if current user liked this comment
  React.useEffect(() => {
    if (user && comment.likes) {
      setIsLiked(comment.likes.some(like => like.user === user._id));
    }
  }, [user, comment.likes]);

  const isAuthor = user && comment.author._id === user._id;
  const canEdit = isAuthor || (user && user.role === 'admin');
  const canDelete = canEdit;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      const result = await dispatch(likeComment(comment._id)).unwrap();
      setIsLiked(result.isLiked);
      setLikesCount(result.likes);
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await dispatch(updateComment({
        id: comment._id,
        content: editContent.trim()
      })).unwrap();
      
      setIsEditing(false);
      toast.success('Comment updated!');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment._id)).unwrap();
        toast.success('Comment deleted!');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleReply = async (replyContent) => {
    try {
      await dispatch(replyToComment({
        id: comment._id,
        content: replyContent
      })).unwrap();
      
      setIsReplying(false);
      setShowReplies(true);
      toast.success('Reply added!');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex items-start space-x-3 group">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.name}&background=3b82f6&color=fff`}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Author and Time */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-900">
                {comment.author.name}
              </h4>
              <span className="text-xs text-gray-500">
                {moment(comment.createdAt).fromNow()}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {/* Menu Button */}
            {canEdit && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <FiMoreHorizontal size={16} className="text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {isAuthor && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiEdit2 className="mr-2" size={14} />
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2 className="mr-2" size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex items-center justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="btn-primary px-3 py-1 text-sm"
                  disabled={!editContent.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  isLiked 
                    ? 'text-red-600' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <FiHeart 
                  size={14} 
                  className={isLiked ? 'fill-current' : ''} 
                />
                <span>{likesCount}</span>
              </button>

              {/* Reply Button - UPDATED ICON */}
              {!isReply && user && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <FiCornerUpLeft size={14} />
                  <span>Reply</span>
                </button>
              )}

              {/* Show Replies Toggle */}
              {!isReply && comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4">
              <CommentForm
                blogId={blogId}
                parentComment={comment._id}
                onCancel={() => setIsReplying(false)}
                placeholder={`Reply to ${comment.author.name}...`}
              />
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <img
                    src={reply.author.avatar || `https://ui-avatars.com/api/?name=${reply.author.name}&background=3b82f6&color=fff`}
                    alt={reply.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.author.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {moment(reply.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default CommentItem;
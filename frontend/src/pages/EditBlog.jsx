import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlog, updateBlog, clearBlog } from '../store/slices/blogSlice';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const categories = [
  'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business',
  'Education', 'Entertainment', 'Sports', 'Other'
];

const EditBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((state) => state.blog);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    dispatch(getBlog(id));
    return () => { dispatch(clearBlog()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setExcerpt(blog.excerpt);
      setCategory(blog.category);
      setTags(blog.tags?.join(', ') || '');
      setContent(blog.content);
      setImagePreview(blog.image);
    }
  }, [blog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await dispatch(updateBlog({
        id,
        blogData: {
          title, excerpt, category, tags, content, image: image || imagePreview
        }
      })).unwrap();
      toast.success('Blog updated!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Failed to update blog');
    }
  };

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <label className="block font-medium mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Excerpt</label>
          <textarea
            className="input-field"
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="Short summary for preview or social media"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Category <span className="text-red-500">*</span></label>
            <select
              className="input-field"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              className="input-field"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. javascript, webdev"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Content <span className="text-red-500">*</span></label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet'}],
                ['link', 'image'],
                ['clean']
              ]
            }}
            className="bg-white"
            placeholder="Write your blog content here..."
            theme="snow"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="input-field"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-20 object-cover mt-2 rounded-md border"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 rounded-2xl hover:text-white w-40 py-3 font-semibold text-center"
        >
          {loading ? 'Saving...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
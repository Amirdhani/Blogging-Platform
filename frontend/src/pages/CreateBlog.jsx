import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../store/slices/blogSlice';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import toast from 'react-hot-toast';

const categories = [
  'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business',
  'Education', 'Entertainment', 'Sports', 'Other'
];

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.blog);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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
      await dispatch(createBlog({
        title, excerpt, category, tags, content, image
      })).unwrap();
      toast.success('Blog created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Failed to create blog');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl text-center font-bold mb-8">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-[120px_1fr] items-center gap-1">
          <label className="font-medium col-span-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input-field col-span-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-1">
          <label className="font-medium col-span-2">Short Description</label>
          <textarea
            className="input-field col-span-2"
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="💬 Share the vibe of your post in 1–2 lines"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-75">
          <div className="grid grid-cols-[120px_1fr] items-center gap-1">
            <label className="font-medium col-span-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="input-field col-span-2"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-1 w-50 text-center">
            <label className="font-medium col-span-2">Tags</label>
            <input
              type="text"
              className="input-field col-span-2"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="ex. #javascript, #webdev"
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
        <div className="w-55">
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
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 rounded-2xl hover:text-white w-40 py-3 font-semibold"
          >
            {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
          </div>
      </form>
    </div>
  );
};

export default CreateBlog;
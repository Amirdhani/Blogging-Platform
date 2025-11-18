import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (file, folder = 'blog-images') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation: [
        { width: 800, height: 450, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from cloudinary:', error);
  }
};
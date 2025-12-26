📝 Blogging Platform (MERN Stack)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

A full-stack blogging platform built with React, Node.js, Express, MongoDB, and Vite, featuring authentication, blog CRUD operations, image uploads, admin controls, and secure APIs.


🚀 Demo: 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Live: https://blogging-platform0.netlify.app


🛠️ Tech Stack
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Frontend

- React (Vite)
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Quill (Rich Text Editor)
- JWT Authentication

## Backend
-Node.js
-Express.js
-MongoDB (Mongoose)
-JWT Authentication
-Cloudinary (Image Uploads)
-Multer
-Helmet & Rate Limiting
-CORS Security


🔐 Environment Variables
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
### Backend .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

FRONTEND_URL=https://your-frontend.netlify.app

#### Frontend .env
VITE_API_URL=https://your-backend-z6jp.onrender.com


Other Features:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🔐 Authentication Features
- JWT-based authentication
- Secure login & signup
- Protected routes
- Token stored in localStorage
- Auto logout on token expiry

📝 Blog Features
- Create, edit, delete blogs
- Rich text editor (React Quill)
- Image upload (Cloudinary)
- Categories & tags
- Pagination
- Search & filter
- Admin dashboard

🔒 Security Features
- Helmet security headers
- CORS protection
- Rate limiting
- Input validation
- Encrypted passwords


🌐 What This Website Does:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
This platform lets users write blogs, upload images, like and comment, search posts, and manage profiles. Admins can access a dashboard to manage blogs, users, and platform activity.

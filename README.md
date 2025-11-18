📝 Blogging Platform
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

A full-stack blogging application built using React.js, Redux Toolkit, Node.js, Express, and MongoDB. Users can write, publish, and interact with blogs through a fast, modern UI.


🎨 Frontend:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
React + Vite

Tailwind CSS

Redux Toolkit for state management

React Quill rich text editor

Axios for API requests


🖥️ Backend:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Node.js + Express

MongoDB & Mongoose

JWT Authentication

Multer + Cloudinary image upload

Helmet & Rate Limiting for security

🚀 Deploying Frontend on Netlify:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Run:
npm run build

Upload the dist folder to Netlify or connect your GitHub repo

Add environment variable:
VITE_API_URL = your-backend-render-url

🚀 Deploying Backend on Render:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Create a new Web Service

Add Environment Variables:

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=


Set Start Command:
node server.js

🌐 What This Website Does:
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
This platform lets users write blogs, upload images, like and comment, search posts, and manage profiles. Admins can access a dashboard to manage blogs, users, and platform activity.

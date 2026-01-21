# 📂 FileX

A secure, full-stack file management system that allows users to upload, organize, and share files. Built with Node.js, PostgreSQL, and Cloudinary.

**[View Live Demo](#)** _(https://file-uploader-t7km.onrender.com)_

## ✨ Features

- **User Authentication:** Secure signup and login (Passport.js + BCrypt).
- **Cloud Storage:** Files are streamed directly to Cloudinary (no local storage).
- **File Organization:** Create folders and organize files hierarchically.
- **Secure Sharing:** Generate unique public links with expiration timers (1 hour, 1 day, etc.).
- **Public Views:** Dedicated public-facing UI for shared files and folders (no login required for visitors).
- **Responsive Design:** Mobile-friendly dashboard and file views.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Storage:** Cloudinary API
- **Frontend:** EJS Templating, CSS
- **Authentication:** Passport.js (Local Strategy)
- **Deployment:** Render

# Learnlog

Learnlog is a full-stack student learning and community platform where students can share what they learned, what confused them, and what finally clicked.

## Problem

Students can find plenty of polished explanations online, but often struggle to find real experiences from other learners who faced the same confusion.

Learnlog provides a simple space where students can share their learning journey and help others understand concepts through real student experiences.

## Vision

Build the project incrementally while learning practical full-stack development and real-world application architecture.

## Current Features

- User registration & login
- JWT authentication
- Access & refresh tokens
- Session management
- Protected & optional authentication routes
- User profiles
- Create, edit & delete learning posts
- Community feed
- Post details
- Image uploads
- Image optimization with Sharp
- Cloudinary image storage
- Post reactions
- Create, read, edit & delete comments
- REST APIs
- MongoDB & Mongoose
- Error handling
- Modular backend architecture
- Responsive React UI

## Planned Features

- Community post search
- Search by title, content & tags
- My Journey
- Learning-focused content discovery

## Tech Stack

### Frontend

- React
- JavaScript
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Sharp
- Cloudinary
- Nodemailer

## Architecture

```text
Client
  ↓
React UI
  ↓
Axios / API Services
  ↓
Express API
  ↓
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB

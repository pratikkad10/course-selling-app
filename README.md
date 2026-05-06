# Course Selling

A full-stack course selling platform built with the MERN stack (React, Node.js, Express, and MongoDB) that allows instructors to create and manage courses while students can browse, purchase, and access content seamlessly. The app includes secure authentication, payment integration, course progress tracking, and an intuitive dashboard for both admins and users.

## Overview

This MERN-based course selling app provides a complete online learning marketplace with:

- Instructor course management
- Student course browsing and purchase flow
- Secure authentication and role-based access
- Payment integration
- Course progress tracking
- Admin and user dashboards

## Key Features

- User registration and login
- Instructor course creation and editing
- Student enrollment and course access
- Password recovery and email verification flows
- Admin controls for user management
- Dashboard interfaces for instructors and students

## Technology Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT and cookie-based auth
- Validation: Zod
- File storage / media: Cloudinary (configured in server)

## Project Structure

- `client/` — React frontend
- `server/` — Express backend
- `server/config/` — database and Cloudinary configuration
- `server/controllers/` — request handlers
- `server/middlewares/` — authentication middleware
- `server/models/` — MongoDB models
- `server/routes/` — API routes
- `server/validation/` — request validation schemas
- `server/postman/` — Postman collection for quick API testing

## Getting Started

1. Install dependencies in `server/` and `client/`.
2. Create a `.env` file for backend environment variables.
3. Run MongoDB and start both frontend and backend.
4. Use Postman collection in `server/postman/` for quick API testing.

## Notes

This repository is built for a seamless online learning experience with secure auth, payments, and course management. It is designed to support administrators, instructors, and students with a polished, production-ready MERN architecture.

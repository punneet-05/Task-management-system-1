# Task Management System

A full-stack task management application built with Node.js, Express, Prisma, and Next.js.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (or MySQL)
- Git

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - File `.env` has been created.
   - **IMPORTANT:** Update `DATABASE_URL` in `.env` with your actual PostgreSQL credentials.
   - Example: `postgresql://postgres:mypassword@localhost:5432/taskdb?schema=public`
4. Setup Database:
   ```bash
   npx prisma db push
   ```
5. Start the Server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features implemented

- **Authentication**: Register, Login, Logout with JWT and Refresh Tokens.
- **Task Management**: Create, Read, Update, Delete tasks.
- **Filtering**: Filter by status and search by title.
- **Pagination**: Navigate through pages of tasks.
- **Security**: Password hashing, protected routes, HttpOnly cookie logic (simulated with local storage for this assessment scope).

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Axios, React Hook Form

# How to Run the Application

## Quick Start Guide

### Step 1: Start the Backend Server

1. Open a terminal/PowerShell window
2. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

3. Make sure your `.env` file has the correct database credentials:
   ```env
   DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/supplier_product_db?schema=public&sslmode=disable"
   JWT_SECRET="your-secret-key-change-this-in-production-make-it-long-and-random"
   PORT=3001
   ```

4. Run database migrations (if you haven't already):
   ```powershell
   npm run prisma:migrate
   ```

5. Start the backend server:
   ```powershell
   npm run dev
   ```

   You should see:
   ```
   Server is running on port 3001
   ```

### Step 2: Start the Frontend Server

1. Open a **NEW** terminal/PowerShell window (keep the backend running)
2. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

3. Start the frontend development server:
   ```powershell
   npm run dev
   ```

   You should see:
   ```
   ▲ Next.js 16.0.3
   - Local:        http://localhost:3000
   ```

### Step 3: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the login page
4. Register a new account or login to start using the application

## What You'll See

### Login/Register Page
- Register with email and password
- Login with your credentials

### After Login
- **Suppliers Page**: Manage suppliers (add, edit, view)
- **Products Page**: Manage products (add, edit, upload images, search)

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify DATABASE_URL in `backend/.env` is correct
- Make sure port 3001 is not already in use

### Frontend won't start
- Check if port 3000 is not already in use
- Verify `frontend/.env.local` has the correct API URL

### Database connection errors
- Make sure PostgreSQL server is running
- Verify database credentials in `backend/.env`
- Ensure the database `supplier_product_db` exists

### Can't see images
- Make sure backend is running (images are served from backend)
- Check that uploads folder exists in backend directory


# Setup Instructions

## Quick Setup Guide

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Step 1: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/supplier_product_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production-make-it-long-and-random"
PORT=3001
```

**Important**: Replace the DATABASE_URL with your actual PostgreSQL connection string:
- `user`: Your PostgreSQL username
- `password`: Your PostgreSQL password
- `localhost:5432`: Your database host and port
- `supplier_product_db`: Your database name

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Step 2: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 3: Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Register a new account or login
3. Start managing suppliers and products!

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Verify your DATABASE_URL is correct
- Check that the database exists (create it if needed: `CREATE DATABASE supplier_product_db;`)

### Port Already in Use
- Change the PORT in backend/.env if 3001 is taken
- Update NEXT_PUBLIC_API_URL in frontend/.env.local accordingly

### Prisma Migration Issues
- Make sure your database is accessible
- Check that the DATABASE_URL is correct
- Try running `npm run prisma:migrate` again


# Supplier & Product Management Application

A full-stack application for managing suppliers and products with authentication, file uploads, and search functionality.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Uploads**: Multer

## Project Structure

```
technical test/
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth & upload middleware
│   │   └── utils/        # Utilities (Prisma client)
│   ├── prisma/       # Prisma schema and migrations
│   └── uploads/      # Product image uploads
└── frontend/         # Next.js frontend
    ├── app/          # Next.js App Router pages
    ├── components/   # React components
    └── lib/          # API client and utilities
```

## Features

- ✅ User registration and login with JWT authentication
- ✅ Supplier management (CRUD operations)
- ✅ Product management (CRUD operations)
- ✅ Product image upload (JPG, PNG, JPEG)
- ✅ Search products by name or supplier name
- ✅ Protected routes with authentication middleware
- ✅ Responsive UI with Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/supplier_product_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=3001
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Suppliers (Protected)
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier

### Products (Protected)
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `POST /api/products/upload` - Upload product image
- `GET /api/products/search?q=query` - Search products

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

### User
- `id` (UUID)
- `email` (string, unique)
- `password` (hashed string)
- `createdAt` (datetime)

### Supplier
- `id` (UUID)
- `name` (string)
- `email` (string)
- `phone` (string)
- `createdAt` (datetime)

### Product
- `id` (UUID)
- `name` (string)
- `description` (string)
- `price` (number)
- `imagePath` (string, nullable)
- `supplierId` (UUID, foreign key)
- `createdAt` (datetime)

## Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Manage Suppliers**: Add, view, and edit suppliers
3. **Manage Products**: Create products and assign them to suppliers
4. **Upload Images**: Upload product images (JPG, PNG, JPEG)
5. **Search**: Use the search bar to find products by name or supplier name

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- Product images are stored in `backend/uploads/` directory
- JWT tokens expire after 7 days
- File upload limit is 5MB
- All API routes except `/auth/register` and `/auth/login` require authentication


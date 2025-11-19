# Supplier & Product Management Application

A full-stack application for managing suppliers and products with authentication, multiple image support, file uploads, and search functionality.

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
- ✅ **User data isolation** - Each user only sees and manages their own suppliers and products
- ✅ Supplier management (Create, Read, Update, Delete)
- ✅ Product management (Create, Read, Update, Delete)
- ✅ **Multiple product images** - Upload, manage, and set primary image
- ✅ Product image upload (JPG, PNG, JPEG) with image display
- ✅ **Primary image selection** - Choose which image displays as the main product image
- ✅ Search products by name or supplier name
- ✅ **Password confirmation** required when changing a product's supplier
- ✅ **Safety features** - Prevents deletion of suppliers with associated products
- ✅ **Modal-based UI** - Modern confirmation dialogs and alerts
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

### Authentication (Protected)
- `POST /api/auth/verify-password` - Verify user password (for sensitive operations)

### Suppliers (Protected)
- `GET /api/suppliers` - Get all suppliers (user-specific)
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier
- `DELETE /api/suppliers/:id` - Delete a supplier (only if no products associated)

### Products (Protected)
- `GET /api/products` - Get all products (user-specific, includes images)
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product (requires password confirmation to change supplier)
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/upload` - Upload a new product image
- `DELETE /api/products/images/:imageId` - Delete a product image
- `PUT /api/products/images/:imageId/primary` - Set an image as primary
- `GET /api/products/search?q=query` - Search products (user-specific)

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
- `suppliers` (relation to Supplier[])
- `products` (relation to Product[])

### Supplier
- `id` (UUID)
- `name` (string)
- `email` (string)
- `phone` (string)
- `userId` (UUID, foreign key to User) - **User isolation**
- `user` (relation to User)
- `createdAt` (datetime)
- `products` (relation to Product[])

### Product
- `id` (UUID)
- `name` (string)
- `description` (string)
- `price` (number)
- `imagePath` (string, nullable) - **Deprecated**: Kept for backward compatibility
- `primaryImageId` (UUID, nullable, unique, foreign key to ProductImage) - **Primary image selection**
- `primaryImage` (relation to ProductImage)
- `images` (relation to ProductImage[]) - **Multiple images support**
- `supplierId` (UUID, foreign key to Supplier)
- `supplier` (relation to Supplier)
- `userId` (UUID, foreign key to User) - **User isolation**
- `user` (relation to User)
- `createdAt` (datetime)

### ProductImage
- `id` (UUID)
- `path` (string) - Image file path
- `productId` (UUID, foreign key to Product)
- `product` (relation to Product)
- `primaryFor` (relation to Product) - Reverse relation for primary image
- `createdAt` (datetime)

## Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Manage Suppliers**: 
   - Add, view, edit, and delete suppliers
   - Each user only sees their own suppliers
   - Cannot delete suppliers that have associated products
3. **Manage Products**: 
   - Create products and assign them to suppliers
   - Update product details
   - **Change supplier**: Requires password confirmation for security
   - Delete products
   - Each user only sees their own products
4. **Manage Product Images** (in Edit mode):
   - **Upload multiple images** - Add as many images as needed per product
   - **Set primary image** - Choose which image displays as the main product image
   - **Delete images** - Remove unwanted images with confirmation
   - **Visual indicators** - Primary image is clearly marked with a badge
   - Images are displayed in a grid layout for easy management
   - First uploaded image is automatically set as primary
5. **Search**: Use the search bar to find products by name or supplier name (searches only your products)

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

## Security Features

- **User Data Isolation**: All suppliers and products are isolated per user. Users cannot see or modify other users' data.
- **Password Confirmation**: Changing a product's supplier requires password verification for security.
- **Delete Protection**: Suppliers with associated products cannot be deleted to prevent data loss.
- **Ownership Verification**: All update and delete operations verify that the user owns the resource.

## Notes

- Product images are stored in `backend/uploads/` directory and served as static files
- **Multiple images per product** - Products can have unlimited images, with one designated as primary
- **Primary image** - The primary image is displayed in product lists; other images are available in edit mode
- **Image management** - All image operations (upload, delete, set primary) are available in the product edit form
- JWT tokens expire after 7 days
- File upload limit is 5MB per image
- All API routes except `/auth/register` and `/auth/login` require authentication
- User data is automatically filtered by user ID - no need to manually filter in queries
- When a supplier is deleted, all associated products are also deleted (cascade delete)
- When a product is deleted, all associated images are also deleted (cascade delete)
- When the primary image is deleted, another image is automatically set as primary (if available)


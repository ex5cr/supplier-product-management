# How to Test Your Application

## Quick Verification Checklist

### 1. Check Backend Server
- Open the terminal where backend is running
- You should see: `Server is running on port 3001`
- No error messages in the console

### 2. Check Frontend Server
- Open the terminal where frontend is running
- You should see: `Local: http://localhost:3000`
- No error messages in the console

### 3. Test Registration
- Go to http://localhost:3000
- Click "Register" or go to http://localhost:3000/register
- Enter an email and password
- Click "Register"
- ✅ **Success**: You should be redirected to the Suppliers page
- ❌ **Failure**: You'll see an error message

### 4. Test Login
- If you're logged out, go to http://localhost:3000/login
- Enter your registered email and password
- Click "Sign in"
- ✅ **Success**: You should be redirected to the Suppliers page

### 5. Test Supplier Management
- Navigate to Suppliers page (should be default after login)
- Click "Add supplier"
- Fill in:
  - Name: e.g., "ABC Company"
  - Email: e.g., "abc@example.com"
  - Phone: e.g., "+1234567890"
- Click "Create"
- ✅ **Success**: Supplier appears in the list
- Try clicking "Edit" on a supplier
- ✅ **Success**: Form populates with supplier data, you can update and save

### 6. Test Product Management
- Navigate to Products page
- Click "Add product"
- Fill in:
  - Product Name: e.g., "Laptop"
  - Description: e.g., "High-performance laptop"
  - Price: e.g., "999.99"
  - Supplier: Select a supplier from dropdown
- Click "Create"
- ✅ **Success**: Product appears in the list with supplier info

### 7. Test Image Upload
- Edit an existing product (click "Edit" on any product)
- Scroll down to "Upload Product Image" section
- Click "Choose File" and select a JPG, PNG, or JPEG image
- Wait for upload to complete
- ✅ **Success**: You'll see "Image uploaded successfully!" message
- ✅ **Success**: Image appears next to the product in the list

### 8. Test Search Functionality
- Go to Products page
- Type in the search bar (top of the page)
- Try searching by:
  - Product name (e.g., "Laptop")
  - Supplier name (e.g., "ABC Company")
- ✅ **Success**: Products matching the search appear
- ✅ **Success**: Clearing search shows all products again

### 9. Test Logout
- Click "Logout" in the top right
- ✅ **Success**: You're redirected to login page
- ✅ **Success**: You can't access protected pages without logging in

## Common Issues & Solutions

### Backend shows connection errors
- Check that PostgreSQL is running
- Verify `backend/.env` has correct database credentials
- Make sure database `supplier_product_db` exists

### Frontend can't connect to backend
- Check backend is running on port 3001
- Verify `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### Images don't display
- Make sure backend server is running (images are served from backend)
- Check that `backend/uploads/` folder exists

### Search doesn't work
- Make sure you have products created
- Try refreshing the page

## Expected Behavior Summary

✅ **Working correctly if:**
- You can register and login
- You can create, view, and edit suppliers
- You can create, view, and edit products
- You can upload product images
- You can search for products
- Images display correctly
- Logout works and redirects to login

❌ **Not working if:**
- You see "Internal server error"
- Pages don't load
- Forms don't submit
- Data doesn't save
- Images don't upload or display


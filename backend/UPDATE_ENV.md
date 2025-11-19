# How to Update Database Credentials

## The Problem
Your `backend/.env` file currently has placeholder credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/supplier_product_db?schema=public&sslmode=disable"
```

## The Solution

1. **Open** `backend/.env` in a text editor

2. **Update** the DATABASE_URL with your actual PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/supplier_product_db?schema=public&sslmode=disable"
   ```

   Replace:
   - `YOUR_USERNAME` - Usually `postgres` (or your PostgreSQL username)
   - `YOUR_PASSWORD` - The password you set during PostgreSQL installation

3. **Example** (if username is `postgres` and password is `mypassword123`):
   ```
   DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/supplier_product_db?schema=public&sslmode=disable"
   ```

4. **Save** the file

5. **Make sure the database exists**. If not, create it using pgAdmin or:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE supplier_product_db;"
   ```

6. **Run migrations**:
   ```powershell
   cd backend
   npm run prisma:migrate
   ```

7. **Restart your backend server** if it's running


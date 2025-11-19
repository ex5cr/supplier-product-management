# Setup Script for Supplier & Product Management Application
# Run this script from the root directory

Write-Host "=== Setting up Supplier & Product Management Application ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Backend Setup
Write-Host ""
Write-Host "=== Backend Setup ===" -ForegroundColor Cyan
Set-Location backend

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
    $envContent = 'DATABASE_URL="postgresql://user:password@localhost:5432/supplier_product_db?schema=public"'
    $envContent += "`nJWT_SECRET=`"your-secret-key-change-this-in-production-make-it-long-and-random`""
    $envContent += "`nPORT=3001"
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "Created backend/.env file" -ForegroundColor Green
    Write-Host "Please update DATABASE_URL with your PostgreSQL credentials!" -ForegroundColor Yellow
} else {
    Write-Host "backend/.env already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "Failed to generate Prisma Client" -ForegroundColor Red
}

Write-Host ""
Write-Host "IMPORTANT: Before running migrations, update backend/.env with your database credentials!" -ForegroundColor Yellow
Write-Host "Then run: cd backend; npm run prisma:migrate" -ForegroundColor Yellow

Set-Location ..

# Frontend Setup
Write-Host ""
Write-Host "=== Frontend Setup ===" -ForegroundColor Cyan
Set-Location frontend

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating frontend/.env.local file..." -ForegroundColor Yellow
    $envLocalContent = 'NEXT_PUBLIC_API_URL=http://localhost:3001/api'
    $envLocalContent | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "Created frontend/.env.local file" -ForegroundColor Green
} else {
    Write-Host "frontend/.env.local already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your PostgreSQL database credentials" -ForegroundColor White
Write-Host "2. Run database migrations: cd backend; npm run prisma:migrate" -ForegroundColor White
Write-Host "3. Start backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "4. Start frontend (in a new terminal): cd frontend; npm run dev" -ForegroundColor White
Write-Host "5. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""

# Script to create PostgreSQL database
# This script will help you create the database using Prisma

Write-Host "=== Creating PostgreSQL Database ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is accessible
Write-Host "Attempting to create database using Prisma..." -ForegroundColor Yellow
Write-Host ""

# First, let's try to find PostgreSQL installation
$pgPaths = @(
    "C:\Program Files\PostgreSQL\*\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\*\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $psqlPath = $found.FullName
        break
    }
}

if ($psqlPath) {
    Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "To create the database manually, run:" -ForegroundColor Yellow
    Write-Host "  & `"$psqlPath`" -U postgres -c `"CREATE DATABASE supplier_product_db;`"" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use pgAdmin GUI to create the database." -ForegroundColor Yellow
} else {
    Write-Host "PostgreSQL command-line tools not found in standard locations." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative methods:" -ForegroundColor Cyan
    Write-Host "1. Use pgAdmin (GUI tool that comes with PostgreSQL)" -ForegroundColor White
    Write-Host "2. Add PostgreSQL bin directory to PATH" -ForegroundColor White
    Write-Host "3. Use Prisma migrations (will create database if it doesn't exist)" -ForegroundColor White
    Write-Host ""
}

Write-Host "=== Using Prisma to Create Database ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prisma can create the database automatically when you run migrations." -ForegroundColor Yellow
Write-Host "However, you need to:" -ForegroundColor Yellow
Write-Host "1. Update backend/.env with your actual PostgreSQL credentials" -ForegroundColor White
Write-Host "2. Make sure PostgreSQL server is running" -ForegroundColor White
Write-Host "3. Connect to 'postgres' database first to create the new database" -ForegroundColor White
Write-Host ""
Write-Host "Recommended approach:" -ForegroundColor Cyan
Write-Host "1. Open pgAdmin (comes with PostgreSQL installation)" -ForegroundColor White
Write-Host "2. Connect to your PostgreSQL server" -ForegroundColor White
Write-Host "3. Right-click 'Databases' -> Create -> Database" -ForegroundColor White
Write-Host "4. Name it 'supplier_product_db'" -ForegroundColor White
Write-Host "5. Then run: cd backend; npm run prisma:migrate" -ForegroundColor White
Write-Host ""



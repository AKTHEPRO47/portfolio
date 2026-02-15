# Copy all static files to public folder for Cloudflare deployment
# Run this from the portfolio-flask directory

$sourceDir = "c:\Users\Aryan Kota\Desktop\project 47\portfolio-flask"

Write-Host "📁 Copying files to /public folder..." -ForegroundColor Green

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "$sourceDir\public\css" | Out-Null
New-Item -ItemType Directory -Force -Path "$sourceDir\public\js" | Out-Null
New-Item -ItemType Directory -Force -Path "$sourceDir\public\images" | Out-Null

# Copy CSS
Write-Host "📋 Copying CSS files..." -ForegroundColor Yellow
Copy-Item "$sourceDir\static\css\*" "$sourceDir\public\css\" -Force
Write-Host "✅ CSS files copied"

# Copy JS
Write-Host "📋 Copying JavaScript files..." -ForegroundColor Yellow
Copy-Item "$sourceDir\static\js\*" "$sourceDir\public\js\" -Force
Write-Host "✅ JavaScript files copied"

# Copy Images
Write-Host "📋 Copying image files..." -ForegroundColor Yellow
if (Test-Path "$sourceDir\static\images") {
    Copy-Item "$sourceDir\static\images\*" "$sourceDir\public\images\" -Recurse -Force
    Write-Host "✅ Image files copied"
} else {
    Write-Host "⚠️  static/images folder not found - skipping"
}

Write-Host "`n✅ All files copied successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://formspree.io and create a form"
Write-Host "2. Update the form action URL in public/contact.html"
Write-Host "3. Push to GitHub"
Write-Host "4. Deploy from https://pages.cloudflare.com"
Write-Host "`nYour portfolio is ready for deployment!" -ForegroundColor Green

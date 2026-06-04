# Cloudinary Setup for Image Upload (FREE)

## Why Cloudinary?
- ✅ **FREE** 25GB storage
- ✅ **FREE** 25GB bandwidth/month
- ✅ Automatic image optimization
- ✅ No credit card required
- ✅ CDN included

## Setup Steps:

### 1. Create Free Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up with your email
3. Verify your email

### 2. Get Your Credentials
1. After login, go to **Dashboard**
2. You'll see:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it)

### 3. Add to Railway Environment Variables
1. Go to your Railway project
2. Click on your service
3. Go to **Variables** tab
4. Add these 3 variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Redeploy
Railway will automatically redeploy with the new environment variables.

## Testing
1. Go to your admin panel: https://cv-moto-hub-production.up.railway.app/admin
2. Click "Add Product"
3. Upload an image file (jpg, png, gif, webp)
4. Image will be uploaded to Cloudinary and URL saved to database

## Features
- Auto-resize to max 800x800px
- Auto-optimize quality
- Auto-convert to best format (WebP when supported)
- Images stored in `cv-moto-hub/products/` folder

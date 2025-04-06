# VRGaus Deployment Guide

This guide explains how to deploy VRGaus to GitHub and Render.com for easy access from VR headsets.

## GitHub Deployment

1. Create a new repository on GitHub named "vrgaus"
2. Initialize and push your local repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vrgaus.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Render.com Deployment

1. Sign up/log in to [Render.com](https://render.com)
2. Click "New" and select "Web Service"
3. Connect to your GitHub repository
4. Configure with these settings:
   - Name: vrgaus
   - Environment: Node
   - Build Command: `npm run build-windows` (if on Windows) or `npm run build` (if on Mac/Linux)
   - Start Command: `npm start`
   - Plan: Free

5. Click "Create Web Service"

Once deployed, Render will provide a URL like `https://vrgaus.onrender.com` that you can access from any VR headset with proper HTTPS support for WebXR.

## Accessing in VR

1. On your Quest or other VR headset, open the browser
2. Navigate to your Render.com URL (example: `https://vrgaus.onrender.com/vr-quest.html`)
3. Click the "Enter VR" button to start the experience

Note: Since Render.com provides proper HTTPS certificates, you won't need to deal with certificate warnings that occur when running locally. 
// Simple Express server for Render.com
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating public directory:', err);
}

// Set security headers for SharedArrayBuffer and cross-origin isolation
app.use((req, res, next) => {
  // Required for SharedArrayBuffer
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  
  // Additional headers for better cross-origin handling
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  next();
});

// Serve build/demo directory statically
app.use(express.static(path.join(__dirname, 'build/demo')));

// Copy demo files to build/demo to make them accessible
app.use('/vr.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo', 'vr.html'));
});

app.use('/vr-quest.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo', 'vr-quest.html'));
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Access your app at: http://localhost:${port}`);
  console.log(`VR demo available at: http://localhost:${port}/vr.html`);
  console.log(`Quest optimized VR demo at: http://localhost:${port}/vr-quest.html`);
}); 
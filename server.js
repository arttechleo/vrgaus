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

// Set security headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Serve build/demo directory statically
app.use(express.static(path.join(__dirname, 'build/demo')));

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
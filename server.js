// Express server for Render.com deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle CORS and security headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Serve static files from the build/demo directory
app.use(express.static(path.join(__dirname, 'build/demo')));

// Handle all routes - important for SPA behavior
app.get('*', (req, res) => {
  // Check if the file exists in the build/demo directory
  const filePath = path.join(__dirname, 'build/demo', req.path);
  const indexPath = path.join(__dirname, 'build/demo/index.html');
  
  // Try to serve the specific file first, fall back to index.html
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, serve index.html
      res.sendFile(indexPath);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`WebXR pages available at:`);
  console.log(`- /vr-quest.html (Quest optimized)`);
  console.log(`- /vr.html (Standard VR)`);
  console.log(`- /test.html (WebXR test page)`);
}); 
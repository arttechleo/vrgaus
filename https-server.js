// HTTPS server for WebXR testing
import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const port = 3443; // Standard HTTPS port

// Self-signed certificate info
// Note: In a real deployment, use a proper SSL certificate
// This is just for local testing
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};

// Set security headers for SharedArrayBuffer and cross-origin isolation
app.use((req, res, next) => {
  // Required for SharedArrayBuffer
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  
  // Additional headers for better cross-origin handling
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  next();
});

// Serve build/demo directory statically
app.use(express.static(path.join(__dirname, 'build/demo')));

// Serve demo files too
app.use('/vr.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo', 'vr.html'));
});

app.use('/vr-quest.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo', 'vr-quest.html'));
});

app.use('/vr-quest-direct.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo', 'vr-quest-direct.html'));
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Start HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on port ${port}`);
  console.log(`Access your app at: https://localhost:${port}`);
  console.log(`VR demo available at: https://localhost:${port}/vr.html`);
  console.log(`Quest optimized VR demo at: https://localhost:${port}/vr-quest.html`);
  console.log(`Direct loading VR demo at: https://localhost:${port}/vr-quest-direct.html`);
  console.log();
  console.log(`For your Quest browser, use: https://192.168.0.145:${port}/vr.html`);
  console.log('(You will need to accept the security warning about the self-signed certificate)');
}); 
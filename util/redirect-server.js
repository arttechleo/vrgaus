import * as http from 'http';

const port = 80; // Standard HTTP port - more likely to be accessible
const host = '0.0.0.0';
const httpsPort = 8443; // The port where your HTTPS server is running

http.createServer((req, res) => {
  // Get the requested path
  const path = req.url;
  
  // Create the HTTPS URL to redirect to
  const redirectUrl = `https://${req.headers.host.split(':')[0]}:${httpsPort}${path}`;
  
  console.log(`Redirecting ${req.url} to ${redirectUrl}`);
  
  // Send redirect
  res.writeHead(302, {
    'Location': redirectUrl
  });
  res.end();
}).listen(port, host);

console.log(`HTTP Redirect Server running at http://${host}:${port}`);
console.log(`Redirecting all traffic to https://${host}:${httpsPort}`);
console.log(`Access from other devices using your IP address: http://192.168.0.145`); 
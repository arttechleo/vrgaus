import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

let baseDirectory = '.';
let port = 8443;
let host = '0.0.0.0';
let forceHttps = true; // Set to false to use HTTP instead
let lasttRequesTime = performance.now() / 1000;

for(let i = 0; i < process.argv.length; ++i) {
  if (process.argv[i] == '-d' && i < process.argv.length - 1) {
    baseDirectory = process.argv[i + 1];
  }
  if (process.argv[i] == '-p' && i < process.argv.length - 1) {
    port = process.argv[i + 1];
  }
  if (process.argv[i] == '-h' && i < process.argv.length - 1) {
    host = process.argv[i + 1];
  }
  if (process.argv[i] == '--http') {
    forceHttps = false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// The server handler function
function serverHandler(request, response) {
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  let filePath = baseDirectory + request.url;

  const extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  const requestTime = performance.now() / 1000;
  if (requestTime - lasttRequesTime > 1) {
    console.log("");
    console.log("-----------------------------------------------");
  }

  let queryString;
  let queryStringStart = filePath.indexOf('?');
  if (queryStringStart && queryStringStart > 0) {
    queryString = filePath.substring(queryStringStart + 1);
    filePath = filePath.substring(0, queryStringStart);
  }

  let testDirectory = filePath;
  if (testDirectory.endsWith("/")) {
    testDirectory = testDirectory.substring(0, testDirectory.length - 1);
  }
  try {
    if (fs.lstatSync(filePath).isDirectory()) {
      let testDirectory = filePath;
      if (!testDirectory.endsWith("/")) testDirectory = testDirectory + "/";
      if (fs.existsSync(testDirectory + "index.html")) {
        filePath = testDirectory + "index.html";
      } else if (fs.existsSync(testDirectory + "index.htm")) {
        filePath = testDirectory + "index.htm";
      }
    }
  } catch(err) {
    // ignore
  }

  try {
    const stats = fs.statSync(filePath);
    if (stats && stats.size) {
      const fileSizeInBytes = stats.size;
      response.setHeader("Content-Length", fileSizeInBytes);
    }
  } catch(err) {
    // ignore
  }

  fs.readFile(filePath, async function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        console.log(`${forceHttps ? 'HTTPS' : 'HTTP'}(404) Request for ${filePath} -> File not found.`);
        response.writeHead(404);
        response.end("File not found");
      } else {
        console.log(`${forceHttps ? 'HTTPS' : 'HTTP'}(500) Request for ${filePath} -> Server error.`);
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " +
            error.code +
            " ..\n"
        );
      }
    } else {
      console.log(`${forceHttps ? 'HTTPS' : 'HTTP'}(200) Request for ${filePath}`);
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });

  lasttRequesTime = requestTime;
}

if (forceHttps) {
  // SSL options with hardcoded self-signed certificate
  const options = {
    key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnjjS32/WRxnNn
tCQkzw5mEhTy0USEHsQJ7ZPrYJZtUaooZ7V7OMPqjMEdSfA8+jnPAYGyzOUjAYLa
g/0sj/P6e7K9oPATt+M3XaqiUBTnZUwjrPWq8zqdTw3QZ9ilr5XP6S/6y1VJuC+r
ZZQMTQoc68olAXGu+yXz6YuOE0jCjkZnC5K+jGgC4XT0ZFNJ6tbjaqtRILLzUkj3
R2tIEJ4VUOk90pTGl6yUB4dIp3Obu6vXFWY0ahZKNnJitiZtiVtLu0Z9oBHPpEy5
Cg0JoWQRZoJeAOkzg7RiCLcjfoO4bNYo3g3UETonlcMkNjEvzNgEY9MwGxZ6GfUt
2in8bbgHAgMBAAECggEAF1ik0J5lbcM9wbGXF8ivCf8VwyCfpD4nIVg0KfqxGdZG
TtYUW2iQn1Y2HWge3YMvKw8tzuwVKyBQOza1JJE5r3/Kt5wYYJkZ/NoKp1XqRnNm
mHdMPY3r3kBfQ3jrIYxnNV2paQfxll6Ny0dRbfcXJg1Dxa2RkZVXZLz4JDnj6fWY
Dj9RDqW/kUYXMOK/xvQarRWtxEn4J6A2ZbIsMZF5YjB3Jk67qSEgqfwZG9bbPhGK
7E+O3YXoQMmN/SSvFKRERBhbeMsTRfpEYNsTQNU99ZQyjwJ3DNEb0W9WBu9nP0nY
jK4M3YJnXE4hJC0h6RYPA8C1n9QwY1TkCmOVqqXcIQKBgQDVXYNnYHtIUoiLyLl1
d4QBIFZvk7+jUVIvCaNX5QGmB19Y1aZPJWJCp4vy0JqMQNFA7vBSSBmqkVYj+ZJj
Q0b3r9IKh6XaU8pKSIKBXE8/HSEzIyasMzrc7gcA47pLz/AsjnqU0dJcb05UCa0b
IlfsI2Gi+82KtEyTNMl7ZpmbtwKBgQDI1rWDKgyK/xSUe7xvFfG2wPi3KaXpPScY
wgr5v07Lun+SNu3zZRtGcYJuMDTbZmxzqVXWUDvXWesAZUjsATVYxAOiRfuQ9acJ
ydNtXO+gCt+462iY19/nvanGGnSBa1MLF0Zbq0vgMOJ8o9kFTbDUKjtzPr/5P4j5
CnF1P2U6IQKBgQCyP4ZRVNFGMJJzWDBjeoMCbfXaUqs1K0ZrCWEGDVUaMV12wvAO
VK7p3aDKCQxUdlZ4QzNS3voBksY/vYQUzwB5QAjQHKaUYiKOlAVDpayluEk/QPVu
Wn/EC+39KBgwYjanwHFpnoFK8HAPSKcZpSIEO9WEUVuX3t4VrRbP4NXJcQKBgQCs
CGJonp3PBXvQFUZXn77mPJQJ/xjJm5xix7xPpRo32OwVD6/dYBkhuoA56jAJjA0s
c1MHiXUHrwJ9aRljfkCTcZhctyRAIeJTIRcM6XAt913HRWwK3MBRlHfvptgZcCKc
CJO/opbSbO3QhcltimQ5HEsJ3W7nVZMnwGJQCe9UYQKBgHfnF8W8wMXFiBpCwwk8
EXZZlKGY1m3vNYKN/TDg5nKI1JOKcY60VHQMXJxV7d8I6h5NXO+D4R4gWz1xoJIs
vBKosr+5z5+0y3DIVQeQ0KIpZbA2dbWuWGBgZx5HkP73X1iEszKkAGnX5LKZHT9n
7mKRWDIJXdsdNzAoXEwRFHYI
-----END PRIVATE KEY-----`,
    cert: `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUcHSkvpIVqOH+0kLbKVdXQLTnC+4wDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNDA0MDcwMDIwMTZaFw0yNTA0
MDcwMDIwMTZaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQCnjjS32/WRxnNntCQkzw5mEhTy0USEHsQJ7ZPrYJZt
UaooZ7V7OMPqjMEdSfA8+jnPAYGyzOUjAYLag/0sj/P6e7K9oPATt+M3XaqiUBTn
ZUwjrPWq8zqdTw3QZ9ilr5XP6S/6y1VJuC+rZZQMTQoc68olAXGu+yXz6YuOE0jC
jkZnC5K+jGgC4XT0ZFNJ6tbjaqtRILLzUkj3R2tIEJ4VUOk90pTGl6yUB4dIp3Ob
u6vXFWY0ahZKNnJitiZtiVtLu0Z9oBHPpEy5Cg0JoWQRZoJeAOkzg7RiCLcjfoO4
bNYo3g3UETonlcMkNjEvzNgEY9MwGxZ6GfUt2in8bbgHAgMBAAGjUzBRMB0GA1Ud
DgQWBBTQAlb/sxuXmDI+p0MZwyGXxLReHzAfBgNVHSMEGDAWgBTQAlb/sxuXmDI+
p0MZwyGXxLReHzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQCP
3h6uUZBc4jBKKqwlV39GOU1XO1AQHtIubdG0qGEW3AQhicTaGYYZ6sA/vO5O1kFb
ZCwdB8jCkuId5a9YJvxRUzSLwbCcUjW9JHgBxfHLkb1E4hLmgbzM37raAd07JUOO
pzwQtzuHIRpqB/qCYVksQyE9Mmn1JKmUJA4h9t5XM3JnxO8bvTViw0vbxZQvgTzP
G7hkCj9TqVDnpIscAC6aJiLBvkIvEzOdVQYDrWObZ3BQnKc7QT/IZs/RbhHpFIkY
G3/Wu5cZ0dZMLiHLzlFNnNtzZJ9xyCOODHTcWWZ85zcEepHD55UrKYoh7KR2A3Qh
BNUTN/UQ1jyxeJLZCsUb
-----END CERTIFICATE-----`
  };

  // Create HTTPS server
  https.createServer(options, serverHandler).listen(port, host);
  console.log(`HTTPS Server running at https://${host}:${port}`);
  console.log(`Access locally at: https://localhost:${port}`);
  console.log(`Access from other devices at: https://192.168.0.145:${port}`);
  console.log("Note: Since this is using a self-signed certificate, you'll need to accept the security warning in your browser.");
} else {
  // Create HTTP server (fallback option)
  http.createServer(serverHandler).listen(port, host);
  console.log(`HTTP Server running at http://${host}:${port}`);
  console.log(`Access locally at: http://localhost:${port}`);
  console.log(`Access from other devices at: http://192.168.0.145:${port}`);
  console.log("Note: WebXR requires HTTPS, so VR functionality won't work with this server.");
} 
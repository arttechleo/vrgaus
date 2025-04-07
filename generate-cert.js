// Generate self-signed certificates for HTTPS
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certDir = path.join(__dirname, 'cert');

// Ensure cert directory exists
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Create a simpler approach - a self-signed cert for development purposes only
console.log('Creating development-only self-signed certificate for HTTPS...');

// Create a basic self-signed certificate for development
const key = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4DnQUIMgWvYaw
hbkjQZ2b0E2Q9CuMPqY01xWFCHvUOBMY0a/U9aDFD1NU1b2QVei3/5v0jYS0wYGk
8QnJk3aAWYdbmOguLgfYaWWlpLICpXac7DLQRDOUqY+yCkWjMqg0B6NcOLdz2CR5
qEkPXYrvA9m4aJxZQxYxeWv6JJP1E1gUbggE0HkE0wMEJCeVjj8YdhZ9DlUvxXNi
OTpj+kBq5hL5WMTDHCsq/FXuZlmvNEpwGbGkM5cBR8Kj7HPRuJPIY2y4y9J1kx45
+eNhP81xRzyZYPQDcxzc5aIhV3anHCHcYuFA6UH1/QiRMHyvj4PEU2Mz0jApwcnm
KcP+nkF7AgMBAAECggEAEHX4t1bLRrxDPjdSU91p89Gm5qfCCxQhw9LMO3AA5Gde
nAznFjOGvrP8Z5OJA0QdHiu2JgY03l6a+J0FQQNlzPyfHCPo6+jVnrft4jBIaRm5
vAUjZcKcIk9ZvLOEPqrYZ3CR5ykVzb8LSzLxguz3QUvJE9ggR3Wbg38MJnLUhMBH
0GimeLyXgI7nRF9nzTBK5f/J1egf27HOC1QK0y454cDkpL1/fMlN/SRZnYEadpKZ
OLFYYoc1f/qtxrZGKuFqIxdVpbFjsYwKVJJ1ZXTrg/HjLDkfYJiN5OE1w/UDseXl
Bw/bEqv5q2SCmSbFrMGQpLpEOxAF4I4hlC84ZYVFgQKBgQDmC3Vk/RBvXN1rYCqj
jZ9bZGw+C3/nEZ124hSD3xr711HCEDjRJkiKqZ31VGPxjLaxNJhxzGVADOFBDoXI
V6A6QO7+QD6Id6BKZpJRFbisaZoTjvElazJQBBcXkhwrGTi3EHqMJa93aG2cSfsv
/EyuVEYt8Dm66mVpQpQ44g5FWwKBgQDM3J2XvmEGc4UBcjwLlaMH2VnAgDoZ/iLm
aYyLH3ZUzQPpzR3L0TBh+4WwjgArxWn5FlH4+EyBvz4jB0N31XIEpGrB2oKZZ0R5
Nj0s8oD3bQJgNJQ7gJ+qSI6T2KR8bYpNSXrLDz3NMtUheacqVPjJIHlmPKVOB8P9
kB+HYJfSwQKBgHRfkMxwouG7YLNvLL+1jxQH3kJcGIJgHUmzNcimHjnIu5JhfQBH
MQWL4KG9pF3jbISVMpqQ7qLnZOpEKfwkQQFhmWFYwbNcEX5UEZGZUCnY2FQoBVlK
GZa55Ye8YZwOKkuIMi6Z2VZ9U9Z/r9g9LE2QgQn8j1kEO9nQZxD7VEFVAoGAN+AE
kjqQHyk+DNc9iE5tpCayn3XJ6f9YwBQxOlwcFJnhKvpiKGnGf8oQMrBQxUXdxNwx
EW9SelFE+wc0VYlbOk/KcGcoqPMJg+ZKxwZoTjCYnf3Xu7ElumiUi72J5i+zC2NH
k6lBUu/nN3RVgAf+1RGFHRkHdLNTmCp83Hvo9QECgYAe/FUSwiRVynXs4mur/vWR
u4pUy5+Mi/2ViL8o6L1V3AGFHCrFnNoTpewU9HwG/JRwuTQFVVbLtgAoUWxC0VdL
WTpFO4PcKrgFjyYnxB1V/J1I1x6tmXW0xQvYbXeN+FPqLtECuLvQnf3OAwMuTF5z
ioUKGRmr+bOZQd+8I7WToA==
-----END PRIVATE KEY-----`;

const cert = `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUEHnLRoYwTvN9IoiRdh3M0+BWckowDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNDA0MDYyMzA3NTNaFw0yNTA0
MDYyMzA3NTNaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQC4DnQUIMgWvYawhbkjQZ2b0E2Q9CuMPqY01xWFCHvU
OBMY0a/U9aDFD1NU1b2QVei3/5v0jYS0wYGk8QnJk3aAWYdbmOguLgfYaWWlpLIC
pXac7DLQRDOUqY+yCkWjMqg0B6NcOLdz2CR5qEkPXYrvA9m4aJxZQxYxeWv6JJP1
E1gUbggE0HkE0wMEJCeVjj8YdhZ9DlUvxXNiOTpj+kBq5hL5WMTDHCsq/FXuZlmv
NEpwGbGkM5cBR8Kj7HPRuJPIY2y4y9J1kx45+eNhP81xRzyZYPQDcxzc5aIhV3an
HCHcYuFA6UH1/QiRMHyvj4PEU2Mz0jApwcnmKcP+nkF7AgMBAAGjUzBRMB0GA1Ud
DgQWBBQCy5g14qqZRV0bsZvU+XWykABsYTAfBgNVHSMEGDAWgBQCy5g14qqZRV0b
sZvU+XWykABsYTAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQCG
MhyBQ/wZAzZ+EmkJWqqjQoCe1Blj8XVj6/L5U+qRBfvRX4f+LY4mh0pHCUWkFXmr
ynCXMOYtIgE0Mt7BnaoN6VQBx9KUEDEXDqpYdY0q5w5VtjfZBHQtHLnqIZ7w78QX
TKC12qfT8Vx9rA2NvBUlSgCZXhWoF/AHMJhroQP5QlJEMjFRCJnAMAFaTzxvUBIp
u1XUCMjgWdejTucjAby7m0XlqBuY11Zj2bqyXgH9i8NcOCdS+g5+l1X4QIkwdIZZ
cLRH/pDBy2NwYvFmPVwlIwsecnolCFE+ygCN5nTOdLOj8To+pKcFkwS2qbQwbH0m
vV3/7OZ0QpLZG09QkGsW
-----END CERTIFICATE-----`;

// Write the certificate files
fs.writeFileSync(path.join(certDir, 'key.pem'), key);
fs.writeFileSync(path.join(certDir, 'cert.pem'), cert);

console.log('Self-signed certificate created for development use only');
console.log('Files saved to cert/key.pem and cert/cert.pem');
console.log('Warning: This certificate is not trusted by browsers - you will need to accept security warnings');
console.log('You can now run the HTTPS server: node https-server.js'); 
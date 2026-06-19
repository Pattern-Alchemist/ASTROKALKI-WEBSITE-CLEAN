const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '..', '.next');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function serve(res, filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not Found');
  }
}

createServer((req, res) => {
  const { pathname } = parse(req.url, true);
  
  // Homepage
  if (pathname === '/' || pathname === '') {
    return serve(res, path.join(STATIC_DIR, 'server', 'app', 'index.html'));
  }
  
  // Static Next.js assets: /_next/...
  if (pathname.startsWith('/_next/')) {
    const filePath = path.join(STATIC_DIR, pathname);
    if (fs.existsSync(filePath)) return serve(res, filePath);
  }
  
  // Public directory files
  const publicPath = path.join(PUBLIC_DIR, pathname);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return serve(res, publicPath);
  }
  
  // Fallback to index.html for SPA
  return serve(res, path.join(STATIC_DIR, 'server', 'app', 'index.html'));
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Lightweight server ready on 0.0.0.0:${PORT}`);
});

// Keepalive
setInterval(() => {}, 60000);

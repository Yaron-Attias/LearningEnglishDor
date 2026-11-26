const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const preview = path.join(__dirname, 'compact-header-options.html');
http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1:4174').pathname;
  if (pathname !== '/' && pathname !== '/compact-header-options.html') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
  fs.readFile(preview, (error, content) => {
    if (error) { res.writeHead(500); return res.end('Preview unavailable'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(content);
  });
}).listen(4174, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4174'));

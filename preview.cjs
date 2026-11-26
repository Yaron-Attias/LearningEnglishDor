const http=require('node:http'),fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'index.html'));
http.createServer((req,res)=>{if(req.url==='/'||req.url==='/index.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(require('node:path').join(__dirname,'index.html')))}else{res.writeHead(404);res.end('Not found')}}).listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173'));

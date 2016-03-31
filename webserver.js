// webserver  어플리케이션 만드는 코드
const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

// server 한대를 만든다. 
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

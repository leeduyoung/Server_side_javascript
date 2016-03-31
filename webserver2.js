// webserver  어플리케이션 만드는 코드
const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

// server 한대를 만든다.
// http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello World\n');
// }).listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

//위와 같은 코드이나 축약형을 풀어서 코딩한것임.
var server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  res.end('Hello World');
});
server.listen('1337', '127.0.0.1', function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});

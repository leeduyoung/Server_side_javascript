var express = require('express');
var app = express();

//public directory를 정적인 페이지를 두는데 사용한다.
app.use(express.static('public'));

app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/route.png">');
});

app.get('/dynamic', function(req, res){
  var time = new Date();
  var lis = '';
  for (var i = 0; i < 5; i++) {
    lis = lis + '<li>coding</li>';
  }
  var output = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    Hello, Dynamic!!!!!
    <ul>
    ${lis}
    </ul>
    ${time}
  </body>
  </html>
`;
  res.send(output);
});

// app.get() : router 웹(client)과 컨트롤러를 연결해준다.
// function은 controller라고 한다. router로 인해 연결된 값을 처리한다.
app.get('/', function(req, res){
  res.send('Hello home page');
});

app.get('/login', function(req, res){
  res.send('<h1>Please login<h1>');
});

app.listen(3000, function(){
  console.log("Connected 3000 port!!");
});

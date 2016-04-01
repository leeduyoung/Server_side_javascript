var express = require('express');
var app = express();

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

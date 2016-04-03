var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.locals.pretty = true;

app.listen(3000, function(){
  console.log("Connected 3000 port!!");
});

// sementic url 사용하기
app.get('/topic/:id', function(req, res){
  var topics = ['Javascript', 'Nodejs', 'Express', 'Jade'];
  var lis = '';
  var time = new Date();
  for (var i = 0; i < topics.length; i++) {
    //lis = lis + '<li>'+topics[i]+'</li>';
    lis += '<a href="/topic/'+i+'">'+topics[i]+'</a><br>'
  }
  var output = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    ${lis}<br>
    ${topics[req.params.id]}<br>
    ${time}
  </body>
  </html>
`;
  res.send(output);
});

app.get('/topic', function(req, res){
  var topics = ['Javascript', 'Nodejs', 'Express', 'Jade'];
  var lis = '';
  var time = new Date();
  for (var i = 0; i < topics.length; i++) {
    //lis = lis + '<li>'+topics[i]+'</li>';
    lis += '<a href="/topic?id='+i+'">'+topics[i]+'</a><br>'
  }
  var output = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    ${lis}<br>
    ${topics[req.query.id]}<br>
    ${time}
  </body>
  </html>
`;
  res.send(output);

  //res.send(topics[req.query.id]);
  //res.send(req.query.id + ',' + req.query.name); //여러개의 값을 받기
  //res.send('Hello');
});

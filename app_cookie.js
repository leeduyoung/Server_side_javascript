var express = require('express');
var app = express(); // cookie 기능을 가지고 있지 않음.
var cookieParser = require('cookie-parser'); // cookie 값을 사용할때 붙이는 미들웨어

app.use(cookieParser());

app.get('/count', function(req, res){

  var cookie_count = parseInt(req.cookies.count);

  if(cookie_count){
    //cookie_count++;
    cookie_count+=1;
  }
  else{
    cookie_count = 1;
  }

  res.cookie('count', cookie_count);
  res.send('Count : ' + cookie_count);
});

app.listen(3000, function(){
  console.log('Connect 3000 port');
});



// var express = require('express');
// var cookieParser = require('cookie-parser');
// var app = express();
// app.use(cookieParser());
// app.get('/count', function(req, res){
//   if(req.cookies.count){
//     var count = parseInt(req.cookies.count);
//   } else {
//     var count = 0;
//   }
//   count = count+1;
//   res.cookie('count', count);
//   res.send('count : ' + count);
// });
// app.listen(3003, function(){
//   console.log('Connected 3003 port!!!');
// });

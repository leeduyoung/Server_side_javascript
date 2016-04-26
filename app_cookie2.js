var express = require('express');
var app = express();
var cookie = require('cookie-parser');

app.use(cookie('!@#%%@#@')); //cookie 암호화. 암호화된 쿠키를 서버로 보냄.

app.listen(3000, function(){
  console.log('Connect 3000 port');
});

app.get('/cookie', function(req, res){

  var cookie_count = parseInt(req.signedCookies.cookie);

  if(cookie_count){
    // request에 cookie 내용이 있을 경우
    cookie_count++;
  }
  else{
    // request에 cookie 내용이 없을 경우
    cookie_count = 1;
  }

  // res.cookie('count', cookie_count);
  res.cookie('cookie', cookie_count, {signed:true});
  res.send('cookie : ' + cookie_count);
});

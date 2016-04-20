var express = require('express');
var session = require('express-session'); // 세션정보는 메모리에 저장함
var bodyParser = require('body-parser');
var app = express();

app.use(session({
  secret: '1@%24^%$3^*&98&^%$', //암호화할 키값 입력
  resave: false,
  saveUnitialized: true
}));

app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function(){
  console.log('Connect 3000 port');
});

app.get('/count', function(req, res){

  console.log(req);
  //console.log(req.session);
  if(req.session.count)
  {
    req.session.count++;
  }
  else
  {
    req.session.count = 1;
  }
  res.send('count: '+req.session.count);
});

app.get('/tmp', function(req, res){
  res.send('result: '+ req.session.count);
});

app.get('/auth/login', function(req, res){
  var output=`
  <h1>LOGIN</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit" value="확인">
      </p>
    </form>
  `;
  res.send(output);
});

app.post('/auth/login', function(req, res){
  var userDB = {
    username: 'leedu',
    password: '1234'
  };

  var username = req.body.username;
  var password = req.body.password;

  //DB에서 데이터 처리 > 코드로 대체(복잡성 최소화)
  if(username === userDB.username && password === userDB.password)
  {
    //res.send('Hello ' + username);
    res.redirect('/welcome');
  }
  else
  {
    res.send('Failed to Login. <p><a href="/auth/login">login</a></p>')
  }
  res.send(req.body.username);
});

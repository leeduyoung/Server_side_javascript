var express = require('express');
var session = require('express-session'); // 세션정보는 메모리에 저장함
var bodyParser = require('body-parser');
var app = express();
var FileStore = require('session-file-store')(session); // 세션 정보를 메모리에 저장하지 않고 파일에 저장할때 사용.

app.use(session({
  secret: '1@%24^%$3^*&98&^%$', //암호화할 키값 입력
  resave: false,
  saveUninitialized: true,
  store: new FileStore() //추가 > sessions 디렉터리 생성됨.
  // 세션을 어디에 저장하고 싶은지 원하는 모듈을 붙여주면 됨.
}));

app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function(){
  console.log('Connect 3000 port');
});

var userDB = [{
  username: 'leeduyoung',
  password: '1234',
  displayName: 'leedu'
}];

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
  var username = req.body.username;
  var password = req.body.password;

  for(var i = 0; i < userDB.length; i++)
  {
    var user = userDB[i];
    if(username === user.username && password === user.password)
    {
      req.session.displayName = user.displayName;
      return req.session.save(function(){
        res.redirect('/welcome');
      });
    }
    res.send('Failed to Login. <p><a href="/auth/login">login</a></p>')
  }

  // //DB에서 데이터 처리 > 코드로 대체(복잡성 최소화)
  // if(username === userDB.username && password === userDB.password)
  // {
  //   req.session.displayName = userDB.displayName;
  //   res.redirect('/welcome');
  // }
  // else
  // {
  //   res.send('Failed to Login. <p><a href="/auth/login">login</a></p>')
  // }
});

app.get('/welcome', function(req, res){
  if(req.session.displayName)
  {
    // 정상적인 로그인 상황
    res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">Logout</a>
      `);
  }
  else
  {
    // 로그인 안하고 url을 통해 접근할 경우
    res.send(`
        <h1>Welcome</h1>
        <ul>
          <li><a href="/auth/login">Login</a></li>
          <li><a href="/auth/register">Register</a></li>
        </ul>
      `);
  }
});

// logout시 세션정보를 날려야함. (지워야함)
app.get('/auth/logout', function(req, res){
  delete req.session.displayName; //자바스크립트 명령. 세션지우기.
  res.redirect('/auth/login');
});

app.get('/auth/register', function(req, res){
  var output = `
  <h1>REGISTER</h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="displayName" placeholder="displayName">
      </p>
      <p>
        <input type="submit" value="확인">
      </p>
    </form>
  `;
  res.send(output);
});

app.post('/auth/register', function(req, res){

  var insertUser =
  {
    username : req.body.username,
    password : req.body.password,
    displayName : req.body.displayName
  };

  var bool = true;
  for(var i = 0; i < userDB.length; i++)
  {
    if(insertUser.username === userDB[i].username)
    {
      // 이미 회원 존재
      res.send('Failed to Register. <p><a href="/auth/register">register</a></p>')
      bool = false;
    }
  }

  // insert user
  if(bool)
  {
    userDB.push(insertUser);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
  }
});

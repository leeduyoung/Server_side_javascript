var express = require('express');
var session = require('express-session'); // 세션정보는 메모리에 저장함
var bodyParser = require('body-parser');
var app = express();
var FileStore = require('session-file-store')(session); // 세션 정보를 메모리에 저장하지 않고 파일에 저장할때 사용.
var md5 = require('md5');
var sha256 = require('sha256');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

app.use(session({
  secret: '1@%24^%$3^*&98&^%$', //암호화할 키값 입력
  resave: false,
  saveUninitialized: true,
  store: new FileStore() //추가 > sessions 디렉터리 생성됨.
  // 세션을 어디에 저장하고 싶은지 원하는 모듈을 붙여주면 됨.
}));

app.use(bodyParser.urlencoded({extended: false}));

//passport 초기화 하고, 사용할수있도록 설정.
app.use(passport.initialize());
//passport 를 이용해서 인증할때 세션을 사용하겠다. 주의할점은 app.use에 세션을 먼저 설정한 후에 사용해야한다.
app.use(passport.session());

app.listen(3000, function(){
  console.log('Connect 3000 port');
});

var salt = '!@#$%^&*(*&^%$)';

var userDB = [
  {
    authId:'local:leeduyoung',
    username: 'leeduyoung',
    //password: '9802a51cbde83d86a73dbd127e80e972',  //md5 hash value
    password: '240d1ade20e045256584e16d38678f09ab28d46c207bd9c91a3c59e4462b4221',
    salt: '!@#$%#',
    displayName: 'leedu'
  },
  {
    authId:'local:dylee',
    username: 'dylee',
    //password: '82687491b97b9d07e34cf59e3818e9d0',  //md5 hash value
    password: 'c43b8a22fe8ad726a8baf84919ff4668570a0689a88cc9db16bf96392a79b202',
    salt: '!@1$5#$23%#',
    displayName: 'dylee'
  }
];

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
    <a href="/auth/facebook">facebook</a>
  `;
  res.send(output);
});

// passport -> configure -> session에 있음.
// done()의 두번째 인자가 false가 아니라면 serializeUser()메소드가 실행된다.
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  //done(null, user.username); //현재 로그인된 사용자의 식별자값만을 두번째 인자로 넣는다. session에 저장됨.
  done(null, user.authId);
});

// login 상태(session상태)라면 웹에 접속했을때, 아래 메소드가 실행된다.
passport.deserializeUser(function(id, done) {
  // mongoDB code
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });

  console.log('deserializeUser', id);
  for(var i=0; i<userDB.length; i++)
  {
    var user = userDB[i];
    if(user.authId === id)
    {
      return done(null, user);
    }
  }
  done('There is no user.');
});

passport.use(new FacebookStrategy({
    clientID: '1615541595435602',
    clientSecret: 'a968d1230f7186e764bee648d26ac2fa',
    //callbackURL: "http://www.example.com/auth/facebook/callback"
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });

    // profile 정보를 사용하여 사용자가 있다면 done 없다면 err
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    for(var i=0; i<userDB.length; i++)
    {
      var user = userDB[i];
      if(user.authId === authId)
      {
        // 이미 존재하는 사용자
        return done(null, user);
      }
    }
    // 존재하지 않을 경우 새로운 유저값을 데이터베이스에 추가
    var insertUser = {
      'authId' : authId,
      'displayName' : profile.displayName,
      'email' : profile.emails[0].value
    };
    userDB.push(insertUser);
    done(null, insertUser);
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) { //사용자가 입력한 username, poassword가 들어온다.
    // mongoDB 인증 코드.
    // User.findOne({ username: username }, function(err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });

    //나한테 맞는 코드로 변경
    for(var i = 0; i < userDB.length; i++)
    {
      var user = userDB[i];
      console.log("db", user.username, user.password);
      console.log(sha256(password+user.salt));
      console.log('input', username, password);
      if(username === user.username && sha256(password+user.salt) === user.password)
      {
        console.log('LocalStrategy', user);
        return done(null, user);
      }
    }
    //return done(null, false, {message: 'Incorrect username or password'});
    return done(null, false);
  }
));

// 패스포트에서 인증작업실시 (local에 해당하는 전략으로 실시 - LocalStrategy)
app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false })
);
// app.post('/auth/login', function(req, res){
//   var username = req.body.username;
//   var password = req.body.password;
//
//   for(var i = 0; i < userDB.length; i++)
//   {
//     var user = userDB[i];
//     if(username === user.username && sha256(password+user.salt) === user.password)
//     {
//       req.session.displayName = user.displayName;
//       return req.session.save(function(){
//         res.redirect('/welcome');
//       });
//     }
//   }
//   res.send('Failed to Login. <p><a href="/auth/login">login</a></p>')
// });

//email도 페북에서 가져오고 싶은 경우 scope에 추가하여 사용.
app.get('/auth/facebook', passport.authenticate('facebook'));

// app.get('/auth/facebook', passport.authenticate('facebook',
// {scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/welcome',
                                      failureRedirect: '/auth/login' }));

app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName)
  {
    // 정상적인 로그인 상황
    res.send(`
        <h1>Hello, ${req.user.displayName}</h1>
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
  //delete req.session.displayName; //자바스크립트 명령. 세션지우기.
  req.logout();
  req.session.save(function(){
    res.redirect('/auth/login');
  });
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
    authId : 'local:'+req.body.username,
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
    req.login(insertUser, function(err) {
      if (err) { return next(err); }
      return res.redirect('/welcome');
    });
    // req.session.displayName = req.body.displayName;
    // req.session.save(function(){
    //   res.redirect('/welcome');
    // });
  }
});

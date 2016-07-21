var express = require('express');
var session = require('express-session'); // 세션정보는 메모리에 저장함
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var OrientoStore = require('connect-oriento')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var assert = require("assert");

var opts = {
  password: "helloworld"
};

var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '2831647'
});
var db = server.use('leeset');

var config = {
        session: {
            server: "host=localhost&port=2424&username=root&password=2831647&db=leeset"
        }
    };


app.use(session({
  secret: '1@%24^%$3^*&98&^%$', //암호화할 키값 입력
  resave: false,
  saveUninitialized: true,
  //store: new FileStore() //추가 > sessions 디렉터리 생성됨.
  // 세션을 어디에 저장하고 싶은지 원하는 모듈을 붙여주면 됨.
  store: new OrientoStore(config.session)
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
  console.log('deserializeUser', id);
  var sql = "SELECT displayName FROM user WHERE authId=:authId";
  db.query(sql, {params:{authId:id}}).then(function(results){
    if(results.length === 0){
      done('There is no user');
    }else{
      done(null, results[0]);
    }
  });
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
    var sql = 'SELECT FROM user WHERE authId=:authId';
    db.query(sql, {params:{authId:authId}}).then(function(results){
      console.log(results, authId);
      if(results.length === 0){
        var insertUser = {
          'authId': authId,
          'displayName': profile.displayName,
          'email': profile.emails[0].value
        };
        var sql = 'INSERT INTO user (authId, displayName, email) VALUES (:authId, :displayName, :email)';
        db.query(sql, {params:insertUser}).then(function () {
          done(null, insertUser);
        }, function (error) {
          console.log(error);
          done('Error');
        })
      }
      else{
        return done(null, results[0]);
      }

    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done){ //사용자가 입력한 username, poassword가 들어온다.
    var sql = 'SELECT * FROM user WHERE authId=:authId';
    db.query(sql, {params:{authId : 'local:'+username}}).then(function(results){
      console.log(results);
      var user = results[0];

      if(results.length === 0){
        return done(null, false);
      }

      return hasher({password:password, salt:user.salt}, function(err, password, salt, hash){
        if(hash === user.password){
          console.log('LocalStrategy', user);
          done(null, user);
        }
        else{
          console.log('login failed. hash : ', hash);
          console.log('user.password : ', user.password);
          done(null, false);
        }
      });
    });
  }
));

// 패스포트에서 인증작업실시 (local에 해당하는 전략으로 실시 - LocalStrategy)
app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false })
);

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

  hasher({password:req.body.password}, function(err, password, salt, hash){
    var insertUser ={
      authId : 'local:'+req.body.username,
      username : req.body.username,
      password : hash,
      salt : salt,
      displayName : req.body.displayName
    }

    //orientDB 사용코드 추가
    var sql = 'INSERT INTO user (authId, username, password, salt, displayName) VALUES(:authId, :username, :password, :salt, :displayName)';
    db.query(sql,{
      params:insertUser
    }).then(function(results){
      req.login(insertUser, function(err){
        req.session.save(function(){
          res.redirect('/welcome');
        });
      });
    }, function(error){
      console.log(error);
      res.status(500);
    });
  });
});

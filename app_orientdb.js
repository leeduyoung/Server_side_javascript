var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({ //callback함수 안에 여러가지 조건문 등을 넣어서 처리 할 수 있다.
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname + '-' + Date.now())
    cb(null, file.originalname)
  }
});
//var upload = multer({dest : 'uploads/'}); //multer모듈을 사용할 수 있도록 해줌. (경로설정)
var upload = multer({storage: storage}); //storage 속성은 dest보다 더 구체적으로 설정할 수 있다. 저장경로, 저장이름
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '2831647'
});
var db = server.use('leeset');

app.set('views', './views_orientdb');
app.set('view engine', 'jade');
app.use('/user', express.static('uploads')); //uploads 디렉터리의 이미지를 /user 라우터를 통하여 제공
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;

app.get('/upload', function(req, res){
  res.render('upload');
});

// upload.single('avatar') -
app.post('/upload',  upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('uploaded : '+req.file.originalname);
});

app.get('/topic/add', function(req, res){
  var sql = 'SELECT FROM topic';

  db.query(sql).then(function(results){
    res.render('add', {topics: results});
  });
});

app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic(title, description, author) VALUES(:title, :description, :author)';
  db.query(sql,{
    params:{
      title: title,
      description: description,
      author: author
    }
  }).then(function(results){
    res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
  })
});

app.get('/topic/:id/edit', function(req, res){
  var sql = 'SELECT FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(results){
    sql = 'SELECT FROM topic WHERE @rid=:rid';

    db.query(sql, {
      params:{
        rid: id
      }
    }).then(function(topic){
      res.render('edit', {topics: results, topic: topic[0]});
    });
  });
});

app.post('/topic/:id/edit', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=:title, description=:description, author=:author WHERE @rid=:rid';
  db.query(sql,{
    params:{
      title: title,
      description: description,
      author: author,
      rid: id
    }
  }).then(function(results){
    res.redirect('/topic/'+encodeURIComponent(id));
  });
});

app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(results){
    sql = 'SELECT FROM topic WHERE @rid=:rid';

    db.query(sql, {
      params:{
        rid: id
      }
    }).then(function(topic){
      console.log(topic);
      res.render('delete', {topics: results, topic: topic[0]});
    });
  });
});

app.post('/topic/:id/delete', function(req, res){
  var sql = 'DELETE FROM topic WHERE @rid=:rid';
  var id = req.params.id;
  db.query(sql,{
    params:{
      rid: id
    }
  }).then(function(results){
    res.redirect('/topic');
  });
});

app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT FROM topic';
  var id = req.params.id;

  db.query(sql).then(function(results){
    if(id){
        sql = 'SELECT FROM topic WHERE @rid=:rid';
        db.query(sql, {
          params:{
            rid: id
          }
        }).then(function(topic){
            res.render('view', {topics: results, topic: topic[0]});
        });
    }
    else {
      res.render('view', {topics: results});
    }
  });
});

app.listen(3000, function(){
  console.log('connected, 3000 port!!');
});

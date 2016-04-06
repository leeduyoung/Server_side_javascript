var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.set('views', './views_file');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;

app.get('/topic/new', function(req, res){
  res.render('new');
});

app.get('/topic', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('view', {topics:files}); //인자구성. template파일 이름, 전달할 객체
  });
});

app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!!');
  });
});

app.get('/topic/:id', function(req, res){

  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    var id = req.params.id;
    fs.readFile('data/'+id, 'utf-8', function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      //res.send(data.toString());
      res.render('view', {topics:files, title:id, description:data});
    });
    //res.render('view', {topics:files}); //인자구성. template파일 이름, 전달할 객체
  });
});

// 위의 하나의 라우터로 모두 처리한다.
// app.get('/topic/Node.js', function(req, res){
//   fs.readFile('data/Node.js', function(err, data){
//     if(err){
//       res.status(500).send('Internal Server Error');
//     }
//     //console.log(data);
//     res.send(data.toString());
//   });
// });
//
// app.get('/topic/Javascript', function(req, res){
//   fs.readFile('data/Javascript', function(err, data){
//     if(err) throw err;
//     //console.log(data);
//     res.send(data.toString());
//   });
// });

app.listen(3000, function(){
  console.log('connected, 3000 port!!');
});

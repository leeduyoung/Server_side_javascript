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

app.set('views', './views_file');
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

app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });
});

app.get(['/topic', '/topic/:id'], function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    var id = req.params.id;
    if(id){
      // id가 존재할 경우
      fs.readFile('data/'+id, 'utf-8', function(err, data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        //res.send(data.toString());
        res.render('view', {topics:files, title:id, description:data});
      });
    }
    else {
      res.render('view', {topics:files}); //인자구성. template파일 이름, 전달할 객체
    }
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
    res.redirect('/topic');
  });
});

// app.get('/topic/:id', function(req, res){
//
//   fs.readdir('data', function(err, files){
//     if(err){
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//
//     var id = req.params.id;
//     fs.readFile('data/'+id, 'utf-8', function(err, data){
//       if(err){
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       }
//       //res.send(data.toString());
//       res.render('view', {topics:files, title:id, description:data});
//     });
//     //res.render('view', {topics:files}); //인자구성. template파일 이름, 전달할 객체
//   });
// });

// app.post('/topic', function(req, res){
//   var title = req.body.title;
//   var description = req.body.description;
//   fs.writeFile('data/'+title, description, function(err){
//     if(err){
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     res.send('Success!!');
//   });
// });

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

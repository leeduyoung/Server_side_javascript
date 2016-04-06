var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'jade');
app.set('views', './views_fs');

app.use(express.static('public_fs'));
app.use(bodyParser.urlencoded({extended: false}));

app.locals.pretty=true;

app.listen(3000, function(){
  console.log('Connected 3000 port');
});

//route
app.get('/', function(req, res){
  //res.send('Hello node js');
  res.render('form');
});

app.post('/form_post_receiver', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  res.send(title+', '+description);
});

app.get('/form_post_receiver', function(req, res){
  var title = req.query.title;
  var description = req.query.description;
  res.send(title+', '+description);
});

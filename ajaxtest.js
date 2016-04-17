var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //post 요청 처리시 사용.

// node.js용 웹프레임워크 express에 jade라고하는 node.js용 view engine 추가 (연결)
app.set('view engine', 'jade');

// jade 템플릿이 들어있을 경로 - 생략 하더라도 디폴트값으로 설정됨. 아래와 동일.
app.set('views', './views');

//public directory를 정적인 페이지를 두는데 사용한다.
app.use(express.static('public'));

// parse application/x-www-form-urlencoded (우리 프로젝트에 붙이는것. Express에 붙이는것임)
// post방식 사용하려면 추가해줘야함
app.use(bodyParser.urlencoded({ extended: false }))

// 웹상에서 html코드 이쁘게 보이게 하기.
app.locals.pretty = true;

app.post('/topic', function(req, res){
  res.send('hihi');
});

app.listen(3000, function(){
  console.log("Connected 3000 port!!");
});

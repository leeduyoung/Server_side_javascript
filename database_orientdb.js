var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '2831647'
});

var db = server.use('leeset');
console.log('Using database: ' + db.name);

// // 특정 레코드 조회
// db.record.get('#12:1')
// .then(function (record) {
//   console.log('Loaded record:', record);
// });

// // topic 테이블의 모든 레코드 조회
// var sql = 'select * from topic';
// db.query(sql).then(function(results){
//   console.log(results);
// });

// select
// var sql = 'select * from topic where @rid=:rid';
// var param = {
//   params:{
//     rid:'#12:0'
//   }
// };
// db.query(sql, param).then(function(results){
//   console.log(results);
// });

//insert
// var sql = 'insert into topic(title, description) values(:title, :description)';
// db.query(sql, {
//   params:{
//     title: 'Express',
//     description: 'Express is framework for web'
//   }
// }).then(function(results){
//   console.log(results);
// });

//delete
// var sql = 'delete from topic where title=:title';
// db.query(sql, {
//   params:{
//     title: 'Express'
//   }
// }).then(function(results){
//   console.log(results);
// });

//update
var sql = 'update topic set title=:title where @rid=:rid';
db.query(sql, {
  params:{
    title: 'Node.js2',
    rid: '#12:1'
  }
}).then(function(results){
  console.log(results);
})

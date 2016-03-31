var fs = require('fs');

//sync
console.log("sync");
console.log(1);
var data = fs.readFileSync('/Users/leedu/Desktop/Dev/js/server_side_javascript/data.txt', {encoding: 'utf8'});
console.log(2);
console.log(data);
console.log(3);

//async - 되도록이면 async를 사용하는 것을 추천한다.
console.log("async");
console.log(1);
fs.readFile('/Users/leedu/Desktop/Dev/js/server_side_javascript/data.txt', {encoding: 'utf8'}, function(err, data){
  console.log(2);
  console.log(err); //error가 없다면 null
  console.log(data); // error가 안나면, data에 값이들어감.
});
console.log(3);


// console.log(2);
// fs.readFile('/Users/leedu/Desktop/Dev/js/server_side_javascript/data.txt', (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

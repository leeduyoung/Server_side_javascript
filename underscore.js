var _ = require('underscore');
var arr = [1,3,5,7,9];
console.log(arr[0]);
console.log(arr[arr.length-1]);

console.log(_.first(arr));
console.log(_.last(arr));

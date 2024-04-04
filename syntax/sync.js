var fs = require('fs');
 
/*
//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/
 
 
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
    console.log(result);
});
console.log('C');

// 이렇게 순서를 다르게 해도 파일을 읽는 작업이 젤 마지막에 console 된다!
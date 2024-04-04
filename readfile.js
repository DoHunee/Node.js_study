var fs = require('fs'); //fs 모듈 사용해서 파일시스템 접근!!
fs.readFile('sample.txt', 'utf8', function(err, data){
  console.log(data);
});
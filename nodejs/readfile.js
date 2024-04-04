var fs = require('fs'); //fs 모듈 사용해서 파일시스템 접근!!
fs.readFile('nodejs/sample.txt', 'utf8', function(err, result){
    console.log(result);
});

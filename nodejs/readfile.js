var fs = require('fs'); //fs 모듈 사용해서 파일시스템 접근!!
fs.readFile('sample.txt', 'utf8', function(err, data){
  if (err) {
    console.error("파일 읽기 중 오류 발생:", err);
    return;
  }
  console.log(data);
});


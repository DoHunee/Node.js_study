// module.js 모듈을 사용한다 

var module = require('./module') ;
console.log(module);  // 결과값 : { v: 'v', f: [Function: f] }
module.f(); // 경과값 : v
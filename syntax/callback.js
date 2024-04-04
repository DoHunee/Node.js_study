/*
function a(){
  console.log('A');
}

// 익명함수
function (){
  console.log('A');
}

*/

var a = function(){
  console.log('A');
}

 
function slowfunc(callback){
  callback();
}
 
slowfunc(a); // 오랜시간이 걸려서 a 함수를 실행한다 
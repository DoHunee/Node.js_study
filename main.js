/*
response.end라는 코드는 (queryData.id)의 값을 페이지에 출력하는 역할이다
따라서 이제 http://localhost:3000/?id= 뒤에 오는 (queryData.id)값을 변경하면
http://localhost:3000/?id=HTML
http://localhost:3000/?id=CSS 등등의 여러가지 페이지를 만들어낼 수 있다

http://127.0.0.1:5500/index.html
http://127.0.0.1:5500/1.html
http://127.0.0.1:5500/2.html
http://127.0.0.1:5500/3.html
http://127.0.0.1:5500/checkbox.html

http://localhost:3000/?id=HTML 을 입력하면 페이지에 HTML이 출력되고
http://localhost:3000/?id=CSS 입력하면 페이지에 CSS가 출력된다

*/

// 모듈 불러오는 부분 
var http = require('http'); // http 기능 
var fs = require('fs');   // 파일 시스템 접근 기능
var url = require('url');  // URL 해석 시능
 
// 이 전체 코드 자체가 함수를 호출하여 서버를 생성하는 부분이겠지??
var app = http.createServer(function(request,response){
    
    // 이 부분이 요청된 url을 해석하는 부분이야!!
    var _url = request.url;  // 요청된 URL을 _url 변수에 저장하고, url.parse 함수를 사용하여 해당 URL을 해석
    var queryData = url.parse(_url, true).query;    //URL의 쿼리 스트링을 파싱한 결과
    var pathname = url.parse(_url, true).pathname;  //url의 경로 부분 
    
    // 루트 경로의 요청인 경우 
    if(pathname === '/'){
      // 쿼리 스트링이 없는 경우 기본적으로 보여줄 Welcome page 구성 부분 
      if(queryData.id === undefined){      
        
        // fs.readFile : 파일을 비동기적으로 읽는 명령
        // function(err, description): 이것은 파일 읽기 작업이 완료된 후 실행될 콜백 함수입니다. 이 함수는 다음 두 매개변수를 받습니다:
        // err: 파일 읽기 과정에서 오류가 발생한 경우, 이 매개변수는 오류 객체를 포함합니다. 오류가 없는 경우에는 null이 됩니다.
        // description: 파일 읽기 작업이 성공적으로 완료되면, 이 매개변수는 파일의 내용을 담은 문자열이 됩니다.
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = 'Welcome'; //제목
          var description = 'Hello, Node.js'; //내용
          
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);  // response.writeHead(200)를 호출하여 HTTP 상태 코드 200(성공)을 응답 헤더에 설정하고,
          response.end(template); //response.end(template)를 호출하여 생성된 HTML 템플릿을 응답 본문으로 전송합니다.
        });
      } 
      
      else {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
        });
      }
    } 
    
    // 루트 경로의 요청이 아닌 경우는 Not found 가 뜨겠지!!
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(3000); // 생성한 서버의 포트번호를 3000번으로 할당!
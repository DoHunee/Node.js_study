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

 
// var http = require('http');
// var fs = require('fs');
// var url = require('url');

// var app = http.createServer(function(request,response){
//     var _url = request.url; // url 이 중복되니 _url로 정의
//     var queryData = url.parse(_url, true).query;
//     console.log(queryData.id);
//     if(_url == '/'){
//       _url = '/index.html';
//     }
//     if(_url == '/favicon.ico'){
//       return response.writeHead(404);
//     }
//     response.writeHead(200);
//     response.end(queryData.id); // (queryData.id)의 값을 페이지에 출력하는 역할이다

// });
// app.listen(3000);


// 정적으로 웹 페이지 나타낸다!
// queryData.get("id")를 통해 특정 쿼리 파라미터의 값을 가져옵니다.
// 당연히 본문 내용은 안바뀌고 타잍틀만 바뀌겠지?
// var http = require("http");
// var fs = require("fs");
// var url = require("url");

// var app = http.createServer(function (request, response) {
//   var _url = request.url;
//   var queryData = new URL("http://localhost:5000" + _url).searchParams;
//   var title = queryData.get("id");

//   if (_url == "/") {
//     title = "Welcome";
//   } else if (_url == "/favicon.ico") {
//     response.writeHead(404);
//     response.end();
//     return;
//   } else {
//     title = queryData.get("id");
//   }
//   response.writeHead(200);
//   var template = `
//     <!doctype html>
//     <html>
//     <head>
//       <title>WEB1 - ${title}</title>
//       <meta charset="utf-8">
//     </head>
//     <body>
//       <h1><a href="/">WEB</a></h1>
//       <ul>
//         <li><a href="/?id=HTML">HTML</a></li>
//         <li><a href="/?id=CSS">CSS</a></li>
//         <li><a href="/?id=JavaScript">JavaScript</a></li>
//       </ul>
//       <h2>${title}</h2>
//       <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
//       <img src="coding.jpg" width="100%">
//       </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
//       </p>
//     </body>
//     </html>
//     `;
//   response.end(template);
// });
// app.listen(3000);



// 이 코드는 fs.readFile을 사용하여 파일 시스템에서 data/${queryData.id} 경로의 파일을 읽어 동적으로 페이지를 나타내는 방식!!
// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var title = queryData.id;
//     if(_url == '/'){
//       title = 'Welcome';
//     }
//     if(_url == '/favicon.ico'){
//       return response.writeHead(404);
//     }
//     response.writeHead(200);
//     fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
//       var template = `
//       <!doctype html>
//       <html>
//       <head>
//         <title>WEB1 - ${title}</title>
//         <meta charset="utf-8">
//       </head>
//       <body>
//         <h1><a href="/">WEB</a></h1>
//         <ul>
//           <li><a href="/?id=HTML">HTML</a></li>
//           <li><a href="/?id=CSS">CSS</a></li>
//           <li><a href="/?id=JavaScript">JavaScript</a></li>
//         </ul>
//         <h2>${title}</h2>
//         <p>${description}</p>
//       </body>
//       </html>
//       `;
//       response.end(template);
//     })


// });
// app.listen(3000);




// 정해진 경로가 아닌 다른 경로로 접속하면 오류 페이지가 뜨게 
var http = require('http');
var fs = require('fs');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    // console.log(url.parse(_url,true).pathname0);
 
    if(pathname === '/'){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
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
    // 루트 경로가 아닌 다른 경로로 접속하면 Not found 
    else {
      response.writeHead(404);
      response.end('Not found');
    }
 
 
 
});
app.listen(3000);
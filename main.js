/*
전의 코드와 다른점!!
첫 번째 코드는 queryData.id가 undefined일 때 올바르지 않은 파일 경로를 참조하여 파일을 읽으려고 시도합니다.
두 번째 코드는 queryData.id의 값에 관계없이 항상 ./data 디렉토리의 파일 목록을 읽고, 이를 기반으로 페이지를 생성하여 응답합니다. queryData.id 값이 존재할 경우에는 해당 파일의 내용도 추가로 읽어서 페이지에 표시합니다.
*/

// 모듈 불러오는 부분
var http = require("http"); // http 기능
var fs = require("fs"); // 파일 시스템 접근 기능
var url = require("url"); // URL 해석 시능
var qs = require('querystring'); //querystring 모듈 임포트

// 중복되는 부분을 줄이기 위해 함수 선언 후 사용
function templateHTML(title, list, body , control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}



// 이 전체 코드 자체가 함수를 호출하여 서버를 생성하는 부분이겠지??
var app = http.createServer(function (request, response) {
  // 이 부분이 요청된 url을 해석하는 부분이야!!
  var _url = request.url; // 요청된 URL을 _url 변수에 저장하고, url.parse 함수를 사용하여 해당 URL을 해석
  var queryData = url.parse(_url, true).query; //URL의 쿼리 스트링을 파싱한 결과
  var pathname = url.parse(_url, true).pathname; //url의 경로 부분
  
  
  // fs.readdir(경로, 콜백함수) : 특정 디렉토리의 파일과 하위 디렉토리 목록을 읽는 데 사용;
  // 경로: 읽고자 하는 디렉토리의 경로입니다.
  // 콜백함수: 디렉토리 읽기 작업이 완료된 후에 실행될 함수입니다. 이 함수는 두 개의 매개변수를 가집니다:    
  
  // 루트 경로의 요청인 경우
  if (pathname === "/") {
    // 쿼리 스트링이 없는 경우 기본적으로 보여줄 Welcome page 구성 부분
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        var title = "Welcome"; //제목
        var description = "Hello, Node.js"; //내용
        var list = templateList(filelist);
        var template = templateHTML(title,list,
          `<h2>${title}</h2>${description}`,
          ` <a href ="/create">create</a>`
          );
        response.writeHead(200); // response.writeHead(200)를 호출하여 HTTP 상태 코드 200(성공)을 응답 헤더에 설정하고,
        response.end(template); //response.end(template)를 호출하여 생성된 HTML 템플릿을 응답 본문으로 전송합니다.
      });
    } 
    // 루트경로의 요청이 아닌 뭐리스트링으로 접근 
    else {
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`,
            ` 
            <a href ="/create">create</a> 
            <a href ="/update?id=${title}">update</a>
            
            <form action="delete_process" method="post">
            <input type = "hidden" name="id" value ="${title}">
            <input type = "submit" value="delete">
            </form>
            `
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }

  // 데이터의 노출을 막기위해 method를 Post방식으로!! = > Post방식 안하면 url에 데이터 유출되잖아!!
  // create 경로로 접근하는 경우!!
  // create 버튼을 누르고 글을 생성할 때  
  else if(pathname === '/create'){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = templateList(filelist);
      var template = templateHTML(title, list, 
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `
      , ` `);
      response.writeHead(200);
      response.end(template);
    });
  }

  // create로 전송한 데이터를 받아 파일생성과 리다이렉션하는 부분
  else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', 
        function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
    });

  } 

  // update 경로로 접근하는 경우!!
  // 파일 선택 후 update 버튼을 눌렀을때
  else if(pathname === '/update'){
    fs.readdir("./data", function (error, filelist) {
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
      var title = queryData.id; // 수정할 파일의 원래 타이틀 이름!
      var list = templateList(filelist);
      var template = templateHTML(title,list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
      response.writeHead(200); // response.writeHead(200)를 호출하여 HTTP 상태 코드 200(성공)을 응답 헤더에 설정하고,
      response.end(template); //response.end(template)를 호출하여 생성된 HTML 템플릿을 응답 본문으로 전송합니다.
    });
  });
  }

  // update로 전송한 데이터를 받아 파일명을 변경하고 내용을 저장하는 방법 
  else if(pathname === '/update_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
    });
  }

  // delete 경로로 접근하는 경우!!
  // 파일 선택 후 delete 버튼을 눌렀을때
  else if(pathname === '/delete'){
    fs.readdir("./data", function (error, filelist) {
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
      var title = queryData.id; // 수정할 파일의 원래 타이틀 이름!
      var list = templateList(filelist);
      var template = templateHTML(title,list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
      response.writeHead(200); // response.writeHead(200)를 호출하여 HTTP 상태 코드 200(성공)을 응답 헤더에 설정하고,
      response.end(template); //response.end(template)를 호출하여 생성된 HTML 템플릿을 응답 본문으로 전송합니다.
    });
  });
  }

  else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
    });
  }

  // 조건문을 제외한 모든 비정상적 접근! => not found 
  else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000); // 생성한 서버의 포트번호를 3000번으로 할당!

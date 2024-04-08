/*
전의 코드와 다른점!!
첫 번째 코드는 queryData.id가 undefined일 때 올바르지 않은 파일 경로를 참조하여 파일을 읽으려고 시도합니다.
두 번째 코드는 queryData.id의 값에 관계없이 항상 ./data 디렉토리의 파일 목록을 읽고, 이를 기반으로 페이지를 생성하여 응답합니다. queryData.id 값이 존재할 경우에는 해당 파일의 내용도 추가로 읽어서 페이지에 표시합니다.
*/

// 모듈 불러오는 부분
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');


// 이 전체 코드 자체가 함수를 호출하여 서버를 생성하는 부분이겠지??
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
 
    // fs.readdir(경로, 콜백함수) : 특정 디렉토리의 파일과 하위 디렉토리 목록을 읽는 데 사용;
    // 경로: 읽고자 하는 디렉토리의 경로입니다.
    // 콜백함수: 디렉토리 읽기 작업이 완료된 후에 실행될 함수입니다. 이 함수는 두 개의 매개변수를 가집니다:    
  
    // 루트 경로의 요청인 경우
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } 
      // 루트경로의 요청이 아닌 뭐리스트링으로 접근 
      else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,

              ` 
              <a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              
              <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
              </form>
              `
            );
            response.writeHead(200);
            response.end(html);
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
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
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
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
    } 
      
    // update 경로로 접근하는 경우!!
    // 파일 선택 후 update 버튼을 눌렀을때
    else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
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
          response.writeHead(200);
          response.end(html);
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
    
    // delete 과정 나타내는 함수@
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

    //  조건문을 제외한 모든 비정상적 접근! => not found
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
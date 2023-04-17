var http = require("http");
var fs = require("fs");
var url = require("url");
// querystring 추가
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  return (`
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB2</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>    
  `);
}

function templateList(filelist) {
   // 목록을 출력하기 위한 코드
   var list = '<ul>';
   var i = 0;
   
   while(i < filelist.length) {
     list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
     i += 1;
   }
   list = list + '</ul>';
   return list;
}

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    //console.log(url.parse(_url, true));
    
    if(pathname === '/') {
      if(queryData.id === undefined) {
        //fs.readFile(`data/${title}`, 'utf-8', function(err, description) { // 파일을 읽어올 필요가 없기 때문에 삭제한다.          
          fs.readdir('./data', function(error, filelist) {
            //console.log(filelist);
            var title = 'Weclom';
            var description = 'Hello, Node.js';

            // 목록을 출력하기 위한 코드
            var list = templateList(filelist);

            var template = templateHTML(
              title, 
              list, 
              `<h2>${title}</h2><p>${description}</p>`, 
              `<a href="/create">create</a><a href="/update">update</a>`);
            // var template = `
            // <!doctype html>
            // <html>
            // <head>
            //   <title>WEB1 - ${title}</title>
            //   <meta charset="utf-8">
            // </head>
            // <body>
            //   <h1><a href="/">WEB</a></h1>
            //   <!-- 파일 목록을 가져오기 전 하드 코딩
            //   <ul>
            //     <li><a href="/?id=HTML">HTML</a></li>
            //     <li><a href="/?id=CSS">CSS</a></li>
            //     <li><a href="/?id=JavaScript">JavaScript</a></li>
            //   </ul>
            //   -->
            //   ${list}
            //   <h2>${title}</h2>
            //   <p>${description}</p>
            //   <!-- <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
            //   <img src="coding.jpg" width="100%">
            //   </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
            //   </p> -->
            // </body>
            // </html>    
            // `;
            
            response.writeHead(200);
            response.end(template);
          });
        //});
      } else {
        fs.readdir('./data', function(error, filelist) {
          var list = templateList(filelist);

          fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description) {
            var title = queryData.id;

            var template = templateHTML(
              title, 
              list, 
              `<h2>${title}</h2><p>${description}</p>`, 
              `<a href="/create">create</a><a href="/update">update</a>`);
            // var template = `
            // <!doctype html>
            // <html>
            // <head>
            //   <title>WEB1 - ${title}</title>
            //   <meta charset="utf-8">
            // </head>
            // <body>
            //   <h1><a href="/">WEB</a></h1>
            //   ${list}
            //   <h2>${title}</h2>
            //   <p>${description}</p>
            // </body>
            // </html>    
            // `;
            
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create') {
      // 글 생성 화면을 구현한다.
      fs.readdir('./data', function(error, filelist) {
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(
          title, 
          list,  
          `<form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit">
          </p>
         </form>
      `);
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname === '/create_process') {
      // querystring모듈을 이용하여 post 방식으로 전달된 데이터 가져오기
      var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        // 파일에 데이터를 쓸 때 사용하는 writeFile
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location: `/?id=${title}`}); // 302페이지를 다른 곳으로 리다이렉션하라는 의미
          response.end();
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }
});

app.listen(3000);
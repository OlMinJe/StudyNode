var http = require('http');
var fs = require('fs');
var url = require('url');
// querystring 추가
var qs = require('querystring');

var template = {
  HTML: function (title, list, body, control) {
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
  },
  list: function(filelist) {
    // 목록을 출력하기 위한 코드
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length) {
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i = i + 1;
      }
      list = list+'</ul>';
      return list;
  }
};

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) {
          //fs.readFile(`data/${title}`, 'utf-8', function(err, description) { // 파일을 읽어올 필요가 없기 때문에 삭제한다.          
            fs.readdir('./data', function(error, filelist) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(filelist);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
            //});
        } else {
            fs.readdir('./data', function(error, filelist) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                    var title = queryData.id;
                    var list = template.list(filelist);
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname === '/create') {
      // 글 생성 화면을 구현한다.
        fs.readdir('./data', function(error, filelist) {
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
    } else if(pathname === '/update') {
      fs.readdir('./data', function(error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
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
    } else if (pathname === '/update_process') {
      var body = "";
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        
        // 변경해주는 코드
        fs.rename(`data/${id}`, `data/${title}`, function(error) {
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
        //console.log(post);

      });
    } else if (pathname === '/delete_process') {
      var body = "";
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        var id = post.id;
        // 삭제해주는 코드
        fs.unlink(`data/${id}`, function(error) {
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);

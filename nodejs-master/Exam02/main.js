/* express 테스트
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
*/

// experss 호출하기
var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template.js');

// app 객체에 포함된 메서드 중 get과 listen을 호출하는 코드
// app.get(path, callback[...]) - 경로, 콜백함수
app.get('/', function(request, response) {
    // res.send('Hello World!');   
    // return res.send('/'); // 아래의 내용을 간결하게 말하자면 이런거임
    
    fs.readdir('./data', function(error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>`
        );
        response.send(html);
    });
});
app.get('/page', function(req, res) {
    return res.send('/page')
});
app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});  // isten메소드가 3000포트로 전달하면 사용자의 요청을 받을 수 있게한다.

// -- express() 사용 전 함수 ㄴㄴㄴ
// var http = require('http');
//var fs = require('fs'); // db사용하면서 사용 x
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var path = require('path'); // db사용하면서 사용 x
// var sanitizeHtml = require('sanitize-html'); // db사용하면서 사용 x
// 데이터베이스 설정
// var db = require('./lib/db.js');
// topic에 있는 home 함수 호출
// var topic = require('./lib/topic.js');
// var author = require('./lib/author.js');
// var app = http.createServer(function(request, response) {
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     if(pathname === '/') {
//         if(queryData.id === undefined) {
//             // fs.readdir('./data', function(error, filelist) {
//             //     var title = 'Welcome';
//             //     var description = 'Hello, Node.js';
//             //     var list = template.list(filelist);
//             //     var html = template.HTML(title, list,
//             //         `<h2>${title}</h2><p>${description}</p>`,
//             //         `<a href="/create">create</a>`
//             //     );
//             //     response.writeHead(200);
//             //     response.end(html);
//             // });
//             topic.home(request, response);
//         } else {
//             // fs.readdir('./data', function(error, filelist) {
//                 // var filteredId = path.parse(queryData.id).base;
//                 // fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
//                 //     var title = queryData.id;
//                 //     var sanitizedTitle = sanitizeHtml(title);
//                 //     var sanitizedDescription = sanitizeHtml(description, {
//                 //         allowedTags:['h1']
//                 //     });
//                 //     var list = template.list(filelist);
//                 //     var html = template.HTML(sanitizedTitle, list,
//                 //         `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
//                 //         `<a href="/create">create</a>
//                 //         <a href="/update?id=${sanitizedTitle}">update</a>
//                 //         <form action="delete_process" method="post">
//                 //             <input type="hidden" name="id" value="${sanitizedTitle}">
//                 //             <input type="submit" value="delete">
//                 //         </form>`
//                 //     );
//                 //     response.writeHead(200);
//                 //     response.end(html);
//                 // });
//             // });
//             topic.page(request, response);
//         }
//     } else if(pathname === '/create') {
//         // fs.readdir('./data', function(error, filelist) {
//         //     var title = 'WEB - create';
//         //     var list = template.list(filelist);
//         //     var html = template.HTML(title, list, `
//         //         <form action="/create_process" method="post">
//         //             <p><input type="text" name="title" placeholder="title"></p>
//         //             <p>
//         //                 <textarea name="description" placeholder="description"></textarea>
//         //             </p>
//         //             <p>
//         //                 <input type="submit">
//         //             </p>
//         //         </form>
//         //     `, '');
//         //     response.writeHead(200);
//         //     response.end(html);
//         // });
        
//         topic.create(request, response);
//     } else if(pathname === '/create_process') {
//         topic.create_process(request, response);
//     } else if(pathname === '/update') {
//         // fs.readdir('./data', function(error, filelist) {
//         //     var filteredId = path.parse(queryData.id).base;
//         //     fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
//         //         var title = queryData.id;
//         //         var list = template.list(filelist);
//         //         var html = template.HTML(title, list,
//         //             `
//         //             <form action="/update_process" method="post">
//         //                 <input type="hidden" name="id" value="${title}">
//         //                 <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//         //                 <p>
//         //                     <textarea name="description" placeholder="description">${description}</textarea>
//         //                 </p>
//         //                 <p>
//         //                     <input type="submit">
//         //                 </p>
//         //             </form>
//         //             `,
//         //             `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
//         //         );
//         //         response.writeHead(200);
//         //         response.end(html);
//         //     });
//         // });

//         topic.update(request, response);
//     } else if(pathname === '/update_process') {
//         topic.update_process(request, response);
//     } else if(pathname === '/delete_process') {
//         topic.delete_process(request, response);
//     } else if(pathname === '/author') {
//         author.home(request, response);
//     } else if(pathname === '/author/create_process') {
//         author.create_process(request, response);
//     } else if(pathname === '/author/update') {
//         author.update(request, response);
//     } else if(pathname === '/author/update_process') {
//         author.update_process(request, response);
//     } else if(pathname === '/author/delete_process') {
//         author.delete_process(request, response);
//     } else {
//         response.writeHead(404);
//         response.end('Not found');
//     }
// });
// app.listen(3000);
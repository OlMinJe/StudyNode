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
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
// body-parser 모듈 불러오기
var bodyParser = require('body-parser');
var compression = require('compression');
// compression 모듈 불러오기 -> 압축과 관련된 미들웨어

app.use(bodyParser.urlencoded({extended: false}));
//app.use(compression()); // 함수를 호출하여 해당 모듈을 이용하겠다고 선언
/* 미들웨어 만들기
app.use(function(request, response, next) {
    fs.readdir('./data', function(error, filelist) {
        request.list = filelist;
        next(); // 다음에 실행해야 할 미들웨어를 의미한다.
    })
}); // 미들웨어가 실행될 때마다 data에 있는 파일 목록을 가져와 request.list에 담고 next() 함수를 호출한다.
/**/
//* 미들웨어를 효율적으로 바꾸기 -> 요청이 있을 때마다 미들웨어가 실행되는걸 방지
app.get('*', function(request, response, next) {
    fs.readdir('./data', function(error, filelist) {
        request.list = filelist;
        next(); 
    });
}); // get 방식으로 전송하는 요청일 때만 미들웨어를 실행한다.

// app 객체에 포함된 메서드 중 get과 listen을 호출하는 코드
// app.get(path, callback[...]) - 경로, 콜백함수
app.get('/', function(request, response) {
    // res.send('Hello World!');   
    // return res.send('/'); // 아래의 내용을 간결하게 말하자면 이런거임

    // fs.readdir('./data', function(error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
    );
    response.send(html);
    // });
});

app.get('/page/:pageId', function(request, response) {
    //response.send(request.params);

    //console.log(request.list);
    // 미들웨어를 통해 모든 라우트 안의 request.list에 접근할 수 있게 되었으므로 fs.readdir 콜백을 지운다.
    // fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
        });
        // var list = template.list(filelist);
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
        );
        response.send(html);
    });
    // });
});

app.get('/create', function(request, response) {
    // fs.readdir('./data', function(error, filelist) {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>
    `, ``);
    response.send(html);
    // });
});

app.post('/create_process', function(request, response) {
    // console.log(request.list);
    // (미들웨어 get 설정후 출력해보면 파일 목록을 가진 배열이 아닌 undefined가 출력된다.)
    // => app.get()에서 두 번쨰 인수로 전달한 콜백이 미들웨어였다는 사실을 알 수 있음

    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
    });
});

app.get('/update/:pageId', function(request, response) {
    fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = request.params.pageId;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
                `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description"
                            placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update/${title}">update</a>`
            );
            response.send(html);
        });
    });
});

app.post('/update_process', function(request, response) {
   var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            // response.writeHead(302, {Location: `/?id=${title}`});
            // response.end();
            response.redirect(`/?id=${title}`);
        });
    });
});

app.post('/delete_process', function(request, response) {
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error) {
        response.redirect('/');
    });
});

app.listen(3000, function() {
    //console.log('Example app listening on port 3000!');
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
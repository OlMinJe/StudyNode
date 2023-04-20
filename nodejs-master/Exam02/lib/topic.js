// 옮기기(1)
var db = require('./db.js');
var template = require('./template.js');
// 상세보기 페이지의 코드 옮기기(1)
var url = require('url');
// 글 생성 처리 옮기기(1)
var qs = require('querystring');
// sanitize-html 라이브러리를 이용하는 코'드 추가하기
var sanitizeHTML = require('sanitize-html');


// 목록 코드 옮기기(1)
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

// 상세보기 페이지의 코드 옮기기(2)
exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error) {
            throw error;
        }
        /*
        var sql = `SELECT * FROM topic LEFT JOIN author ON
        topic.author_id=author.id WHERE
        topic.id=${db.escape(queryData.id)}`; 
        */
        // escape 메서드를 이용하여 확인 -> topic.id의 값이 sql문이 아닌 일반 문자열로 들어간다는 것을 알 수 있음
        // 연속적인 sql문이 들어올 때 어떤식으로 코드를 받아들이는지 확인하는 작업
        //console.log(sql);
        var query = db.query(`SELECT * FROM topic LEFT JOIN author ON
                    topic.author_id=author.id WHERE
                    topic.id=?`, [queryData.id], function(error2, topic) {
            if(error2) {
                throw error2;
            }
            //console.log(topic);
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${sanitizeHTML(title)}</h2>
                ${sanitizeHTML(description)}
                <p>by ${sanitizeHTML(topic[0].name)}</p>
                `,
                ` <a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                    </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

// 글 생성 화면
exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(erro2, authors) {
            //console.log(authors);

            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(sanitizeHTML(title), list,
                `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        ${template.authirSelect(authors)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        })
    });
}

// 글 생성 처리 옮기기(2)
exports.create_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`
                INSERT INTO topic (title, description, created, author_id)
                    VALUES(?, ?, NOW(), ?)`,
                [post.title, post.description, post.author], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${result.insertId}`});
                    response.end();
                }
            );
        });
}

// 글 수정 화면의 코드 옮기기
exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query('SELECT * FROM topic', function(error, topics) {
        if(error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
            if(error2) {
                throw error2;
            }
            // 글 수정 페이지에 작성자 목록 출력하기
            db.query(`SELECT * FROM author`, function(error2, authors) {
                var list = template.list(topics);
                var html = template.HTML(sanitizeHTML(topic[0].title), list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic[0].title)}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea>
                        </p>
                        <p>
                            ${template.authirSelect(authors, topic[0].author_id)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

// 글 수정 처리 코드 옮기기
exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?',
            [post.title, post.description, post.id], function(error, result) {
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
        });
    });
}

// 글 삭제 처리 코드 옮기기
exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        // var post = qs.parse(body);
        // var id = post.id;
        // var filteredId = path.parse(id).base;
        // fs.unlink(`data/${filteredId}`, function(error) {
        //     response.writeHead(302, {Location: `/`});
        //     response.end();
        // });
        var post = qs.parse(body);
        db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
        });
    });
}
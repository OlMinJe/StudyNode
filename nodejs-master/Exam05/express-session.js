var express = require('express');
var parseurl = require('parseurl');
// 세션
var session = require('express-session');
// 서버를 종료해도 세션이 지워지지 않게 해주는 미들웨어
var FileStore = require('session-file-store')(session);
    // sessions 이라는 폴더 안에 json 파일을 생성하여 저장해준다.
    // FileStore를 mysql로 바꾸면 mysql 세션 스토어로 사용하게 되는 것이다.

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore() // 세션 유지
}));

app.get('/', function(req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }
    res.send(`Views: ${req.session.num}`);
})

app.use(function(req, res, next) {
    if (!req.session.views) {
        req.session.views = {};
    }

    // get the url pathname
    var pathname = parseurl(req).pathname;

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

    next();
});

app.get('/foo', function(req, res, next) {
    res.send('you viewed this page ' + req.session.views['/foo'] + ' times');
});

app.get('/bar', function(req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + ' times');
});

app.listen(3000, function() {
    console.log('3000!');
});

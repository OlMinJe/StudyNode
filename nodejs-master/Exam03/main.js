var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
// 보안과 관련된 이슈를 자동으로 해결해주는 모듈
var helmet = require('helmet');
var topicRouter = require('./router/topic.js');
var indexRouter = require('./router/index.js');

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static('public'));
app.get('*', function(request, response, next) {
    fs.readdir('./data', function(error, filelist) {
        request.list = filelist;
        next();
    });
});
app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
}); // 매개변수가 4개인 경우에는 익스프레스 프레임워크가 에러 핸들ㄹ러 인식한다.
app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});
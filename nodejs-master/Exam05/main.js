var express = require('express');
var app = express();
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var helmet = require('helmet');
var authRouter = require('./routes/auth.js');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
    // 교육용이기 때문에 session에 저장, 원래는 DB에 저장해야됨.

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static('public'));
app.use(session({
    secret: 'asadlfkj!@#!@#dfasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.get('*', function(request, response, next) {
    fs.readdir('./data', function(error, filelist) {
        request.list = filelist;
        next();
    });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});
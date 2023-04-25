const http = require('http');
const express = require('express');
const boardRouter = require('./router/boardRouter.js');

const app = express();

app.use(express.static("public"));
app.use('/board', boardRouter);
app.listen(3000);
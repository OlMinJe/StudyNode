// npm install sweetalert2 설치

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/indexRouter")
const boardRouter = require("./routes/boardRouter");

const app = express();

app.use(express.static("public"));
app.use("/", indexRouter);
app.use(bodyParser.urlencoded({extended: false}));
app.use("/board", boardRouter);

app.listen(3000);
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const boardRouter = require("./routes/boardRouter");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/board", boardRouter);

app.listen(3000);
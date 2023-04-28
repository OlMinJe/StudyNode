const express = require("express");
const router = express.Router();
const path = require("path");
const {request} = require("express");

const template = require("../lib/template");
const db = require("../lib/db");

router.get('/', function(request, response) {
    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
        ${template.head("메인", "style.css")}
        <body>
          <div class="homepage pattern">
            <img src="/image/img02.png" onclick="location.href='/board/list';">
          </div>
        </body>
      </html>
    `);

    response.send(html);
});

module.exports = router;

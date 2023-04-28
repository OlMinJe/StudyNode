const express = require("express");
const router = express.Router();
const path = require("path");
const {request} = require("express");

const template = require("../lib/template");
const db = require("../lib/db");

//리스트
router.get("/", (request, response) => {
  let sql = "SELECT * FROM notice ORDER BY no DESC";
  db.query(sql, (error, notices) => {
    let table = (`
      <table class="boardList">
      <thead>
        <tr>
          <th>num</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
    `);
    for(let i=0; i<notices.length; i++){
      table += (`
      <tr>
        <td>${notices[i].no}</td>
        <td><a href="/notice/${notices[i].no}">${notices[i].title}</a></td>
        <td>${notices[i].author}</td>
        <td>${notices[i].cre_date.toLocaleDateString()}</td>
      </tr>
      `);
    }
    table += `</tbody></table>`;

    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
        ${template.head("공지사항")}
        <body>
          ${template.header}      
          <div class="container">
            <article id="boardList">
              ${template.pageTitle("공지사항")}
              ${table}
            </article>
          </div>
          ${template.footer}
        </body>
      </html>
    `);

    response.send(html);
  });
});

//게시물 보기
router.get("/:no", (request, response) => {
  let no = path.parse(request.params.no).base;

  let sql = `SELECT * FROM notice WHERE no=${no}`;
  db.query(sql, (error, notices) => {
    let notice = notices[0];
    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
      ${template.head("공지사항")}
      <body>
        ${template.header}
        <div class="container">
          <article id="boardRead">
            ${template.pageTitle("공지사항")}
            <table class="borderHeader">
              <thead>
              <tr>
                <td>작성자: ${notice.author}</td>
                <td>작성일: ${notice.cre_date.toLocaleDateString()}</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td colspan="2" class="txtTitle">
                  제목: ${notice.title}
                </td>
              </tr>
              <tr>
                <td colspan="2" class="txtContent">${notice.content}</td>
              </tr>
              </tbody>
            </table>            
            <div class="control">
              <div class="left">
                <button type="button" onclick="location.href='/notice/'">목록</button>
              </div>
            </div>
          </article>
          </div>
        ${template.footer}
      </body>
      </html>
    `);
    
    response.send(html);
  });
});


module.exports = router;
const express = require("express");
const router = express.Router();
const path = require("path");
const {request} = require("express");

const template = require("../lib/template");
const db = require("../lib/db");

//리스트
router.get("/list", (request, response) => {
  let sql = "SELECT * FROM freeBoard ORDER BY no DESC";
  db.query(sql, (error, boards) => {
    let table = (`
      <table class="boardList">
      <tr>
        <th></th>
        <th>제목</th>
        <th>작성자</th>
        <th>작성일</th>
      </tr>
    `);
    for(let i=0; i<boards.length; i++){
      table += (`
      <tr>
        <td>${boards[i].no}</td>
        <td><a href="/board/read/${boards[i].no}">${boards[i].title}</a></td>
        <td>${boards[i].author}</td>
        <td>${boards[i].cre_date.toLocaleDateString()}</td>
      </tr>
      `);
    }
    table += `</table>`;

    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
        ${template.head("자유게시판", "boardListStyle.css")}
        <body>
          ${template.header}
          <article>
            ${template.pageTitle("자유 게시판")}
            ${table}
            <div class="control">
              <div class="right">
                <button type="button" onclick="location.href='/board/create'">글쓰기</button>
              </div>
            </div>
          </article>
          ${template.footer}
        </body>
      </html>
    `);

    response.send(html);
  });
});

//게시물 보기
router.get("/read/:no", (request, response) => {
  let no = path.parse(request.params.no).base;

  let sql = `SELECT * FROM freeBoard WHERE no=${no}`;
  db.query(sql, (error, boards) => {
    let board = boards[0];
    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
      ${template.head("자유게시판", "boardContentStyle.css")}
      <body>
        ${template.header}
        <article>
          ${template.pageTitle("자유 게시판")}
          <table class="borderHeader">
            <tr>
              <td>작성자: ${board.author}</td>
              <td>작성일: ${board.cre_date.toLocaleDateString()}</td>
            </tr>
            <tr>
              <td colspan="2" class="txtTitle">
                ${board.title}
              </td>
            </tr>
          </table>
      
          <div class="boardContent">
            ${board.content}
          </div>
          
          <div class="control">
            <div class="left">
              <button type="button" onclick="location.href='/board/list'">목록</button>
            </div>
            <div class="right">
              <button type="button" onclick="location.href='/board/update/${board.no}'">
                수정
              </button>
              <button type="button" onclick="boardDelete()">삭제</button>
            </div>
          </div>
        </article>
        ${template.footer}
        
        <script>
          function boardDelete() {
            if(confirm("게시물을 삭제 하겠습니까?")) {
              location.href = "/board/delete/${board.no}";
            }
          }
        </script>
      </body>
      </html>
    `);
    
    response.send(html);
  });
});

//게시물 쓰기
router.get("/create", (request, response) => {
  let html = (`
    <!DOCTYPE html>
    <html lang="ko">
    ${template.head("자유게시판", "boardContentStyle.css")}
    <body>
      ${template.header}
      <article>
        ${template.pageTitle("자유 게시판")}
        
        <hr>
        <form action="/board/writeProc" method="post">
          <div class="boardInput">
            <input type="text" name="author" placeholder="작성자" required>
          </div>
          <div class="boardInput">
            <input class="txtTitle" type="text" name="title" placeholder="제목" required>
          </div>
          <div class="boardInput">
            <textarea name="content"></textarea>
          </div>
          <div class="control">
            <div class="right">
              <button type="submit">등록</button>
            </div>
          </div>
        </form>
      </article>
      ${template.footer}
    </body>
    </html>
  `);

  response.send(html);
});

//쓰기 프로세스
router.post("/writeProc", (request, response) => {
  let {author, title, content} = request.body;
  
  let sql = `INSERT INTO freeBoard(title, content, author) 
    VALUES("${title}", "${content}", "${author}")`;
  db.query(sql, (error, result) => {
    response.redirect(`/board/read/${result.insertId}`);
  });
});

//수정 화면
router.get("/update/:no", (request, response) => {
  let no = path.parse(request.params.no).base;

  let sql = `SELECT * FROM freeBoard WHERE no=${no}`;
  db.query(sql, (error, boards) => {
    let board = boards[0];
    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
      ${template.head("자유게시판", "boardContentStyle.css")}
      <body>
        ${template.header}
        <article>
          ${template.pageTitle("자유 게시판")}
          <hr>
          <form action="/board/updateProc" method="post">
            <div class="boardUpdateHeader">
              <div class="left">작성자: ${board.author}</div>
              <div class="right">작성일: ${board.cre_date}</div>
            </div>
            <div class="boardInput">
              <input class="txtTitle" type="text" 
                name="title" placeholder="제목" value="${board.title}"
              >
            </div>
            <div class="boardInput">
              <textarea name="content">${board.content}</textarea>
            </div>
            <div class="control">
              <div class="right">
                <button type="submit">수정</button>
              </div>
            </div>
            <input type="hidden" name="no" value="${board.no}">
          </form>
        </article>
        ${template.footer}
      </body>
      </html>
    `);

    response.send(html);
  });
});

//수정 프로세스
router.post("/updateProc", (request, response) => {
  let {no, title, content} = request.body;
  
  let sql = `UPDATE freeBoard SET title="${title}", content="${content}" WHERE no=${no}`;
  db.query(sql, (error, result) => {
    response.redirect(`/board/read/${no}`);
  });
});

//삭제 프로세스
router.get("/delete/:no", (request, response) => {
  let no = path.parse(request.params.no).base;
  
  let sql = `DELETE FROM freeBoard WHERE no=${no}`;
  db.query(sql, (error, result) => {
    response.redirect(`/board/list`);
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const path = require("path");
const {request} = require("express");

const template = require("../lib/template");
const db = require("../lib/db");

//리스트
router.get("/list", (request, response) => {
  let sql = "SELECT * FROM board ORDER BY no DESC";
  db.query(sql, (error, boards) => {
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
    table += `</tbody></table>`;

    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
        ${template.head("일기 게시판")}
        <body>
          ${template.header}      
          <div class="container">
            <article id="boardList">
              ${template.pageTitle("일기 게시판")}
              ${table}
              <div class="control">
                <div class="right">
                  <button type="button" onclick="location.href='/board/create'">글쓰기</button>
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

//게시물 보기
router.get("/read/:no", (request, response) => {
  let no = path.parse(request.params.no).base;

  let sql = `SELECT * FROM board WHERE no=${no}`;
  db.query(sql, (error, boards) => {
    let board = boards[0];
    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
      ${template.head("오늘의 일기")}
      <body>
        ${template.header}
        <div class="container">
          <article id="boardRead">
            ${template.pageTitle("오늘의 일기")}
            <table class="borderHeader">
              <thead>
              <tr>
                <td>작성자: ${board.author}</td>
                <td>작성일: ${board.cre_date.toLocaleDateString()}</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td colspan="2" class="txtTitle">
                  제목: ${board.title}
                </td>
              </tr>
              <tr>
                <td colspan="2" class="txtContent">${board.content}</td>
              </tr>
              </tbody>
            </table>            
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
          </div>
        ${template.footer}
        
        <script>
          function boardDelete() {
            Swal.fire({
              title: '일기를 삭제하시겠습니까?',
              text: "다시 한 번 생각하고 선택해주세요.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: 'rgb(176 77 255)',
              cancelButtonColor: 'rgb(68 57 57)',
              confirmButtonText: '확인',
              cancelButtonText: '취소'
            }).then((result) => {
              if (result.isConfirmed) {
                location.href = "/board/delete/${board.no}";
              }
            })
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
    ${template.head("일기장")}
    <body>
      ${template.header}
      <div class="container">
        <article id="boardCreate">
          ${template.pageTitle("일기장")}
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
      </div>
      ${template.footer}
    </body>
    </html>
  `);

  response.send(html);
});

//쓰기 프로세스
router.post("/writeProc", (request, response) => {
  let {author, title, content} = request.body;
  
  let sql = `INSERT INTO board(title, content, author) 
    VALUES("${title}", "${content}", "${author}")`;
  db.query(sql, (error, result) => {
    response.redirect(`/board/read/${result.insertId}`);
  });
});

//수정 화면
router.get("/update/:no", (request, response) => {
  let no = path.parse(request.params.no).base;

  let sql = `SELECT * FROM board WHERE no=${no}`;
  db.query(sql, (error, boards) => {
    let board = boards[0];
    let html = (`
      <!DOCTYPE html>
      <html lang="ko">
      ${template.head("일기 수정하기")}
      <body>
        ${template.header}
        <div class="container">
          <article id="boardUpdate">
            ${template.pageTitle("일기 게시판")}
            <form action="/board/updateProc" method="post">
              <div class="header">
                <div>작성자: ${board.author}</div>
                <div>작성일: ${board.cre_date.toLocaleDateString()}</div>
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
        </div>
        ${template.footer}
        </script>
      </body>
      </html>
    `);

    response.send(html);
  });
});

//수정 프로세스
router.post("/updateProc", (request, response) => {
  let {no, title, content} = request.body;
  
  let sql = `UPDATE board SET title="${title}", content="${content}" WHERE no=${no}`;
  db.query(sql, (error, result) => {
    response.redirect(`/board/read/${no}`);
  });
});

//삭제 프로세스
router.get("/delete/:no", (request, response) => {
  let no = path.parse(request.params.no).base;
  
  let sql = `DELETE FROM board WHERE no=${no}`;
  db.query(sql, (error, result) => {
    response.redirect(`/board/list`);
  });
});

module.exports = router;
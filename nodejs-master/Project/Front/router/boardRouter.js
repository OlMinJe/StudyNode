const express = require('express');
const router = express.Router();
const template = require('../lib/template.js');

router.get('/list', (request, response) => {
    let html = (`
    <!DOCTYPE html>
    <html lang="ko">
    ${template.head('자유게시판', 'boardListStyle.css')}
    <body>
      ${template.header}
      <article>
        ${template.pageTitle('자유 게시판')}
        <table class="boardList">
          <tr>
            <th></th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
          <tr>
            <td>1</td>
            <td><a href="boardRead.html">대통령은 법률안의 일부에 대하여 또는 법률안을 수정하여 재의...</a></td>
            <td>김시민</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>2</td>
            <td><a href="boardRead.html">국민의 모든 자유와 권리는 국가안전보장·질서유지 또는 공공복...</a></td>
            <td>이종무</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>3</td>
            <td><a href="boardRead.html">대통령은 국무총리·국무위원·행정각부의 장 기타 법률이 정하...</a></td>
            <td>이인로</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>4</td>
            <td><a href="boardRead.html">행정각부의 장은 국무위원 중에서 국무총리의 제청으로 대통령이...</a></td>
            <td>대조영</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>5</td>
            <td><a href="boardRead.html">대통령은 법률이 정하는 바에 의하여 사면·감형 또는 복권을 명...</a></td>
            <td>계백</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>6</td>
            <td><a href="boardRead.html">위원은 탄핵 또는 금고 이상의 형의 선고에 의하지 아니하고는 ...</a></td>
            <td>동명왕</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>7</td>
            <td><a href="boardRead.html">모든 국민은 법률이 정하는 바에 의하여 공무담임권을 가진다....</a></td>
            <td>원호</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>8</td>
            <td><a href="boardRead.html">헌법개정은 국회재적의원 과반수 또는 대통령의 발의로 제안된다...</a></td>
            <td>논개</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>9</td>
            <td><a href="boardRead.html">언론·출판은 타인의 명예나 권리 또는 공중도덕이나 사회윤리를...</a></td>
            <td>김정호</td>
            <td>2023.04.25</td>
          </tr>
          <tr>
            <td>10</td>
            <td><a href="boardRead.html">대통령은 전시·사변 또는 이에 준하는 국가비상사태에 있어서 ...</a></td>
            <td>박문수</td>
            <td>2023.04.25</td>
          </tr>
        </table>
        <div class="control">
          <div class="right">
            <button type="button" onclick="location.href='boardCreate.html'">
              글쓰기
            </button>
          </div>
        </div>
      </article>
      ${template.footer}
    </body>
    </html>
    `);
    response.send(html);
});

module.exports = router;
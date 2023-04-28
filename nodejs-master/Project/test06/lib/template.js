module.exports = {
  head: function(title, cssFile) {
    return (`
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}::Exam.com</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sigmar&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poor+Story&display=swap" rel="stylesheet">
        <link href="/css/common.css" rel="stylesheet" type="text/css">
        <link href="/css/style.css" rel="stylesheet" type="text/css">
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
      </head>
    `);
  },
  header: `
    <header>
      <h1 onclick="location.href='/board/list'">SECRET DIARY</h1>
      <nav>
        <ul>
          <li onclick="location.href='/board/list'">일기장</li>
          <li onclick="location.href='/notice'">공지사항</li>
        </ul>
      </nav>
    </header>
  `,
  pageTitle: function(pageTitle) {
    return (`
      <div class="pageTitle">
        <h2>${pageTitle}</h2>
      </div>
    `);
  },
  footer: `
    <footer>
      <a href="/"></a>
      <div class="footerLeft">
        <h2>아잠만의 사이트</h2>
        <ul>
          <li><a>github.com/OlMinJe</a></li>
          <li>이민제</li>
          <li>프론트엔드 개발자가 꿈이라네요</li>
        </ul>
      </div>
      <div class="footerRight" style="float: right;">Copyright&copy;2023 All rights reserved</div>
    </footer>
  `
};
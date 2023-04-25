module.exports = {
    head: function(title, cssFile) {
        return (`
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}::Exam.com</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css">
            <link href="/css/${cssFile}" rel="stylesheet" type="text/css">
        </head>
        `);
    },
    header: `
        <header>
        <h1>Header1111</h1>
        </header>
      `,
    footer:
    `
        <footer>
            <h2>Footer</h2>
        </footer>
    `,
    pageTitle: function(pageTitle) {
        return (`
        <div class="pageTitle">
          <h2>${pageTitle}</h2>
        </div>`);
    }
};
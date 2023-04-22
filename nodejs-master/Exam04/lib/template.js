module.exports = {
    HTML:function(title, list, body, control, authStatusUI = '<a href="/login">login</a>') {
        // 로그인 되어 있으면 authStatusUI를 보여준다.
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                ${authStatusUI}
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    },
    list:function(filelist) {
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length) {
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }
}
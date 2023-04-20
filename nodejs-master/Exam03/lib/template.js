// sanitize-html 라이브러리를 이용하는 코드 추가하기
var sanitizeHTML = require('sanitize-html');

// module.exports = {
//     HTML:function(title, list, body, control) {
//         return `
//         <!doctype html>
//         <html>
//             <head>
//                 <title>WEB1 - ${title}</title>
//                 <meta charset="utf-8">
//             </head>
//             <body>
//                 <h1><a href="/">WEB</a></h1>
//                 <a href="/author">author</a>
//                 ${list}
//                 ${control}
//                 ${body}
//             </body>
//         </html>
//         `;
//     },
//     list:function(topics) {
//         var list = '<ul>';
//         var i = 0;
//         while(i < topics.length) {
//             list = list + `<li><a href="/?id=${sanitizeHTML(topics[i].id)}">${sanitizeHTML(topics[i].title)}</a></li>`;
//             i = i + 1;
//         }
//         list = list+'</ul>';
//         return list;
//     },
//     authirSelect: function(authors, author_id) {
//         // 작성자 선택
//         var tag = '';
//         var i = 0;
//         while(i < authors.length) {
//             var selected = '';
//             if(authors[i].id === author_id) {
//                 selected = ' selected';
//             }

//             tag += `<option value="${authors[i].id}"${selected}>${sanitizeHTML(authors[i].name)}</option>`;
//             i++;
//         }
//         return `
//         <select name="author">${tag}</select>
//         `
//     }, 
//     authorTable: function(authors) {
//         var tag = '<table>';
//         var i = 0;
//         while(i < authors.length) {
//             tag += `
//                 <tr>
//                     <td>${sanitizeHTML(authors[i].name)}</td>
//                     <td>${sanitizeHTML(authors[i].profile)}</td>
//                     <td><a href="/author/update?id=${authors[i].id}">update</a></td>
//                     <td>
//                         <form action="/author/delete_process" method="post">
//                             <input type="hidden" name="id" value="${authors[i].id}">
//                             <input type="submit" value="delete">
//                         </form>
//                     </td>
//                 </tr>
//             `;
//             i++;
//         } 
//         tag += '</table>';
//         return tag;
//     }
// }


module.exports = {
    HTML:function(title, list, body, control) {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <a href="/author">author</a>
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
        /*
        while(i < topics.length) {
            //list = list + `<li><a href="/?id=${sanitizeHTML(filelist[i].id)}">${sanitizeHTML(filelist[i].title)}</a></li>`;
            list += `<li><a href="/page/${filelist[i].id}">${sanitizeHTML(filelist[i])}</a></li>`;
            i = i + 1;
        }
        */

        while(i < filelist.length) {
            list += `<li><a href="/page/${filelist[i]}">${sanitizeHTML(filelist[i])}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    },
    authirSelect: function(authors, author_id) {
        // 작성자 선택
        var tag = '';
        var i = 0;
        while(i < authors.length) {
            var selected = '';
            if(authors[i].id === author_id) {
                selected = ' selected';
            }

            tag += `<option value="${authors[i].id}"${selected}>${sanitizeHTML(authors[i].name)}</option>`;
            i++;
        }
        return `
        <select name="author">${tag}</select>
        `
    }, 
    authorTable: function(authors) {
        var tag = '<table>';
        var i = 0;
        while(i < authors.length) {
            tag += `
                <tr>
                    <td>${sanitizeHTML(authors[i].name)}</td>
                    <td>${sanitizeHTML(authors[i].profile)}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="post">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
            `;
            i++;
        } 
        tag += '</table>';
        return tag;
    }
}
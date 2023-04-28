let mysql = require('mysql2');
// user 다름
let db = mysql.createConnection({
    host     : 'localhost',
    user     : 'thisisjava',
    password : '1234',
    database : 'opentutorials',
    // multipleStatements: true     // 한 번에 여러 개의 SQL문이 실행되는 것을 허용함 -> escape 메서드로 확인했으니 삭제함
});
db.connect();
module.exports = db;
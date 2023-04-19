// mysql 모듈을 가져오는 코드 작성
var mysql = require('mysql2');
// createConnection 메서드를 이용해 데이터베이스 접속 정보를 정의
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'thisisjava',
    password : '1234',
    database : 'opentutorials'
});
db.connect();
module.exports = db;
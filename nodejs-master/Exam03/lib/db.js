// mysql 모듈을 가져오는 코드 작성
var mysql = require('mysql2');
// createConnection 메서드를 이용해 데이터베이스 접속 정보를 정의
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'thisisjava',
    password : '1234',
    database : 'opentutorials',
    // multipleStatements: true 
    // 한 번에 여러 개의 SQL문이 실행되는 것을 허용함 -> escape 메서드로 확인했으니 삭제함
});
db.connect();
module.exports = db;
/*数据库配置文件*/ 
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '991116',
    database: 'blog',
    multipleStatements: true
});

module.exports = connection;

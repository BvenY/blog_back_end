/*数据库配置文件*/ 
const mysql = require('mysql');

const mysqlConf = {
    host: 'localhost',
    user: 'root',
    password: '991116',
    database: 'blog',
    multipleStatements: true
}

// 用于保存数据库连接实例
let dataBase = null;

// 设置计时器
let pingInterval;

// 如果数据连接出错 重新连接

function handleError(err){
    logger.info(err.stack || err);
    connect();
}

// 建立数据库的连接
function connect() {
    if(dataBase !== null){
        dataBase.destroy();
        dataBase = null;
    }
    dataBase = mysql.createConnection(mysqlConf);
    dataBase.connect((err) => {
        if (err) {
            logger.info("err conncetion to database",err);
            setTimeout(connect, 1500);
        }
    });
    dataBase.on("error",handleError);

    //每小时ping一次数据库 保持数据库连接状态
    clearInterval(pingInterval);
    pingInterval = setInterval(() => {
        console.log('ping database');
        dataBase.ping((err) => {
            if(err){
                console.log('ping err' + JSON.stringify(err));
            }
        });
    }, 3600000);
}
// 调用连接函数
connect();

module.exports = dataBase;

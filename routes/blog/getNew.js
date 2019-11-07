let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.get('/', (req, res) => {
    // 定义SQL语句
    const sqlStr = `select blogID , userID,blogType,blogName,blogDescription,blogTime from blog ORDER BY blogTime DESC LIMIT 10`
    connection.query(sqlStr, (err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        //对数据库返回的数据进行处理
        let blogData = JSON.parse(result);
        for (let i = 0; i < blogData.length; i++) {
            const userSql = `select userName from user where userID = ?`;
            let userData = blogData[i].userID;
            connection.query(userSql, userData, (err, userReusult) => {
                userReusult = JSON.parse(JSON.stringify(userReusult));
                if (err) {
                    let error = new returnValue.Error(err);
                    return res.json(error);
                }
                blogData[i]['userName'] = userReusult[0].userName;
                delete blogData[i]['userID'];
            });
        }
        setTimeout(() => {
            let success = new returnValue.Success(blogData);
            res.json(success);
        }, 100);
    })
});

module.exports = router;



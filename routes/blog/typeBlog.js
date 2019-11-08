let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.post('/', (req, res) => {
    //先获取get传过来的参数
    const requestData = req.body;
    //再对用户名进行判空
    if (!("typeName" in requestData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误";
        return res.json(error);
    }
    let typeName = requestData.typeName;
    // 定义SQL语句
    const sqlStr = `select blogID , userID,blogType,blogName,blogDescription,blogTime from blog where blogType = ?`
    let sqlData = [typeName ]
    connection.query(sqlStr, sqlData, (err, results) => {
        let result = JSON.parse(JSON.stringify(results));
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        else if (JSON.stringify(results) === '[]') {
            let error = new returnValue.Error(null);
            error.msg = "该类型博客为空"
            return res.json(error);
        }
        else {
            for (let i = 0; i < result.length; i++) {
                const userSql = `select userName from user where userID = ?`;
                let userData = result[i].userID;
                connection.query(userSql, userData, (err, userReusult) => {
                    userReusult = JSON.parse(JSON.stringify(userReusult));
                    if (err) {
                        let error = new returnValue.Error(err);
                        return res.json(error);
                    }
                    result[i]['userName'] = userReusult[0].userName;
                    delete result[i]['userID'];
                });
            }
            setTimeout(() => {
                let success = new returnValue.Success(result);
                res.json(success);
            }, 200);
        }
    })
});

module.exports = router;



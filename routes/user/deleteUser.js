let express = require('express');
let router = express.Router();
let url = require('url');
let qs = require('qs');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.delete('/', token, (req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    //先获取get传过来的参数
    let parseObj = url.parse(req.url);
    let reqData = qs.parse(parseObj.query);
    //再对用户名进行判空
    if (!("userID" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "请输入用户ID"
        return res.json(error);
    }
    let userID = reqData.userID;
    // 定义SQL语句
    const sqlStr = `delete from user where userID = ?`;
    connection.query(sqlStr, userID, (err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        else {
            let resData = JSON.parse(result).affectedRows;
            if (resData === 0){
                let error = new returnValue.Error(null);
                error.msg = "用户不存在"
                return res.json(error);
            }
            else {
            let success = new returnValue.Success(null);
            success.msg = "删除成功"
            res.json(success);
            }
        }

    })
});

module.exports = router;



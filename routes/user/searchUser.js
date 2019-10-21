let express = require('express');
let router = express.Router();
let url = require('url');
let qs = require('qs');
let token = require('../../public/javascripts/token');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.get('/', token,(req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    //先获取get传过来的参数
    let parseObj = url.parse(req.url);
    let reqData = qs.parse(parseObj.query);
    //再对用户名进行判空
    if (!("userName" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "请输入用户名"
        return res.json(error);
    }
    let userName = reqData.userName.toString();
    // 定义SQL语句
    const sqlStr = `select * from user where userName = ?`;
    connection.query(sqlStr,userName,(err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        else if (result === '[]') {
            let error = new returnValue.Error(null);
            error.msg = "用户不存在"
            return res.json(error);
        }
        else {
            let resData = JSON.parse(result)[0]; 
            //去掉密码
            delete resData.passWord;
            let success = new returnValue.Success(resData);
            res.json(success);
        }
        
    })
});

module.exports = router;



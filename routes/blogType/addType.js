/*用户注册接口*/
let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.post('/', token,(req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    /*解析post请求中所携带的数据*/
    const requestData = req.body;
    /*对必要数据进行判空*/
    if (!("blogType" in requestData )) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    //处理返回的数据
    const blogType = requestData.blogType;
    // 定义SQL语句
    const sqlStr = `INSERT INTO blogtype(blogType) VALUES(?)`;
    //定义要插入的数据
    let sqlData = [blogType];
    connection.query(sqlStr, sqlData, (err, result) => {
        if (err) {
            let error = new returnValue.Error(err.message);
            return res.json(error);
        }
        let success = new returnValue.Success(null);
        return res.json(success);
    });
});

module.exports = router;



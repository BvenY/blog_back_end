let express = require('express');
let router = express.Router();
let url = require('url');
let qs = require('qs');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.get('/', (req, res) => {
    //先获取get传过来的参数
    let parseObj = url.parse(req.url);
    let reqData = qs.parse(parseObj.query);
    //再对用户名进行判空
    if (!("pageNum" in reqData && "pageSize" in reqData && "blogType" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    let blogType = reqData.blogType;
    let pageNum = (reqData.pageNum - 1) * reqData.pageSize;
    let pageSize = reqData.pageSize * 1;
    // 定义SQL语句
    const sqlStr = `select blogID , userID,blogType,blogName,blogDescription,blogTime from blog where blogType = ? LIMIT ?,? `
    let sqlData = [ blogType,pageNum, pageSize]
    connection.query(sqlStr, sqlData, (err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        else if (result === '[]') {
            let error = new returnValue.Error(null);
            error.msg = "该类型博客为空"
            return res.json(error);
        }
        else {
            let resData = JSON.parse(result);
            let success = new returnValue.Success(resData);
            res.json(success);
        }
    })
});

module.exports = router;



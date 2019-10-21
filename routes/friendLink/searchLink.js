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
    if (!("linkID" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "请检查参数"
        return res.json(error);
    }
    let linkID = reqData.linkID;
    // 定义SQL语句
    const sqlStr = `select * from friendlink where linkID = ?`;
    connection.query(sqlStr, linkID, (err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        else if (result === '[]') {
            let error = new returnValue.Error(null);
            error.msg = "友链不存在"
            return res.json(error);
        }
        else {
            let resData = JSON.parse(result)[0];
            let success = new returnValue.Success(resData);
            res.json(success);
        }

    })
});

module.exports = router;



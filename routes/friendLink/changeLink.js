let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.post('/', token, (req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    const requestData = req.body;
    if (!("linkID" in requestData && "linkName" in requestData && "link" in requestData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    //处理返回的数据
    const linkID = requestData.linkID;
    const linkName = requestData.linkName;
    const link = requestData.link;
    // 定义SQL语句
    const sqlStr = `UPDATE friendlink SET linkName = ? ,link = ? WHERE linkID = ?`;
    //定义要插入的数据
    let sqlData = [linkName, link, linkID];
    connection.query(sqlStr, sqlData, (err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        else {
            let resData = JSON.parse(result).affectedRows;
            if (resData === 0) {
                let error = new returnValue.Error(null);
                error.msg = "友链不存在"
                return res.json(error);
            }
            else {
                let success = new returnValue.Success(null);
                success.msg = "修改成功"
                res.json(success);
            }
        }
    });
});

module.exports = router;



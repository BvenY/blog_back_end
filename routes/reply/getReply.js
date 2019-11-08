let express = require('express');
let router = express.Router();
let url = require('url');
let qs = require('qs');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');


router.get('/',token, (req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    //先获取get传过来的参数
    let parseObj = url.parse(req.url);
    let reqData = qs.parse(parseObj.query);
    //再对必要参数进行判空
    if (!("commentID" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    let commentsID = reqData.commentID;
    // 定义查询评论SQL语句
    const sqlStr_reply = "select * from reply where commentsID = ?";
    connection.query(sqlStr_reply, commentsID, (err, results) => {
        results = JSON.parse(JSON.stringify(results));
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        //对回复查询结果进行遍历，查询对应的userName
        for (let i = 0; i < results.length; i++) {
            let replyUser = results[i].userID;
            const sqlStr_reply_user = "select userName from user where userID = ?";
            connection.query(sqlStr_reply_user, replyUser, (err, result) => {
                result = JSON.parse(JSON.stringify(result));
                if (err) {
                    let error = new returnValue.Error(err);
                    return res.json(error);
                }
                results[i]['replyName'] = result[0]['userName'];
                delete results[i]['userID'];
                setTimeout(() => {
                    let success = new returnValue.Success(results);
                    res.json(success);
                }, 200);
            });
        }
    });
});

module.exports = router;



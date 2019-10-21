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
    //再对必要参数进行判空
    if (!("pageNum" in reqData && "pageSize" in reqData )) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    let pageNum = (reqData.pageNum - 1) * reqData.pageSize;
    let pageSize = reqData.pageSize * 1;
    // 定义查询评论SQL语句
    const sqlStr = `select * from comments  LIMIT ?,?`
    let sqlData = [ pageNum, pageSize];
    //数据库操作
    connection.query(sqlStr, sqlData, (err, results) => {
        //最终返回的数据
        let commentsData;
        //对评论表返回的数据进行处理
        let result = JSON.stringify(results);
        commentsData = JSON.parse(result);
        //错误处理
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        //查询结果为空的处理
        else if (result === '[]') {
            let success = new returnValue.Success(null);
            success.msg = "该博客暂无评论"
            return res.json(success);
        }
        //正常情况
        else {
            //对评论返回结果进行遍历
            for (let i = 0; i < commentsData.length; i++) {
                //查询对应的userID对应的userName
                let userID = commentsData[i].userID;
                const sqlStr_user = "select userName from user where userID = ?";
                connection.query(sqlStr_user, userID, (err, results) => {
                    let result = JSON.stringify(results);
                    let userData = JSON.parse(result)[0];
                    let keyName = Object.keys(userData);
                    if (err) {
                        let error = new returnValue.Error(err);
                        return res.json(error);
                    }
                    commentsData[i].commentsName = userData[keyName];
                });
                //查询每一条评论对应的回复
                let commentsID = commentsData[i].commentsID;
                const sqlStr_reply = "select * from reply where commentsID = ?";
                connection.query(sqlStr_reply, commentsID, (err, results) => {
                    let result = JSON.stringify(results);
                    let replyData = JSON.parse(result);
                    if (err) {
                        let error = new returnValue.Error(err);
                        return res.json(error);
                    }
                    commentsData[i].reply = replyData;
                    //对回复查询结果进行遍历，查询对应的userName
                    for (let j = 0; j < replyData.length; j++) {
                        let replyUser = replyData[j].userID;
                        const sqlStr_reply_user = "select userName from user where userID = ?";
                        connection.query(sqlStr_reply_user, replyUser, (err, results) => {
                            let result = JSON.stringify(results);
                            let replyData = JSON.parse(result)[0];
                            let keyName = Object.keys(replyData);
                            if (err) {
                                let error = new returnValue.Error(err);
                                return res.json(error);
                            }
                            commentsData[i].reply[j].replyName = replyData[keyName];
                        });
                    }
                });
            }
            setTimeout(() => {
                let success = new returnValue.Success(commentsData);
                res.json(success);
            }, 300);
        }
    });
});

module.exports = router;



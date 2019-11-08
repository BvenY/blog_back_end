let express = require('express');
let router = express.Router();
let url = require('url');
let qs = require('qs');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.get('/', token, (req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    //先获取get传过来的参数
    let parseObj = url.parse(req.url);
    let reqData = qs.parse(parseObj.query);
    //再对必要参数进行判空
    if (!("commentsID" in reqData )) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    let commentsID = reqData.commentsID;
    // 定义查询评论SQL语句
    const sqlStr = `select * from comments  WHERE commentsID = ?`
    let sqlData = [commentsID];
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
            success.msg = "该评论不存在"
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
                    delete commentsData[i].userID;
                });
                //查询每一条评论对应的回复数量
                let commentsID = commentsData[i].commentsID;
                const sqlStr_reply = "select COUNT(*) from reply where commentsID = ?";
                connection.query(sqlStr_reply, commentsID, (err, results) => {
                    results = JSON.parse(JSON.stringify(results));
                    try {
                        commentsData[i].replyNum = results[0]['COUNT(*)'];
                    }
                    catch {
                        let error = new returnValue.Error(err);
                        return res.json(error);
                    }
                });
                //查询每一条评论对应的博客名字
                let blogID = commentsData[i].blogID;
                const sqlStr_blog = "select blogName from blog where blogID = ?";
                connection.query(sqlStr_blog, blogID, (err, results) => {
                    results = JSON.parse(JSON.stringify(results));
                    try {
                        commentsData[i].blogName = results[0]['blogName'];
                    }
                    catch {
                        let error = new returnValue.Error(err);
                        return res.json(error);
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



let express = require('express');
let router = express.Router();
let url = require('url');
let qs = require('qs');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.get('/', token,(req, res) => {
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
        let totalCount = 0;
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
            //查询总的评论条数名字
            const sqlStr_num = "select COUNT(*) from comments";
            connection.query(sqlStr_num, (err, results) => {
                results = JSON.parse(JSON.stringify(results));
                try {
                    totalCount = results[0]['COUNT(*)'];
                }
                catch {
                    let error = new returnValue.Error(err);
                    return res.json(error);
                }
            });
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
                //封装一个返回类
                class response {
                    constructor(data, count) {
                        this.data = data;
                        this.totalCount = count;
                    }
                }
                let resData = new response(commentsData, totalCount);
                let success = new returnValue.Success(resData);
                res.json(success);
            }, 300);
        }
    });
});

module.exports = router;



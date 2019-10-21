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
    if (!("pageNum" in reqData && "pageSize" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    let pageNum = (reqData.pageNum - 1) * reqData.pageSize;
    let pageSize = reqData.pageSize * 1;
    // 定义SQL语句
    const sqlStr = `select blogID , userID,blogType,blogName,blogDescription,blogTime from blog LIMIT ?,?;SELECT COUNT(*) FROM blog;`
    let sqlData = [pageNum, pageSize]
    connection.query(sqlStr, sqlData,(err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        //对数据库返回的数据进行处理
        let blogData = JSON.parse(result)[0];
        let count = JSON.parse(result)[1];
        let key = Object.keys(count[0]);
        let resCount = count[0][key];
        //封装一个返回类
        class response{
            constructor(data,count){
                this.data = data;
                this.totalCount = count;
            }
        }
        let resData = new response(blogData, resCount);
        let success = new returnValue.Success(resData);
        res.json(success);
    })
});

module.exports = router;



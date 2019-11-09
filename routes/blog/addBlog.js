/*用户注册接口*/
let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.post('/',token, (req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    /*解析post请求中所携带的数据*/
    const requestData = req.body;
    /*对必要数据进行判空*/
    if (!("userID" in requestData && "blogType" in requestData && "blogName" in requestData && "blogMsg" in requestData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    //处理返回的数据
    const userID = requestData.userID;
    const blogType = requestData.blogType;
    const blogName = requestData.blogName;
    const blogMsg = requestData.blogMsg;
    const blogDescription = requestData.description;
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份 
            "d+": this.getDate(),                    //日 
            "h+": this.getHours(),                   //小时 
            "m+": this.getMinutes(),                 //分 
            "s+": this.getSeconds(),                 //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    let blogTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    // 定义SQL语句
    const sqlStr = `INSERT INTO blog(userID,blogType,blogName,blogDescription,blogTime,blogMsg) VALUES(?,?,?,?,?,?)`;
    //定义要插入的数据
    let sqlData = [userID, blogType, blogName, blogDescription, blogTime, blogMsg];
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



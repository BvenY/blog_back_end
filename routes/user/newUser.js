/*用户注册接口*/
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.post('/',(req, res) => {
    /*解析post请求中所携带的数据*/
    const requestData = req.body;
    /*对必要数据进行判空*/
    if (!("userName" in requestData && "passWord" in requestData && "telePhone" in requestData && "userType" in requestData && "description" in requestData && "code" in requestData)){
        let error  = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    //处理返回的数据
    const userName = requestData.userName;
    const passWord = requestData.passWord;
    const telePhone = requestData.telePhone;
    const userType = requestData.userType;
    const description = requestData.description;
    const sex = requestData.sex;
    let code = (requestData.code).toLowerCase();
    //对密码进行加密处理
    const key = 3;
    let afterPassword;
    
    bcrypt.hash(passWord, key, (err, encryptPassword)=>{
        afterPassword = encryptPassword;
    });
    //数据库操作
    setTimeout(() => {
        // 定义SQL语句
        const sqlStr = `INSERT INTO user(userName,passWord,telePhone,sex,userType,description) VALUES(?,?,?,?,?,?)`;
        //定义要插入的数据
        let sqlData = [userName, afterPassword, telePhone, sex, userType, description];
        connection.query(sqlStr, sqlData, (err, result) => {
            if (err) {
                let error = new returnValue.Error(err.message);
                error.msg = "用户已存在"
                return res.json(error);
            }
            //查询验证码库
            const codeSql = 'select * from code where codeID = 1'
            connection.query(codeSql, (err, codeResults) => {
                //对验证码进行处理
                let codeData = JSON.parse(JSON.stringify(codeResults));
                let nowTime = Date.now();
                try {
                    //判断验证码是否过时
                    if (nowTime > codeData[0].time) {
                        let error = new returnValue.Error(err);
                        error.msg = '验证码过期，请刷新验证码';
                        return res.json(error);
                    }
                    //判断验证码
                    else if (code !== codeData[0].code) {
                        let error = new returnValue.Error(err);
                        error.msg = '验证码错误';
                        return res.json(error);
                    }
                    //验证码正确
                    else {
                        let success = new returnValue.Success(null);
                        return res.json(success);
                    }
                }
                //异常处理
                catch (e) {
                    let error = new returnValue.Error(e);
                    error.msg = "注册失败"
                    return res.json(error);
                }
            });
        });
    }, 200);
});

module.exports = router;



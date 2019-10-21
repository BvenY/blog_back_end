let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.post('/', token,(req, res) => {
    if (req.userType != 1 && req.userType != 520 && req.userType != 0) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    const requestData = req.body;
    if (!("userID" in requestData )) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    
    //处理返回的数据
    const userID = requestData.userID;
    const userName = requestData.userName;
    const passWord = requestData.passWord;
    const telePhone = requestData.telePhone;
    const userType = requestData.userType;
    const description = requestData.description;
    const sex = requestData.sex;
    //对密码进行加密处理
    const key = 3;
    let afterPassword;
    
    bcrypt.hash(passWord, key, (err, encryptPassword) => {
        afterPassword = encryptPassword;
    });

    //数据库操作
    setTimeout(() => {
        // 定义SQL语句
        const sqlStr = `UPDATE user SET userName = ?, passWord = ?,telePhone = ?, userType = ?, description = ?, sex = ?  WHERE userID = ?`;
        //定义要插入的数据
        let sqlData = [userName, afterPassword, telePhone,userType, description, sex, userID];
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
                    error.msg = "用户不存在"
                    return res.json(error);
                }
                else {
                    let success = new returnValue.Success(null);
                    success.msg = "修改成功"
                    res.json(success);
                }
            }
        });
    }, 200);
});

module.exports = router;



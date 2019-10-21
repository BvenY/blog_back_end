let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');

router.post('/', token,(req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    const requestData = req.body;
    if (!("typeID" in requestData && "blogType" in requestData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    //处理返回的数据
    const typeID = requestData.typeID;
    const blogType = requestData.blogType;
    // 定义SQL语句
    const sqlStr = `UPDATE blogtype SET blogType = ?  WHERE typeID = ?`;
    //定义要插入的数据
    let sqlData = [blogType, typeID];
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
                error.msg = "类型不存在"
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



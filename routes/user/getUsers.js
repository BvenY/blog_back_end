let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let token = require('../../public/javascripts/token');


router.get('/',token, (req, res) => {
  // 定义SQL语句
  if (req.userType != 1 && req.userType != 520){
    let permission = new returnValue.Permission(null);
    return res.json(permission);
  }
  const sqlStr = `select * from user`
  connection.query(sqlStr, (err, results) => {
    let result = JSON.stringify(results);
    if (err) {
      let error = new returnValue.Error(err);
      return res.json(error);
    }
    let resData = JSON.parse(result);
    //去掉密码
    for (let i = 0; i < resData.length;i++){
      delete resData[i].passWord;
    }
    let success = new returnValue.Success(resData);
    res.json(success);
  })
});

module.exports = router;



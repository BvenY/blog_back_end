let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.get('/', (req, res) => {
    // 定义SQL语句
    const sqlStr = `select * from blogtype`
    /**
     * TODO:当数据量过大时，所有的get all message 接口全部采用limit做分页查询
     */
    connection.query(sqlStr, (err, results) => {
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        let success = new returnValue.Success(results);
        res.json(success);
    })
});

module.exports = router;



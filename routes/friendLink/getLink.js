let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');


router.get('/', (req, res) => {
    // 定义SQL语句
    const sqlStr = `select * from friendlink`
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



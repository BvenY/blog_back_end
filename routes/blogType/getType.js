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
        try{
            results = JSON.parse(JSON.stringify(results));
            for(let i = 0;i < results.length;i++){
                const sqlStr = `SELECT COUNT(*) FROM blog WHERE blogType = ?`
                let sqlData = results[i].blogType;
                connection.query(sqlStr, sqlData,(err, result) => {
                    try{
                        results[i]['blogNum'] = JSON.parse(JSON.stringify(result))[0]['COUNT(*)'];
                    }
                    catch{
                        let error = new returnValue.Error(err);
                        return res.json(error);
                    }
                });
            }
            setTimeout(() => {
                let success = new returnValue.Success(results);
                res.json(success);
            }, 100);
        }
        catch{
            let error = new returnValue.Error(err);
            return res.json(error);
        }
    })
});

module.exports = router;



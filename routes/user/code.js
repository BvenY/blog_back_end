let express = require('express');
let router = express.Router();
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');
let svgCaptcha = require('svg-captcha');

router.get('/', function (req, res) {
    //生成验证码
    let captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        width: 100,
        height: 40,
        fontSize: 50,
        background:"#F1F3F4"
    });
    //存入数据库
    const sqlStr = `UPDATE code SET code = ? , time = ? WHERE codeID = 1`
    //设置过期时间
    let time = Date.now() + 1000 * 60 * 10;
    //转换为小写字母
    let sqlData = [(captcha.text).toLowerCase(),time];
    connection.query(sqlStr, sqlData,(err, results) => {
        if (err) {
            let error = new returnValue.Error(err);
            return res.json(error);
        }
        //返回验证码给前端
        res.type('svg');
        res.status(200).send(captcha.data);
    });
});

module.exports = router;
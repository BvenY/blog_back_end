/*用户登录接口*/ 
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let url = require('url');
let qs = require('qs');
let jwt = require('jwt-simple');
let jwtTokenSecret = 'aijiaojiaobabyzhenshitaihaole';
//set the token expires time = 30min
let expires = Date.now() + 1000 * 60 * 30;
const connection = require('../../public/javascripts/database');
const returnValue = require('../../public/javascripts/return');

router.get('/',(req, res)=>{
    //先获取get传过来的参数
    let parseObj = url.parse(req.url);
    let reqData = qs.parse(parseObj.query);
    //再对用户名和密码进行判空
    if (!("telePhone" in reqData && "passWord" in reqData && "code" in reqData)) {
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    let telePhone = reqData.telePhone;
    let PASSWORD = reqData.passWord;
    let code = (reqData.code).toLowerCase();
        //对电话号码的值进行判定
    if (telePhone == ''){
        let error = new returnValue.Error(null);
        error.msg = "参数错误"
        return res.json(error);
    }
    //定义查询语句
    const sqlSerch = `select * from user where telePhone=` + telePhone;
    //数据库操作
    connection.query(sqlSerch,(err, results) => {
        let result = JSON.stringify(results);
        if (err) {
            let error = new returnValue.Error(err.message);
            return res.json(error);
        }
        //判断用户是否存在
        else if (result === '[]'){
            let error = new returnValue.Error(null);
            error.msg = "用户不存在"
            return res.json(error);
        }
        else{
            //校验密码
            let passWord = JSON.parse(result)[0].passWord;
            bcrypt.compare(PASSWORD, passWord,(err, response)=>{
                if(err){
                    let error = new returnValue.Error(null);
                    error.data = err;
                    return res.json(error);
                }
                //密码正确时
                else if (response){
                    //查询验证码库
                    const codeSql = 'select * from code where codeID = 1'
                    connection.query(codeSql,(err, codeResults) => {
                        //对验证码进行处理
                        let codeData = JSON.parse(JSON.stringify(codeResults));
                        let nowTime = Date.now();
                        try {
                            //判断验证码是否过时
                            if (nowTime > codeData[0].time){
                                let error = new returnValue.Error(err);
                                error.msg = '验证码过期，请刷新验证码';
                                return res.json(error);
                            }
                            //判断验证码
                            else if (code !== codeData[0].code){
                                let error = new returnValue.Error(err);
                                error.msg = '验证码错误';
                                return res.json(error);
                            }
                            //密码验证码全部正确
                            else{
                                let resData = JSON.parse(result)[0];
                                //去掉密码
                                delete resData.passWord;
                                //返回token
                                let token = jwt.encode({
                                    iis: resData.userType,
                                    expires: expires
                                }, jwtTokenSecret);
                                //token加入到返回头中
                                res.header("x-access-token", token);
                                let success = new returnValue.Success(resData);
                                success.msg = "登录成功";
                                return res.json(success);
                            }
                        }
                        //异常处理
                        catch(e) {
                            let error = new returnValue.Error(e);
                            return res.json(error);
                        }
                    });
                }
                else{
                    let error = new returnValue.Error(null);
                    error.msg = "密码错误";
                    return res.json(error);
                }
                });
        }  
    });
});

module.exports = router;
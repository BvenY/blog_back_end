let jwt = require('jwt-simple');
let jwtTokenSecret = 'aijiaojiaobabyzhenshitaihaole';
const returnValue = require('../../public/javascripts/return');

module.exports = (req, res, next)=>{
    //获取http requset中的token
    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if(token){
        try{
            //正常获取 解码
            let decoded = jwt.decode(token,jwtTokenSecret);
            //判断是否过时
            if (decoded.expires <= Date.now()){
                let unlogin = new returnValue.Unlogin(null);
                unlogin.msg = "用户登录信息过期";
                res.json(unlogin);
            }
            else {
                //刷新token的过期时间
                let newToken = jwt.encode({
                    iis: decoded.iis,
                    expires: Date.now() + 1000 * 60 * 30
                }, jwtTokenSecret);
                //把用户权限信息加到request中
                req.userType = decoded.iis;
                req.headers['x-access-token'] = newToken;
                res.header("x-access-token", newToken);
                //路由放行
                next();
            }
        }
        //异常信息处理
        catch(err) {
            let unlogin = new returnValue.Unlogin(null);
            unlogin.msg = "用户登录信息异常";
            res.json(unlogin);
        }
    }
    //没有token
    else{
        let unlogin = new returnValue.Unlogin(null);
        unlogin.msg = "用户未登录";
        res.json(unlogin);
    }
}
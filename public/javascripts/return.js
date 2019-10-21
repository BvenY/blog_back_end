/*返回值封装类*/
function Success(data) {
    this.code = '0000';
    this.data = data;
    this.msg = "请求成功";
}

function Error(data) {
    this.code = '1101';
    this.data = data;
    this.msg = '未知错误';
}

function Unlogin(data) {
    this.code = '0203';
    this.data = data;
    this.msg = '用户登录信息过期';
}

function Permission(data) {
    this.code = '0204';
    this.data = data;
    this.msg = '无权限操作';
}

module.exports = { Success, Error, Unlogin,Permission};
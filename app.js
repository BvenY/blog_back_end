let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
// let jwt = require('jwt-simple');

///=======路由信息 （接口地址）开始 存放在./routes目录下===========//
let indexRouter = require('./routes/index');
let getNum = require('./routes/getNum');
let uploadImg = require('./routes/uploadImg');
//用户模块
let usersRouter = require('./routes/user/getUsers');
let newUser = require('./routes/user/newUser');
let login = require('./routes/user/login');
let searchUser = require('./routes/user/searchUser');
let deleteUser = require('./routes/user/deleteUser');
let changeUser = require('./routes/user/changeUser');
let code = require('./routes/user/code');
//简介模块
let getMsg = require('./routes/userMsg/getMsg');
let addMsg = require('./routes/userMsg/addMsg');
let changeMsg = require('./routes/userMsg/changeMsg');
let deleteMsg = require('./routes/userMsg/deleteMsg');
let searchMsg = require('./routes/userMsg/searchMsg');
//友链模块
let getLink = require('./routes/friendLink/getLink');
let addLink = require('./routes/friendLink/addLink');
let changeLink = require('./routes/friendLink/changeLink');
let deleteLink = require('./routes/friendLink/deleteLink');
let searchLink = require('./routes/friendLink/searchLink');
//博客类型模块
let getType = require('./routes/blogType/getType');
let addType = require('./routes/blogType/addType');
let deleteType = require('./routes/blogType/deleteType');
let changeType = require('./routes/blogType/changeType');
//博客模块
let getBlog = require('./routes/blog/getBlog');
let getNew = require('./routes/blog/getNew');
let deleteBlog = require('./routes/blog/deleteBlog');
let searchBlog = require('./routes/blog/serchBlog');
let addBlog = require('./routes/blog/addBlog');
let changeBlog = require('./routes/blog/changeBlog');
let typeBlog = require('./routes/blog/typeBlog');
//评论模块
let getComments = require('./routes/comments/getComments');
let allComments = require('./routes/comments/allComments');
let addComments = require('./routes/comments/addComments');
let deleteComments = require('./routes/comments/deleteComments');
//回复模块
let addReply = require('./routes/reply/addReply');
let getReply = require('./routes/reply/getReply');
let deleteReply = require('./routes/reply/deleteReply');
///=======路由信息 （接口地址）结束 存放在./routes目录下===========//

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//the secret of token
// app.set("jwtTokenSecret", "aijiaojiaobabyzhenshitaihaole");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//设置跨域问题
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, x-access-token");
  res.header("Access-Control-Expose-Headers", "x-access-token");
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

//对需要权限设置的接口返回新的token
app.all('/api/*', (req, res, next) => {
  res.header("x-access-token", req.headers['x-access-token']);
  next();
});

/*接口路由暴露注册============================================开始*/ 
app.use('/', indexRouter);
app.use('/api/getNum', getNum);
app.use('./public/img', express.static(path.join(__dirname, 'img')));
app.use('/api/uploadImg', uploadImg);
//用户模块
app.use('/api/getUsers', usersRouter); 
app.use('/newUser', newUser);
app.use('/login', login);
app.use('/api/searchUser', searchUser); 
app.use('/api/deleteUser', deleteUser); 
app.use('/api/changeUser', changeUser);
app.use('/code', code);
//用户简介模块
app.use('/getMsg', getMsg);
app.use('/api/addMsg', addMsg); 
app.use('/api/changeMsg', changeMsg);  
app.use('/api/deleteMsg', deleteMsg);  
app.use('/api/searchMsg', searchMsg);  
//友链模块
app.use('/getLink', getLink);
app.use('/api/addLink', addLink); 
app.use('/api/changeLink', changeLink); 
app.use('/api/deleteLink', deleteLink); 
app.use('/api/searchLink', searchLink); 
//博客类型模块
app.use('/getType', getType);
app.use('/api/addType', addType); 
app.use('/api/deleteType', deleteType); 
app.use('/api/changeType', changeType); 
//博客模块
app.use('/api/getBlog', getBlog);
app.use('/getNew', getNew);
app.use('/api/deleteBlog', deleteBlog); 
app.use('/searchBlog', searchBlog);
app.use('/api/addBlog', addBlog); 
app.use('/api/changeBlog', changeBlog); 
app.use('/typeBlog', typeBlog);
//评论模块
app.use('/getComments', getComments);
app.use('/allComments', allComments);
app.use('/api/addComments', addComments); 
app.use('/api/deleteComments', deleteComments); //后期添加删除自己的评论功能
//回复模块
app.use('/api/getReply', getReply); 
app.use('/api/addReply', addReply); 
app.use('/api/deleteReply', deleteReply); 
/*接口路由暴露注册============================================结束*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//错误处理监听，防止应用程序退出
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});


module.exports = app;

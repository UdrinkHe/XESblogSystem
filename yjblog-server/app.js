require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const scheduleRouter = require('./routes/user/schedule')
const todoListDataRouter = require('./routes/user/todoListData')
const { router:authRouter,authenticateToken} = require('./routes/user/auth')
const postRouter = require('./routes/user/post')
const { router:userInfoRouter } = require('./routes/user/userInfo')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 提供静态文件服务
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter)
app.use('/user/schedule',authenticateToken,scheduleRouter)
app.use('/user/todolist', authenticateToken, todoListDataRouter)
app.use('/user/auth', authRouter)
app.use('/user/post',postRouter)
app.use('/user/userInfo',userInfoRouter)
module.exports = app;
//app.js用来做路由、跨域配置
//routes文件夹下面对应的是不同模块的路由，业务部分写在routes里

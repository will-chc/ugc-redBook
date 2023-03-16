const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const router = require('./router/router');
const { connection } = require('./MySQL/connect');

connection.connect((err) => {
  if (err) {
    console.error('连接失败：' + err.stack);
    return;
  }

  console.log('连接成功，连接 ID：' + connection.threadId);
});

const app = express();
const port = 3000;

// 跨域请求处理
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(cors());


//公开静态文件夹
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

// 监听5000端口 启动服务
app.listen('5000', () => {
  console.log('Server is running 5000');
});


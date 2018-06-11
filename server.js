const express = require("express");
const static = require("express-static");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const consolidate = require("consolidate");
const expressRoute = require("express-route");
const multer = require("multer");

//指定上传的路径
const multerObj = multer({dest:'./static/upkoad'})
//const express = require("express");

var server = express();
server.listen(3000);

//请求数据
//get自带
server.use(bodyParser.urlencoded({extended: false }));
server.use(multerObj.any())

//cookie session
server.use(cookieParser());
//防止污染全局变量
(function(){
    var keys = [];
    for(var i=0;i<10000;i++){
        keys[i] ='a_'+Math.random();
    };
    server.use(cookieSession({
        name:"sess_id",
        keys,keys,
        maxAge:20*60*1000 //20min
    }));  
})();
server.use('/test',function(req,res){
    var md5 = require('./libs/common');
    console.log(md5.md5("123"));
    res.send("ok").end();
});
//模版
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//route
server.use('/', require('./route/web.js')());
server.use('/admin/', require('./route/admin.js')());  
//default:static
server.use(static('./static/'));


const express = require("express");
const common = require("../libs/common")
const mysql = require("mysql");
// var lodg = common.md5("admin123");
// console.log(lodg);
//创建数据库链接
var db= mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'admin',
    database : 'test'
});
module.exports = function(){
    var router = express.Router();
    //检查登陆状态
    router.use((req,res,next)=>{
        //如果没有session且访问地址不是/login
        if(!req.session['admin_id'] && req.url!='/login'){
            res.redirect('/admin/login');
        }else{
            next();
        }
    })
    router.get('/login',function(req,res){
           // res.send("我是admin").end();
            res.render('admin/login.ejs',{
                data:"",
                show:"flase"
            });
    });
    router.post('/login',function(req,res){
        //获取到post的数据
         var userPost = req.body.user;
         var passWord = common.md5(req.body.password);
         db.query(`select * from learn where user = '${userPost}'`,(err,data)=>{
             if(err){
                 //console.log(undefined);
                 res.status(500).send("数据库链接失败").end();
             }else{
                  if(data.length == 0){
                   res.render('admin/login.ejs',{
                        data:"用户名不正确",
                        show:true
                       }); 
                 }else{
                //  console.log(data);
                //验证加密的密码是否正确
                    if(data[0].password !=passWord){    
                        res.render('admin/login.ejs',{
                            data:"密码不正确",
                            show:true
                           }); 
                    }else{
                        req.session['admin_id'] = data[0].Id;
                        res.redirect("/admin/");
                       
                    }
                 }
            }
         })
 });
    //登陆成功页面
    router.get('/',function(req,res){
        //判断是修改还是删除
        switch(req.query.act){
            case "mod":
            db.query(`select * from banners where id=${req.query.id}`,(err,dta)=>{
                if(err){
                    res.status(500).send("databases err").end();
                }else{
                    if(dta.leng==0){
                        res.status(404).send("data not find").end();
                     }else{
                        db.query(`select * from banners order by Id desc`,(err,data)=>{
                        res.render('admin/index.ejs',{
                            banners:data,
                            data:dta[0]
                           }); 
                        })
                     }                 
                }
            });
            break;
            case "del":
            db.query(`delete from banners where id=${req.query.id}`,(err,dta)=>{
                if(err){
                    res.status(500).send("databases err").end();
                }else{
                    //res.status(200).send("删除成功").end();
                    res.redirect('/admin/');                    
                }
            });
            break;
            default:
            db.query(`select * from banners order by Id desc`,(err,data)=>{
                if(err){
                    res.status(500).send("databases err").end();
                }else{
                    //console.log(data);
                    res.render('admin/index.ejs',{
                        banners:data,
                       }); 
                }
            });
        }
    
    })
    //接受post数据，写入banners
    router.post('/',function(req,res){
        // console.log(req.body);
        var title = req.body.title;
        var describe = req.body.describe;
        if(!title||!describe){
          res.status(400).send("数据不能为空").end();
        }else{
            //判断是否有隐藏域的传值，有的话是修改，没有的话是添加
            if(req.body.data_id){
                //res.status(200).send("xiugai").end();
                db.query(`update banners set title ='${title}',description='${describe}' where id=${req.body.data_id}`,(err,data)=>{
                    if(err){
                        res.status(500).send("databases err").end();
                    }else{
                     res.redirect('/admin/');
                    }     
                 })
            }else{
            db.query(`insert into banners (title,description)value('${title}','${describe}')`,(err,data)=>{
               if(err){
                   res.status(500).send("databases err").end();
               }else{
                res.redirect('/admin/');
               }     
            })
        };
        };
    })

    return router;
}
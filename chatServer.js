/**
 * Created by hxsd on 2016/5/27.
 */
var http=require("http");
var socketio=require("socket.io");
var express=require("express");

var formidable = require("formidable");
var fs = require("fs");
var qs = require("querystring");
var url = require("url");
var multer = require("multer");
var updir = multer({dest:"uploads/"});

var app=express();
var httpServer=http.createServer(app);//创建服务器
var socketSever=require("./socketserver.js");
var port=8000;
socketSever.listen(httpServer);
app.use(express.static("public"));

app.post("/douploadajax",updir.single("file"),function(request,response){
    console.log(JSON.stringify(request.body));  // 存放表单中的非file类型字段
    console.log(JSON.stringify(request.file));  // 存放表单中的file类型字段

    // step1: 创建一个IncomingForm对象的实例
    var imagename = new Date().getTime() + ".png";
    fs.renameSync(request.file.path,request.file.destination+imagename);
    // 并且给客户端一个响应信息
    console.log(imagename);
    response.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    response.write('<img src="show?pic='+request.file.destination+ imagename + '">');
    response.end();
});
// 处理图片显示的函数(将上传的图片发回客户端)
app.get("/show",function(request,response){
    var query = url.parse(decodeURI(request.url)).query;    // query: pic=beauty.png
    var imagename =qs.parse(query).pic;        // upload/beauty.png
    console.log("imagename:" + imagename);
    // 将图片以流的形式发回客户端 - 使用管道流
    fs.createReadStream(imagename).pipe(response);
});

httpServer.listen(process.env.PORT || port,function(){
    console.log("=============服务器运行在端口：" + port + "=============http://localhost:" + port);
});

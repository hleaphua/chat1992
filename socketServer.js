/**
 * Created by hxsd on 2016/6/3.
 */
var socketio = require("socket.io");
var allUserInfo=[];

module.exports.listen = function (httpServer) {
    var io = socketio.listen(httpServer);
    io.on("connection", function (socket) {
        console.log("有客户端请求：" + socket.id);
        socket.emit("welcome", allUserInfo);
        socket.on("user_enter", function (data) {
            socket.userInfo = data;
            socket.username=data.username;
            allUserInfo.push(data);
            socket.broadcast.emit("user_entered", data);
            socket.emit("my_entered", data);
        });
   /*     /!*私聊*!/
        socket.on("privateChat",function(sendUser,data,message){
            socket.emit("pChat",sendUser,data,message);
            socket.broadcast.emit("pAll", sendUser,data,message);
        })*/
        /*聊天*/
        socket.on("message", function (messageData) {
            console.log(socket.userInfo .username + "说：" + messageData.content);
            if (messageData.type == "userMessage") {
                messageData.username = socket.userInfo.username;
                messageData.userpic=socket.userInfo.userpic;
                socket.broadcast.send(messageData);
                messageData.username = "我";
                messageData.type = "myMessage";
                messageData.userpic=socket.userInfo.userpic;
                socket.send(messageData);
            }else if(messageData.type == "picMessage"){
                messageData.type = "userMessage";
                messageData.username = socket.userInfo.username;
                messageData.userpic=socket.userInfo.userpic;
                socket.broadcast.send(messageData);
                messageData.username = "我";
                messageData.type = "myMessage";
                messageData.userpic=socket.userInfo.userpic;
                socket.send(messageData);
            }else if(messageData.type == "priMessage"){
                messageData.username = socket.userInfo.username;
                messageData.userpic=socket.userInfo.userpic;
                socket.broadcast.send(messageData);
                messageData.username = "我";
                messageData.type = "myMessage";
                messageData.userpic=socket.userInfo.userpic;
                socket.send(messageData);
            }else if(messageData.type == "priPicMessage"){
                messageData.type = "priMessage";
                messageData.username = socket.userInfo.username;
                messageData.userpic=socket.userInfo.userpic;
                socket.broadcast.send(messageData);
                messageData.username = "我";
                messageData.type = "myMessage";
                messageData.userpic=socket.userInfo.userpic;
                socket.send(messageData);
            }
        });
        /*用户退出提醒*/
        socket.on("disconnect", function () {
            for(var index=0;index<allUserInfo.length;index++){
                if(allUserInfo[index].username==socket.username){
                    allUserInfo.splice(index,1);
                }
            }
            console.log(socket.username+"离开");
            socket.broadcast.emit("user_leave", socket.userInfo,allUserInfo);
        })
    })
}


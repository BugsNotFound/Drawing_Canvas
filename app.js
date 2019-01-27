var express = require("express"),
    app = express(),
    socket      = require("socket.io");


app.use(express.static("public"));

var server = app.listen(process.env.PORT, process.env.IP, function(){
    console.log("I am listening...");
});




var io = socket(server);    //socket.io will work on this server


io.on("connection", function(socket){     //event handler
    console.log("New Connection: " + socket.id);
    
    socket.on("mouse", function(data){
       //console.log(data); 
       socket.broadcast.emit("mouse", data);
    });
    
    socket.on("colorPick", function(data){
        socket.broadcast.emit("colorPick", data);
    });
    
});

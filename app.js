var express = require("express"),
    app = express(),
    socket = require("socket.io");


app.use(express.static("public"));

var server = app.listen(process.env.PORT, process.env.IP, function() {
    console.log("I am listening...");
});


var io = socket(server); //socket.io will work on this server

var totalConnections = 0;

io.of("/main_board").on("connection", function(socket) { //event handler
    totalConnections++;
    console.log("New Connection: " + socket.id);



    socket.on("mouse", function(data) {
        //console.log(data); 
        socket.broadcast.emit("mouse", data);
    });

    /*
    socket.on("colorPick", function(data){
        socket.broadcast.emit("colorPick", data);
    });
    */

    socket.on("resetCanvas", function(data) {
        //console.log('canvas cleared');
        socket.broadcast.emit("resetCanvas", data);
    });



});
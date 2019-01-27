
/* global firebase */
/* global io */
/* global createCanvas */
/* global background */
/* global stroke line mouseX mouseY pmouseX pmouseY */
/* global mouseIsPressed */


var socket = io.connect("https://hjwebdevbootcamp-srjjain1996.c9users.io/");

var database = "";
var drawing = [];

var color = {};
var palleteColor = "";


var pallete = document.getElementById("pick_color");

pallete.value = "000000";
pallete.style.backgroundColor = ("#000000");

        
function update(picker) {
    color.R = Math.round(picker.rgb[0]);
    color.G = Math.round(picker.rgb[1]);
    color.B = Math.round(picker.rgb[2]);

    palleteColor = pallete.value;
    socket.emit("colorPick", palleteColor);
}

update();

function setup() {
    //this is like pageLoad function for p5js
    
    // Canvas Initialization
    createCanvas(window.innerWidth, window.innerHeight);
    background(51);
    
    
    // FIREBASE    
    var config = {
        apiKey: "AIzaSyDP81usZbeYT7BntUurEG-hTiKLFppBhP8",
        authDomain: "drawing-minor.firebaseapp.com",
        databaseURL: "https://drawing-minor.firebaseio.com",
        projectId: "drawing-minor",
        storageBucket: "drawing-minor.appspot.com",
        messagingSenderId: "625285438967"
    };
    
    firebase.initializeApp(config);
    database = firebase.database();
    
    var ref = database.ref("boards");   //collection name
    
    var data = {
        name: "DTS",
        score: 43
    };
    
    ref.push(data);




    // Socket Initializations
    socket.on("mouse", function(data){
        console.log(data);
        stroke(data.color.R, data.color.G, data.color.B);
        line(data.x, data.y, data.px, data.py);
    });
    
    socket.on("colorPick", function(data){
        pallete.value = data;
        pallete.style.backgroundColor = ("#" + data);
    });
    
    
}



function mouseDragged(){
    //console.log("Sending: " + mouseX + ',' + mouseY);    
    
    var data = {
        x: mouseX,
        y: mouseY,
        
        px: pmouseX,
        py: pmouseY,
        color:  {
            R: color.R,
            G: color.G,
            B: color.B
        }
    };
    
    socket.emit("mouse", data);
        
        
    stroke(color.R, color.G, color.B);
    line(mouseX, mouseY, pmouseX, pmouseY);
        

    
}




function draw(){
    //This function runs continuously from top to bottom until the program is stopped
    
    if(mouseIsPressed){
        var point = {
            x: mouseX,
            y: mouseY
        }
        
        drawing.push(point);
    }
}

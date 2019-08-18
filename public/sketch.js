
/* global firebase */
/* global io */
/* global createCanvas */
/* global background */
/* global stroke line mouseX mouseY pmouseX pmouseY */
/* global mouseIsPressed */


var socket = io.connect("https://hjwebdevbootcamp-srjjain1996.c9users.io/main_board");




var database = "";
var drawing = [];

var g_color = {
    R: 00,
    G: 00,
    B: 00
};

var palleteColor = "";


var pallete = document.getElementById("pick_color");
pallete.value = "000000";
pallete.style.backgroundColor = ("#000000");

var rgbToHex = function (rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var fullColorHex = function(r,g,b) {   
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red+green+blue;
};
        
function update(picker) {
    g_color.R = Math.round(picker.rgb[0]);
    g_color.G = Math.round(picker.rgb[1]);
    g_color.B = Math.round(picker.rgb[2]);
    
    palleteColor = pallete.value;
    /*socket.emit("colorPick", palleteColor);*/
}

//update();

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
    
    var ref = database.ref("board_id/saved_board" /* + board.id*/);   //database name...later we'll change it to each route id name
    
    ref.once('value', function(data) {
        var temp = data.val();
        drawing = temp[Object.keys(temp)[0]];
        var count = drawing.length;
        
        
        drawing.forEach(function(drawing){
            count--;
            stroke(drawing.color.R, drawing.color.G, drawing.color.B);
            line(drawing.x, drawing.y, drawing.px, drawing.py);  
            
            if(count == 0){
                pallete.value = fullColorHex(drawing.color.R, drawing.color.B, drawing.color.G);
                pallete.style.backgroundColor = 'rgb(' + drawing.color.R + ", " + drawing.color.G + ", " + drawing.color.B + ')';
                g_color = drawing.color;
            }    
        });
        
    });
    
    
    




    // Socket Initializations
    socket.on("mouse", function(data){
        drawing.push(data);
        stroke(data.color.R, data.color.G, data.color.B);
        line(data.x, data.y, data.px, data.py);
    });
    
    /*
    //not required...
    socket.on("colorPick", function(data){
        pallete.value = data;
        pallete.style.backgroundColor = ("#" + data);
    });
    */
    
    socket.on("resetCanvas", function(data){
        document.getElementsByTagName("canvas")[0].remove();
        drawing.length = 0;     //empty the drawing array
      
            
        //create brand new canvas
        createCanvas(window.innerWidth, window.innerHeight);
        background(51);    
    })
}



function mouseDragged(){
    //console.log("Sending: " + mouseX + ',' + mouseY);    
    
    if(document.querySelectorAll("div[style]").length >= 20){
        //i.e color picker tab is open
        return;
    }
    
    var data = {
        x: mouseX,
        y: mouseY,
        
        px: pmouseX,
        py: pmouseY,
        color:  {
            R: g_color.R,
            G: g_color.G,
            B: g_color.B
        }
    };
    
    drawing.push(data);
    socket.emit("mouse", data);
        
    
    stroke(g_color.R, g_color.G, g_color.B);
    line(mouseX, mouseY, pmouseX, pmouseY);
}



function save_canvas_to_database(){
    var ref = database.ref("board_id/saved_board");   //collection name
    

    ref.remove(function(error){
        if(error){
            console.log(error);
        }else{
            var result = ref.push(drawing);
            alert("Board Saved to Database!!!");
        }
    });
}

function reset_canvas(){
    document.getElementsByTagName("canvas")[0].remove();
    drawing.length = 0;     //empty the drawing array
    
    //create brand new canvas
    createCanvas(window.innerWidth, window.innerHeight);
    background(51);
    
    
    
    socket.emit("resetCanvas", 1);
}


function draw(){
    
    
}


//To Do
// ================================= //
// remove pallete matching via socket.io...because two people may be using different colors and contributing to same piece...


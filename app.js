var c = document.querySelector('canvas');
c.width = window.innerWidth;
c.height = window.innerHeight;
var can = c.getContext('2d');

var x = ((window.innerWidth) / 2) - 55;
var y = (window.innerHeight) - 50
var dx = 17;
var dy = 0.8;
var orig_x = ((window.innerWidth) / 2) - 55;
var orig_y = (window.innerHeight) - 50;

var bul_x=((window.innerWidth) / 2) - 55;
var bul_y=(window.innerHeight) - 10;

var rocks = []; // Array to store rock objects
var rockSpeed = 1; // Adjust the speed as needed
var lastRockSpawnTime = 0;
var rockSpawnInterval = 2000; // 2 seconds (2000 milliseconds)

var stars = []; 
var starSpeed = 0.5; 
var lastStarSpawnTime = 0;
var StarSpawnInterval = 50;
var color=['yellow','white']

var H='----------'
var S=0
var CONGO="Congratulations ! you have completed the game. beat your high score."
const admin="@RikuZavi";


const img_ship = new Image();
img_ship.src = "images/ship.png";
img_ship.onload = function () {
    ship();
};

const img_enemy = new Image();
img_enemy.src = "images/alien.png";

const left_but=new Image();
left_but.src="images/left_but.png";

const right_but=new Image();
right_but.src="images/right_but.png";

const shoot_but=new Image();
shoot_but.src="images/target.png"

const bul = new Image();
bul.src="images/baloon.png";


function health(){ 
    can.font = "60px Arial";
    can.fillStyle="red";
    can.fillText(H,10,60)
}

function score(){
    can.font = "20px Arial";
    can.fillStyle="white";
    can.fillText('score :',c.width-130,48);
    can.fillText(S,c.width-50,50);
}

function win(){
    can.font = "15px Arial";
    can.fillStyle="white";
    can.fillText(CONGO,c.width-500,60)
}

function copyright(){
    can.font = "14px Arial";
    can.fillStyle="white";
    can.fillText(admin,5,c.height-8)
}



//update score
// score>30 increase speed and decreae sentinal spawn time  score+=30....

function star(x,y){
    var col_index = Math.floor(Math.random() *(color.length))
    can.beginPath();
    can.arc(x,y,0.8,0,Math.PI*2,false)
    can.fillStyle = color[col_index]
    can.fill();
}

function bullet(){
    can.beginPath();
    can.arc(bul_x+30,bul_y-10,3,0,Math.PI*2,false)
    can.fillStyle = "yellow"
    can.fill();
    //can.drawImage(bul, bul_x+20, bul_y,10,40);
}

function left(){
    can.drawImage(left_but,0,(window.innerHeight)-80,60,50)
}

function right(){
    can.drawImage(right_but,200,(window.innerHeight)-80,60,50)
}

function target(){
    can.drawImage(shoot_but,(window.innerWidth)-150,(window.innerHeight)-80,60,50)
}

function ship() {
    can.drawImage(img_ship, x, y, 60, 30);
}

function rock(x, y) {
    can.drawImage(img_enemy, x, y, 50, 25);
}

// Function to clear the canvas
function clearCanvas() {
    can.clearRect(0, 0, c.width, c.height);
}



// Function to update the canvas
function updateCanvas() {
    clearCanvas();
    ship();
    left();
    right();
    target();
    health();
    score();
    copyright();
    bullet();
    for (var i = 0; i < rocks.length; i++) {
        
        rocks[i].y += rockSpeed;
        rock(rocks[i].x, rocks[i].y);

        //collision detection
        var dif_x=Math.floor(rocks[i].x)-x
        if(rocks[i].y >= y - 12.9 && rocks[i].y <= y - 11.8){
            
            if(dif_x>=-45 && dif_x<=45){
                console.log("colide")
                H=H.replace(H[0],'')
            }
        }

        if ((rocks[i].y > y-10)) {
            rocks.splice(i, 1);
            i--;
        } else if(((rocks[i].y+10 > bul_y) && (bul_x <= rocks[i].x+30) && (bul_x >= rocks[i].x-30))){
            rocks.splice(i, 1);
            i--;
            S+=5
        }
    }

    for (var i = 0; i < stars.length; i++) {
        stars[i].y += starSpeed;
        star(stars[i].x, stars[i].y);
        if ((stars[i].y > c.height)) {
            stars.splice(i, 1);
            i--;
        }
    }

    if(S>=50){
        rockSpeed=1.2
        rockSpawnInterval=1500
    }
    if(S>=100){
        rockSpeed=1.4
        rockSpawnInterval=1000
    }
    if(S>=150){
        rockSpeed=1.5
        rockSpawnInterval=800
    }
    if(S>=200){
        rockSpeed=1.8
        rockSpawnInterval=500
    }
    if(S>=300){
        rockSpeed=1.3
        rockSpawnInterval=1200
        win()
    }
    

}

// Ship movement when the screen is pressed

window.addEventListener("mousedown", function () {
    var x_cor = this.event.x;
    if (x_cor < 120) {
        if (x > 10) {
            x = x - dx;
            bul_x=x;
        }
    } else if (x_cor > 120 && x_cor<265) {
        if (x < (c.width - 100)) {
            x = x + dx;
            bul_x=x
        }
    }
    updateCanvas(); // Update the canvas after moving the ship
       
    }, 30);



function fire(){
    if(bul_y > 50){
        bul_y-=40
        bullet()
        requestAnimationFrame(fire)
    } else {
        bul_y=(window.innerHeight) - 10
        bul_x=x
        bullet()
    }
    
}

window.addEventListener("mousedown", function(){
    var bulet_cor = this.event.x;
    if(bulet_cor>orig_x+200){
        console.log("fire")
        fire()
          
    }
});

function generate_star(){
    var x_star = Math.random() * (c.width); 
    var y_star = 0; 
    stars.push({ x: x_star, y: y_star });
}

// Function to generate a rock
function generateRock() {
    var x_rock = Math.random() * (c.width - 80); // Random x-axis position
    var y_rock = 0; // Fixed y-axis position
    rocks.push({ x: x_rock, y: y_rock });
}



// Animation loop
function gameLoop(timestamp) {
    updateCanvas();
    if (timestamp - lastRockSpawnTime >= rockSpawnInterval) {
        generateRock();
        lastRockSpawnTime = timestamp;
    }

    if (timestamp - lastStarSpawnTime >= StarSpawnInterval) {
        generate_star();
        lastStarSpawnTime = timestamp;
    }
    
    
    //checking health to specify game over else animation frame called

    if(H==''){   //should be less than 2
        alert("GAME OVER\nrefresh the page to start Again")
        clearCanvas()

    } else {
        requestAnimationFrame(gameLoop);
    }
    
}

// Start the animation loop
gameLoop()

window.addEventListener("resize", function () {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    updateCanvas(); // Update the canvas after resizing
});

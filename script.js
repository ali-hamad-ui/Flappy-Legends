const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

const menu = document.getElementById("menu");
const gameOver = document.getElementById("gameOver");

const finalScore = document.getElementById("finalScore");
const bestScoreText = document.getElementById("bestScore");

let best = localStorage.getItem("best") || 0;

bestScoreText.textContent = best;

let bird;
let pipes;
let score;
let gameRunning;

function startGame(){

menu.style.display="none";

gameOver.style.display="none";

canvas.style.display="block";

bird={

x:80,

y:250,

radius:18,

velocity:0

};

pipes=[];

score=0;

gameRunning=true;

spawnPipe();

requestAnimationFrame(loop);

}

function spawnPipe(){

let gap=170;

let topHeight=Math.random()*250+50;

pipes.push({

x:canvas.width,

top:topHeight,

bottom:topHeight+gap,

passed:false

});

}

function update(){

bird.velocity+=0.5;

bird.y+=bird.velocity;

if(bird.y>canvas.height||bird.y<0){

endGame();

}

for(let i=0;i<pipes.length;i++){

let p=pipes[i];

p.x-=3;

if(!p.passed&&p.x<bird.x){

score++;

p.passed=true;

}

if(

bird.x+bird.radius>p.x&&

bird.x-bird.radius<p.x+70&&

(

bird.y-bird.radius<p.top||

bird.y+bird.radius>p.bottom

)

){

endGame();

}

}

if(pipes.length==0||pipes[pipes.length-1].x<220){

spawnPipe();

}

if(pipes[0].x<-70){

pipes.shift();

}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="yellow";

ctx.beginPath();

ctx.arc(bird.x,bird.y,bird.radius,0,Math.PI*2);

ctx.fill();

ctx.fillStyle="green";

pipes.forEach(p=>{

ctx.fillRect(p.x,0,70,p.top);

ctx.fillRect(p.x,p.bottom,70,canvas.height-p.bottom);

});

ctx.fillStyle="white";

ctx.font="32px Arial";

ctx.fillText(score,20,40);

}

function loop(){

if(!gameRunning)return;

update();

draw();

requestAnimationFrame(loop);

}

function endGame(){

gameRunning=false;

canvas.style.display="none";

gameOver.style.display="block";

finalScore.textContent=score;

if(score>best){

best=score;

localStorage.setItem("best",best);

bestScoreText.textContent=best;

}

}

document.addEventListener("keydown",e=>{

if(e.code==="Space"){

bird.velocity=-8;

}

});

canvas.addEventListener("click",()=>{

bird.velocity=-8;

});

playBtn.onclick=startGame;

restartBtn.onclick=startGame;

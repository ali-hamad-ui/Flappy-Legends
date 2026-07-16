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


function spawnCoin() {
    coins.push({
        x: 400,
        y: Math.random() * 350 + 80
    });
}

let coins = [];
let coinScore = 0;

let clouds = [
    {x:60,y:90},
    {x:230,y:120},
    {x:350,y:70}
];

let bird;
let pipes;
let score;
let gameRunning;

function startGame(){

    coins = [];
    coinScore = 0;

    menu.style.display = "none";
    gameOver.style.display = "none";
    canvas.style.display = "block";

    bird = {
        x:80,
        y:250,
        radius:18,
        velocity:0
    };

    pipes = [];
    score = 0;
    gameRunning = true;

    spawnPipe();

    if(Math.random() < 0.7){
        spawnCoin();
    }

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

spawnCoin();

}

}

if(pipes[0].x<-70){

pipes.shift();

}
function update() {

    bird.velocity += 0.5;
    bird.y += bird.velocity;

    if (bird.y > canvas.height || bird.y < 0) {
        endGame();
    }

    clouds.forEach(c => {
        c.x -= 0.3;
        if (c.x < -70) c.x = 450;
    });

    coins.forEach((coin, index) => {
        coin.x -= 3;

        if (
            Math.abs(coin.x - bird.x) < 20 &&
            Math.abs(coin.y - bird.y) < 20
        ) {
            coinScore++;
            coins.splice(index, 1);
        }
    });

    for (let i = 0; i < pipes.length; i++) {

        let p = pipes[i];

        p.x -= 3;

        if (!p.passed && p.x < bird.x) {
            score++;
            p.passed = true;
        }

        if (
            bird.x + bird.radius > p.x &&
            bird.x - bird.radius < p.x + 70 &&
            (
                bird.y - bird.radius < p.top ||
                bird.y + bird.radius > p.bottom
            )
        ) {
            endGame();
        }
    }

    if (pipes.length == 0 || pipes[pipes.length - 1].x < 220) {
        spawnPipe();

        if (Math.random() < 0.7)
            spawnCoin();
    }

    if (pipes.length && pipes[0].x < -70) {
        pipes.shift();
    }
}

function loop() {

    if (!gameRunning) return;

    update();
    draw();

    requestAnimationFrame(loop);
}

function draw() {

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, 600);
    sky.addColorStop(0, "#87CEEB");
    sky.addColorStop(1, "#3AA0FF");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = "white";

    clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 25, 0, Math.PI * 2);
        ctx.arc(c.x + 20, c.y - 10, 20, 0, Math.PI * 2);
        ctx.arc(c.x + 40, c.y, 25, 0, Math.PI * 2);
        ctx.fill();
    });

    // Pipes
    ctx.fillStyle = "#28b463";

    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 70, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom);
    });

    // Coins
    ctx.fillStyle = "gold";

    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Ground
    ctx.fillStyle = "#7CFC00";
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    // Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.velocity * 0.05);

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Score
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 40);
    ctx.fillText("Coins: " + coinScore, 20, 80);
}

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

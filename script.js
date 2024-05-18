//canvas
let board;
let boardWidth=360;
let boardHeight=640;
let context;
let gameOver=false;
let score=0;

//bird
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;

let bird={
x:birdX,
y:birdY,
width:birdWidth,
height:birdHeight
}

//PIPE
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX=-2;
let velocityY=0;    //bird jump
let gravity=0.2;

window.onload=function(){
    board=document.getElementById("canvas");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");

    //bird drawing
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //bird image
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload=function(){
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png";
    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png";
    requestAnimationFrame(update);
    setInterval(placePipes,2500); //every 1.5 seconds
    document.addEventListener("keydown",moveBird);
    document.addEventListener("touchstart", moveBird);
}
function update(){
    //board
requestAnimationFrame(update);
if(gameOver){
    return;
}
context.clearRect(0,0,board.width,board.height);

   //bird
   velocityY+=gravity;
   bird.y=Math.max(bird.y+velocityY,0);
   
context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
 if(bird.y>boardHeight){
    gameOver=true;
 }
   //pipe
   for(let i =0; i<pipeArray.length;i++){
    let pipe=pipeArray[i];
    pipe.x+=velocityX;
    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

    if(!pipe.passed && bird.x>pipe.x+pipe.width){
        score+=0.5;       //because there are 2 pipes
        pipe.passed=true;
    }

    while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();
    }

    if(detectCollision(bird,pipe)){
        gameOver=true;
       }
   }

   if(gameOver){
    context.fillText("GAME OVER",40,300);
    context.fillStyle="blue";
   }
   context.fillStyle="white";
   context.font="45px sans-serif";
   context.fillText(score,5,45);
  
}
function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace=boardHeight/4;
let topPipe={
    img:topPipeImg,
    x:pipeX,
    y:randomPipeY,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
}
pipeArray.push(topPipe);
let bottomPipe={
    img:bottomPipeImg,
    x:pipeX,
    y:randomPipeY+pipeHeight+openingSpace,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
}
pipeArray.push(bottomPipe);
}
function moveBird(e){
    if(e.code=="Space"||e.code=="ArrowUp"|| e.code=="keyX"){
        velocityY=-6;
    }
    if(gameOver){
        bird.y=birdY;
        score=0;
        pipeArray=[];
        gameOver=false;
    }
}
function detectCollision(a,b){
    return a.x<b.x+b.width &&
    a.x+a.width>b.x &&
    a.y<b.y+b.height &&
    a.y+a.height>b.y;
}

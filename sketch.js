var trex, trex_running,trex_collided;
var ground, invisibleGround, groundImage;
var rand;
var cloud,cloudImage;
var obstacle;
var obstacle1,obstacle2,obstacle3,obstacle4;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameover,gameoverImage;
var restart,restartImage;
var checkpointSound,dieSound,jumpSound;
var tero,tero_fly;
var trexdown;
function preload(){
 trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  tero_fly = loadAnimation("tero1.png","tero2.png");
  trexdown = loadAnimation("trex_down1.png","trex_down2.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  trex.addAnimation("down",trexdown);
  
  ground = createSprite(width/2,height-80,width,2);
ground.addImage("ground",groundImage);
ground.x = width /2;

  
  //crea suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  teroGroup = new Group();
  
  console.log("hola mundo");
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  score = 0;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  gameover = createSprite(width/2,height/2- 50);
  gameover.addImage(gameoverImage);
  gameover.scale = 0.6;
}

function draw() {
  background("white");
  
  text("score:" +score,500,50);
 
  
  if(gameState === PLAY){
    
    
    ground.velocityX = -(4 + 3* score / 100);
    gameover.visible = false;
    restart.visible = false;
     score = score + Math.round(getFrameRate() /60);
    if(score >0 && score % 100 === 0){ 
    checkpointSound.play();
    }
     // duplicar suelo
if (ground.x < 0) {
  ground.x = ground.width / 2;
}
      if (touches.length > 0 || keyDown("space")&& trex.y >= height-120) {
  trex.velocityY = -10;
       jumpSound.play(); 
        touches = [];
}
    if(keyDown("down")){
      trex.changeAnimation("down",trexdown);
    }
    
    if(keyWentUp("down")){
      trex.changeAnimation("running",trex_running);
    }
    //gravedad
trex.velocityY = trex.velocityY + 0.8;
    spawnClouds();
  spawnObstacles();
    spawnTero();

     if(obstaclesGroup.isTouching(trex) || trex.isTouching(teroGroup)){
       dieSound.play();
    gameState = END;
  }
  }
  else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    gameover.visible = true;
    restart.visible = true;
     trex.changeAnimation("collided", trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    teroGroup.setVelocityXEach(0);
    teroGroup.setVelocityYEach(0);
    teroGroup.setLifetimeEach(-1);
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  trex.collide(invisibleGround);
  if(mousePressedOver(restart)){
    reset();
  }
  
  //aparece las nubes
  drawSprites();
}
function reset(){
  gameState = PLAY;
  gameover.visible = false;
    restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  teroGroup.destroyEach();
}
function spawnObstacles(){
  if(frameCount % 60 === 0){
    obstacle = createSprite(600,height-95,20,30);
    obstacle.velocityX = -(2 + score / 100);
  
    rand = Math.round(random(1,4));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
        case 2: obstacle.addImage(obstacle2);
        break;
        case 3: obstacle.addImage(obstacle3);
        break;
        case 4: obstacle.addImage(obstacle4);
        break;
        default: break;
    }
    obstacle.scale = 0.5;
      obstacle.lifetime = 250;
   obstaclesGroup.add(obstacle);
  }
}
function spawnClouds(){
  if(frameCount % 60 === 0){
   cloud = createSprite(width+20,height-300,40,10);
  cloud.addImage(cloudImage);
  cloud.velocityX = -2;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
     cloud.lifetime = 300;
  cloud.scale = 0.5;
  cloudsGroup.add(cloud);
  }
}
function spawnTero (){
  if(frameCount % 60 === 0){
  tero = createSprite(width+20,height-300,60,20);
  tero.addAnimation("fly",tero_fly);
  tero.velocityX = -3;
  tero.velocityY = 0.5;
    teroGroup.add(tero);
}
  }
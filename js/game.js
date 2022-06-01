//created by Thinh Nguyen
//get the game system
let gameScene = new Phaser.Scene("game");

gameScene.init= function(){
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;
    this.treeSpeedMax = 2;
    this.treeSpeedMin = 1;
    this.flag = false;//is the tree flag
    this.flagLevel = false;
    this.flagStopTree = false;
    this.flagRobot = false;
    this.flagMissle = false;
    this.waitForRobo = false;
    this.startJump = true;
    this.startCrouch = true;
    this.levelNum = 0;
    this.countMissle = 0;
    this.whileLoop = true;
    this.waitRound2 = false;
    this.changeMissleDir = false;
    this.xCount =1;
    this.speedLight = 2;
    this.speedLightY = 2;
    this.muteFlagBttn = true;
    this.isTerminated = false;
    this.cameraFlag = 0;
    this.cameraFadeOut = false;
    };
    //call after preload to create on screen
    gameScene.create = function(){
        this.entities = this.add.group();
        this.bg = this.add.sprite(0,0,"background");
        //Change the position
        this.bg.setPosition(this.gameWidth/2,this.gameHeight/2);
        console.log(this.gameWidth,this.gameHeight);
        //change the size of image
        this.bg.displayWidth = this.gameWidth;
        this.bg.displayHeight = this.gameHeight;
        this.ground = this.add.tileSprite(this.gameWidth/2,this.gameHeight+20,10*200,100,"ground");
        //cloud
        this.cloud = this.add.sprite(this.gameWidth/2,-40, "darkCloud");
        this.cloud.displayWidth = 100;
        this.cloud.displayHeight = 100;
        
        //this.lightning = this.add.sprite(this.gameWidth/2,this.gameHeight/2,"lightning");
        //this.lightning.displayHeight = 100;
        //this.lightning.displayWidth = 100;
        //this.lightning.visible= false;
        this.lightning = this.add.group({
            key:"lightning",
            repeat:10,
            setXY:{
                x:this.gameWidth/2,
                y:90,
            }
        });
        Phaser.Actions.ScaleXY(this.lightning.getChildren(),2,2);
        Phaser.Actions.Call(this.lightning.getChildren(),function(lightning){
            //let speed = this.treespeedMin + Math.random() * (this.treeSpeedMax - this.treespeedMax);
            lightning.visible = false;
        },this);
        this.rain= this.add.tileSprite(this.gameWidth/2,this.gameHeight/2,10*200,500,"rain")
        this.rain.visible = false;
        this.physics.add.existing(this.ground,true)
        
        //this.ground.setPosition(this.gameWidth/2,this.gameHeight-40);
        this.ground.setSize(this.gameWidth,249,true)//true mean it center is the collision
        //this.ground.displayWidth = this.gameWidth;
        //this.ground.depth =1
        //this.collison.add(this.ground);
        
        //Add the t-Rex
        this.tRex = this.physics.add.sprite(100,this.gameHeight-75,"tRex",0);
        //set size of image
        this.tRex.displayWidth = 60
        this.tRex.displayHeight = 90;
        
        //add the tree
        this.trees = this.add.group({
            key:"tree",
            repeat: 2,
            setXY:{
                x:400,
                y:(this.gameHeight-70),
                stepX:200,
                stepY:0,
            },
            });
        
        //scale trees
        Phaser.Actions.ScaleXY(this.trees.getChildren(),5,4);
        //Varitey of speed. loop through children
        Phaser.Actions.Call(this.trees.getChildren(),function(tree){
            let speed = this.treeSpeedMin + Math.random() * (this.treeSpeedMax-this.treeSpeedMin);
            tree.speed = speed;
            //this.graphics.fillRectShape(tree);
        },this);
        this.captureRex = this.tRex.y;
        //create a function that contain event
        
        this.bg.setInteractive();
        this.bg.on("pointerdown",doJump,this);
        this.bg.on("pointerup",goDown,this);
        //walking animation
        this.anims.create({
            
            key: "walking",
            frames:this.anims.generateFrameNames("tRex",{
                frames:[0,1,2]
            }),
            frameRate:12,
            yoyo:true,//frame go back
            repeat: -1,
        });
        this.treesChild = this.trees.getChildren();
        this.robot = this.add.sprite(this.gameWidth+22,this.gameHeight-150,"robot",0);
        this.physics.add.existing(this.robot);
        this.entities.add(this.tRex);
        this.entities.add(this.robot);
        //this.robot.setSize(100,200,true);
        this.robot.displayHeight = 100;
        this.robot.displayWidth = 100;
        this.robot.visible = false;
        
        //set collision for t-Rex
        this.physics.add.collider(this.ground,this.entities);
        //Add the missle
        this.missle = this.add.group({
            key:"missle",
            repeat: 1,
            setXY:{
                x:500,//far away from scene
                y: (this.gameHeight-70),
                stepX:50,
                stepY:10,
            }
        });
        Phaser.Actions.ScaleXY(this.missle.getChildren(),10,10);
        Phaser.Actions.Call(this.missle.getChildren(),function(missile){
            let speed = this.treespeedMin + Math.random() * (this.treeSpeedMax - this.treespeedMax);
            missile.visible = false;
        },this);
        this.missileChild = this.missle.getChildren() 
        this.tRexBull = this.add.sprite(140,this.gameHeight-50,"missle");
        this.tRexBull.displayHeight = 100;
        this.tRexBull.displayWidth = 100;
        this.tRexBull.visible = false;
        this.music = this.sound.add("music");
        this.mute = this.add.sprite(this.gameWidth-30,90,"mute");
        this.mute.displayWidth = 80;
        this.mute.displayHight = 100;
        this.mute.setInteractive();
        this.mute.on("pointerdown",mute,this);
        this.gameOverScreen = this.add.container(this.gameWidth/2,this.gameHeight/2,).setAlpha(0);
        this.scoreText = this.add.text(-80,-80,"Game Over",{fontSize: "32px",fill: "#11111"});
        this.scoreText2 = this.add.text(-250,-80,"Congrat for making this far!!",{fontSize: "32px",fill: "#11111"});
        this.replay = this.add.sprite(0,0,"replay");
        this.replay.setInteractive();
        this.replay2 = this.add.sprite(0,0,"replay");
        this.replay2.setInteractive();
        this.replay.on("pointerdown",replay,this);
        this.replay2.on("pointerdown",replay2,this);

        this.gameOverScreen.add([
            this.scoreText,this.replay
        ])
        this.gameOverScreen2 = this.add.container(this.gameWidth/2,this.gameHeight/2,).setAlpha(0);
        this.gameOverScreen2.add([
            this.scoreText2,this.replay2
        ])
        this.graphics = this.add.graphics({ fillStyle: { color: 0x00FF00} });//0x to signifies hexadecimal
        //this.music.allowMultiple = true;
        
        //this.music.play();
        //this.music.play();
        };
//update the frame rate
gameScene.update = function(){
    //this.rain.tilePositionY -= 0.5;
    //this.graphics.clear();
    //this.playerBound = this.tRex.getBounds();
    this.rect = new Phaser.Geom.Rectangle(this.tRex.x,this.tRex.y,30,50);
    Phaser.Geom.Rectangle.CenterOn(this.rect,this.tRex.x-5,this.tRex.y+10)
    //this.graphics.fillRectShape(this.rect);
    //collision
    if(this.flagLevel == true){
        if(this.levelNum <=3){
            if(this.levelNum == 0){
                this.music.play();
            this.time.delayedCall(2000,()=>{
            this.scoreText = this.add.text(16,16,"Welcome Friend!",{fontSize: "32px",fill: "#535353"});
        },null,this);
            }
            else if(this.levelNum == 1){
            this.time.delayedCall(9000,()=>{
                if(this.isTerminated){
                    //this.scoreText.destroy();
                   return this.gameOver();
                }
                this.scoreText.setText("Looking good. Here come a ROBOT!!!!");
                this.flagStopTree = true;
                this.trees.clear(true,true);//remove the group, destroy from scene
                //this.trees.destroy();
                this.robot.visible = true;
                this.flagRobot = true;
                this.time.delayedCall(3900,()=>{
                    this.flagMissle = true;
                },null,this);
                this.time.delayedCall(4500,()=>{
                    this.waitForRobo = true;
                },null,this);
            },null,this);
        }else if(this.levelNum == 2){
            this.time.delayedCall(24000,()=>{
                if(this.isTerminated){
                //    this.scoreText.destroy();
                 //   console.log("end");
                 //   return;
                 return this.gameOver();
                }

                this.changeMissleDir= true;
                this.rain.visible = true;
                this.scoreText.setText("Wow you did it! Oh look THUNDER!!!");
                this.waitRound2 = true;
            },null,this);
        }else if (this.levelNum == 3){
            this.time.delayedCall(50000,()=>{
                if(this.isTerminated){
                    //this.scoreText.destroy();
                      //  console.log("end");
                      //  return;
                      return this.gameOver();
                   }
                   this.scoreText.destroy();
                   this.music.stop();
                   this.gameOverScreen2.setAlpha(1);
                 //this.flagLevel = false;
                this.waitRound2 = false;
                this.rain.destroy();
                this.cloud.destroy();
                this.lightning.getChildren().forEach((child)=>{
                    child.destroy();
                })
                this.tRex.x = this.gameWidth/2;
                this.ground.tilePositionX +=1;
                this.tRex.body.setVelocity(0);
                //game end
            },null,this);
        }
        }
            //this.scoreText.visible = false;
            //removefromscene
            //this.scoreText.removedfromscene;
            //console.log(this.scoreText);
            if(this.levelNum<=3){
            this.levelNum++;
            }
        
        }//if true
        //Round 2 Thunder Round start
        if(this.waitRound2){
            if(this.input.activePointer){
                this.rain.tilePositionY -= 0.5;
                //move the object toward the mouse;
                this.physics.moveTo(this.tRex,this.input.x,this.gameHeight-75,200);
            }
            this.cloud.visible = true;
            if(this.cloud.y == 90){
                this.cloud.y +=0;
                this.lightning.getChildren().forEach((missle,idx,array)=>{
                    missle.visible = true;
                    this.lightningRect = new Phaser.Geom.Rectangle(missle.x,missle.y,10,50);
                    Phaser.Geom.Rectangle.CenterOn(this.lightningRect,missle.x-10,missle.y)
            //this.graphics.fillRectShape(this.lightningRect);
                if(Phaser.Geom.Intersects.RectangleToRectangle(this.rect,this.lightningRect)){
                 return this.gameOver();
        
                 }
                    if(this.xCount ==1){
                    //missle.flipX =false;
                    if(this.speedLight <0.5){
                        this.speedLight = 0;
                    }
                    missle.x -= this.speedLight;
                    missle.y += this.speedLightY;
                    if(missle.y >= 600){
                        missle.x = this.gameWidth/2;
                        missle.y = 90;
                        this.speedLight = Math.random() *15;
                        this.speedLightY = Math.random() *3 +5;
                        this.xCount= 0;
                    }
                    }else{
                        if(this.speedLight <0.5){
                            this.speedLight = 0;
                        }else if(this.speedLight>14){
                            this.speedLight = 30;
                        }
                        //missle.flipX = true;
                        missle.x += 30;//this.speedLight;
                        missle.y += this.speedLight +5;
                        if(missle.y >= 600){
                            missle.x = this.gameWidth/2;
                            missle.y = 90;
                            this.speedLight = Math.random() *15;
                            this.speedLightY = Math.random() *3 +5;
                            this.xCount= 1;
                        }
                    }
                },null,this);
            }else{
                this.cloud.y += 2;
            }
                //this.lightning.x -= Math.radoom()* 2 < 1.5 ? 1:-1;
        }

        if(this.flagMissle == true){
        this.missileChild.forEach((missle,idx,array)=>{
            missle.visible=true;
            this.missleRect = new Phaser.Geom.Rectangle(missle.x,missle.y,50,10);
            Phaser.Geom.Rectangle.CenterOn(this.missleRect,missle.x-10,missle.y)
    //this.graphics.fillRectShape(this.missleRect);
        if(Phaser.Geom.Intersects.RectangleToRectangle(this.rect,this.missleRect)){
          return this.gameOver();

         }
            if(this.waitForRobo){
            this.robot.setFrame(1);
            }
            if(!this.changeMissleDir){
            array[idx].y = this.gameHeight-70;
            array[idx].x -= 7;
            
            if(array[1].x <= -10){
                array[idx].x = 500;
                array[idx].y = this.gameHeight-70;
               if(Math.random()*2 <= 1.5){
                   this.changeMissleDir = true;
               }
                //create an index and an if to stop at the 9th shot
                this.countMissle++;
                }
            }else{
                array[idx].x -=7;
                array[idx].y -= 0.5;
                if(array[1].x <= -10){
                    array[idx].x = 500;
                    array[idx].y = this.gameHeight-70;
                    if(Math.random()*2 <= 1.5){
                        this.changeMissleDir = false;
                    }
                    this.countMissle++;
                }
            }
            
          },null,this);
          if(this.countMissle == 5){
            this.flagRobot = false;
            this.tRex.anims.paused = true;
            this.robot.setFrame(0);
            this.tRex.setFrame(3);
            this.startJump = false;
            this.missle.clear(true,true);
            this.tRexBull.visible = true;
            this.tRexBull.displayWidth += 13;
            this.tRexBull.displayHeight +=1;
            this.tRexBull.x +=3;
            if(this.tRexBull.x > this.gameWidth-20){
            this.robot.x += 5;
            if(this.robot.x > this.gameWidth+100){
                this.tRex.anims.paused = false;
            this.robot.destroy();
            this.tRexBull.destroy();
            this.startCrouch = false;
            this.flagMissle =false;
            this.countMissle++;
            }
            }
         }

        }
if(this.flagRobot == true){
    if(this.robot.x > 600){
        this.robot.x -= 10;
   }
}
//are we on the ground
this.onGround = this.tRex.body.blocked.down || 
this.tRex.body.touching.down;//physical body touching something down or anything.
// loop through the trees and make it go
if(this.flag == true){
    if(!this.flagStopTree){
    let i ;
    //this.music.play();
for(i = 0; i< this.treesChild.length;i++){
    //this.treeBound = this.treesChild[i].getBounds();
    this.treeRect = new Phaser.Geom.Rectangle(this.treesChild[i].x,this.treesChild[i].y,20,30);
    Phaser.Geom.Rectangle.CenterOn(this.treeRect,this.treesChild[i].x,this.treesChild[i].y);
    //this.graphics.fillRectShape(this.treeRect);
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.rect,this.treeRect)){
        return this.gameOver();

    }
    this.treesChild[i].x -= this.treesChild[i].speed + 1;        
        if(this.treesChild[i].x< -1){
            this.treesChild[i].x = this.gameWidth //- Math.random() * 10;
        }
    }
    this.ground.tilePositionX += 2;
};
    //turn on the level muhahaha
    this.flagLevel = true;
};

};//update

//create a game over function
gameScene.gameOver = function(){
    this.bg.off("pointerdown",doJump,this);
    this.waitRound2 = false;
    this.tRex.body.velocity.setTo(0, 0);
    if(this.cameraFlag == 0){
    this.cameras.main.shake(500);
    this.cameraFlag = 1;
    }
    this.isTerminated = true;
    this.flagMissle = false;
    this.round2 = false;
    this.flag = false;
    Phaser.Actions.Call(this.missle.getChildren(),function(missile){
        missile.destroy();
    },this);
    Phaser.Actions.Call(this.trees.getChildren(),function(tree){
        tree.destroy();
    },this);
    Phaser.Actions.Call(this.lightning.getChildren(),function(lightning){
        lightning.destroy();
    },this);
    this.cloud.destroy();
    this.scoreText.destroy();
    this.cameras.main.on("camerashakecomplete",function(camera,effect){
        this.music.stop();
        this.gameOverScreen.setAlpha(1);
    },this);
}
//Replay function
function replay(){
    this.scene.restart();
}
function replay2(){
    this.scene.restart();
}
//create the mute event
function mute(){
    console.log("here");
    if(this.muteFlagBttn){
        console.log("start");
        this.mute.setFrame(1);
        this.music.pause();
        this.muteFlagBttn = false;
    }else{
        this.mute.setFrame(0);
        this.music.resume();
        this.muteFlagBttn =true;
    }
}
//function that do the jump
function doJump(){
    this.tRex.anims.play("walking");
    //this.tRex.y = this.tRex.y- 90;
    if(this.onGround && this.startJump){
    this.tRex.body.setVelocityY(-600);
    }
    this.flag=true;
}
//function to go down
function goDown(){
        //this.tRex.y =this.captureRex;
        this.tRex.body.setVelocityY(0);
};
//Config the game
let config = {
    type: Phaser.AUTO,//Phaser.AUTO, // use canvas or webGL
    width: 640,
    height: 360,
    scene: [ bootScene,preLoadScene,gameScene],
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:1000},
            debug:true,
        }
    }
}
//create a new game 
let game = new Phaser.Game(config);
//    let timedEvent = this.time.delayedCall(2000,goDown,this.tRex,this);

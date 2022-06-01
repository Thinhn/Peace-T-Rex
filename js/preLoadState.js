let preLoadScene = new Phaser.Scene("loading");

    preLoadScene.preload=function(){
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        this.background = this.add.sprite(this.gameWidth/2,this.gameHeight/2, "backgroundImg");
        //this.background.setPosition(this.gameWidth,this.gameHeight);
        this.background.displayWidth = this.gameWidth;
        this.background.displayHeight = this.gameHeight;
        this.tRex = this.add.sprite(this.gameWidth/2,this.gameHeight-200,"tRexLogo");
        this.tRex.displayHeight = 100;
        this.tRex.displayWidth = 100;
        this.scoreText = this.add.text(this.gameWidth/2-100,90,"Please Wait...",{fontSize: "32px",fill: "#11111"});
        //this.scoreText = this.add.text(this.gameWidth/2-100,30,"By Thinh N",{fontSize: "32px",fill: "#11111"});

        //load the images
this.load.image("missle","assetT-Rex/missle.png");
this.load.spritesheet("robot","assetT-Rex/robotSprite.png",{
    frameWidth:30,
    frameHeight:25,
    margin:1,
    spacing:1,
});
this.load.image("background","assetT-Rex/sky.png");
this.load.image("tree","assetT-Rex/tree.png");
this.load.spritesheet("tRex","assetT-Rex/tRexSprite.png",{
    frameWidth: 20,
    frameHeight:30,
    margin:6,
    spacing:4,
});
this.load.image("ground","assetT-Rex/ground2.png");
this.load.image("rain","assetT-Rex/rain.png");
this.load.image("darkCloud","assetT-Rex/darkCloud.png");
this.load.image("lightning","assetT-Rex/lightning.png");
this.load.audio("music","audio/SmoothCoolByNico.mp3");
this.load.spritesheet("mute","assetT-Rex/musicSprite.png",{
    frameWidth:30,
    frameHeight:20,
    margin:1,
    spacing:1,
});
this.load.image("replay","assetT-Rex/replayBttn.png");
    }
    preLoadScene.create= function(){
        this.scene.start("game");

    }
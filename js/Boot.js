let bootScene = new Phaser.Scene("boot");
bootScene.preload = function(){
        this.load.image("backgroundImg","assetT-Rex/sky.png");
        this.load.image("tRexLogo","assetT-Rex/tRex.png");
        this.load.image("loadBar","assetT-Rex/loadBar.png");
    }
    bootScene.create = function(){
        //this.stage.backgroundColor = "#fff";
        this.scene.start("loading");
    }
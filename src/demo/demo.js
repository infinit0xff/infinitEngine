"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
   
    // the camera to view the scene
    this.ivCamera = null;

    // for echo message
    this.ivMsg = null;

    // the hero and the support objects
    this.ivHero = null;
    this.ivBrain = null;

    // mode of running: 
    //   H: Player drive brain
    //   J: Dye drive brain, immediate orientation change
    //   K: Dye drive brain, gradual orientation change
    this.ivMode = 'H';
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
};

Demo.prototype.initialize = function () {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5),   // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    // create the brain  
    this.ivBrain = new Brain(this.kMinionSprite);

    //  create the hero object 
    this.ivHero = new Hero(this.kMinionSprite);

    // for displaying message 
    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([0, 0, 0, 1]);
    this.ivMsg.getXform().setPosition(1, 2);
    this.ivMsg.setTextHeight(3);
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // activate the drawing Camera
    this.ivCamera.setupViewProjection();

    // draw everything
    this.ivHero.draw(this.ivCamera);
    this.ivBrain.draw(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var msg = "Brain [H:keys J:imm K:gradual]: ";
    var rate = 1;

    this.ivHero.update();
    
    // get the bounding box for collision
    var hBbox = this.ivHero.getBBox();
    var bBbox = this.ivBrain.getBBox();
    switch (this.ivMode) {
    case 'H':
        this.ivBrain.update();  // player steers with arrow keys
        break;
    case 'K':
        rate = 0.02;    // graduate rate
        // when "K" is typed, the following should also be executed.
    case 'J':
        if (!hBbox.intersectsBound(bBbox)) {  // stop the brain when it touches hero bound
            this.ivBrain.rotateObjPointTo(this.ivHero.getXform().getPosition(), rate);
            GameObject.prototype.update.call(this.ivBrain);  // the default GameObject: only move forward
        }
        break;
    }
    
    // Check for hero going outside 80% of the WC Window bound
    var status = this.ivCamera.collideWCBound(this.ivHero.getXform(), 0.8);
    
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.H)) {
        this.ivMode = 'H';
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.J)) {
        this.ivMode = 'J';
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.K)) {
        this.ivMode = 'K';
    }
    this.ivMsg.setText(msg + this.ivMode + " [Hero bound=" + status + "]");
    };
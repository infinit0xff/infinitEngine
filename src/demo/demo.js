"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionCollector = "assets/minion_collector.png";
    this.kMinionPortal = "assets/minion_portal.png";
    
    // the camera to view the scene
    this.ivCamera = null;

    this.ivMsg = null;

   // the hero and the support objects
   this.ivHero = null;
   this.ivBrain = null;
   this.ivPortalHit = null;
   this.ivHeroHit = null;

   this.ivPortal = null;
   this.ivLMinion = null;
   this.ivRMinion = null;

   this.ivCollide = null;
   this.ivChoice = 'H';
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kMinionPortal);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kMinionPortal);
};

Demo.prototype.initialize = function () {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    this.ivBrain = new Brain(this.kMinionSprite);

    // Step D: Create the hero object with texture from the lower-left corner 
    this.ivHero = new Hero(this.kMinionSprite);
        
    this.ivPortalHit = new DyePack(this.kMinionSprite);
    this.ivPortalHit.setVisibility(false);
    this.ivHeroHit = new DyePack(this.kMinionSprite);
    this.ivHeroHit.setVisibility(false);
        
    this.ivPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);
        
    this.ivLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.ivRMinion = new Minion(this.kMinionSprite, 70, 30);
        
    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([0, 0, 0, 1]);
    this.ivMsg.getXform().setPosition(1, 2);
    this.ivMsg.setTextHeight(3);
        
    this.ivCollide = this.ivHero;
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // activate the drawing Camera
    this.ivCamera.setupViewProjection();

     // Step  C: Draw everything
     this.ivHero.draw(this.ivCamera);
     this.ivBrain.draw(this.ivCamera);
     this.ivPortal.draw(this.ivCamera);
     this.ivLMinion.draw(this.ivCamera);
     this.ivRMinion.draw(this.ivCamera);
     this.ivPortalHit.draw(this.ivCamera);
     this.ivHeroHit.draw(this.ivCamera);
     this.ivMsg.draw(this.ivCamera);
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var msg = "[L/R: Left or Right Minion; H: Dye; B: Brain]: ";

    this.ivLMinion.update();
    this.ivRMinion.update();

    this.ivHero.update();

    this.ivPortal.update(infinitEngine.Input.keys.Up, infinitEngine.Input.keys.Down,
        infinitEngine.Input.keys.Left, infinitEngine.Input.keys.Right, infinitEngine.Input.keys.P);

    var h = [];

    // Portal intersects with which ever is selected
    if (this.ivPortal.pixelTouches(this.ivCollide, h)) {
        this.ivPortalHit.setVisibility(true);
        this.ivPortalHit.getXform().setXPos(h[0]);
        this.ivPortalHit.getXform().setYPos(h[1]);
    } else {
        this.ivPortalHit.setVisibility(false);
    }

    // hero always collide with Brain (Brain chases hero)
    if (!this.ivHero.pixelTouches(this.ivBrain, h)) {
        this.ivBrain.rotateObjPointTo(this.ivHero.getXform().getPosition(), 0.05);
        GameObject.prototype.update.call(this.ivBrain);
        this.ivHeroHit.setVisibility(false);
    } else {
        this.ivHeroHit.setVisibility(true);
        this.ivHeroHit.getXform().setPosition(h[0], h[1]);
    }

    // decide which to collide
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.L)) {
        this.ivCollide = this.ivLMinion;
        this.ivChoice = 'L';
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.R)) {
        this.ivCollide = this.ivRMinion;
        this.ivChoice = 'R';
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.B)) {
        this.ivCollide = this.ivBrain;
        this.ivChoice = 'B';
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.H)) {
        this.ivCollide = this.ivHero;
        this.ivChoice = 'H';
    }

    this.ivMsg.setText(msg + this.ivChoice);
};
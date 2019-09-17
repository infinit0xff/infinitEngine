"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionPortal = "assets/minion_portal.png";
    this.kBg = "assets/bg.png";
    
    // the camera to view the scene
    this.ivCamera = null;

    this.ivBg = null;

    this.ivMsg = null;

   // the hero and the support objects
   this.ivHero = null;
   this.ivBrain = null;
   this.ivPortal = null;
   this.ivLMinion = null;
   this.ivRMinion = null;
   this.ivFocusObj = null;

   this.ivChoice = 'D';
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kMinionPortal);
    infinitEngine.Textures.loadTexture(this.kBg);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kMinionPortal);
    infinitEngine.Textures.loadTexture(this.kBg);
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

    // Large background image
    var bgR = new SpriteRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(150, 150);
    bgR.getXform().setPosition(50, 35);
    this.ivBg = new GameObject(bgR);

    // Objects in the scene
    this.ivBrain = new Brain(this.kMinionSprite);
    this.ivHero = new Hero(this.kMinionSprite);
    this.ivPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);
    this.ivLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.ivRMinion = new Minion(this.kMinionSprite, 70, 30);
    this.ivFocusObj = this.ivHero;

    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([1, 1, 1, 1]);
    this.ivMsg.getXform().setPosition(2, 4);
    this.ivMsg.setTextHeight(3);
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // activate the drawing Camera
    this.ivCamera.setupViewProjection();

  
    // Step  C: Draw everything
    this.ivBg.draw(this.ivCamera);
    this.ivHero.draw(this.ivCamera);
    this.ivBrain.draw(this.ivCamera);
    this.ivPortal.draw(this.ivCamera);
    this.ivLMinion.draw(this.ivCamera);
    this.ivRMinion.draw(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var zoomDelta = 0.05;
    var msg = "[L/R: Left or Right Minion; H: Dye; B: Brain]: ";
    
    // for smoother camera movements
    this.ivCamera.update();

    this.ivLMinion.update();
    this.ivRMinion.update();

    this.ivHero.update();

    this.ivPortal.update(     // for arrow movement
        infinitEngine.Input.keys.Up,
        infinitEngine.Input.keys.Down,
        infinitEngine.Input.keys.Left,
        infinitEngine.Input.keys.Right
    );

    // Brain chasing the hero
    var h = [];
    if (!this.ivHero.pixelTouches(this.ivBrain, h)) {
        this.ivBrain.rotateObjPointTo(this.ivHero.getXform().getPosition(), 0.01);
        GameObject.prototype.update.call(this.ivBrain);
    }

    // Pan camera to object
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.L)) {
        this.ivFocusObj = this.ivLMinion;
        this.ivChoice = 'L';
        this.ivCamera.panTo(this.ivLMinion.getXform().getXPos(), this.ivLMinion.getXform().getYPos());
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.R)) {
        this.ivFocusObj = this.ivRMinion;
        this.ivChoice = 'R';
        this.ivCamera.panTo(this.ivRMinion.getXform().getXPos(), this.ivRMinion.getXform().getYPos());
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.P)) {
        this.ivFocusObj = this.ivPortal;
        this.ivChoice = 'P';
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.H)) {
        this.ivFocusObj = this.ivHero;
        this.ivChoice = 'H';
    }

    // zoom
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.N)) {
        this.ivCamera.zoomBy(1 - zoomDelta);
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.M)) {
        this.ivCamera.zoomBy(1 + zoomDelta);
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.J)) {
        this.ivCamera.zoomTowards(this.ivFocusObj.getXform().getPosition(), 1 - zoomDelta);
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.K)) {
        this.ivCamera.zoomTowards(this.ivFocusObj.getXform().getPosition(), 1 + zoomDelta);
    }

    // interaction with the WC bound
    this.ivCamera.clampAtBoundary(this.ivBrain.getXform(), 0.9);
    this.ivCamera.clampAtBoundary(this.ivPortal.getXform(), 0.8);
    this.ivCamera.panWith(this.ivHero.getXform(), 0.9);

    // camera shake effect
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Q)) {
        this.ivCamera.shake(-2, -2, 20, 30);
    }

    this.ivMsg.setText(msg + this.ivChoice);
};
"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionCollector = "assets/minion_collector.png";
    this.kMinionPortal = "assets/minion_portal.png";
    
    // the camera to view the scene
    this.ivCamera = null;

    this.ivMsg = null;

    this.ivCollector = null;
    this.ivPortal = null;
}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kMinionCollector);
    infinitEngine.Textures.loadTexture(this.kMinionPortal);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kMinionCollector);
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

    this.ivDyePack = new DyePack(this.kMinionSprite);
    this.ivDyePack.setVisibility(false);

    this.ivCollector = new TextureObject(this.kMinionCollector, 50, 30, 30, 30);
    this.ivPortal = new TextureObject(this.kMinionPortal, 70, 30, 10, 10);

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
    this.ivCollector.draw(this.ivCamera);
    this.ivPortal.draw(this.ivCamera);
    this.ivDyePack.draw(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var msg = "No Collision";

    this.ivCollector.update(infinitEngine.Input.keys.W, infinitEngine.Input.keys.S,
        infinitEngine.Input.keys.A, infinitEngine.Input.keys.D);
    this.ivPortal.update(infinitEngine.Input.keys.Up, infinitEngine.Input.keys.Down,
        infinitEngine.Input.keys.Left, infinitEngine.Input.keys.Right);

    var h = [];

    // portal's resolution is 1/16 x 1/16 that of Collector!
    // if (this.ivCollector.pixelTouches(this.ivPortal, h)) {  // <-- VERY EXPENSIVE!!
    if (this.ivPortal.pixelTouches(this.ivCollector, h)) {
        msg = "Collided!: (" + h[0].toPrecision(4) + " " + h[1].toPrecision(4) + ")";
        this.ivDyePack.setVisibility(true);
        this.ivDyePack.getXform().setXPos(h[0]);
        this.ivDyePack.getXform().setYPos(h[1]);
    } else {
        this.ivDyePack.setVisibility(false);
    }
    this.ivMsg.setText(msg);
};
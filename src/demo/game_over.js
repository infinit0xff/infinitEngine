"use strict";

function GameOver() {
    this.ivCamera = null;
    this.ivMsg = null;
}
infinitEngine.Core.inheritPrototype(GameOver, Scene);

GameOver.prototype.unloadScene = function () {
    // will be called from GameLoop.stop
    infinitEngine.Core.cleanUp(); // release gl resources
};

GameOver.prototype.initialize = function () {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 33),   // position of the camera
        100,                       // width of camera
        [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to gray

    this.ivMsg = new FontRenderable("Game Over!");
    this.ivMsg.setColor([0, 0, 0, 1]);
    this.ivMsg.getXform().setPosition(22, 32);
    this.ivMsg.setTextHeight(10);
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GameOver.prototype.draw = function () {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // activate the drawing Camera
    this.ivCamera.setupViewProjection();
    this.ivMsg.draw(this.ivCamera.getVPMatrix());
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GameOver.prototype.update = function () {
    infinitEngine.GameLoop.stop();
};
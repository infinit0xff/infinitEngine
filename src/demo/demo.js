"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    // The camera to view the scene
    this.ivCamera = null;

    // For echo message
    this.ivMsg = null;

    // the hero and the support objects
    this.ivHero = null;
    this.ivMinionset = null;
    this.ivDyePack = null;
}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
};

Demo.prototype.initialize = function () {
    // Step A: set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5),   // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
            // 
    // Step B: The dye pack: simply another GameObject
    this.ivDyePack = new DyePack(this.kMinionSprite);

    // Step C: A set of Minions
    this.ivMinionset = new GameObjectSet();
    var i = 0, randomY, aMinion;
    // create 5 minions at random Y values
    for (i = 0; i <  5; i++) {
        randomY = Math.random() * 65;
        aMinion = new Minion(this.kMinionSprite, randomY);
        this.ivMinionset.addToSet(aMinion);
    }

    // Step D: Create the hero object
    this.ivHero = new Hero(this.kMinionSprite);

    // Step E: Create and initialize message output
    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([0, 0, 0, 1]);
    this.ivMsg.getXform().setPosition(1, 2);
    this.ivMsg.setTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // Step A: clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.ivCamera.setupViewProjection();

    // Step  C: draw everything
    this.ivHero.draw(this.ivCamera);
    this.ivMinionset.draw(this.ivCamera);
    this.ivDyePack.draw(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    this.ivHero.update();
    this.ivMinionset.update();
    this.ivDyePack.update();
};
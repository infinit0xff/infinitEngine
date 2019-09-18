"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBg = "assets/bg.png";

    // the camera to view the scene
    this.ivCamera = null;
    this.ivBg = null;

    this.ivMsg = null;

    // the hero and the support objects
    this.ivHero = null;
    this.ivLMinion = null;
    this.ivRMinion = null;

    this.ivGlobalLightSet = null;

    // to verify swiitching between shaders is fine
    this.ivBlock1 = null;
    this.ivBlock2 = null;
    this.ivLgtIndex = 0;    // the light to move

}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kBg);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kBg);
};

Demo.prototype.initialize = function () {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    // sets the background to gray
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
   
    this._initializeLights();   // defined in demo_lights.js

    // the Background
    var bgR = new LightRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(100, 100);
    bgR.getXform().setPosition(50, 35);
    var i;
    for (i = 0; i < 4; i++) {
        bgR.addLight(this.ivGlobalLightSet.getLightAt(i));   // all the lights
    }
    this.ivBg = new GameObject(bgR);

    // the objects
    this.ivHero = new Hero(this.kMinionSprite);
    this.ivHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(0));   // hero light
    this.ivHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(3));   // center light
    // Uncomment the following to see how light affects Dye
    //      this.ivHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(1)); 
    //      this.ivHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(2)); 

    this.ivLMinion = new Minion(this.kMinionSprite, 17, 15);
    this.ivLMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(1));   // LMinion light
    this.ivLMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(3));   // center light

    this.ivRMinion = new Minion(this.kMinionSprite, 87, 15);
    this.ivRMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(2));   // RMinion light
    this.ivRMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(3));   // center light

    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([1, 1, 1, 1]);
    this.ivMsg.getXform().setPosition(1, 2);
    this.ivMsg.setTextHeight(3);

    this.ivBlock1 = new Renderable();
    this.ivBlock1.setColor([1, 0, 0, 1]);
    this.ivBlock1.getXform().setSize(5, 5);
    this.ivBlock1.getXform().setPosition(30, 50);

    this.ivBlock2 = new Renderable();
    this.ivBlock2.setColor([0, 1, 0, 1]);
    this.ivBlock2.getXform().setSize(5, 5);
    this.ivBlock2.getXform().setPosition(70, 50);
};


Demo.prototype.drawCamera = function (camera) {

    // Step A: set up the View Projection matrix
    camera.setupViewProjection();
    // Step B: Now draws each primitive
    this.ivBg.draw(camera);
    this.ivBlock1.draw(camera);
    this.ivLMinion.draw(camera);
    this.ivBlock2.draw(camera);
    this.ivHero.draw(camera);
    this.ivRMinion.draw(camera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // Step A: clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Draw with all three cameras
    this.drawCamera(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var msg = "Selected Light=" + this.ivLgtIndex + " ";

    this.ivCamera.update();  // to ensure proper interpolated movement effects

    this.ivLMinion.update(); // ensure sprite animation
    this.ivRMinion.update();

    this.ivHero.update();  // allow keyboard control to move

    // control the selected light
    msg += this._lightControl();

    this.ivMsg.setText(msg);
};
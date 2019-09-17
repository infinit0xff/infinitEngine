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

Demo.prototype.initialize = function() {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );

    // sets the background to gray
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    var bgR = new SpriteRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1900, 0, 1000);
    bgR.getXform().setSize(190, 100);
    bgR.getXform().setPosition(50, 35);
    this.ivBg = new GameObject(bgR);

    // create the hero object with texture from the lower-left corner 
    this.ivHero = new Hero(this.kMinionSprite);

    this.ivLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.ivRMinion = new Minion(this.kMinionSprite, 70, 30);

    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([1, 1, 1, 1]);
    this.ivMsg.getXform().setPosition(1, 2);
    this.ivMsg.setTextHeight(3);
};


Demo.prototype.drawCamera = function (camera) {
    camera.setupViewProjection();
    this.ivBg.draw(camera);
    this.ivHero.draw(camera);
    this.ivLMinion.draw(camera);
    this.ivRMinion.draw(camera);
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // draw with cameras
    this.drawCamera(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var deltaAmbient = 0.01;
    var msg = "Current Ambient]: ";

    this.ivCamera.update();  // to ensure proper interpolated movement effects
    this.ivLMinion.update(); // ensure sprite animation
    this.ivRMinion.update();
    this.ivHero.update();  // allow keyboard control to move
    this.ivCamera.panWith(this.ivHero.getXform(), 0.8);

    var v = infinitEngine.DefaultResources.getGlobalAmbientColor();
    if (infinitEngine.Input.isButtonPressed(infinitEngine.Input.mouseButton.Left)) {
        v[0] += deltaAmbient;
    }

    if (infinitEngine.Input.isButtonPressed(infinitEngine.Input.mouseButton.Middle)) {
        v[0] -= deltaAmbient;
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        infinitEngine.DefaultResources.setGlobalAmbientIntensity(infinitEngine.DefaultResources.getGlobalAmbientIntensity() - deltaAmbient);
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        infinitEngine.DefaultResources.setGlobalAmbientIntensity(infinitEngine.DefaultResources.getGlobalAmbientIntensity() + deltaAmbient);
    }

    msg += " Red=" + v[0].toPrecision(3) + " Intensity=" + infinitEngine.DefaultResources.getGlobalAmbientIntensity().toPrecision(3);
    this.ivMsg.setText(msg);
};
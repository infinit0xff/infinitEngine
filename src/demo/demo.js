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

    this.ivTheLight = null;

    // to verify swiitching between shaders is fine
    this.ivBlock1 = null;
    this.ivBlock2 = null;
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

    // the light
    this.ivTheLight = new Light();
    this.ivTheLight.setRadius(8);
    this.ivTheLight.setZPos(2);
    this.ivTheLight.setXPos(30);
    this.ivTheLight.setYPos(30);  // Position above LMinion
    this.ivTheLight.setColor([0.9, 0.9, 0.2, 1]);

    // the Background
    var bgR = new LightRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(100, 100);
    bgR.getXform().setPosition(50, 35);
    bgR.addLight(this.ivTheLight);
    this.ivBg = new GameObject(bgR);

    // 
    // the objects
    this.ivHero = new Hero(this.kMinionSprite);
    this.ivHero.getRenderable().addLight(this.ivTheLight);

    this.ivLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.ivLMinion.getRenderable().addLight(this.ivTheLight);

    this.ivRMinion = new Minion(this.kMinionSprite, 70, 30);

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
    // set up the View Projection matrix
    camera.setupViewProjection();

    // now draws each Renderable
    this.ivBg.draw(camera);
    this.ivBlock1.draw(camera);
    this.ivLMinion.draw(camera);
    this.ivRMinion.draw(camera);
    this.ivBlock2.draw(camera);
    this.ivHero.draw(camera);
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // Step A: clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // draw with all three cameras
    this.drawCamera(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);   // only draw status in the main camera
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    var msg, i, c;
    var deltaC = 0.01;
    var deltaZ = 0.05;

    this.ivCamera.update();  // to ensure proper interpolated movement effects
    this.ivLMinion.update(); // ensure sprite animation
    this.ivRMinion.update();
    this.ivHero.update();  // allow keyboard control to move

    if (infinitEngine.Input.isButtonPressed(infinitEngine.Input.mouseButton.Left)) {
        this.ivTheLight.set2DPosition(this.ivHero.getXform().getPosition());
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        c = this.ivTheLight.getColor();
        for (i = 0; i < 4; i++) {
            c[i] += deltaC;
        }
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        c = this.ivTheLight.getColor();
        for (i = 0; i < 4; i++) {
            c[i] -= deltaC;
        }
    }
    
    var p = this.ivTheLight.getPosition(), r;
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Z)) {
        p[2] += deltaZ;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.X)) {
        p[2] -= deltaZ;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.C)) {
        r = this.ivTheLight.getRadius();
        r += deltaC;
        this.ivTheLight.setRadius(r);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.V)) {
        r = this.ivTheLight.getRadius();
        r -= deltaC;
        this.ivTheLight.setRadius(r);
    }
    
    c = this.ivTheLight.getColor();
    msg = "LightColor:" + c[0].toPrecision(4) + " " + c[1].toPrecision(4) +
                    " " + c[2].toPrecision(4) + " " + c[3].toPrecision(4) +
          " Z=" + p[2].toPrecision(3) +
          " r=" + this.ivTheLight.getRadius().toPrecision(3);
    this.ivMsg.setText(msg);
};
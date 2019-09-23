"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
    this.kBg = "assets/bg.png";
    this.kBgNormal = "assets/bg_normal.png";
    this.kBgLayer = "assets/bgLayer.png";
    this.kBgLayerNormal = "assets/bgLayer_normal.png";

    // The camera to view the scene
    this.ivCamera = null;
    this.ivHeroCam = null;
    
    this.ivBg = null;
    this.ivBgL1 = null;

    this.ivMsg = null;
    this.ivMatMsg = null;

    // the hero and the support objects
    this.ivLgtHero = null;
    this.ivIllumHero = null;

    this.ivLgtMinion = null;
    this.ivIllumMinion = null;

    this.ivGlobalLightSet = null;

    this.ivBlock1 = null;   // to verify swiitching between shaders is fine
    this.ivBlock2 = null;

    this.ivLgtIndex = 0;
    this.ivLgtRotateTheta = 0;
    
    // shadow support
    this.ivBgShadow1 = null;
}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kBg);
    infinitEngine.Textures.loadTexture(this.kBgNormal);
    infinitEngine.Textures.loadTexture(this.kBgLayer);
    infinitEngine.Textures.loadTexture(this.kBgLayerNormal);
    infinitEngine.Textures.loadTexture(this.kMinionSpriteNormal);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kBg);
    infinitEngine.Textures.unloadTexture(this.kBgNormal);
    infinitEngine.Textures.unloadTexture(this.kBgLayer);
    infinitEngine.Textures.unloadTexture(this.kBgLayerNormal);
    infinitEngine.Textures.unloadTexture(this.kMinionSpriteNormal);
};

Demo.prototype.initialize = function () {
    // Step A: set up the cameras
    this.ivHeroCam = new Camera(
        vec2.fromValues(20, 30.5), // position of the camera
        14,                        // width of camera
        [0, 420, 300, 300],        // viewport (orgX, orgY, width, height)
        2
    );
    this.ivHeroCam.setBackgroundColor([0.5, 0.5, 0.9, 1]);
    
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 1280, 720]           // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    // Step B: the lights
    this._initializeLights();   // defined in Demo_Lights.js

    // Step C: the far Background
    var bgR = new IllumRenderable(this.kBg, this.kBgNormal);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(30, 30);
    bgR.getXform().setPosition(0, 0);
    bgR.getMaterial().setSpecular([0.2, 0.1, 0.1, 1]);
    bgR.getMaterial().setShininess(50);
    bgR.getXform().setZPos(-20);
    bgR.addLight(this.ivGlobalLightSet.getLightAt(1));   // only the directional light
    this.ivBg = new TiledGameObject(bgR);
    
    // Step D: the closer Background
    var i; 
    var bgR1 = new IllumRenderable(this.kBgLayer, this.kBgLayerNormal);
    bgR1.getXform().setSize(30, 30);
    bgR1.getXform().setPosition(0, 0);
    bgR1.getXform().setZPos(-10);
    for (i = 0; i < 4; i++) {
        bgR1.addLight(this.ivGlobalLightSet.getLightAt(i));   // all the lights
    }
    bgR1.getMaterial().setSpecular([0.2, 0.2, 0.5, 1]);
    bgR1.getMaterial().setShininess(10);
    this.ivBgL1 = new TiledGameObject(bgR1);
    this.ivBgL1.setSpeed(0.1);
    this.ivBgL1.setCurrentFrontDir([-1, 0]);
    
    // 
    // the objects
    this.ivIllumHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal, 20, 30);
    this.ivLgtHero = new Hero(this.kMinionSprite, null, 60, 50);
    this.ivIllumMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 25, 30);
    this.ivLgtMinion = new Minion(this.kMinionSprite, null, 65, 25);
    for (i = 0; i < 4; i++) {
        this.ivIllumHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
        this.ivLgtHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
        this.ivIllumMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
        this.ivLgtMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
    }

    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([1, 1, 1, 1]);
    this.ivMsg.getXform().setPosition(4, 12);
    this.ivMsg.setTextHeight(3);

    this.ivMatMsg = new FontRenderable("Status Message");
    this.ivMatMsg.setColor([1, 1, 1, 1]);
    this.ivMatMsg.getXform().setPosition(4, 64);
    this.ivMatMsg.setTextHeight(3);

    this.ivBlock1 = new Renderable();
    this.ivBlock1.setColor([1, 0, 0, 1]);
    this.ivBlock1.getXform().setSize(5, 5);
    this.ivBlock1.getXform().setPosition(30, 50);

    this.ivBlock2 = new Renderable();
    this.ivBlock2.setColor([0, 1, 0, 1]);
    this.ivBlock2.getXform().setSize(5, 5);
    this.ivBlock2.getXform().setPosition(70, 50);

    this.ivSelectedCh = this.ivIllumHero;
    this.ivMaterialCh = this.ivSelectedCh.getRenderable().getMaterial().getDiffuse();
    this.ivSelectedChMsg = "H:";
    
    this._setupShadow();  // defined in Demo_Shadow.js
};


Demo.prototype.drawCamera = function (camera) {
    // Step A: set up the View Projection matrix
    camera.setupViewProjection();
    // Step B: Now draws each primitive
    
    // always draw shadow first!
    this.ivBg.draw(camera);
    this.ivBgShadow1.draw(camera);

    this.ivBlock1.draw(camera);
    this.ivLgtMinion.draw(camera);
    this.ivIllumMinion.draw(camera);
    this.ivIllumHero.draw(camera);
    this.ivBlock2.draw(camera);  
    this.ivLgtHero.draw(camera);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // Step A: clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Draw with all cameras
    this.drawCamera(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);   // only draw status in the main camera
    this.ivMatMsg.draw(this.ivCamera);
    
    this.drawCamera(this.ivHeroCam);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    this.ivCamera.update();  // to ensure proper interpolated movement effects
    this.ivHeroCam.update();
    
    this.ivBgL1.update();

    this.ivIllumMinion.update(); // ensure sprite animation
    this.ivLgtMinion.update();

    this.ivIllumHero.update();  // allow keyboard control to move
    this.ivLgtHero.update();

    var xf = this.ivIllumHero.getXform();
    this.ivCamera.panWith(xf, 0.7);
    this.ivGlobalLightSet.getLightAt(2).set2DPosition(xf.getPosition());
    this.ivHeroCam.setWCCenter(xf.getXPos(), xf.getYPos());
        
    this.ivCamera.panWith(this.ivLgtHero.getXform(), 0.7);
    this.ivGlobalLightSet.getLightAt(3).set2DPosition(this.ivLgtHero.getXform().getPosition());
    
    // control the selected light
    var msg = "L=" + this.ivLgtIndex + " ";
    msg += this._lightControl();
    this.ivMsg.setText(msg);

    msg = this._selectCharacter();
    msg += this.materialControl();
    this.ivMatMsg.setText(msg);

};

Demo.prototype._selectCharacter = function () {
    // select which character to work with
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Five)) {
        this.ivSelectedCh = this.ivIllumMinion;
        this.ivMaterialCh = this.ivSelectedCh.getRenderable().getMaterial().getDiffuse();
        this.ivSelectedChMsg = "L:";
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Six)) {
        this.ivSelectedCh = this.ivIllumHero;
        this.ivMaterialCh = this.ivSelectedCh.getRenderable().getMaterial().getDiffuse();
        this.ivSelectedChMsg = "H:";
    }
    return this.ivSelectedChMsg;
};

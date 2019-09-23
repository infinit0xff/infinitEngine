"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
    this.kBg = "assets/bg.png";
    this.kBgNormal = "assets/bg_normal.png";
    this.kBgLayer = "assets/bgLayer.png";
    this.kBgLayerNormal = "assets/bgLayer_normal.png";

    // the camera to view the scene
    this.ivCamera = null;
    this.ivParallaxCam = null;
    this.ivShowHeroCam = false;
    
    this.ivBg = null;
    this.ivBgL1 = null;
    this.ivFront = null;

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
    // set up the cameras
    this.ivParallaxCam = new Camera(
        vec2.fromValues(25, 40), // position of the camera
        30,                       // width of camera
        [0, 420, 700, 300],           // viewport (orgX, orgY, width, height)
        2
    );
    this.ivParallaxCam.setBackgroundColor([0.5, 0.5, 0.9, 1]);
    
    this.ivCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 1280, 720]           // viewport (orgX, orgY, width, height)
    );
    // sets the background to gray
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    // the lights
    this._initializeLights();   // defined in Demo_Lights.js

    // the far Background
    var bgR = new IllumRenderable(this.kBg, this.kBgNormal);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(30, 30);
    bgR.getXform().setPosition(0, 0);
    bgR.getMaterial().setSpecular([0.2, 0.1, 0.1, 1]);
    bgR.getMaterial().setShininess(50);
    bgR.getXform().setZPos(-10);
    bgR.addLight(this.ivGlobalLightSet.getLightAt(1));   // only the directional light
    this.ivBg = new ParallaxGameObject(bgR, 5, this.ivCamera);
    this.ivBg.setCurrentFrontDir([0, -1, 0]);
    this.ivBg.setSpeed(0.1);
    
    // the closer Background
    var i; 
    var bgR1 = new IllumRenderable(this.kBgLayer, this.kBgLayerNormal);
    bgR1.getXform().setSize(25, 25);
    bgR1.getXform().setPosition(0, 0);
    bgR1.getXform().setZPos(0); 
    bgR1.addLight(this.ivGlobalLightSet.getLightAt(1));   // the directional light
    bgR1.addLight(this.ivGlobalLightSet.getLightAt(2));   // the hero spotlight light
    bgR1.addLight(this.ivGlobalLightSet.getLightAt(3));   // the hero spotlight light
    bgR1.getMaterial().setSpecular([0.2, 0.2, 0.5, 1]);
    bgR1.getMaterial().setShininess(10);
    this.ivBgL1 = new ParallaxGameObject(bgR1, 3, this.ivCamera);
    this.ivBgL1.setCurrentFrontDir([0, -1, 0]);
    this.ivBgL1.setSpeed(0.1);
    
    // the front layer 
    var f = new TextureRenderable(this.kBgLayer);
    f.getXform().setSize(30, 30);
    f.getXform().setPosition(0, 0);
    this.ivFront = new ParallaxGameObject(f, 0.9, this.ivCamera);
    
    // 
    // the objects
    this.ivIllumHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal, 40, 30);
    this.ivLgtHero = new Hero(this.kMinionSprite, null, 60, 40);
    this.ivIllumMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 25, 40);
    this.ivLgtMinion = new Minion(this.kMinionSprite, null, 65, 25);
    for (i = 0; i < 4; i++) {
        this.ivIllumHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
        this.ivLgtHero.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
        this.ivIllumMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
        this.ivLgtMinion.getRenderable().addLight(this.ivGlobalLightSet.getLightAt(i));
    }

    this.ivMsg = new FontRenderable("Status Message");
    this.ivMsg.setColor([1, 1, 1, 1]);
    this.ivMsg.getXform().setPosition(6, 15);
    this.ivMsg.setTextHeight(3);

    this.ivMatMsg = new FontRenderable("Status Message");
    this.ivMatMsg.setColor([1, 1, 1, 1]);
    this.ivMatMsg.getXform().setPosition(6, 65);
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
    // set up the View Projection matrix
    camera.setupViewProjection();
    // now draws each primitive
    
    // always draw shadow first!
    this.ivBg.draw(camera);
    this.ivBgShadow1.draw(camera);

    this.ivBlock1.draw(camera);
    this.ivLgtMinion.draw(camera);
    this.ivIllumMinion.draw(camera);
    this.ivIllumHero.draw(camera);
    this.ivBlock2.draw(camera);  
    this.ivLgtHero.draw(camera);
    
    this.ivFront.draw(camera);
    
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // draw with all cameras
    this.drawCamera(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);   // only draw status in the main camera
    this.ivMatMsg.draw(this.ivCamera);
    
    if (this.ivShowHeroCam)
        this.drawCamera(this.ivParallaxCam);
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    this.ivCamera.update();  // to ensure proper interpolated movement effects
    this.ivParallaxCam.update();
    
    this.ivBgL1.update();
    this.ivBg.update();
    this.ivFront.update();

    this.ivIllumMinion.update(); // ensure sprite animation
    this.ivLgtMinion.update();

    this.ivIllumHero.update();  // allow keyboard control to move
    this.ivLgtHero.update();

    var xf = this.ivLgtHero.getXform();
    this.ivCamera.panWith(xf, 0.2);
    this.ivGlobalLightSet.getLightAt(3).set2DPosition(xf.getPosition());
    
    xf = this.ivIllumHero.getXform();
    this.ivGlobalLightSet.getLightAt(2).set2DPosition(xf.getPosition());
        
     if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.P)) {
         this.ivShowHeroCam = !this.ivShowHeroCam;
     }
    
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

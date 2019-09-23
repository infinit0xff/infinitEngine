"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kDyePackTexture = "assets/dye_pack.png";
    this.kParticleTexture = "assets/particle.png";
    this.kPrompt = "RigidBody Physics!";

    // the camera to view the scene
    this.ivCamera = null;

    this.ivMsg = null;

    // the hero and the support objects
    this.ivHero = null;
    
    this.ivCollidedObj = null;
    this.ivAllPlatforms = new GameObjectSet();
    this.ivAllMinions = new GameObjectSet();
    this.ivAllDyePacks = new GameObjectSet();
    this.ivAllParticles = new ParticleGameObjectSet();
}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kPlatformTexture);
    infinitEngine.Textures.loadTexture(this.kWallTexture);
    infinitEngine.Textures.loadTexture(this.kDyePackTexture);
    infinitEngine.Textures.loadTexture(this.kParticleTexture);
};

Demo.prototype.unloadScene = function () {    
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kPlatformTexture);
    infinitEngine.Textures.unloadTexture(this.kWallTexture);
    infinitEngine.Textures.unloadTexture(this.kDyePackTexture);
    infinitEngine.Textures.unloadTexture(this.kParticleTexture);
};

Demo.prototype.initialize = function () {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(100, 56.25), // position of the camera
        200,                         // width of camera
        [0, 0, 1280, 720]            // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.7, 0.7, 0.7, 1]);
            // sets the background to gray
    
    infinitEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    // create a few objects ...
    var i, j, rx, ry, obj, dy, dx;
    dx = 80;
    ry = Math.random() * 5 + 20;
    for (i = 0; i<4; i++) {
        rx = 20 + Math.random() * 160;
        obj = new Minion(this.kMinionSprite, rx, ry);
        this.ivAllMinions.addToSet(obj);
        
        for (j=0; j<2; j++) {
            rx = 20 + (j*dx) + Math.random() * dx;
            dy = 10 * Math.random() - 5;
            obj = new Platform(this.kPlatformTexture, rx, ry+dy);
            this.ivAllPlatforms.addToSet(obj);
        }
        
        ry = ry + 20 + Math.random() * 10;
    }
    
    // the floor and ceiling
    rx = -15;
    for (i = 0; i<9; i++) {
        obj = new Platform(this.kPlatformTexture, rx, 2);
        this.ivAllPlatforms.addToSet(obj);
        
        obj = new Platform(this.kPlatformTexture, rx, 112);
        this.ivAllPlatforms.addToSet(obj);
        rx += 30;
    }
    
    // the left and right walls
    ry = 12;
    for (i = 0; i<8; i++) {
        obj = new Wall(this.kWallTexture, 5, ry);
        this.ivAllPlatforms.addToSet(obj);
        
        obj = new Wall(this.kWallTexture, 195, ry);
        this.ivAllPlatforms.addToSet(obj);
        ry += 16;
    }
    
    // 
    // the important objects
    this.ivHero = new Hero(this.kMinionSprite, 20, 30);   
    
    this.ivMsg = new FontRenderable(this.kPrompt);
    this.ivMsg.setColor([0, 0, 0, 1]);
    this.ivMsg.getXform().setPosition(10, 110);
    this.ivMsg.setTextHeight(3);
};

// this is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.ivCamera.setupViewProjection();
    
    this.ivAllPlatforms.draw(this.ivCamera);
    this.ivAllMinions.draw(this.ivCamera);
    this.ivAllDyePacks.draw(this.ivCamera);
    this.ivHero.draw(this.ivCamera);
    this.ivAllParticles.draw(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);
};

// the update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    
    var func = function(x, y) { this.createParticle.call(this, x, y); };
    
    this.ivCamera.update();  // to ensure proper interpolated movement effects
    
    this.ivAllPlatforms.update();
    this.ivAllMinions.update();
    this.ivHero.update(this.ivAllDyePacks, this.ivAllParticles, this.createParticle);
    this.ivAllDyePacks.update();
    this.ivAllParticles.update();
    
    // create dye pack and remove the expired ones ...
    if (infinitEngine.Input.isButtonClicked(infinitEngine.Input.mouseButton.Left)) {
        if (this.ivCamera.isMouseInViewport()) {
            var d = new DyePack(this.kDyePackTexture, this.ivCamera.mouseWCX(), this.ivCamera.mouseWCY());
            this.ivAllDyePacks.addToSet(d);
        }
    }
    
    // create particles
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Z)) {
        if (this.ivCamera.isMouseInViewport()) {
            var p = this.createParticle(this.ivCamera.mouseWCX(), this.ivCamera.mouseWCY());
            this.ivAllParticles.addToSet(p);
        }
    }
    
    // cleanup DyePacks
    var i, obj;
    for (i=0; i<this.ivAllDyePacks.size(); i++) {
        obj = this.ivAllDyePacks.getObjectAt(i);
        if (obj.hasExpired()) {
            this.ivAllDyePacks.removeFromSet(obj);
        }
    }
    
    // physics simulation
    this._physicsSimulation();
    
    this.ivMsg.setText(this.kPrompt + ": DyePack=" + this.ivAllDyePacks.size() +
            " Particles=" + this.ivAllParticles.size());
};

Demo.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    
    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getPhysicsComponent().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
};
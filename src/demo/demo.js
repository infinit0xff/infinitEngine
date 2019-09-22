"use strict";

function Demo() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    
    this.kCollideColor = [1, 0, 0, 1];
    this.kNormalColor = [0, 1, 0, 1];

    // The camera to view the scene
    this.ivCamera = null;

    this.ivMsg = null;

    // the hero and the support objects
    this.ivHero = null;
    this.ivMinion = null;
    this.ivPlatform = null;
    
    this.ivSelectedObj = null;
    this.ivCollidedObj = null;
    this.ivAllObjects = new GameObjectSet();
    
    this.kPrompt = "[H:hero M:minion P:platform]: ";
    this.ivEcho = "Hero";
}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    infinitEngine.Textures.loadTexture(this.kMinionSprite);
    infinitEngine.Textures.loadTexture(this.kPlatformTexture);
};

Demo.prototype.unloadScene = function () {    
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    infinitEngine.Textures.unloadTexture(this.kPlatformTexture);
};

Demo.prototype.initialize = function () {
    // Step A: set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(100, 56.25), // position of the camera
        200,                         // width of camera
        [0, 0, 1280, 720]            // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    infinitEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    // create a few objects ...
    var i, rx, ry, obj; 
    ry = Math.random() * 5 + 20;
    for (i = 0; i<4; i++) {
        rx = 20 + Math.random() * 80;
        obj = new Hero(this.kMinionSprite, rx, ry);
        this.ivAllObjects.addToSet(obj);
        
        rx = rx + 20 + Math.random() * 80;
        obj = new Minion(this.kMinionSprite, rx, ry);
        this.ivAllObjects.addToSet(obj);
        
        rx = 20 + Math.random() * 160;
        obj = new Platform(this.kPlatformTexture, rx, ry);
        this.ivAllObjects.addToSet(obj);
        
        ry = ry + 20 + Math.random() * 10;
    }
    
    // 
    // the important objects
    this.ivHero = new Hero(this.kMinionSprite, 20, 30);
    this.ivAllObjects.addToSet(this.ivHero);
    
    this.ivMinion = new Minion(this.kMinionSprite, 50, 50);
    this.ivAllObjects.addToSet(this.ivMinion);
    
    this.ivPlatform = new Platform(this.kPlatformTexture, 20, 30);
    this.ivAllObjects.addToSet(this.ivPlatform);
    
    
    this.ivSelectedObj = this.ivHero;
    this.ivSelectedObj.setVisibility(false);
    
    this.ivMsg = new FontRenderable(this.kPrompt);
    this.ivMsg.setColor([0, 0, 0, 1]);
    this.ivMsg.getXform().setPosition(1, 2);
    this.ivMsg.setTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.ivCamera.setupViewProjection();
    
    this.ivAllObjects.draw(this.ivCamera);
    this.ivMsg.draw(this.ivCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    
    this.ivCamera.update();  // to ensure proper interpolated movement effects
    this.ivAllObjects.update();  // updates everything
 
    if (this.ivCamera.isMouseInViewport()) {
        if (infinitEngine.Input.isButtonPressed(infinitEngine.Input.mouseButton.Left)) {
            var x = this.ivCamera.mouseWCX();
            var y = this.ivCamera.mouseWCY();
            this.ivSelectedObj.getXform().setPosition(x, y);
        }
    }
    
    this._selectCharacter();
    this._detectCollision();
    
    this.ivMsg.setText(this.kPrompt + this.ivEcho);
};

Demo.prototype._selectCharacter = function () {
    // select which character to work with
    this.ivSelectedObj.setVisibility(true);
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.H)) {
        this.ivSelectedObj = this.ivHero;
        this.ivEcho = "Hero";
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.M)) {
        this.ivSelectedObj = this.ivMinion;
        this.ivEcho = "Minion";
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.P)) {
        this.ivSelectedObj = this.ivPlatform;
        this.ivEcho = "Platform";
    }
    this.ivSelectedObj.setVisibility(false);
};

Demo.prototype._detectCollision = function () {
    
    var i, obj;
    this.ivCollidedObj = null;
    var selectedRigidShape = this.ivSelectedObj.getPhysicsComponent();
    for (i = 0; i<this.ivAllObjects.size(); i++) {
        obj = this.ivAllObjects.getObjectAt(i);
        if (obj !== this.ivSelectedObj) {
            if (selectedRigidShape.collided(obj.getPhysicsComponent())) {
                this.ivCollidedObj = obj;
                this.ivCollidedObj.getPhysicsComponent().setColor(this.kCollideColor);
            } else {
                obj.getPhysicsComponent().setColor(this.kNormalColor);
            }
        }
    }
};
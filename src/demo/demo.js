"use strict";

function Demo() {

    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";  // Portal and Collector are embedded here
 
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/bgclip.mp3";
    this.kCue = "assets/sounds/demo_cue.wav";
     
    // camera to view the scene
    this.ivCamera = null;

    // hero and support objects
    this.ivHero = null;
    // this.ivSupport = null;
    this.ivPortal = null;
    this.ivCollector = null;
    this.ivFontImage = null;
    this.mRightMinion = null;
    this.mLeftMinion = null;
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function() {
    infinitEngine.Textures.loadTexture(this.kFontImage);
    infinitEngine.Textures.loadTexture(this.kMinionSprite);

    infinitEngine.AudioClips.loadAudio(this.kBgClip);
    infinitEngine.AudioClips.loadAudio(this.kCue);
};

Demo.prototype.unloadScene = function() {

    // game loop not running, unload all assets
    infinitEngine.Textures.unloadTexture(this.kFontImage);
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);
    // stop the background audio
    infinitEngine.AudioClips.stopBackgroundAudio();

     // unload the scene resources
    infinitEngine.AudioClips.unloadAudio(this.kCue);
     //      You know this clip will be used elsewhere in the game
     //      So you decide to not unload this clip!!
};

Demo.prototype.initialize = function() {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(20, 60),   // position of the camera
        20,                        // width of camera
        [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    // Step B: Create the support objects
    this.ivPortal = new SpriteRenderable(this.kMinionSprite);
    this.ivPortal.setColor([1, 0, 0, 0.2]);  // tints red
    this.ivPortal.getXform().setPosition(25, 60);
    this.ivPortal.getXform().setSize(3, 3);
    this.ivPortal.setElementPixelPositions(130, 310, 0, 180);

    this.ivCollector = new SpriteRenderable(this.kMinionSprite);
    this.ivCollector.setColor([0, 0, 0, 0]);  // No tinting
    this.ivCollector.getXform().setPosition(15, 60);
    this.ivCollector.getXform().setSize(3, 3);
    this.ivCollector.setElementPixelPositions(315, 495, 0, 180);

    // Step C: Create the font and minion images using sprite
    this.ivFontImage = new SpriteRenderable(this.kFontImage);
    this.ivFontImage.setColor([1, 1, 1, 0]);
    this.ivFontImage.getXform().setPosition(13, 62);
    this.ivFontImage.getXform().setSize(4, 4);

    // the right minion
    this.ivRightMinion= new SpriteAnimateRenderable(this.kMinionSprite);
    this.ivRightMinion.setColor([1, 1, 1, 0]);
    this.ivRightMinion.getXform().setPosition(26, 56.5);
    this.ivRightMinion.getXform().setSize(4, 3.2);
    this.ivRightMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,       // widthxheight in pixels
                                    5,              // number of elements in this sequence
                                    0);             // horizontal padding in between
    this.ivRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.ivRightMinion.setAnimationSpeed(50);
                                // show each element for mAnimSpeed updates

    // the left minion
    this.ivLeftMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.ivLeftMinion.setColor([1, 1, 1, 0]);
    this.ivLeftMinion.getXform().setPosition(15, 56.5);
    this.ivLeftMinion.getXform().setSize(4, 3.2);
    this.ivLeftMinion.setSpriteSequence(348, 0,      // first element pixel position: top-right 164 from 512 is top of image, 0 is right of image
                                    204, 164,       // widthxheight in pixels
                                    5,              // number of elements in this sequence
                                    0);             // horizontal padding in between
    this.ivLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.ivLeftMinion.setAnimationSpeed(50);
                                // show each element for mAnimSpeed updates

    // Step D: Create the hero object with texture from the lower-left corner 
    this.ivHero = new SpriteRenderable(this.kMinionSprite);
    this.ivHero.setColor([1, 1, 1, 0]);
    this.ivHero.getXform().setPosition(20, 60);
    this.ivHero.getXform().setSize(2, 3);
    this.ivHero.setElementPixelPositions(0, 120, 0, 180);

     // now start the bg music ...
     infinitEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

Demo.prototype.draw = function() {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);

    // starts the drawing by activating the camera
    this.ivCamera.setupViewProjection();
  
    // draw all squares
    //  this.ivSupport.draw(this.ivCamera.getVPMatrix());
    this.ivPortal.draw(this.ivCamera.getVPMatrix());
    this.ivHero.draw(this.ivCamera.getVPMatrix());
    this.ivCollector.draw(this.ivCamera.getVPMatrix());
    this.ivFontImage.draw(this.ivCamera.getVPMatrix());
    this.ivRightMinion.draw(this.ivCamera.getVPMatrix());
    this.ivLeftMinion.draw(this.ivCamera.getVPMatrix());
};

Demo.prototype.update = function() {
    // simple game for now only moves the blue pulses the red
    
    // move the blue square
    var deltaX = 0.05;
    var xform = this.ivHero.getXform();

    // support hero movements
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        infinitEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(deltaX);
        if (xform.getXPos() > 30) { // this is the right-bound of the window
            xform.setPosition(12, 60);
        }
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        infinitEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(-deltaX);
        if (xform.getXPos() < 11) {  // this is the left-bound of the window
        // infinitEngine.GameLoop.stop();
            xform.setXPos(20);
        }
    }

    // continously change texture tinting
    var c = this.ivPortal.getColor();
    var ca = c[3] + deltaX;
    if (ca > 1) {
        ca = 0;
    }
    c[3] = ca;

    // New update code for changing the sub-texture regions being shown"
    var deltaT = 0.001;

    // <editor-fold desc="The font image:">
    // zoom into the texture by updating texture coordinate
    // For font: zoom to the upper left corner by changing bottom right
    var texCoord = this.ivFontImage.getElementUVCoordinateArray();
            // The 8 elements:
            //      mTexRight,  mTexTop,          // x,y of top-right
            //      mTexLeft,   mTexTop,
            //      mTexRight,  mTexBottom,
            //      mTexLeft,   mTexBottom
    var b = texCoord[SpriteRenderable.eTexCoordArray.eBottom] + deltaT;
    var r = texCoord[SpriteRenderable.eTexCoordArray.eRight] - deltaT;
    if (b > 1.0) {
        b = 0;
    }
    if (r < 0) {
        r = 1.0;
    }
    this.ivFontImage.setElementUVCoordinate(
        texCoord[SpriteRenderable.eTexCoordArray.eLeft],
        r,
        b,
        texCoord[SpriteRenderable.eTexCoordArray.eTop]
    );
   
    // control sprite animation
    // remember to update the minion's animation
    this.ivRightMinion.updateAnimation();
    this.ivLeftMinion.updateAnimation();

    // animate left on the sprite sheet
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.One)) {
        this.ivRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
        this.ivLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    }

    // swing animation 
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Two)) {
        this.ivRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.ivLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    }

    // animate right on the sprite sheet
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Three)) {
        this.ivRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
        this.ivLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    }

    // decrease the duration of showing each sprite element, thereby speeding up the animation
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Four)) {
        this.ivRightMinion.incAnimationSpeed(-2);
        this.ivLeftMinion.incAnimationSpeed(-2);
    }

    // increase the duration of showing each sprite element, thereby slowing down the animation
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Five)) {
        this.ivRightMinion.incAnimationSpeed(2);
        this.ivLeftMinion.incAnimationSpeed(2);
    }
};

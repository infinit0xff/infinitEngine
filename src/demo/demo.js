"use strict";

function Demo() {
    // // textures: 
    // this.kPortal = "assets/minion_portal.png";      // supports png with transparency
    // this.kCollector = "assets/minion_collector.png";

    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";  // Portal and Collector are embedded here
 
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/bgclip.mp3";
    this.kCue = "assets/sounds/demo_cue.wav";
    
    // scene file name
    // this.kSceneFile = "assets/scene.xml"
     
    // camera to view the scene
    this.ivCamera = null;

    // hero and support objects
    this.ivHero = null;
    // this.ivSupport = null;
    this.ivPortal = null;
    this.ivCollector = null;
    this.ivFontImage = null;
    this.ivMinion = null;
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function() {
    // loads the textures
    // infinitEngine.Textures.loadTexture(this.kPortal);
    // infinitEngine.Textures.loadTexture(this.kCollector);
    infinitEngine.Textures.loadTexture(this.kFontImage);
    infinitEngine.Textures.loadTexture(this.kMinionSprite);

    infinitEngine.AudioClips.loadAudio(this.kBgClip);
    infinitEngine.AudioClips.loadAudio(this.kCue);
};

Demo.prototype.unloadScene = function() {

      // Game loop not running, unload all assets

    //   infinitEngine.Textures.unloadTexture(this.kPortal);
    //   infinitEngine.Textures.unloadTexture(this.kCollector);
      infinitEngine.Textures.unloadTexture(this.kFontImage);
      infinitEngine.Textures.unloadTexture(this.kMinionSprite);
     // stop the background audio
    infinitEngine.AudioClips.stopBackgroundAudio();

     // unload the scene resources
     infinitEngine.AudioClips.unloadAudio(this.kCue);
     //      You know this clip will be used elsewhere in the game
     //      So you decide to not unload this clip!!
 
    var nextLevel = new BlueLevel();
    infinitEngine.Core.startScene(nextLevel);
};

// Demo.prototype.draw = function () {

//     // game loop not running, unload all assets
//     // then stop the background audio
//     infinitEngine.AudioClips.stopBackgroundAudio();

//     // unload the scene resources
//     infinitEngine.AudioClips.unloadAudio(this.kCue);
//     //      The above line is commented out on purpose because
//     //      you know this clip will be used elsewhere in the game
//     //      So you decide to not unload this clip!!

//     // starts the next level
//     var nextLevel = new BlueLevel();  // next level to be loaded
//     infinitEngine.Core.startScene(nextLevel);
// };

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

    this.ivMinion = new SpriteRenderable(this.kMinionSprite);
    this.ivMinion.setColor([1, 1, 1, 0]);
    this.ivMinion.getXform().setPosition(26, 56);
    this.ivMinion.getXform().setSize(5, 2.5);

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
    this.ivMinion.draw(this.ivCamera.getVPMatrix());

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
        infinitEngine.GameLoop.stop();
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
   
    // for minion: zoom to the bottom right corner by changing top left
    texCoord = this.ivMinion.getElementUVCoordinateArray();
            // The 8 elements:
            //      mTexRight,  mTexTop,          // x,y of top-right
            //      mTexLeft,   mTexTop,
            //      mTexRight,  mTexBottom,
            //      mTexLeft,   mTexBottom
    var t = texCoord[SpriteRenderable.eTexCoordArray.eTop] - deltaT;
    var l = texCoord[SpriteRenderable.eTexCoordArray.eLeft] + deltaT;

    if (l > 0.5) {
        l = 0;
    }
    if (t < 0.5) {
        t = 1.0;
    }

    this.ivMinion.setElementUVCoordinate(
        l,
        texCoord[SpriteRenderable.eTexCoordArray.eRight],
        texCoord[SpriteRenderable.eTexCoordArray.eBottom],
        t
    );
};

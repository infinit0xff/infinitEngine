"use strict";

function Demo() {
    // textures: 
    this.kPortal = "assets/minion_portal.png";      // supports png with transparency
    this.kCollector = "assets/minion_collector.png";

    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/bgclip.mp3";
    this.kCue = "assets/sounds/demo_cue.wav";
    
    // scene file name
    this.kSceneFile = "assets/scene.xml"
     
    // camera to view the scene
    this.ivCamera = null;

    // hero and support objects
    this.ivHero = null;
    // this.ivSupport = null;
    this.ivPortal = null;
    this.ivCollector = null;
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function() {
    // loads the textures
    infinitEngine.Textures.loadTexture(this.kPortal);
    infinitEngine.Textures.loadTexture(this.kCollector);

    infinitEngine.AudioClips.loadAudio(this.kBgClip);
    infinitEngine.AudioClips.loadAudio(this.kCue);
};

Demo.prototype.unloadScene = function() {

      // Game loop not running, unload all assets

      infinitEngine.Textures.unloadTexture(this.kPortal);
      infinitEngine.Textures.unloadTexture(this.kCollector);

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

    // create the support object in red
    // this.ivSupport = new Renderable(infinitEngine.DefaultResources.getConstColorShader());
    // this.ivSupport.setColor([0.8, 0.2, 0.2, 1]);
    // this.ivSupport.getXform().setPosition(20, 60);
    // this.ivSupport.getXform().setSize(5, 5);

     // Step B: Create the game objects
     this.ivPortal = new TextureRenderable(this.kPortal);
     this.ivPortal.setColor([1, 0, 0, 0.2]);  // tints red
     this.ivPortal.getXform().setPosition(25, 60);
     this.ivPortal.getXform().setSize(3, 3);
 
     this.ivCollector = new TextureRenderable(this.kCollector);
     this.ivCollector.setColor([0, 0, 0, 0]);  // No tinting
     this.ivCollector.getXform().setPosition(15, 60);
     this.ivCollector.getXform().setSize(3, 3);
 
    // create the hero object in blue
    this.ivHero = new Renderable();
    this.ivHero.setColor([0, 0, 1, 1]);
    this.ivHero.getXform().setPosition(20, 60);
    this.ivHero.getXform().setSize(2, 3);

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

};

"use strict";

function Demo() {

     // scene file name
     this.kSceneFile = "assets/scene.xml"
     
    // all squares
    // renderable objects
    this.ivSqSet = [];

    // camera to view the scene
    this.ivCamera = null;

    // hero and support objects
    this.ivHero = null;
    this.ivSupport = null;
}

infinitEngine.Core.inheritPrototype(Demo, Scene);

// Demo.prototype.loadScene = function() {
//     infinitEngine.TextFileLoader.loadTextFile(this.kSceneFile,
//         infinitEngine.TextFileLoader.eTextFileType.eXMLFile);
// };

Demo.prototype.unloadScene = function() {
    var nextLevel = new BlueLevel();
    infinitEngine.Core.startScene(nextLevel);
};

Demo.prototype.initialize = function() {
    // Step A: set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(20, 60),   // position of the camera
        20,                        // width of camera
        [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
    );
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    // Step B: Create the support object in red
    this.ivSupport = new Renderable(infinitEngine.DefaultResources.getConstColorShader());
    this.ivSupport.setColor([0.8, 0.2, 0.2, 1]);
    this.ivSupport.getXform().setPosition(20, 60);
    this.ivSupport.getXform().setSize(5, 5);

    // Setp C: Create the hero object in blue
    this.ivHero = new Renderable(infinitEngine.DefaultResources.getConstColorShader());
    this.ivHero.setColor([0, 0, 1, 1]);
    this.ivHero.getXform().setPosition(20, 60);
    this.ivHero.getXform().setSize(2, 3);
};

Demo.prototype.draw = function() {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.1, 0.8, 0.2, 1]);

    // starts the drawing by activating the camera
    this.ivCamera.setupViewProjection();
  
    // draw all squares
     this.ivSupport.draw(this.ivCamera.getVPMatrix());
     this.ivHero.draw(this.ivCamera.getVPMatrix());
};

Demo.prototype.update = function() {
    // simple game for now only moves the blue pulses the red
    
    // move the blue square
    var deltaX = 0.05;
    var xform = this.ivHero.getXform();

   // support hero movements
   if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
    xform.incXPosBy(deltaX);
    if (xform.getXPos() > 30) { // this is the right-bound of the window
        xform.setPosition(12, 60);
    }
}

if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
    xform.incXPosBy(-deltaX);
    if (xform.getXPos() < 11) {  // this is the left-bound of the window
        infinitEngine.GameLoop.stop();
    }
}
};
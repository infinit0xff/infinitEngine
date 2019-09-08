"use strict";

function Demo() {
    
    // scene file name
    this.kSceneFile = "assets/scene.xml"
    
    // all squares
    // renderable objects
    this.ivSqSet = [];

    // camera to view the scene
    this.ivCamera = null;
}


Demo.prototype.loadScene = function() {
    infinitEngine.TextFileLoader.loadTextFile(this.kSceneFile,
        infinitEngine.TextFileLoader.eTextFileType.eXMLFile);
};

Demo.prototype.unloadScene = function() {
    infinitEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
};

Demo.prototype.initialize = function() {
    var sceneParser = new SceneFileParser(this.kSceneFile);

    // Step A: Parse the camera
    this.ivCamera = sceneParser.parseCamera();

    // Step B: Parse for all the squares
    sceneParser.parseSquares(this.ivSqSet);
};

Demo.prototype.draw = function() {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.1, 0.8, 0.2, 1]);

    // starts the drawing by activating the camera
    this.ivCamera.setupViewProjection();
  
    // draw all squares
    var i;
    for (i = 0; i < this.ivSqSet.length; i++) {
        this.ivSqSet[i].draw(this.ivCamera.getVPMatrix());
    }
};

Demo.prototype.update = function() {
    // simple game for now only moves the blue pulses the red
    
    // move the blue square
    var xform = this.ivSqSet[0].getXform();
    var deltaX = 0.05;
    
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        if (xform.getXPos() > 30) {
            xform.setPosition(10, 60);
        }

        xform.incXPosBy(deltaX);
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Up)) {
        xform.incRotationByDegree(1);
    }

    
    xform = this.ivSqSet[1].getXform();
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Down)) {
        if(xform.getWidth() > 5) {
            xform.setSize(2, 2);
        }
        xform.incSizeBy(0.05);
    }
};
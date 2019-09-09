"use strict";

function BlueLevel() {

    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/bgclip.mp3";
    this.kCue = "assets/sounds/bluelevel_cue.wav";
  
    // scene file name
    this.kSceneFile = "assets/bluelevel.xml";
    // all squares
    this.ivSqSet = [];  // these are the renderable objects
    // The camera to view the scene
    this.ivCamera = null;
}
infinitEngine.Core.inheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.loadScene = function() {
    infinitEngine.TextFileLoader.loadTextFile(this.kSceneFile,
        infinitEngine.TextFileLoader.eTextFileType.eXMLFile);
    // loads the audios
    infinitEngine.AudioClips.loadAudio(this.kBgClip);
    infinitEngine.AudioClips.loadAudio(this.kCue);
    };

BlueLevel.prototype.unloadScene = function() {
    // stop the background audio
    infinitEngine.AudioClips.stopBackgroundAudio();

    // unload the scene flie and loaded resources
    infinitEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    infinitEngine.AudioClips.unloadAudio(this.kBgClip);
    infinitEngine.AudioClips.unloadAudio(this.kCue);

    // load next level
    var nextLevel = new Demo();
    infinitEngine.Core.startScene(nextLevel);
};

BlueLevel.prototype.initialize = function() {
    var sceneParser = new SceneFileParser(this.kSceneFile);

    // read in the camera
    this.ivCamera = sceneParser.parseCamera();

    // read all squares
    sceneParser.parseSquares(this.ivSqSet);

    // now start the bg music ...
    infinitEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

BlueLevel.prototype.draw = function() {
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    // activate drawing camera
    this.ivCamera.setupViewProjection();

    // draw all squares
    var i;
    for (i = 0; i < this.ivSqSet.length; i++) {
        this.ivSqSet[i].draw(this.ivCamera.getVPMatrix());
    }
};

BlueLevel.prototype.update = function() {
    //for this very simple game, lets move the square
    var xform = this.ivSqSet[1].getXform();
    var deltaX = 0.05;

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        infinitEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(deltaX);
        if (xform.getXPos() > 30) { // this is the right-bound of the window
            xform.setPosition(12, 60);
        }
    }

    // test for white square movement
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        infinitEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(-deltaX);
        if (xform.getXPos() < 11) { // this is the left-boundary
            infinitEngine.GameLoop.stop();
        }
    }

};

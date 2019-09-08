"use strict";

function Demo() {
    
    // square variables
    this.ivBlueSq = null;
    this.ivRedSq = null;

    // camera to view the scene
    this.ivCamera = null;
}

Demo.prototype.initialize = function() {
    // setup the camera
    this.ivCamera = new Camera(
        vec2.fromValues(20, 60),    // center
        20,                         // width
        [20, 40, 600, 300]          // viewport ( orgX, orgY, width, height)
    );

    // set background to dark gray
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    // create renderable objects
    var constColorShader = infinitEngine.DefaultResources.getConstColorShader();
    this.ivRedSq = new Renderable(constColorShader);
    this.ivRedSq.setColor([0.8, 0.2, 0.2, 1]);
    this.ivBlueSq = new Renderable(constColorShader);
    this.ivBlueSq.setColor([0.2, 0.4, 0.8, 1]);
    
     // draw the blue square
    // centre blue, slightly rotated square
    this.ivBlueSq.getXform().setPosition(20, 60);
    this.ivBlueSq.getXform().setRotationInRad(0.2); // In Radians
    this.ivBlueSq.getXform().setSize(5, 5);

    // draw the center and the corner squares
    // centre red square
    this.ivRedSq.getXform().setPosition(20, 60);
    this.ivRedSq.getXform().setSize(2, 2);

    // start the game loop
    infinitEngine.GameLoop.start(this);
};

Demo.prototype.draw = function() {
    // clear the canvas
    infinitEngine.Core.clearCanvas([0.1, 0.8, 0.2, 1]);

    // starts the drawing by activating the camera
    this.ivCamera.setupViewProjection();
  
    // activate the blue shader to draw
    this.ivBlueSq.draw(this.ivCamera.getVPMatrix());

    // activate the red shader to draw
    this.ivRedSq.draw(this.ivCamera.getVPMatrix());
};

Demo.prototype.update = function() {
    // simple game for now only moves the blue pulses the red
    
    // move the blue square
    var blueXform = this.ivBlueSq.getXform();
    var redXform = this.ivRedSq.getXform();
    var deltaX = 0.05;
    
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        if (blueXform.getXPos() > 30)
            blueXform.setPosition(10, 60);
        blueXform.incXPosBy(deltaX);
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Up)) {
        blueXform.incRotationByDegree(1);
    }


    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Down)) {
        if(redXform.getWidth() > 5)
            redXform.setSize(2, 2);
        redXform.incSizeBy(0.05);
    }
};
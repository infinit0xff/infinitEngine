"use strict";

function Demo(htmlCanvasID) {
    
    // shader for drawing
    this.ivConstColorShader = null;

    // square variables
    this.ivBlueSq = null;
    this.ivRedSq = null;

    // initialize webgl context
    infinitEngine.Core.initializeWebGL(htmlCanvasID);
    
    // setup the camera
    this.ivCamera = new Camera(
    vec2.fromValues(20, 60),    // center
    20,                         // width
    [20, 40, 600, 300]          // viewport ( orgX, orgY, width, height)
    );

    // create, load and compile shader 
    this.ivConstColorShader = new SimpleShader(
        "src/glsl_shaders/simple_vs.glsl",
        "src/glsl_shaders/simple_fs.glsl"
    );
    
    // create renderable objects
    this.ivRedSq = new Renderable(this.ivConstColorShader);
    this.ivRedSq.setColor([0.8, 0.2, 0.2, 1]);
    this.ivBlueSq = new Renderable(this.ivConstColorShader);
    this.ivBlueSq.setColor([0.2, 0.4, 0.8, 1]);
    this.ivTLSq = new Renderable(this.ivConstColorShader);
    this.ivTLSq.setColor([0.9, 0.1, 0.1, 1]);
    this.ivTRSq = new Renderable(this.ivConstColorShader);
    this.ivTRSq.setColor([0.1, 0.9, 0.1, 1]);
    this.ivBRSq = new Renderable(this.ivConstColorShader);
    this.ivBRSq.setColor([0.1, 0.1, 0.9, 1]);
    this.ivBLSq = new Renderable(this.ivConstColorShader);
    this.ivBLSq.setColor([0.1, 0.1, 0.1, 1]);

    // clear the canvas
    infinitEngine.Core.clearCanvas([0.1, 0.8, 0.2, 1]);

    // view and projection matrices">
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();

    // define the view matrix
    mat4.lookAt(viewMatrix,
        [20, 60, 10],   // camera position
        [20, 60, 0],    // look at position
        [0, 1, 0]);     // orientation 

    // define the projection matrix
    mat4.ortho(projMatrix,
        -10,     // distant to left of WC
         10,     // distant to right of WC
        -5,      // distant to bottom of WC
         5,      // distant to top of WC
         0,      // distant to near plane 
         1000);  // distant to far plane 

    // concatenate to form the view projection operator
    var vpMatrix = mat4.create();
    mat4.multiply(vpMatrix, projMatrix, viewMatrix);
    // </editor-fold>

    // starts the drawing by activating the camera
    this.ivCamera.setupViewProjection();
    var vpMatrix = this.ivCamera.getVPMatrix()
    
    // draw the blue square
    // centre blue, slightly rotated square
    this.ivBlueSq.getXform().setPosition(20, 60);
    this.ivBlueSq.getXform().setRotationInRad(0.2); // In Radians
    this.ivBlueSq.getXform().setSize(5, 5);
    this.ivBlueSq.draw(vpMatrix);

    // draw the center and the corner squares
    // centre red square
    this.ivRedSq.getXform().setPosition(20, 60);
    this.ivRedSq.getXform().setSize(2, 2);
    this.ivRedSq.draw(vpMatrix);

    // top left
    this.ivTLSq.getXform().setPosition(10, 65);
    this.ivTLSq.draw(vpMatrix);

    // top right
    this.ivTRSq.getXform().setPosition(30, 65);
    this.ivTRSq.draw(vpMatrix);

    // bottom right
    this.ivBRSq.getXform().setPosition(30, 55);
    this.ivBRSq.draw(vpMatrix);

    // bottom left
    this.ivBLSq.getXform().setPosition(10, 55);
    this.ivBLSq.draw(vpMatrix);
};
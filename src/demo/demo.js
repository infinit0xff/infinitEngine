function Demo(htmlCanvasID) {
    
    // shader for drawing
    this.ivShader = null;

    // initialize webgl context
    infinitEngine.Core.initializeWebGL(htmlCanvasID);
    
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

    // clear the canvas
    infinitEngine.Core.clearCanvas([0.1, 0.8, 0.2, 1]);

    // create new indentity transform
    var xform = mat4.create();
    
    // compute red transform operator
    this.ivRedSq.getXform().setPosition(-0.25, 0.25);
    this.ivRedSq.getXform().setRotationInRad(0.2); // In Radians
    this.ivRedSq.getXform().setSize(1.2, 1.2);
    this.ivRedSq.draw(xform);

    // compute blue transform operator
    //
    // to show alternative to setPosition
    this.ivBlueSq.getXform().setXPos(0.25);
     // possible to setX/Y separately
    this.ivBlueSq.getXform().setYPos(-0.25);
    // degree of ratation ex: 45
    this.ivBlueSq.getXform().setRotationInDegree(45);
    // show alternative to setSize
    this.ivBlueSq.getXform().setWidth(0.4);
    // possible to set width/height separately
    this.ivBlueSq.getXform().setHeight(0.4);
    this.ivBlueSq.draw(xform);

    // draw with activated geometry and shader
    var gl = infinitEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
};
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
    
    // create Renderable objects
    this.ivRedSq = new Renderable(this.ivConstColorShader);
    this.ivRedSq.setColor([0.8, 0.2, 0.2, 1]);
    this.ivBlueSq = new Renderable(this.ivConstColorShader);
    this.ivBlueSq.setColor([0.2, 0.4, 0.8, 1]);

    // clear the canvas
    infinitEngine.Core.clearCanvas([0.1, 0.8, 0.2, 1]);
    
    // draw    
    this.ivRedSq.draw();
    // this.ivBlueSq.draw();

    // draw with activated geometry and shader
    var gl = infinitEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
};
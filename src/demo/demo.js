function Demo(htmlCanvasID) {
    
    // shader for drawing
    this.ivShader = null;

    // initialize webgl context
    infinitEngine.Core.initializeWebGL(htmlCanvasID);
    
    // create, load and compile shader 
    this.ivShader = new SimpleShader(
        "src/glsl_shaders/simple_vs.glsl",
        "src/glsl_shaders/simple_fs.glsl"
    );
    
    // clear the canvas
    infinitEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    // activate proper shader
    this.ivShader.activateShader([0, 0, 1, 1]);

    // draw with activated geometry and shader
    var gl = infinitEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
};
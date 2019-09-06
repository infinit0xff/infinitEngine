function Demo(htmlCanvasID) {
    
    // shader for drawing
    this.ivShader = null;

    // initialize webgl context
    infinitEngine.Core.initializeWebGL(htmlCanvasID);
    
    // create, load and compile shader 
    this.ivShader = new SimpleShader("VertexShader", "FragmentShader");
    
    // clear the canvas
    infinitEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    // activate proper shader
    this.ivShader.activateShader();

    // draw with activated geometry and shader
    var gl = infinitEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
};
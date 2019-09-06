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

    // create new indentity transform
    var xform = mat4.create();
    
    // compute red transform operator
    mat4.translate(xform, xform, vec3.fromValues(-0.25, 0.25, 0.0));
    mat4.rotateZ(xform, xform, 0.2);
    mat4.scale(xform, xform, vec3.fromValues(1.2, 1.2, 1.0));
    this.ivRedSq.draw(xform);

    // restart
    mat4.identity(xform);

    // compute blue transform operator
    mat4.translate(xform, xform, vec3.fromValues(-0.25, 0.25, 0.0));
    mat4.rotateZ(xform, xform, -0.785);
    mat4.scale(xform, xform, vec3.fromValues(0.4, 0.4, 1.0));
    this.ivBlueSq.draw(xform);

    // draw with activated geometry and shader
    var gl = infinitEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 
};
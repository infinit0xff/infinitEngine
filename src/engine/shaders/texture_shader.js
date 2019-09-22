"use strict";

// constructor
function TextureShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);

    // reference to aTextureCoordinate within the shader
    this.ivShaderTextureCoordAttribute = null;
    
    // reference to the uSampler, when using only texture, 
    // this is not necessary, with NormalMap, we must do this.
    this.ivSamplerRef = null;

    // get the reference of aTextureCoordinate within the shader
    var gl = infinitEngine.Core.getGL();
    this.ivSamplerRef = gl.getUniformLocation(this.ivCompiledShader, "uSampler");
    this.ivShaderTextureCoordAttribute = gl.getAttribLocation(this.ivCompiledShader, "aTextureCoordinate");
}
// get all the prototype functions from SimpleShader
infinitEngine.Core.inheritPrototype(TextureShader, SimpleShader);

// overriding the activation of the shader for rendering
TextureShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // now our own functionality: enable texture coordinate array
    var gl = infinitEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, infinitEngine.VertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.ivShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this.ivShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    // binds to texture unit 0
    gl.uniform1i(this.ivSamplerRef, 0);

};
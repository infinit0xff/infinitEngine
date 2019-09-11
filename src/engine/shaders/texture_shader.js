"use strict";

// constructor
function TextureShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);

    // reference to aTextureCoordinate within the shader
    this.ivShaderTextureCoordAttribute = null;

    // get the reference of aTextureCoordinate within the shader
    var gl = infinitEngine.Core.getGL();
    this.ivShaderTextureCoordAttribute = gl.getAttribLocation(this.ivCompiledShader, "aTextureCoordinate");
}
// get all the prototype functions from SimpleShader
infinitEngine.Core.inheritPrototype(TextureShader, SimpleShader);

// overriding the activation of the shader for rendering
TextureShader.prototype.activateShader = function (pixelColor, vpMatrix) {
    // first call the super class's activate
    SimpleShader.prototype.activateShader.call(this, pixelColor, vpMatrix);

    // now our own functionality: enable texture coordinate array
    var gl = infinitEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, infinitEngine.VertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.ivShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this.ivShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
};
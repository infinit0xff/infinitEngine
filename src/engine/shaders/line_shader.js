"use strict";

function LineShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

    this.ivPointSizeRef = null;            // reference to the PointSize uniform
    var gl = infinitEngine.Core.getGL();

    // point size uniform
    this.ivPointSizeRef = gl.getUniformLocation(this.ivCompiledShader, "uPointSize");

    this.ivPointSize = 1;
}
infinitEngine.Core.inheritPrototype(LineShader, SimpleShader);


// activate the shader for rendering
LineShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // now our own functionality: enable texture coordinate array
    var gl = infinitEngine.Core.getGL();
    gl.uniform1f(this.ivPointSizeRef, this.ivPointSize);
    gl.bindBuffer(gl.ARRAY_BUFFER, infinitEngine.VertexBuffer.getGLLineVertexRef());
    gl.vertexAttribPointer(this.ivShaderVertexPositionAttribute,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,       // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);

    gl.enableVertexAttribArray(this.ivShaderVertexPositionAttribute);
};
LineShader.prototype.setPointSize = function (w) { this.ivPointSize = w; };


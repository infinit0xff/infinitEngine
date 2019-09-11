"use strict";

function SpriteShader(vertexShaderPath, fragmentShaderPath) {
    
    // call superclass
    TextureShader.call(this, vertexShaderPath, fragmentShaderPath);
    
    //gl buffer contains texture coordinates
    this.ivTexCoordBuffer = null;

    var initTexCoord = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    var gl = infinitEngine.Core.getGL();
    this.ivTexCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ivTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord),
    gl.DYNAMIC_DRAW);
}

// spriteShader subclass's TextureShader
infinitEngine.Core.inheritPrototype(SpriteShader, TextureShader);

SpriteShader.prototype.setTextureCoordinate = function(texCoord) {
    var gl = infinitEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ivTexCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord))
};

SpriteShader.prototype.activateShader = function(pixelColor, vpMatrix) {
    // call superclass
    SimpleShader.prototype.activateShader.call(this, pixelColor, vpMatrix);
    
    // bind texture coordinate buffer
    var gl = infinitEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ivTexCoordBuffer);
    gl.vertexAttribPointer(this.ivShaderTextureCoordAttribute,
        2,
        gl.FLOAT,
        false,
        0,
        0);
    gl.enableVertexAttribArray(this.ivShaderTextureCoordAttribute);
};


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

SpriteShader.prototype.activateShader = function(pixelColor, aCamera) {
    // call superclass
    SimpleShader.prototype.activateShader.call(this, pixelColor, aCamera);
    
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

SpriteShader.prototype.setTextureCoordinate = function(texCoord) {
    var gl = infinitEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ivTexCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord))
};

// cleanup to release allocated memory
SpriteShader.prototype.cleanUp = function () {
    var gl = infinitEngine.Core.getGL();
    gl.deleteBuffer(this.ivTexCoordBuffer);
    // now call super class's clean up ...
    SimpleShader.prototype.cleanUp.call(this);
};

// make sure these functions are defined, such that
// this shader can support LightRenderable and IllumRenderable

// will be override by LightShader
SpriteShader.prototype.setLights = function (l) { };

// will be override by IllumShader
SpriteShader.prototype.setMaterialAndCameraPos = function(m, p) { };


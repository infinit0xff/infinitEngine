"use strict";

function SimpleShader(vertexShaderPath, fragmentShaderPath) {
    // instance vars
    this.ivCompiledShader = null;

    // reference to pixelColor fragment shader
    this.ivPixelColor = null;

    // reference to uModelTransform
    this.ivModelTransform = null;

    // reference to view projection tansform
    this.ivViewProjTransform = null;

    // reference compiled shader webgl context
    this.ivSharedVertexPositionAttribute = null;

    var gl = infinitEngine.Core.getGL();

    // constructor code below

    // load and compile vertex and fragment
    this.ivVertexShader = this._compileShader(vertexShaderPath, gl.VERTEX_SHADER);
    this.ivFragmentShader = this._compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);
    
    // create and link shaders
    this.ivCompiledShader = gl.createProgram();
    gl.attachShader(this.ivCompiledShader, this.ivVertexShader);
    gl.attachShader(this.ivCompiledShader, this.ivFragmentShader);
    gl.linkProgram(this.ivCompiledShader);

    // check for errors
    if (!gl.getProgramParameter(this.ivCompiledShader, gl.LINK_STATUS)) {
        alert("Error linking shader");
        return null;
    }

    // get reference to aSquareVertexPosition
    this.ivSharedVertexPositionAttribute = gl.getAttribLocation(this.ivCompiledShader,
        "aSquareVertexPosition");

    // activate vertex buffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, infinitEngine.VertexBuffer.getGLVertexRef());
    
    gl.vertexAttribPointer(this.ivSharedVertexPositionAttribute,
        3,
        gl.FLOAT,
        false,
        0,
        0);
    
    this.ivPixelColor = gl.getUniformLocation(this.ivCompiledShader, "uPixelColor");
    this.ivModelTransform = gl.getUniformLocation(this.ivCompiledShader,
        "uModelTransform");
    this.ivViewProjTransform = gl.getUniformLocation(this.ivCompiledShader, "uViewProjTransform")
}

// accessor for shader
SimpleShader.prototype.getShader = function() {
    return this.ivCompiledShader;
};

// activate shader
SimpleShader.prototype.activateShader = function(pixelColor, aCamera) {
    var gl = infinitEngine.Core.getGL();
    gl.useProgram(this.ivCompiledShader);
    gl.uniformMatrix4fv(this.ivViewProjTransform, false, aCamera.getVPMatrix());
    gl.enableVertexAttribArray(this.ivSharedVertexPositionAttribute);
    gl.uniform4fv(this.ivPixelColor, pixelColor);
};

// load per object model transform
SimpleShader.prototype.loadObjectTransform = function(modelTransform) {
    var gl = infinitEngine.Core.getGL();
    gl.uniformMatrix4fv(this.ivModelTransform, false, modelTransform);
    
}

// return a compiled shader from a shader in the DOM
SimpleShader.prototype._compileShader = function(filePath, shaderType) {
    var gl = infinitEngine.Core.getGL();
    var shaderSource = null, compiledShader = null;
    
    // resource map handles file loading
    shaderSource = infinitEngine.ResourceMap.retrieveAsset(filePath);

    if (shaderSource === null) {
        alert("WARNING: Loading of: " + filePath + " Failed!");
        return null;
    }

    // create shader of shader type vertex or fragment
    compiledShader = gl.createShader(shaderType);

    // compile created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // check for errors
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }
    return compiledShader;
}

SimpleShader.prototype.cleanUp = function () {
    var gl = infinitEngine.Core.getGL();
    gl.detachShader(this.ivCompiledShader, this.ivVertexShader);
    gl.detachShader(this.ivCompiledShader, this.ivFragmentShader);
    gl.deleteShader(this.ivVertexShader);
    gl.deleteShader(this.ivFragmentShader);
};
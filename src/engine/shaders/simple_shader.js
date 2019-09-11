function SimpleShader(vertexShaderID, fragmentShaderID) {
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
    var vertexShader = this._compileShader(vertexShaderID, gl.VERTEX_SHADER);
    var fragmentShader = this._compileShader(fragmentShaderID, gl.FRAGMENT_SHADER);
    
    // create and link shaders
    this.ivCompiledShader = gl.createProgram();
    gl.attachShader(this.ivCompiledShader, vertexShader);
    gl.attachShader(this.ivCompiledShader, fragmentShader);
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
SimpleShader.prototype.activateShader = function(pixelColor, vpMatrix) {
    var gl = infinitEngine.Core.getGL();
    gl.useProgram(this.ivCompiledShader);
    gl.uniformMatrix4fv(this.ivViewProjTransform, false, vpMatrix);
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
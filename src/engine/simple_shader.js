function SimpleShader(vertexShaderID, fragmentShaderID) {
    // instance vars
    this.ivCompiledShader = null;

    // reference compiled shader webgl context
    this.ivSharedVertexPositionAttribute = null;

    var gl = infinitEngine.Core.getGL();

    // constructor code below

    // load and compile vertex and fragment
    var vertexShader = this._loadAndCompileShader(vertexShaderID, gl.VERTEX_SHADER);
    var fragmentShader = this._loadAndCompileShader(fragmentShaderID, gl.FRAGMENT_SHADER);
    
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
}

// return a compiled shader from a shader in the DOM
SimpleShader.prototype._loadAndCompileShader = function(id, shaderType) {
    var shaderText, shaderSource, compiledShader;
    var gl = infinitEngine.Core.getGL();

    // get shader source from index.html
    shaderText = document.getElementById(id);
    shaderSource = shaderText.firstChild.textContent;

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

// activate shader
SimpleShader.prototype.activateShader = function() {
    var gl = infinitEngine.Core.getGL();
    gl.useProgram(this.ivCompiledShader);
    gl.enableVertexAttribArray(this.ivSharedVertexPositionAttribute);
};

// accessor for shader
SimpleShader.prototype.getShader = function() {
    return this.ivCompiledShader;
};

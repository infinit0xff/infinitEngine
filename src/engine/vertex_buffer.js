"use strict";

var infinitEngine = infinitEngine || {};

// vertex object
infinitEngine.VertexBuffer = (function() {

    // define vertices
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    var ivSquareVertexBuffer = null;
    
    var getGLVertexRef = function() { return ivSquareVertexBuffer; };

    var initialize = function() {
        var gl = infinitEngine.Core.getGL();
        
        // create buffer
        ivSquareVertexBuffer = gl.createBuffer();

        // activate buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ivSquareVertexBuffer);
        
        // load vertices into buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare),
        gl.STATIC_DRAW);
    };

    var ivPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef
    };
    return ivPublic;

}()); //create single instance
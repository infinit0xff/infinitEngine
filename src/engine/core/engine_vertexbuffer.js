"use strict";

var infinitEngine = infinitEngine || {};

// vertex object
infinitEngine.VertexBuffer = (function() {

    var ivSquareVertexBuffer = null;

    // reference to the texture positions for the square vertices in the gl context
    var ivTextureCoordBuffer = null;

    // define vertices
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // texture cooridnates
    var textureCoordinates = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    var initialize = function() {
        var gl = infinitEngine.Core.getGL();
        
        // create buffer
        ivSquareVertexBuffer = gl.createBuffer();

        // activate buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ivSquareVertexBuffer);
        
        // load vertices into buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare),
        gl.STATIC_DRAW);

        // create a buffer on the gGL context for our vertex positions
        ivTextureCoordBuffer = gl.createBuffer();

        // activate textureCoordBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, ivTextureCoordBuffer);

        // Loads textureCoordinates into the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    
    };

    var cleanUp = function() {
        var gl = infinitEngine.Core.getGL();
        gl.deleteBuffer(ivSquareVertexBuffer);
        gl.deleteBuffer(ivTextureCoordBuffer);
    };

    // getters
    var getGLVertexRef = function() { return ivSquareVertexBuffer; };
    var getGLTexCoordRef = function () { return ivTextureCoordBuffer; };

    var ivPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef,
        getGLTexCoordRef: getGLTexCoordRef,
        cleanUp: cleanUp
    };
    
    return ivPublic;

}()); //create single instance
"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.Core = (function() {
    
    // 'iv' means instance variable

    // graphical context
    var ivGL = null;

    // accessor for webgl context
    var getGL = function() { return ivGL; };

    // initialize webgl, vertex buffer and compile shaders.
    var initializeWebGL = function(htmlCanvasID) {

        // create canvas and expose as HTMLCanvasElement
        var canvas = document.createElement("canvas");
        canvas.id = htmlCanvasID;
        canvas.width = 640;
        canvas.height = 480;
        canvas.innerHTML = "your browser does not support HTML5 canvas."
        
        // add canvas to body
        document.querySelector('body').appendChild(canvas);

        ivGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        
        // if context doesnt load then error
        if(ivGL === null) {
            document.write("<br><b>WebGL not supported!</b>");
            return;
        }
    }

    // clears draw area
    var clearCanvas = function(color) {
        ivGL.clearColor(color[0], color[1], color[2], color[3]);
        ivGL.clear(ivGL.COLOR_BUFFER_BIT);
    };

    // contains accessible functions and vars
    var ivPublic = {
        getGL: getGL
    };

    return ivPublic;
}()); // create single instance of gEngine.Core
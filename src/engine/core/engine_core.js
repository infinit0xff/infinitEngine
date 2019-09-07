"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.Core = (function() {
    
    // 'iv' means instance variable
    
    // 1. defines canvas in infinitEngine.Core
    // 2. sets graphical context with setGL()
    // 3. uses id inside initializeWebGL function
    
    // create canvas and expose as HTMLCanvasElement
    var canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvas.innerHTML = "your browser does not support HTML5 canvas."
 
    // add canvas to body
    document.querySelector('body').appendChild(canvas);
    
    // setter for webgl context
    var setGL = function() { 
        let context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return context;
    }

    // accessor for webgl context
    var getGL = function() { return setGL(); };

    // set instance var to webgl context
    var ivGL = getGL();

    // initialize webgl, vertex buffer and compile shaders.
    var initializeWebGL = function(htmlCanvasID) {
        
        // id from canvas above thats created in infintEngine.Core
        canvas.id = htmlCanvasID;

        if(ivGL === null) {
            document.write("<br><b>WebGL not supported!</b>");
            return;
        }

        // initialize vertex buffer
        infinitEngine.VertexBuffer.initialize();
    };
    
    // clears draw area
    var clearCanvas = function(color) {
        ivGL.clearColor(color[0], color[1], color[2], color[3]);
        ivGL.clear(setGL().COLOR_BUFFER_BIT);
    };

    // contains accessible functions and vars
    var ivPublic = {
        getGL: getGL,
        initializeWebGL: initializeWebGL,
        clearCanvas: clearCanvas
    };

    return ivPublic;
}()); // create single instance of infinitEngine.Core
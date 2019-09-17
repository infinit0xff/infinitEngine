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
        let context = canvas.getContext("webgl", {alpha: false}) || canvas.getContext("experimental-webgl", {alpha: false});
        return context;
    }

    // accessor for webgl context
    var getGL = function() { return setGL(); };

    // set instance var to webgl context
    var ivGL = getGL();

    // initialize webgl, vertex buffer and compile shaders.
    var _initializeWebGL = function(htmlCanvasID) {
        
        // id from canvas above thats created in infintEngine.Core
        canvas.id = htmlCanvasID;

         // Allows transperency with textures.
    ivGL.blendFunc(ivGL.SRC_ALPHA, ivGL.ONE_MINUS_SRC_ALPHA);
    ivGL.enable( ivGL.BLEND ) ;
    // Set images to flip the y axis to match the texture coordinate space.
    ivGL.pixelStorei(ivGL.UNPACK_FLIP_Y_WEBGL, true);
        if(ivGL === null) {
            document.write("<br><b>WebGL not supported!</b>");
            return;
        }

    };


    var startScene = function(scene) {
        scene.loadScene.call(scene);
        infinitEngine.GameLoop.start(scene);
    };

    // initialize engine core
    var initializeEngineCore = function(htmlCanvasID, demo) {
        
        _initializeWebGL(htmlCanvasID);

         // initialize vertex buffer
        infinitEngine.VertexBuffer.initialize();

        // initialize input
        infinitEngine.Input.initialize(htmlCanvasID);

        infinitEngine.AudioClips.initAudioContext();

        // initialize default resources,
        // invoke startScene(demo) when done
        infinitEngine.DefaultResources.initialize(function() {
            startScene(demo);
        })
    };

    // clears draw area
    var clearCanvas = function(color) {
        ivGL.clearColor(color[0], color[1], color[2], color[3]);
        ivGL.clear(ivGL.COLOR_BUFFER_BIT);
    };

    var inheritPrototype = function(subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    // unloads all allocated resources
    var cleanUp = function() {
        infinitEngine.VertexBuffer.cleanUp();
        infinitEngine.DefaultResources.cleanUp();
    };

    // contains accessible functions and vars
    var ivPublic = {
        getGL: getGL,
        initializeEngineCore: initializeEngineCore,
        clearCanvas: clearCanvas,
        inheritPrototype: inheritPrototype,
        startScene: startScene,
        cleanUp: cleanUp
    };

    return ivPublic;
}()); // create single instance of infinitEngine.Core
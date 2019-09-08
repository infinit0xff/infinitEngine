"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.DefaultResources = (function() {
    
    // Simple Shader GLSL Shader file paths
     
    // path to the VertexShader
    var kSimpleVS = "src/glsl_shaders/simple_vs.glsl";
    // path to the FragmentShader
    var kSimpleFS = "src/glsl_shaders/simple_fs.glsl";
    
    // variable for SimpleShader object
    var ivConstColorShader = null;

    // assessor
    var _getConstColorShader = function() { return ivConstColorShader; };
    
    // callback function after loadings are done
    var _createShaders = function(callBackFunction) {
       ivConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
       callBackFunction();
    };
    // initiate asynchronous loading of glsl shader files
    var _initialize = function(callBackFunction) {
        
        // constant color shader: SimpleVS, and SimpleFS
        infinitEngine.TextFileLoader.loadTextFile(kSimpleVS,
            infinitEngine.TextFileLoader.eTextFileType.eTextFile);
        infinitEngine.TextFileLoader.loadTextFile(kSimpleFS,
            infinitEngine.TextFileLoader.eTextFileType.eTextFile);
        infinitEngine.ResourceMap.setLoadCompleteCallback(
            function() {_createShaders(callBackFunction);});
};

    var ivPublic = {
        initialize: _initialize,
        getConstColorShader: _getConstColorShader
    };

    return ivPublic;
}());
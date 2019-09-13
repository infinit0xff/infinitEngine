"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.DefaultResources = (function() {
    
    // simple shader glsl shader file paths
     
    // path to the VertexShader
    var kSimpleVS = "src/glsl_shaders/simple_vs.glsl";
    // path to the FragmentShader
    var kSimpleFS = "src/glsl_shaders/simple_fs.glsl";
    
    // variable for SimpleShader object
    var ivConstColorShader = null;

    // texture shader file paths
    var kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
    var kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
    
    // variable for textureShader object
    var ivTextureShader = null;
    var ivSpriteShader = null;

    // default font
    var kDefaultFont = "assets/fonts/system-default-font";
    var getDefaultFont = function() { return kDefaultFont; };

    // getters
    var getConstColorShader = function() { return ivConstColorShader; };
    var getTextureShader = function () { return ivTextureShader; };
    var getSpriteShader = function () { return ivSpriteShader; };

    // callback function after loadings are done
    var _createShaders = function(callBackFunction) {
        infinitEngine.ResourceMap.setLoadCompleteCallback(null);
        ivConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        ivTextureShader = new TextureShader(kTextureVS, kTextureFS);
        ivSpriteShader =  new SpriteShader(kTextureVS, kTextureFS);
        callBackFunction();
    };

    // initiate asynchronous loading of glsl shader files
    var initialize = function(callBackFunction) {
        
        // constant color shader: SimpleVS, and SimpleFS
        infinitEngine.TextFileLoader.loadTextFile(kSimpleVS,
            infinitEngine.TextFileLoader.eTextFileType.eTextFile);
        infinitEngine.TextFileLoader.loadTextFile(kSimpleFS,
            infinitEngine.TextFileLoader.eTextFileType.eTextFile);

         // texture shader: 
        infinitEngine.TextFileLoader.loadTextFile(kTextureVS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);
        infinitEngine.TextFileLoader.loadTextFile(kTextureFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);
 
        // load default font
        infinitEngine.Fonts.loadFont(kDefaultFont);

        infinitEngine.ResourceMap.setLoadCompleteCallback(
            function() {_createShaders(callBackFunction);});
    };

     // unload all resources
     var cleanUp = function () {
        ivConstColorShader.cleanUp();
        ivTextureShader.cleanUp();
        ivSpriteShader.cleanUp();

        infinitEngine.TextFileLoader.unloadTextFile(kSimpleVS);
        infinitEngine.TextFileLoader.unloadTextFile(kSimpleFS);

        // texture shader: 
        infinitEngine.TextFileLoader.unloadTextFile(kTextureVS);
        infinitEngine.TextFileLoader.unloadTextFile(kTextureFS);

        // default font
        infinitEngine.Fonts.unloadFont(kDefaultFont);
    };


    var ivPublic = {
        initialize: initialize,
        getConstColorShader: getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getDefaultFont: getDefaultFont,
        cleanUp: cleanUp
    };

    return ivPublic;
}());
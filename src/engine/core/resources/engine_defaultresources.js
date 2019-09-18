"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.DefaultResources = (function() {
    
    // Global Ambient color
    var ivGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
    var ivGlobalAmbientIntensity = 1;
    var getGlobalAmbientIntensity = function () { return ivGlobalAmbientIntensity; };
    var setGlobalAmbientIntensity = function (v) { ivGlobalAmbientIntensity = v; };
    var getGlobalAmbientColor = function () { return ivGlobalAmbientColor; };
    var setGlobalAmbientColor = function (v) { ivGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); };


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

    // light Shader
    var kLightFS = "src/glsl_shaders/light_fs.glsl";  // Path to the Light FragmentShader
    var ivLightShader = null;

    // default font
    var kDefaultFont = "assets/fonts/system-default-font";
    var getDefaultFont = function() { return kDefaultFont; };

    // getters
    var getConstColorShader = function() { return ivConstColorShader; };
    var getTextureShader = function () { return ivTextureShader; };
    var getSpriteShader = function () { return ivSpriteShader; };
    var getLightShader = function () { return ivLightShader; };


    // callback function after loadings are done
    var _createShaders = function(callBackFunction) {
        infinitEngine.ResourceMap.setLoadCompleteCallback(null);
        ivConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        ivTextureShader = new TextureShader(kTextureVS, kTextureFS);
        ivSpriteShader =  new SpriteShader(kTextureVS, kTextureFS);
        ivLightShader = new LightShader(kTextureVS, kLightFS);

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
 
        // Light Shader
        infinitEngine.TextFileLoader.loadTextFile(kLightFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);

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
        ivLightShader.cleanUp();

        infinitEngine.TextFileLoader.unloadTextFile(kSimpleVS);
        infinitEngine.TextFileLoader.unloadTextFile(kSimpleFS);

        // texture shader: 
        infinitEngine.TextFileLoader.unloadTextFile(kTextureVS);
        infinitEngine.TextFileLoader.unloadTextFile(kTextureFS);

         // Light Shader
         infinitEngine.TextFileLoader.unloadTextFile(kLightFS);

        // default font
        infinitEngine.Fonts.unloadFont(kDefaultFont);
    };


    var ivPublic = {
        initialize: initialize,
        getConstColorShader: getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getLightShader: getLightShader,
        getDefaultFont: getDefaultFont,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        cleanUp: cleanUp
    };

    return ivPublic;
}());
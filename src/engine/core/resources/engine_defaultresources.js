"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.DefaultResources = (function() {
    
    // global ambient color
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

    // texture shader
    var kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
    var kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
    var ivTextureShader = null;
    var ivSpriteShader = null;

    // light Shader
    var kLightFS = "src/glsl_shaders/light_fs.glsl";  // Path to the Light FragmentShader
    var ivLightShader = null;

    // illumination Shader
    var kIllumFS = "src/glsl_shaders/illum_fs.glsl"; // Path to the Illumination FragmentShader
    var ivIllumShader = null;

     // shadow shaders
     var kShadowReceiverFS = "src/glsl_shaders/shadow_receiver_fs.glsl";  // Path to the FragmentShader
     var ivShadowReceiverShader = null;
     var kShadowCasterFS = "src/glsl_shaders/shadow_caster_fs.glsl";  // Path to the FragmentShader
     var ivShadowCasterShader = null;

    // default font
    var kDefaultFont = "assets/fonts/system-default-font";
    var getDefaultFont = function() { return kDefaultFont; };

    // getters
    var getConstColorShader = function() { return ivConstColorShader; };
    var getTextureShader = function () { return ivTextureShader; };
    var getSpriteShader = function () { return ivSpriteShader; };
    var getLightShader = function () { return ivLightShader; };
    var getIllumShader = function () { return ivIllumShader; };
    var getShadowReceiverShader = function () { return ivShadowReceiverShader; };
    var getShadowCasterShader = function () { return ivShadowCasterShader; };

    // callback function after loadings are done
    var _createShaders = function(callBackFunction) {
        infinitEngine.ResourceMap.setLoadCompleteCallback(null);
        ivConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        ivTextureShader = new TextureShader(kTextureVS, kTextureFS);
        ivSpriteShader =  new SpriteShader(kTextureVS, kTextureFS);
        ivLightShader = new LightShader(kTextureVS, kLightFS);
        ivIllumShader = new IllumShader(kTextureVS, kIllumFS);
        ivShadowReceiverShader = new SpriteShader(kTextureVS, kShadowReceiverFS);
        ivShadowCasterShader = new ShadowCasterShader(kTextureVS, kShadowCasterFS);
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

        // Illumination Shader
        infinitEngine.TextFileLoader.loadTextFile(kIllumFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);

        // Shadow caster and receiver shaders
        infinitEngine.TextFileLoader.loadTextFile(kShadowReceiverFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);
        infinitEngine.TextFileLoader.loadTextFile(kShadowCasterFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);
    
        // load default font
        infinitEngine.Fonts.loadFont(kDefaultFont);

        infinitEngine.ResourceMap.setLoadCompleteCallback(
            function s() {_createShaders(callBackFunction);});
    };

     // unload all resources
     var cleanUp = function () {
        ivConstColorShader.cleanUp();
        ivTextureShader.cleanUp();
        ivSpriteShader.cleanUp();
        ivLightShader.cleanUp();
        ivIllumShader.cleanUp();
        ivShadowReceiverShader.cleanUp();
        ivShadowCasterShader.cleanUp();


        infinitEngine.TextFileLoader.unloadTextFile(kSimpleVS);
        infinitEngine.TextFileLoader.unloadTextFile(kSimpleFS);

        // texture shader: 
        infinitEngine.TextFileLoader.unloadTextFile(kTextureVS);
        infinitEngine.TextFileLoader.unloadTextFile(kTextureFS);

        // Light Shader
        infinitEngine.TextFileLoader.unloadTextFile(kLightFS);

        // Illumination Shader
        infinitEngine.TextFileLoader.unloadTextFile(kIllumFS);

        // Shadow shaders
        infinitEngine.TextFileLoader.unloadTextFile(kShadowReceiverFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);
        infinitEngine.TextFileLoader.unloadTextFile(kShadowCasterFS, infinitEngine.TextFileLoader.eTextFileType.eTextFile);

        // default font
        infinitEngine.Fonts.unloadFont(kDefaultFont);
    };


    var ivPublic = {
        initialize: initialize,
        getConstColorShader: getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getLightShader: getLightShader,
        getIllumShader: getIllumShader,
        getShadowReceiverShader: getShadowReceiverShader,
        getShadowCasterShader: getShadowCasterShader,
        getDefaultFont: getDefaultFont,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        cleanUp: cleanUp
    };

    return ivPublic;
}());
"use strict";

var infinitEngine = infinitEngine || { };

function TextureInfo(name, w, h, id) {
    this.ivName = name;
    this.ivWidth = w;
    this.ivHeight = h;
    this.ivGLTexID = id;
    this.ivColorArray = null;

}

infinitEngine.Textures = (function () {
    /*
     * This converts an image to the webGL texture format. 
     * This should only be called once the texture is loaded.
     */
    var _processLoadedImage = function (textureName, image) {
        var gl = infinitEngine.Core.getGL();

        // Generate a texture reference to the webGL context
        var textureID = gl.createTexture();

        // bind the texture reference with the current texture functionality in the webGL
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        // Load the texture into the texture data structure with descriptive info.
        // Parameters:
        //  1: Which "binding point" or target the texture is being loaded to.
        //  2: Level of detail. Used for mipmapping. 0 is base texture level.
        //  3: Internal format. The composition of each element. i.e. pixels.
        //  4: Format of texel data. Must match internal format.
        //  5: The data type of the texel data.
        //  6: Texture Data.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Creates a mipmap for this texture.
        gl.generateMipmap(gl.TEXTURE_2D);

        // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
        gl.bindTexture(gl.TEXTURE_2D, null);

        var texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
        infinitEngine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
    };

    // Loads an texture so that it can be drawn.
    // If already in the map, will do nothing.
    var loadTexture = function (textureName) {
        if (!(infinitEngine.ResourceMap.isAssetLoaded(textureName))) {
            // Create new Texture object.
            var img = new Image();

            // Update resources in loading counter.
            infinitEngine.ResourceMap.asyncLoadRequested(textureName);

            // When the texture loads, convert it to the WebGL format then put
            // it back into the mTextureMap.
            img.onload = function () {
                _processLoadedImage(textureName, img);
            };
            img.src = textureName;
        } else {
            infinitEngine.ResourceMap.incAssetRefCount(textureName);
        }
    };

    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    var unloadTexture = function (textureName) {
        var gl = infinitEngine.Core.getGL();
        var texInfo = infinitEngine.ResourceMap.retrieveAsset(textureName);
        gl.deleteTexture(texInfo.ivGLTexID);
        infinitEngine.ResourceMap.unloadAsset(textureName);
    };

    var activateTexture = function (textureName) {
        var gl = infinitEngine.Core.getGL();
        var texInfo = infinitEngine.ResourceMap.retrieveAsset(textureName);
        
        gl.activeTexture(gl.TEXTURE0);
        // Binds our texture reference to the current webGL texture functionality
        gl.bindTexture(gl.TEXTURE_2D, texInfo.ivGLTexID);
        
        // To prevent texture wrappings
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Handles how magnification and minimization filters will work.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // For pixel-graphics where you want the texture to look "sharp" do the following:
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    };

    // texture 1 is always normal map for this game engine
    var activateNormalMap = function (textureName) {
        var gl = infinitEngine.Core.getGL();
        var texInfo = infinitEngine.ResourceMap.retrieveAsset(textureName);

        // binds our texture reference to the current webGL texture functionality
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texInfo.ivGLTexID);
        
        // to prevent texture wrappings
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // handles how magnification and minimization filters will work.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    };

    var deactivateTexture = function () {
        var gl = infinitEngine.Core.getGL();
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    var getTextureInfo = function (textureName) {
        return infinitEngine.ResourceMap.retrieveAsset(textureName);
    };

    // retrieve the color array from the WebGL context 
    var getColorArray = function (textureName) {
        var texInfo = getTextureInfo(textureName);
        if (texInfo.ivColorArray === null) {
            // create a framebuffer bind it to the texture, and read the color content
            // Hint from: http://stackoverflow.com/questions/13626606/read-pixels-from-a-webgl-texture 
            var gl = infinitEngine.Core.getGL();
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.ivGLTexID, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                var pixels = new Uint8Array(texInfo.ivWidth * texInfo.ivHeight * 4);
                gl.readPixels(0, 0, texInfo.ivWidth, texInfo.ivHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                texInfo.ivColorArray = pixels;
            } else {
                alert("WARNING: Engine.Textures.getColorArray() failed!");
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
        }
        return texInfo.ivColorArray;
    };

    // public interface for this object. Anything not in here will
    // not be accessable.
    var ivPublic = {
        loadTexture: loadTexture,
        unloadTexture: unloadTexture,
        activateTexture: activateTexture,
        activateNormalMap: activateNormalMap,
        deactivateTexture: deactivateTexture,
        getTextureInfo: getTextureInfo,
        getColorArray: getColorArray
    };
    return ivPublic;
}());
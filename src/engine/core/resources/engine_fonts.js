"use strict";

var infinitEngine = infinitEngine || {};

function CharacterInfo() {
    // in texture coordinate (0 to 1) maps to the entire image
    this.ivTexCoordLeft = 0;
    this.ivTexCoordRight = 1;
    this.ivTexCoordBottom = 0;
    this.ivTexCoordTop = 0;

    // 1 is "standard width/height" of a char
    this.ivCharWidth = 1;
    this.ivCharHeight = 1;
    this.ivCharWidthOffset = 0;
    this.ivCharHeightOffset = 0;

    // reference of char width/height ration
    this.ivCharAspectRatio = 1;
}

infinitEngine.Fonts = (function(){
    var _storeLoadedFont = function (fontInfoSourceString) {
        var fontName = fontInfoSourceString.slice(0, -4);  // trims the .fnt extension
        var fontInfo = infinitEngine.ResourceMap.retrieveAsset(fontInfoSourceString);
        fontInfo.FontImage = fontName + ".png";
        infinitEngine.ResourceMap.asyncLoadCompleted(fontName, fontInfo); // to store the actual font info
    };

    var loadFont = function(fontName) {
        if (!(infinitEngine.ResourceMap.isAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";

            infinitEngine.ResourceMap.asyncLoadRequested(fontName); // to register an entry in the map

            infinitEngine.Textures.loadTexture(textureSourceString);
            infinitEngine.TextFileLoader.loadTextFile(fontInfoSourceString,
                            infinitEngine.TextFileLoader.eTextFileType.eXMLFile, _storeLoadedFont);
        } else {
            infinitEngine.ResourceMap.incAssetRefCount(fontName);
        }
    };

    // remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    var unloadFont = function (fontName) {
        infinitEngine.ResourceMap.unloadAsset(fontName);
        if (!(infinitEngine.ResourceMap.isAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";

            infinitEngine.Textures.unloadTexture(textureSourceString);
            infinitEngine.TextFileLoader.unloadTextFile(fontInfoSourceString);
        }
    };

    var getCharInfo = function (fontName, aChar) {
        var returnInfo = null;
        var fontInfo = infinitEngine.ResourceMap.retrieveAsset(fontName);
        var commonPath = "font/common";
        var commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        commonInfo = commonInfo.iterateNext();
        if (commonInfo === null) {
            return returnInfo;
        }
        var charHeight = commonInfo.getAttribute("base");

        var charPath = "font/chars/char[@id=" + aChar + "]";
        var charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        charInfo = charInfo.iterateNext();

        if (charInfo === null) {
            return returnInfo;
        }

        returnInfo = new CharacterInfo();
        var texInfo = infinitEngine.Textures.getTextureInfo(fontInfo.FontImage);
        var leftPixel = Number(charInfo.getAttribute("x"));
        var rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
        var topPixel = (texInfo.ivHeight - 1) - Number(charInfo.getAttribute("y"));
        var bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

        // texture coordinate information
        returnInfo.ivTexCoordLeft = leftPixel / (texInfo.ivWidth - 1);
        returnInfo.ivTexCoordTop = topPixel / (texInfo.ivHeight - 1);
        returnInfo.ivTexCoordRight = rightPixel / (texInfo.ivWidth - 1);
        returnInfo.ivTexCoordBottom = bottomPixel / (texInfo.ivHeight - 1);

        // relative character size
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.ivCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.ivCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.ivCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.ivCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
        returnInfo.ivCharAspectRatio = charWidth / charHeight;

        return returnInfo;
    };

    var ivPublic = {
        loadFont: loadFont,
        unloadFont: unloadFont,
        getCharInfo: getCharInfo
    };
    
    return ivPublic;

}());
"use strict";

function SpriteRenderable(myTexture) {
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getSpriteShader());
    this.ivTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
    this.ivTexRight = 1.0;  // 
    this.ivTexTop = 1.0;    //   1 is top and 0 is bottom of image
    this.ivTexBottom = 0.0;
    this._setTexInfo();

}
infinitEngine.Core.inheritPrototype(SpriteRenderable, TextureRenderable);

//// the expected texture coordinate array is an array of 8 floats where elements:
    //  [0] [1]: is u/v coordinate of Top-Right 
    //  [2] [3]: is u/v coordinate of Top-Left
    //  [4] [5]: is u/v coordinate of Bottom-Right
    //  [6] [7]: is u/v coordinate of Bottom-Left
    // Convention: eName is an enumerated data type
SpriteRenderable.eTexCoordArray = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});

// specify element region by texture coordinate (between 0 to 1)
SpriteRenderable.prototype.setElementUVCoordinate = function (left, right, bottom, top) {
    this.ivTexLeft = left;
    this.ivTexRight = right;
    this.ivTexBottom = bottom;
    this.ivTexTop = top;
    this._setTexInfo();
};

// specify element region by pixel positions (between 0 to image resolutions)
SpriteRenderable.prototype.setElementPixelPositions = function (left, right, bottom, top) {
    var texInfo = infinitEngine.ResourceMap.retrieveAsset(this.ivTexture);
    // entire image width, height
    var imageW = texInfo.ivWidth;
    var imageH = texInfo.ivHeight;

    this.ivTexLeft = left / imageW;
    this.ivTexRight = right / imageW;
    this.ivTexBottom = bottom / imageH;
    this.ivTexTop = top / imageH;
    this._setTexInfo();
};

SpriteRenderable.prototype.getElementUVCoordinateArray = function () {
    return [
        this.ivTexRight,  this.ivTexTop,          // x,y of top-right
        this.ivTexLeft,   this.ivTexTop,
        this.ivTexRight,  this.ivTexBottom,
        this.ivTexLeft,   this.ivTexBottom
    ];
};

SpriteRenderable.prototype.draw = function (pixelColor, aCamera) {
    // set the current texture coordinate
    // 
    // activate the texture
    this.ivShader.setTextureCoordinate(this.getElementUVCoordinateArray());
    TextureRenderable.prototype.draw.call(this, pixelColor, aCamera);
};

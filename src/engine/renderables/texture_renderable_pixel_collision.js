"use strict";

TextureRenderable.prototype.pixelTouches = function(other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0, yIndex;
    var otherIndex = [0, 0];

    while ((!pixelTouch) && (xIndex < this.ivTexWidth)) {
        yIndex = 0;
        while ((!pixelTouch) && (yIndex < this.ivTexHeight)) {
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex);
                other._wcPositionToIndex(otherIndex, wcTouchPos);
                if ((otherIndex[0] > 0) && (otherIndex[0] < other.ivTexWidth) &&
                    (otherIndex[1] > 0) && (otherIndex[1] < other.ivTexHeight)) {
                    pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouch;
};

TextureRenderable.prototype.setColorArray = function () {
    if (this.ivColorArray === null) {
        this.ivColorArray = infinitEngine.Textures.getColorArray(this.ivTexture);
    }
};

TextureRenderable.prototype._pixelAlphaValue = function (x, y) {
    x = x * 4;
    y = y * 4;
    return this.ivColorArray[(y * this.ivTextureInfo.ivWidth) + x  + 3];
};

TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this.ivXform.getPosition());
    returnIndex[0] = this.ivTexWidth  * (delta[0] / this.ivXform.getWidth());
    returnIndex[1] = this.ivTexHeight * (delta[1] / this.ivXform.getHeight());

    // recall that xForm.getPosition() returns center, yet
    // Texture origin is at lower-left corner!
    returnIndex[0] += this.ivTexWidth / 2;
    returnIndex[1] += this.ivTexHeight / 2;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

TextureRenderable.prototype._indexToWCPosition = function (returnWCPos, i, j) {
    var x = i * this.ivXform.getWidth() / (this.ivTexWidth - 1);
    var y = j * this.ivXform.getHeight() / (this.ivTexHeight - 1);
    returnWCPos[0] = this.ivXform.getXPos() + (x - (this.ivXform.getWidth() * 0.5));
    returnWCPos[1] = this.ivXform.getYPos() + (y - (this.ivXform.getHeight() * 0.5));
};
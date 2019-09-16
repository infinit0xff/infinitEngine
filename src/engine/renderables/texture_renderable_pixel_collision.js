"use strict";

TextureRenderable.prototype.pixelTouches = function(other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0, yIndex;
    var otherIndex = [0, 0];

    var xDir = [1, 0];
    var yDir = [0, 1];
    var otherXDir = [1, 0];
    var otherYDir = [0, 1];
    vec2.rotate(xDir, xDir, this.ivXform.getRotationInRad());
    vec2.rotate(yDir, yDir, this.ivXform.getRotationInRad());
    vec2.rotate(otherXDir, otherXDir, other.ivXform.getRotationInRad());
    vec2.rotate(otherYDir, otherYDir, other.ivXform.getRotationInRad());

    while ((!pixelTouch) && (xIndex < this.ivTexWidth)) {
        yIndex = 0;
        while ((!pixelTouch) && (yIndex < this.ivTexHeight)) {
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
                other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
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
    y += this.ivTexBottomIndex;
    x += this.ivTexLeftIndex;
    x = x * 4;
    y = y * 4;
    return this.ivColorArray[(y * this.ivTextureInfo.ivWidth) + x  + 3];
};

TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos, xDir, yDir) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this.ivXform.getPosition());
    var xDisp = vec2.dot(delta, xDir);
    var yDisp = vec2.dot(delta, yDir);
    returnIndex[0] = this.ivTexWidth  * (xDisp / this.ivXform.getWidth());
    returnIndex[1] = this.ivTexHeight * (yDisp / this.ivXform.getHeight());

    // recall that xForm.getPosition() returns center, yet
    // Texture origin is at lower-left corner!
    returnIndex[0] += this.ivTexWidth / 2;
    returnIndex[1] += this.ivTexHeight / 2;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

TextureRenderable.prototype._indexToWCPosition = function (returnWCPos, i, j, xDir, yDir) {
    var x = i * this.ivXform.getWidth() / (this.ivTexWidth - 1);
    var y = j * this.ivXform.getHeight() / (this.ivTexHeight - 1);
    var xDisp = x - (this.ivXform.getWidth() * 0.5);
    var yDisp = y - (this.ivXform.getHeight() * 0.5);
    var xDirDisp = [];
    var yDirDisp = [];

    vec2.scale(xDirDisp, xDir, xDisp);
    vec2.scale(yDirDisp, yDir, yDisp);
    vec2.add(returnWCPos, this.ivXform.getPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);
};
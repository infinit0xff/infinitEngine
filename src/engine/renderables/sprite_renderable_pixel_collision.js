"use strict";

SpriteRenderable.prototype._setTexInfo = function () {
    var imageW = this.ivTextureInfo.ivWidth;
    var imageH = this.ivTextureInfo.ivHeight;

    this.ivTexLeftIndex = this.ivTexLeft * imageW;
    this.ivTexBottomIndex = this.ivTexBottom * imageH;

    this.ivTexWidth = ((this.ivTexRight - this.ivTexLeft) * imageW) + 1;
    this.ivTexHeight = ((this.ivTexTop - this.ivTexBottom) * imageH) + 1;
};
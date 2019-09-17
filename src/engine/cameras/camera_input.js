"use strict";

Camera.prototype._mouseDCX = function () {
    return infinitEngine.Input.getMousePosX() - this.ivViewport[Camera.eViewport.eOrgX];
};
Camera.prototype._mouseDCY = function () {
    return infinitEngine.Input.getMousePosY() - this.ivViewport[Camera.eViewport.eOrgY];
};

Camera.prototype.isMouseInViewport = function () {
    var dcX = this._mouseDCX();
    var dcY = this._mouseDCY();
    return ((dcX >= 0) && (dcX < this.ivViewport[Camera.eViewport.eWidth]) &&
            (dcY >= 0) && (dcY < this.ivViewport[Camera.eViewport.eHeight]));
};

Camera.prototype.mouseWCX = function () {
    var minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
    return minWCX + (this._mouseDCX() * (this.getWCWidth() / this.ivViewport[Camera.eViewport.eWidth]));
};

Camera.prototype.mouseWCY = function () {
    var minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
    return minWCY + (this._mouseDCY() * (this.getWCHeight() / this.ivViewport[Camera.eViewport.eHeight]));
};
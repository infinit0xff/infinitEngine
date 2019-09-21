"use strict";

Camera.prototype.fakeZInPixelSpace = function (z) {
    return z * this.ivRenderCache.ivWCToPixelRatio;
};

// p is a vec3, fake Z
Camera.prototype.wcPosToPixel = function (p) {
    // convert the position to pixel space
    var x = this.ivViewport[Camera.eViewport.eOrgX] + ((p[0] - this.ivRenderCache.ivCameraOrgX) * this.ivRenderCache.ivWCToPixelRatio) + 0.5;
    var y = this.ivViewport[Camera.eViewport.eOrgY] + ((p[1] - this.ivRenderCache.ivCameraOrgY) * this.ivRenderCache.ivWCToPixelRatio) + 0.5;
    var z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

Camera.prototype.wcDirToPixel = function (d) {  // d is a vec3 direction in WC
    // convert the position to pixel space
    var x = d[0] * this.ivRenderCache.ivWCToPixelRatio;
    var y = d[1] * this.ivRenderCache.ivWCToPixelRatio;
    var z = d[2];
    return vec3.fromValues(x, y, z);
};

Camera.prototype.wcSizeToPixel = function (s) {
    return (s * this.ivRenderCache.ivWCToPixelRatio) + 0.5;
};

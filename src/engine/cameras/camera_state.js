"use strict";

function CameraState(center, width) {
    this.kCycles = 300;  // number of cycles to complete the transition
    this.kRate = 0.1;    // rate of change for each cycle
    this.ivCenter = new InterpolateVec2(center, this.kCycles, this.kRate);
    this.ivWidth = new Interpolate(width, this.kCycles, this.kRate);
}

CameraState.prototype.getCenter = function () { return this.ivCenter.getValue(); };
CameraState.prototype.getWidth = function () { return this.ivWidth.getValue(); };

CameraState.prototype.setCenter = function (c) { this.ivCenter.setFinalValue(c); };
CameraState.prototype.setWidth = function (w) { this.ivWidth.setFinalValue(w); };

CameraState.prototype.updateCameraState = function () {
    this.ivCenter.updateInterpolation();
    this.ivWidth.updateInterpolation();
};

CameraState.prototype.configInterpolation = function (stiffness, duration) {
    this.ivCenter.configInterpolation(stiffness, duration);
    this.ivWidth.configInterpolation(stiffness, duration);
};
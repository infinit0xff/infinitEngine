"use strict";

// damped simple harmonic shake motion
//
// state is the CameraState to be shaked.
function CameraShake(state, xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.ivOrgCenter = vec2.clone(state.getCenter());
    this.ivShakeCenter = vec2.clone(this.ivOrgCenter);
    this.ivShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

CameraShake.prototype.updateShakeState = function () {
    var s = this.ivShake.getShakeResults();
    vec2.add(this.ivShakeCenter, this.ivOrgCenter, s);
};

CameraShake.prototype.shakeDone = function () {
    return this.ivShake.shakeDone();
};

CameraShake.prototype.getCenter = function () { return this.ivShakeCenter; };
CameraShake.prototype.setRefCenter = function (c) {
    this.ivOrgCenter[0] = c[0];
    this.ivOrgCenter[1] = c[1];
};
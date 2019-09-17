"use strict";

// damped simple harmonic shake motion
// xDelta, yDelta: how large a shake
// shakeFrequency: how much movement
// shakeDuration: for how long in number of cycles
//
function ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.ivXMag = xDelta;
    this.ivYMag = yDelta;

    this.ivCycles = shakeDuration; // number of cycles to complete the transition
    this.ivOmega = shakeFrequency * 2 * Math.PI; // Converts frequency to radians 

    this.ivNumCyclesLeft = shakeDuration;
}

ShakePosition.prototype.shakeDone = function () {
    return (this.ivNumCyclesLeft <= 0);
};

ShakePosition.prototype.getShakeResults = function () {
    this.ivNumCyclesLeft--;
    var c = [];
    var fx = 0;
    var fy = 0;
    if (!this.shakeDone()) {
        var v = this._nextDampedHarmonic();
        fx = (Math.random() > 0.5) ? -v : v;
        fy = (Math.random() > 0.5) ? -v : v;
    }
    c[0] = this.ivXMag * fx;
    c[1] = this.ivYMag * fy;
    return c;
};

ShakePosition.prototype._nextDampedHarmonic = function () {
    // computes (Cycles) * cos(  Omega * t )
    var frac = this.ivNumCyclesLeft / this.ivCycles;
    return frac * frac * Math.cos((1 - frac) * this.ivOmega);
};
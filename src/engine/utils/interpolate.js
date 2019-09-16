"use strict";

// value: target for interpolation
// cycles: integer, how many cycle it should take for a value to change to final
// rate: the rate at which the value should change at each cycle
function Interpolate(value, cycles, rate) {
    this.ivCurrentValue = value;    // begin value of interpolation
    this.ivFinalValue = value;      // final value of interpolation
    this.ivCycles = cycles;
    this.ivRate = rate;

    // if there is a new value to interpolate to, number of cycles left for interpolation
    this.ivCyclesLeft = 0;
}

Interpolate.prototype.getValue = function () { return this.ivCurrentValue; };
Interpolate.prototype.setFinalValue = function (v) {
    this.ivFinalValue = v;
    this.ivCyclesLeft = this.ivCycles;     // will trigger interpolation
};

Interpolate.prototype.updateInterpolation = function () {
    if (this.ivCyclesLeft <= 0) {
        return;
    }

    this.ivCyclesLeft--;
    if (this.ivCyclesLeft === 0) {
        this.ivCurrentValue = this.ivFinalValue;
    } else {
        this._interpolateValue();
    }
};

// stiffness of 1 switches off interpolation
Interpolate.prototype.configInterpolation = function (stiffness, duration) {
    this.ivRate = stiffness;
    this.ivCycles = duration;
};

// subclass should override this function for non-scalar values
Interpolate.prototype._interpolateValue = function () {
    this.ivCurrentValue = this.ivCurrentValue + this.ivRate * (this.ivFinalValue - this.ivCurrentValue);
};
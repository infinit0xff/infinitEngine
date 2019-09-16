"use strict";

// vec2 interpolation support
function InterpolateVec2(value, cycle, rate) {
    Interpolate.call(this, value, cycle, rate);
}
infinitEngine.Core.inheritPrototype(InterpolateVec2, Interpolate);

InterpolateVec2.prototype._interpolateValue = function () {
    vec2.lerp(this.ivCurrentValue, this.ivCurrentValue, this.ivFinalValue, this.ivRate);
};
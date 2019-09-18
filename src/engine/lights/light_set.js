"use strict";

function LightSet() {
    this.ivSet = [];
}

LightSet.prototype.numLights = function () { return this.ivSet.length; };

LightSet.prototype.getLightAt = function (index) {
    return this.ivSet[index];
};

LightSet.prototype.addToSet = function (light) {
    this.ivSet.push(light);
};
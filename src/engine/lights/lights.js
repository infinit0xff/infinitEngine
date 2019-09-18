"use strict";

// constructor
function Light() {
    this.ivColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
    this.ivPosition = vec3.fromValues(0, 0, 5); // light position in WC
    this.ivNear = 5;  // effective distance in WC
    this.ivFar = 10;  // within near is full on, outside far is off
    this.ivIntensity = 1;
    this.ivIsOn = true;
}

// simple setters and getters
Light.prototype.setColor = function (c) { this.ivColor = vec4.clone(c); };
Light.prototype.getColor = function () { return this.ivColor; };

Light.prototype.set2DPosition = function (p) { this.ivPosition = vec3.fromValues(p[0], p[1], this.ivPosition[2]); };
Light.prototype.setXPos = function (x) { this.ivPosition[0] = x; };
Light.prototype.setYPos = function (y) { this.ivPosition[1] = y; };
Light.prototype.setZPos = function (z) { this.ivPosition[2] = z; };
Light.prototype.getPosition = function () { return this.ivPosition; };

Light.prototype.setNear = function (r) { this.ivNear = r; };
Light.prototype.getNear = function () { return this.ivNear; };

Light.prototype.setFar = function (r) { this.ivFar = r; };
Light.prototype.getFar = function () { return this.ivFar; };

Light.prototype.setIntensity = function (i) { this.ivIntensity = i; };
Light.prototype.getIntensity = function () { return this.ivIntensity; };
Light.prototype.setLightTo = function (isOn) { this.ivIsOn = isOn; };
Light.prototype.isLightOn = function () { return this.ivIsOn; };
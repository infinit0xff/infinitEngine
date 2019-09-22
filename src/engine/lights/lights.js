"use strict";

Light.eLightType = Object.freeze({
    ePointLight: 0,
    eDirectionalLight: 1,
    eSpotLight: 2
});

function Light() {
    this.ivColor = vec4.fromValues(1, 1, 1, 1);  // light color
    this.ivPosition = vec3.fromValues(0, 0, 5); // light position in WC
    this.ivDirection = vec3.fromValues(0, 0, -1); // in WC
    this.ivNear = 5;  // effective radius in WC
    this.ivFar = 10;
    this.ivInner = 0.1;  // in radian
    this.ivOuter = 0.3;
    this.ivIntensity = 1;
    this.ivDropOff = 1;  // 
    this.ivLightType = Light.eLightType.ePointLight;
    this.ivIsOn = true;
    this.ivCastShadow = false;
}

// simple setters and getters
Light.prototype.setColor = function (c) { this.ivColor = vec4.clone(c); };
Light.prototype.getColor = function () { return this.ivColor; };

Light.prototype.set2DPosition = function (p) { this.ivPosition = vec3.fromValues(p[0], p[1], this.ivPosition[2]); };
Light.prototype.setXPos = function (x) { this.ivPosition[0] = x; };
Light.prototype.setYPos = function (y) { this.ivPosition[1] = y; };
Light.prototype.setZPos = function (z) { this.ivPosition[2] = z; };
Light.prototype.getPosition = function () { return this.ivPosition; };

Light.prototype.setDirection = function (d) { this.ivDirection = vec3.clone(d); };
Light.prototype.getDirection = function () { return this.ivDirection; };

Light.prototype.setNear = function (r) { this.ivNear = r; };
Light.prototype.getNear = function () { return this.ivNear; };

Light.prototype.setFar = function (r) { this.ivFar = r; };
Light.prototype.getFar = function () { return this.ivFar; };

Light.prototype.setInner = function (r) { this.ivInner = r; };
Light.prototype.getInner = function () { return this.ivInner; };

Light.prototype.setOuter = function (r) { this.ivOuter = r; };
Light.prototype.getOuter = function () { return this.ivOuter; };

Light.prototype.setIntensity = function (i) { this.ivIntensity = i; };
Light.prototype.getIntensity = function () { return this.ivIntensity; };

Light.prototype.setDropOff = function (d) { this.ivDropOff = d; };
Light.prototype.getDropOff = function () { return this.ivDropOff; };

Light.prototype.setLightType = function (t) { this.ivLightType = t; };
Light.prototype.getLightType = function () { return this.ivLightType; };

Light.prototype.isLightOn = function () { return this.ivIsOn; };
Light.prototype.setLightTo = function (isOn) { this.ivIsOn = isOn; };

Light.prototype.isLightCastShadow = function () { return this.ivCastShadow; };
Light.prototype.setLightCastShadowTo = function (on) { this.ivCastShadow = on; };

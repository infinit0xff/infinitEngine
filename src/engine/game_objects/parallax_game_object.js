"use strict";

// represent a GameObject located at some distance D away, thus 
// resulting in slower movements 
// Passed in scale: 
// ==1: means same as actors
// > 1: farther away, slows down inversely (scale==2 slows down twice)
// < 1: closer, speeds up inversely (scale==0.5 speeds up twice)

function ParallaxGameObject(renderableObj, scale, aCamera) {
    this.ivRefCamera = aCamera;
    this.ivCameraWCCenterRef = vec2.clone(this.ivRefCamera.getWCCenter());
    this.ivParallaxScale = 1;
    this.setParallaxScale(scale);
    TiledGameObject.call(this, renderableObj);
}
infinitEngine.Core.inheritPrototype(ParallaxGameObject, TiledGameObject);

// renderableObj xfrom is accessible, it is in WC space!!
// GameObject parameters: speed and direction are all in WC space

ParallaxGameObject.prototype.update = function () {
    // simple default behavior
    this._refPosUpdate(); // check to see if the camera has moved
    var pos = this.getXform().getPosition();  // our own xform
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.ivParallaxScale);
};

ParallaxGameObject.prototype._refPosUpdate = function () {
    // now check for reference movement
    var deltaT = vec2.fromValues(0, 0);
    vec2.sub(deltaT, this.ivCameraWCCenterRef, this.ivRefCamera.getWCCenter());
    this.setWCTranslationBy(deltaT);
    vec2.sub(this.ivCameraWCCenterRef, this.ivCameraWCCenterRef, deltaT); // update WC center ref position
};

ParallaxGameObject.prototype.setWCTranslationBy = function (delta) {
    var f = (1-this.ivParallaxScale);
    this.getXform().incXPosBy(-delta[0] * f);
    this.getXform().incYPosBy(-delta[1] * f);
};

ParallaxGameObject.prototype.getParallaxScale = function () {
    return this.ivParallaxScale;
};

ParallaxGameObject.prototype.setParallaxScale = function(s) {
    if (s <= 0) {
        this.ivParallaxScale = 1;
    } else {
        this.ivParallaxScale = 1/s;
    }
};
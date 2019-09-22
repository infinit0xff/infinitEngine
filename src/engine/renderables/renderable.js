"use strict";

function Renderable() {
    // shader for this object
    this.ivShader = infinitEngine.DefaultResources.getConstColorShader();
    this.ivXform = new Transform();

    // fragment shader color
    this.ivColor = [1, 1, 1, 1];
}

Renderable.prototype.draw = function(aCamera) {
    // get webgl context 
    var gl = infinitEngine.Core.getGL();

    //activate shader first
    this.ivShader.activateShader(this.ivColor, aCamera);
    this.ivShader.loadObjectTransform(this.ivXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// getter setter for color instance var
Renderable.prototype.getXform = function() { return this.ivXform; }
Renderable.prototype.setColor = function(color) { this.ivColor = color; };
Renderable.prototype.getColor = function() { return this.ivColor; };
Renderable.prototype.swapShader = function (s) {
    var out = this.ivShader;
    this.ivShader = s;
    return out;
};

Renderable.prototype._setShader = function (s) { this.ivShader = s; };
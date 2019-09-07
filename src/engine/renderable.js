"use strict";

function Renderable(shader) {
    // shader for this object
    this.ivShader = shader;
    this.ivXform = new Transform();

    // fragment shader color
    this.ivColor = [1, 1, 1, 1];
}
Renderable.prototype.getXform = function() { return this.ivXform; }

Renderable.prototype.draw = function(vpMatrix) {
    // get webgl context 
    var gl = infinitEngine.Core.getGL();

    //activate shader first
    this.ivShader.activateShader(this.ivColor, vpMatrix);
    this.ivShader.loadObjectTransform(this.ivXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// getter setter for color instance var
Renderable.prototype.setColor = function(color) { this.ivColor= color; };
Renderable.prototype.getColor = function() { return this.ivColor; };

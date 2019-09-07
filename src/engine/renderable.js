"use strict";

function Renderable(shader) {
    // shader for this object
    this.ivShader = shader;
    this.ivXform = new Transform();

    // fragment shader color
    this.ivColor = [1, 1, 1, 1];
}
Renderable.prototype.getXform = function() { return this.ivXform; }

Renderable.prototype.draw = function() {
    var gl = infinitEngine.Core.getGL();
    this.ivShader.activateShader(this.ivColor);
    // this.ivShader.loadObjectTransform(modelTranform);
    this.ivShader.loadObjectTransform(this.ivXform.getXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// getter setter for color instance var
Renderable.prototype.setColor = function(color) { this.ivColor= color; };
Renderable.prototype.getColor = function() { return this.ivColor; };

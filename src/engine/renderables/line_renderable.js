"use strict";

// p1, p2: either both there, or none
function LineRenderable(x1, y1, x2, y2) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [0, 0, 0, 1]);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getLineShader());

    this.ivPointSize = 1;
    this.ivDrawVertices = false;
    this.ivShowLine = true;

    this.ivP1 = vec2.fromValues(0, 0);
    this.ivP2 = vec2.fromValues(0, 0);

    if (x1 !== "undefined") {
        this.setVertices(x1, y1, x2, y2);
    }
}
infinitEngine.Core.inheritPrototype(LineRenderable, Renderable);

LineRenderable.prototype.draw = function (aCamera) {
    this.ivShader.setPointSize(this.ivPointSize);
    // draw line instead of triangle!
    var gl = infinitEngine.Core.getGL();
    this.ivShader.activateShader(this.ivColor, aCamera);  // always activate the shader first!

    var sx = this.ivP1[0] - this.ivP2[0];
    var sy = this.ivP1[1] - this.ivP2[1];
    var cx = this.ivP1[0] - sx / 2;
    var cy = this.ivP1[1] - sy / 2;
    var xf = this.getXform();
    xf.setSize(sx, sy);
    xf.setPosition(cx, cy);

    this.ivShader.loadObjectTransform(this.ivXform.getXform());
    if (this.ivShowLine) {
        gl.drawArrays(gl.LINE_STRIP, 0, 2);
    }
    if (!this.ivShowLine || this.ivDrawVertices) {
        gl.drawArrays(gl.POINTS, 0, 2);
    }
};

LineRenderable.prototype.setDrawVertices = function (s) { this.ivDrawVertices = s; };
LineRenderable.prototype.setShowLine = function (s) { this.ivShowLine = s; };
LineRenderable.prototype.setPointSize = function (s) { this.ivPointSize = s; };

LineRenderable.prototype.setVertices = function (x1, y1, x2, y2) {
    this.setFirstVertex(x1, y1);
    this.setSecondVertex(x2, y2);
};

LineRenderable.prototype.setFirstVertex = function (x, y) {
    this.ivP1[0] = x;
    this.ivP1[1] = y;
};

LineRenderable.prototype.setSecondVertex = function (x, y) {
    this.ivP2[0] = x;
    this.ivP2[1] = y;
};
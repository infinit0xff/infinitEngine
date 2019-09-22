"use strict";

function RigidCircle(xform, r) {
    RigidShape.call(this, xform);
    this.kNumSides = 16;
    this.ivSides = new LineRenderable();
    this.ivRadius = r;
}
infinitEngine.Core.inheritPrototype(RigidCircle, RigidShape);

RigidCircle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidCircle;
};
RigidCircle.prototype.getRadius = function () {
    return this.ivRadius;
};

RigidCircle.prototype.draw = function (aCamera) {
    if (!this.ivDrawBounds) {
        return;
    }
    RigidShape.prototype.draw.call(this, aCamera);
    
    // kNumSides forms the circle.
    var pos = this.getPosition();
    var prevPoint = vec2.clone(pos);
    var deltaTheta = (Math.PI * 2.0) / this.kNumSides;
    var theta = deltaTheta;
    prevPoint[0] += this.ivRadius;
    var i, x, y;
    for (i = 1; i <= this.kNumSides; i++) {
        x = pos[0] + this.ivRadius * Math.cos(theta);
        y = pos[1] +  this.ivRadius * Math.sin(theta);
        
        this.ivSides.setFirstVertex(prevPoint[0], prevPoint[1]);
        this.ivSides.setSecondVertex(x, y);
        this.ivSides.draw(aCamera);
        
        theta = theta + deltaTheta;
        prevPoint[0] = x;
        prevPoint[1] = y;
    }
};

RigidCircle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.ivSides.setColor(color);
};
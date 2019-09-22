"use strict";

function RigidRectangle(xform, w, h) {
    RigidShape.call(this, xform);
    this.ivSides = new LineRenderable();
    
    this.ivWidth = w;
    this.ivHeight = h;
}
infinitEngine.Core.inheritPrototype(RigidRectangle, RigidShape);

RigidRectangle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidRectangle;
};

RigidRectangle.prototype.draw = function (aCamera) {
    if (!this.ivDrawBounds) {
        return;
    }
    RigidShape.prototype.draw.call(this, aCamera);
    var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    var w = this.ivWidth/2;
    var h = this.ivHeight/2;
    
    this.ivSides.setFirstVertex(x - w, y + h);  //TOP LEFT
    this.ivSides.setSecondVertex(x + w, y + h); //TOP RIGHT
    this.ivSides.draw(aCamera);
    this.ivSides.setFirstVertex(x + w, y - h); //BOTTOM RIGHT
    this.ivSides.draw(aCamera);
    this.ivSides.setSecondVertex(x - w, y - h); //BOTTOM LEFT
    this.ivSides.draw(aCamera);
    this.ivSides.setFirstVertex(x - w, y + h); //TOP LEFT
    this.ivSides.draw(aCamera);
};

RigidRectangle.prototype.getWidth = function () { return this.ivWidth; };
RigidRectangle.prototype.getHeight = function () { return this.ivHeight; };
RigidRectangle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.ivSides.setColor(color);
};
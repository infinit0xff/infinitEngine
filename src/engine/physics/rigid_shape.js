"use strict";

RigidShape.eRigidType = Object.freeze({
    eRigidAbstract: 0,
    eRigidCircle: 1,
    eRigidRectangle: 2
});

function RigidShape(xform) {
    this.ivXform = xform; // this is typically from gameObject
    this.kPadding = 0.25; // size of the position mark
    
    this.ivPositionMark = new LineRenderable();
    
    this.ivDrawBounds = false;
}

RigidShape.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidAbstract;
};

RigidShape.prototype.draw = function (aCamera) {
    if (!this.ivDrawBounds) {
        return;
    }
    
    // calculation for the X at the center of the shape
    var x = this.ivXform.getXPos();
    var y = this.ivXform.getYPos();
    
    this.ivPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.ivPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
    this.ivPositionMark.draw(aCamera);
    
    this.ivPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
    this.ivPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT   
    this.ivPositionMark.draw(aCamera);
};

RigidShape.prototype.update = function () {};

RigidShape.prototype.getPosition = function() { 
    return this.ivXform.getPosition(); 
};
RigidShape.prototype.setPosition = function(x, y ) { 
    this.ivXform.setPosition(x, y); 
};
RigidShape.prototype.getXform = function () { return this.ivXform; };
RigidShape.prototype.setXform = function (xform) { this.ivXform = xform; };
RigidShape.prototype.setColor = function (color) {
    this.ivPositionMark.setColor(color);
};
RigidShape.prototype.getColor = function () { return this.ivPositionMark1.getColor(); };
RigidShape.prototype.setDrawBounds = function(d) { this.ivDrawBounds = d; };
RigidShape.prototype.getDrawBounds = function() { return this.ivDrawBounds; };
"use strict";

function Transform() {
    // translation
    this.ivPosition = vec2.fromValues(0, 0);
    // width (x) and height (y)
    this.ivScale = vec2.fromValues(1, 1);
     // radian
    this.ivRotationInRad = 0.0;
}

//**
//  Public Methods
//** 

// setters and getters
Transform.prototype.setPosition = function (xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
Transform.prototype.getPosition = function () { return this.ivPosition; };
Transform.prototype.setXPos = function (xPos) { this.ivPosition[0] = xPos; };
Transform.prototype.getXPos = function () { return this.ivPosition[0]; };
Transform.prototype.setYPos = function (yPos) { this.ivPosition[1] = yPos; };
Transform.prototype.getYPos = function () { return this.ivPosition[1]; };
Transform.prototype.incXPosBy = function (delta) { this.ivPosition[0] += delta; };
Transform.prototype.incYPosBy = function (delta) { this.ivPosition[1] += delta; };

// setter and getter for size
Transform.prototype.setSize = function (width, height) {
    this.setWidth(width);
    this.setHeight(height);
};
Transform.prototype.getSize = function () { return this.ivScale; };
Transform.prototype.incSizeBy = function (delta) {
    this.incWidthBy(delta);
    this.incHeightBy(delta);
};
Transform.prototype.getWidth = function () { return this.ivScale[0]; };
Transform.prototype.setWidth = function (width) { this.ivScale[0] = width; };
Transform.prototype.incWidthBy = function (delta) { this.ivScale[0] += delta; };
Transform.prototype.getHeight = function () { return this.ivScale[1]; };
Transform.prototype.setHeight = function (height) { this.ivScale[1] = height; };
Transform.prototype.incHeightBy = function (delta) { this.ivScale[1] += delta; };

// rotation setters and getters
Transform.prototype.setRotationInRad = function (rotationInRadians) {
    this.ivRotationInRad = rotationInRadians;
    while (this.ivRotationInRad > (2 * Math.PI)) {
        this.ivRotationInRad -= (2 * Math.PI);
    }
};
Transform.prototype.setRotationInDegree = function (rotationInDegree) {
    this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
};
Transform.prototype.incRotationByDegree = function (deltaDegree) {
    this.incRotationByRad(deltaDegree * Math.PI / 180.0);
};
Transform.prototype.incRotationByRad = function (deltaRad) {
    this.setRotationInRad(this.ivRotationInRad + deltaRad);
};
Transform.prototype.getRotationInRad = function () {  return this.ivRotationInRad; };
Transform.prototype.getRotationInDegree = function () { return this.ivRotationInRad * 180.0 / Math.PI; };

// returns matrix from defined, concatenated transformations
Transform.prototype.getXform = function () {
    
    // creates an empty identity matrix
    var matrix = mat4.create();

    // Remember - WebGL uses matrices that are transposed, so typical matrix
    // operations must be in reverse.

    // compute translation, z is always at 0.0 for now
    mat4.translate(matrix, matrix, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
    // concatenate with rotation.
    mat4.rotateZ(matrix, matrix, this.getRotationInRad());
    // concatenate with scaling
    mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

    return matrix;
};
"use strict"; 

function CollisionInfo() {
    this.ivDepth = 0;
    this.ivNormal = vec2.fromValues(0, 0);
}

CollisionInfo.prototype.setDepth = function (s) { this.ivDepth = s; };
CollisionInfo.prototype.setNormal = function (s) { this.ivNormal = s; };

CollisionInfo.prototype.getDepth = function () { return this.ivDepth; };
CollisionInfo.prototype.getNormal = function () { return this.ivNormal; };
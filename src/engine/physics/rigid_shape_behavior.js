"use strict";

RigidShape.prototype.update = function () {
    var dt = infinitEngine.GameLoop.getUpdateIntervalInSeconds();
    
    // symplectic euler
    //    v += (1/m * F) * dt
    //    x += v * dt
    var v = this.getVelocity();
    vec2.scaleAndAdd(v, v, this.ivAcceleration, (this.getInvMass() * dt ));
    
    var pos = this.getPosition();
    vec2.scaleAndAdd(pos, pos, v, dt);
};
RigidShape.prototype.getInvMass = function () { return this.ivInvMass; };
RigidShape.prototype.setMass = function (m) {
    if(m > 0) {
        this.ivInvMass = 1/m;
    } else {
        this.ivInvMass = 0;
    }
};
RigidShape.prototype.getVelocity = function () { return this.ivVelocity; };
RigidShape.prototype.setVelocity = function (v) { this.ivVelocity = v; };
RigidShape.prototype.getRestitution = function () { return this.ivRestitution; };
RigidShape.prototype.setRestitution = function (r) { this.ivRestitution = r; };
RigidShape.prototype.getFriction = function () { return this.ivFriction; };
RigidShape.prototype.setFriction = function (f) { this.ivFriction = f; };
RigidShape.prototype.getAcceleration = function () { return this.ivAcceleration; };
RigidShape.prototype.setAcceleration = function (g) { this.ivAcceleration = g; };
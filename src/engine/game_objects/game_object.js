"use strict";

function GameObject(renderableObj) {
    this.ivRenderComponent = renderableObj;
    this.ivVisible = true;
    this.ivCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
    this.ivSpeed = 0;
    this.ivPhysicsComponent = null;
}

GameObject.prototype.getXform = function () { return this.ivRenderComponent.getXform(); };
GameObject.prototype.getBBox = function () {
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};

GameObject.prototype.setVisibility = function (f) { this.ivVisible = f; };
GameObject.prototype.isVisible = function () { return this.ivVisible; };

GameObject.prototype.setSpeed = function (s) { this.ivSpeed = s; };
GameObject.prototype.getSpeed = function () { return this.ivSpeed; };
GameObject.prototype.incSpeedBy = function (delta) { this.ivSpeed += delta; };

GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.ivCurrentFrontDir, f); };
GameObject.prototype.getCurrentFrontDir = function () { return this.ivCurrentFrontDir; };

GameObject.prototype.getRenderable = function () { return this.ivRenderComponent; };

GameObject.prototype.setPhysicsComponent = function (p) { this.ivPhysicsComponent = p; };
GameObject.prototype.getPhysicsComponent = function () { return this.ivPhysicsComponent; };

// orientate the entire object to point towards point p
// will rotate Xform() accordingly
GameObject.prototype.rotateObjPointTo = function (p, rate) {
    // determine if reach the destination position p
    var dir = [];
    vec2.sub(dir, p, this.getXform().getPosition());
    var len = vec2.length(dir);
    if (len < Number.MIN_VALUE) {
        return; // we are there.
    }
    vec2.scale(dir, dir, 1 / len);

    // compute the angle to rotate
    var fdir = this.getCurrentFrontDir();
    var cosTheta = vec2.dot(dir, fdir);

    if (cosTheta > 0.999999) { // almost exactly the same direction
        return;
    }

    // clamp the cosTheda to -1 to 1 
    // in a perfect world, this would never happen! BUT ...
    if (cosTheta > 1) {
        cosTheta = 1;
    } else {
        if (cosTheta < -1) {
            cosTheta = -1;
        }
    }

    // compute whether to rotate clockwise, or counterclockwise
    var dir3d = vec3.fromValues(dir[0], dir[1], 0);
    var f3d = vec3.fromValues(fdir[0], fdir[1], 0);
    var r3d = [];
    vec3.cross(r3d, f3d, dir3d);

    var rad = Math.acos(cosTheta);  // radian to roate
    if (r3d[2] < 0) {
        rad = -rad;
    }

    // rotate the facing direction with the angle and rate
    rad *= rate;  // actual angle need to rotate from Obj's front
    vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
    this.getXform().incRotationByRad(rad);
};

GameObject.prototype.update = function () {
    // simple default behavior
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    
    if (this.ivPhysicsComponent !== null) {
        this.ivPhysicsComponent.update();
    }
};

GameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        this.ivRenderComponent.draw(aCamera);
    }
    if (this.ivPhysicsComponent !== null) {
        this.ivPhysicsComponent.draw(aCamera);
    }
};


"use strict";

function Particle(pos) {
    this.kPadding = 0.5;   // for drawing particle bounds
    
    this.ivPosition = pos;  // this is likely to be a reference to xform.ivPosition
    this.ivVelocity = vec2.fromValues(0, 0);
    this.ivAcceleration = infinitEngine.Particle.getSystemtAcceleration();
    this.ivDrag = 0.95; 
    
    this.ivPositionMark = new LineRenderable();
    this.ivDrawBounds = false;
}

Particle.prototype.draw = function (aCamera) {
    if (!this.ivDrawBounds) {
        return;
    }
    
    // calculation for the X at the particle position
    var x = this.ivPosition[0];
    var y = this.ivPosition[1];

    this.ivPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.ivPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
    this.ivPositionMark.draw(aCamera);

    this.ivPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
    this.ivPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
    this.ivPositionMark.draw(aCamera);
};

Particle.prototype.update = function () {
    var dt = infinitEngine.GameLoop.getUpdateIntervalInSeconds();
    
    // symplectic euler
    //    v += a * dt
    //    x += v * dt
    var p = this.getPosition();
    vec2.scaleAndAdd(this.ivVelocity, this.ivVelocity, this.ivAcceleration, dt);
    vec2.scale(this.ivVelocity, this.ivVelocity, this.ivDrag);
    vec2.scaleAndAdd(p, p, this.ivVelocity, dt);
};

Particle.prototype.setColor = function (color) {
    this.ivPositionMark.setColor(color);
};
Particle.prototype.getColor = function () { return this.ivPositionMark1.getColor(); };
Particle.prototype.setDrawBounds = function(d) { this.ivDrawBounds = d; };
Particle.prototype.getDrawBounds = function() { return this.ivDrawBounds; };

Particle.prototype.setPosition = function (xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
Particle.prototype.getPosition = function () { return this.ivPosition; };
Particle.prototype.getXPos = function () { return this.ivPosition[0]; };
Particle.prototype.setXPos = function (xPos) { this.ivPosition[0] = xPos; };
Particle.prototype.getYPos = function () { return this.ivPosition[1]; };
Particle.prototype.setYPos = function (yPos) { this.ivPosition[1] = yPos; };
Particle.prototype.setVelocity = function (f) { this.ivVelocity = f; };
Particle.prototype.getVelocity = function () { return this.ivVelocity; };
Particle.prototype.setAcceleration = function (g) { this.ivAcceleration = g; };
Particle.prototype.getAcceleration = function () { return this.ivAcceleration; };
Particle.prototype.setDrag = function (d) { this.ivDrag = d; };
Particle.prototype.getDrag = function () { return this.ivDrag; };

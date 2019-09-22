"use strict";

function DyePack(texture, atX, atY) {
    this.ivCycleLeft = 300;

    this.ivDyePack = new TextureRenderable(texture);

    this.ivDyePack.setColor([1, 1, 1, 0]);
    this.ivDyePack.getXform().setPosition(atX, atY);
    this.ivDyePack.getXform().setSize(4, 3);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivDyePack);
    this.setSpeed(0.5);
    this.setCurrentFrontDir([1, 0]);

    var rigidShape = new RigidCircle(this.getXform(), 1.5);
    rigidShape.setMass(0.1);
    rigidShape.setAcceleration([0, 0]);
    rigidShape.setDrawBounds(true);
    this.setPhysicsComponent(rigidShape);
}
infinitEngine.Core.inheritPrototype(DyePack, GameObject);


DyePack.prototype.update = function () {
    GameObject.prototype.update.call(this);
    // remember to update this.mMinion's animation
    this.ivCycleLeft--;
};

DyePack.prototype.hasExpired = function() { return this.ivCycleLeft <= 0; };
"use strict";

function Platform(texture, atX, atY) {
    this.ivPlatform = new TextureRenderable(texture);

    this.ivPlatform.setColor([1, 1, 1, 0]);
    this.ivPlatform.getXform().setPosition(atX, atY);
    this.ivPlatform.getXform().setSize(30, 3.75);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivPlatform);

    var rigidShape = new RigidRectangle(this.getXform(), 30, 3);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([1, 0.2, 0.2, 1]);
    this.setPhysicsComponent(rigidShape);
}
infinitEngine.Core.inheritPrototype(Platform, GameObject);
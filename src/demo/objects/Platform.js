"use strict";

function Platform(texture, atX, atY) {
    this.ivPlatform = new TextureRenderable(texture);

    this.ivPlatform.setColor([1, 1, 1, 0]);
    this.ivPlatform.getXform().setPosition(atX, atY);
    this.ivPlatform.getXform().setSize(30, 3.75);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivPlatform);

    var rigidShape = new RigidRectangle(this.getXform(), 25, 5);
    rigidShape.setDrawBounds(true);
    this.setPhysicsComponent(rigidShape);
}
infinitEngine.Core.inheritPrototype(Platform, GameObject);
"use strict";

function Wall(texture, atX, atY) {
    this.ivWall = new TextureRenderable(texture);

    this.ivWall.setColor([1, 1, 1, 0]);
    this.ivWall.getXform().setPosition(atX, atY);
    this.ivWall.getXform().setSize(4, 16);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivWall);

    var rigidShape = new RigidRectangle(this.getXform(), 2, 16);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([1, 1, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}
infinitEngine.Core.inheritPrototype(Wall, GameObject);
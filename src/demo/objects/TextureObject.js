"use strict";

function TextureObject(texture, x, y, w, h) {
    this.kDelta = 0.2;
    this.kRDelta = 0.1; // radian

    this.ivRenderable = new TextureRenderable(texture);
    this.ivRenderable.setColor([1, 1, 1, 0.1]);
    this.ivRenderable.getXform().setPosition(x, y);
    this.ivRenderable.getXform().setSize(w, h);
    GameObject.call(this, this.ivRenderable);
}
infinitEngine.Core.inheritPrototype(TextureObject, GameObject);

TextureObject.prototype.update = function (up, down, left, right, rot) {
    var xform = this.getXform();
    if (infinitEngine.Input.isKeyPressed(up)) {
        xform.incYPosBy(this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(down)) {
        xform.incYPosBy(-this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(left)) {
        xform.incXPosBy(-this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(right)) {
        xform.incXPosBy(this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(rot)) {
        xform.incRotationByRad(this.kRDelta);
    }
};
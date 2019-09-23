"use strict";

function Hero(spriteTexture, normalMap, atX, atY) {
    this.kDelta = 0.3;
    if (normalMap !== null) {
        this.ivDye = new IllumRenderable(spriteTexture, normalMap);
    } else {
        this.ivDye = new LightRenderable(spriteTexture);
    }
    this.ivDye.setColor([1, 1, 1, 0]);
    this.ivDye.getXform().setPosition(atX, atY);
    this.ivDye.getXform().setZPos(5);
    this.ivDye.getXform().setSize(9, 12);
    this.ivDye.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.ivDye);
}
infinitEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    // control by WASD
    var xform = this.getXform();
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.W)) {
        xform.incYPosBy(this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.S)) {
        xform.incYPosBy(-this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.A)) {
        xform.incXPosBy(-this.kDelta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.D)) {
        xform.incXPosBy(this.kDelta);
    }
};
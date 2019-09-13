"use strict";

function Brain(spriteTexture) {
    this.kDeltaDegree = 1;
    this.kDeltaRad = Math.PI * this.kDeltaDegree / 180;
    this.kDeltaSpeed = 0.01;
    this.ivBrain = new SpriteRenderable(spriteTexture);
    this.ivBrain.setColor([1, 1, 1, 0]);
    this.ivBrain.getXform().setPosition(50, 10);
    this.ivBrain.getXform().setSize(3, 5.4);
    this.ivBrain.setElementPixelPositions(600, 700, 0, 180);

    GameObject.call(this, this.ivBrain);

    this.setSpeed(0.05);
}
infinitEngine.Core.inheritPrototype(Brain, GameObject);

Brain.prototype.update = function () {
    GameObject.prototype.update.call(this);  // default moving forward

    var xf = this.getXform();
    var fdir = this.getCurrentFrontDir();
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        xf.incRotationByDegree(this.kDeltaDegree);
        vec2.rotate(fdir, fdir, this.kDeltaRad);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        xf.incRotationByRad(-this.kDeltaRad);
        vec2.rotate(fdir, fdir, -this.kDeltaRad);
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Up)) {
        this.incSpeedBy(this.kDeltaSpeed);
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Down)) {
        this.incSpeedBy(-this.kDeltaSpeed);
    }
};
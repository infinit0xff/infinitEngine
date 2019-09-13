"use strict";

function DyePack(spriteTexture) {
    this.kRefWidth = 80;
    this.kRefHeight = 130;

    this.ivDyePack = new SpriteRenderable(spriteTexture);
    this.ivDyePack.setColor([1, 1, 1, 0.1]);
    this.ivDyePack.getXform().setPosition(50, 33);
    this.ivDyePack.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
    this.ivDyePack.setElementPixelPositions(510, 595, 23, 153);
    GameObject.call(this, this.ivDyePack);
}
infinitEngine.Core.inheritPrototype(DyePack, GameObject);
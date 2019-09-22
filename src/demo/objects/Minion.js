"use strict";

function Minion(spriteTexture, normalMap, atX, atY) {
    this.kDelta = 0.2;

    if (normalMap === null) {
        this.ivMinion = new LightRenderable(spriteTexture);
    } else {
        this.ivMinion = new IllumRenderable(spriteTexture, normalMap);
    }

    this.ivMinion.setColor([1, 1, 1, 0]);
    this.ivMinion.getXform().setPosition(atX, atY);
    this.ivMinion.getXform().setSize(18, 14.4);
    this.ivMinion.getXform().setZPos(2);
    this.ivMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                   204, 164,    // widthxheight in pixels
                                   5,           // number of elements in this sequence
                                   0);          // horizontal padding in between
    this.ivMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.ivMinion.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivMinion);
}
infinitEngine.Core.inheritPrototype(Minion, GameObject);

Minion.prototype.update = function () {
    // remember to update this.ivMinion's animation
    this.ivMinion.updateAnimation();
};
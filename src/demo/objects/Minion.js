"use strict";

function Minion(spriteTexture, atX, atY) {
    this.kDelta = 0.2;
    this.ivMinion = new SpriteAnimateRenderable(spriteTexture);

    this.ivMinion.setColor([1, 1, 1, 0]);
    this.ivMinion.getXform().setPosition(atX, atY);
    this.ivMinion.getXform().setSize(18, 14.4);
    // this.ivMinion.getXform().setZPos(2);
    this.ivMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                   204, 164,    // widthxheight in pixels
                                   5,           // number of elements in this sequence
                                   0);          // horizontal padding in between
    this.ivMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.ivMinion.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivMinion);
    
    var r;
    if (Math.random() > 0.5) {
        r = new RigidCircle(this.getXform(), 7);
    } else {
        r = new RigidRectangle(this.getXform(), 17, 14);
    }
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(true);
    this.setPhysicsComponent(r);
}
infinitEngine.Core.inheritPrototype(Minion, GameObject);

Minion.prototype.update = function () {
    // remember to update this.ivMinion's animation
    this.ivMinion.updateAnimation();
};
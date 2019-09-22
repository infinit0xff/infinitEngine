"use strict";

function Minion(spriteTexture, atX, atY) {
    this.kSpeed = 5;
    this.ivMinion = new SpriteAnimateRenderable(spriteTexture);

    this.ivMinion.setColor([1, 1, 1, 0]);
    this.ivMinion.getXform().setPosition(atX, atY);
    this.ivMinion.getXform().setSize(18, 14.4);
    this.ivMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                   204, 164,    // widthxheight in pixels
                                   5,           // number of elements in this sequence
                                   0);          // horizontal padding in between
    this.ivMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.ivMinion.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.ivMinion);

    var r = new RigidCircle(this.getXform(), 6.5);
    r.setMass(2);
    r.setAcceleration([0, 0]);
    r.setFriction(0);
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(true);
    if (Math.random() > 0.5) {
        r.setVelocity([this.kSpeed, 0]);
    } else {
        r.setVelocity([-this.kSpeed, 0]);
    }
    this.setPhysicsComponent(r);

    this.ivHasCollision = false;
}
infinitEngine.Core.inheritPrototype(Minion, GameObject);

Minion.prototype.update = function () {
    GameObject.prototype.update.call(this);
    // remember to update this.ivMinion's animation
    this.ivMinion.updateAnimation();
    
    if (this.ivHasCollision) {
        this.flipVelocity();
        this.ivHasCollision = false;
    }
};

Minion.prototype.flipVelocity = function () {
    var v = this.getPhysicsComponent().getVelocity();
    vec2.scale(v, v, -1);
};

Minion.prototype.hasCollision = function () {
    this.ivHasCollision = true;
};

"use strict";

function SpriteAnimateRenderable(myTexture) {
    SpriteRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getSpriteShader());

    // all coordinates are in texture coordinate (UV between 0 to 1)

    // information on the sprite element
    this.ivFirstElmLeft = 0.0; // 0.0 is left corner of image
    this.ivElmTop = 1.0;  // 1.0 is top corner of image
    this.ivElmWidth = 1.0;     // default sprite element size is the entire image
    this.ivElmHeight = 1.0;
    this.ivWidthPadding = 0.0;
    this.ivNumElems = 1;   // number of elements in an animation

    // per animation settings
    // how often to advance
    this.ivUpdateInterval = 1;
    this.ivAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;

    this.ivCurrentAnimAdvance = -1;
    this.ivCurrentElm = 0;
    this._initAnimation();
}
infinitEngine.Core.inheritPrototype(SpriteAnimateRenderable, SpriteRenderable);

SpriteAnimateRenderable.prototype._initAnimation = function () {
    // currently running animation
    this.ivCurrentTick = 0;
    switch (this.ivAnimationType) {
    case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
        this.ivCurrentElm = 0;
        this.ivCurrentAnimAdvance = 1; // either 1 or -1
        break;
    case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
        this.ivCurrentAnimAdvance = -1 * this.ivCurrentAnimAdvance; // swings ... 
        this.ivCurrentElm += 2 * this.ivCurrentAnimAdvance;
        break;
    case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
        this.ivCurrentElm = this.ivNumElems - 1;
        this.ivCurrentAnimAdvance = -1; // either 1 or -1
        break;
    }
    this._setSpriteElement();
};

SpriteAnimateRenderable.prototype._setSpriteElement = function () {
    var left = this.ivFirstElmLeft + (this.ivCurrentElm * (this.ivElmWidth + this.ivWidthPadding));
    SpriteRenderable.prototype.setElementUVCoordinate.call(this, left, left + this.ivElmWidth,
                                        this.ivElmTop - this.ivElmHeight, this.ivElmTop);
};

// assumption is that the first sprite in an animation is always the left-most element.
SpriteAnimateRenderable.eAnimationType = Object.freeze({
    eAnimateRight: 0,     // animate from first (left) towards right, when hit the end, start from the left again
    eAnimateLeft: 1,      // compute find the last element (in the right), start from the right animate left-wards, 
    eAnimateSwing: 2      // animate from first (left) towards the right, when hit the end, animates backwards 
});


// always set the left-most element to be the first
SpriteAnimateRenderable.prototype.setSpriteSequence = function (
    topPixel,   // offset from top-left
    leftPixel, // offset from top-left
    elmWidthInPixel,
    elmHeightInPixel,
    numElements,      // number of elements in sequence
    wPaddingInPixel  // left/right padding
) {
    var texInfo = infinitEngine.ResourceMap.retrieveAsset(this.ivTexture);
    // entire image width, height
    var imageW = texInfo.ivWidth;
    var imageH = texInfo.ivHeight;

    this.ivNumElems = numElements;   // number of elements in animation
    this.ivFirstElmLeft = leftPixel / imageW;
    this.ivElmTop = topPixel / imageH;
    this.ivElmWidth = elmWidthInPixel / imageW;
    this.ivElmHeight = elmHeightInPixel / imageH;
    this.ivWidthPadding = wPaddingInPixel / imageW;
    this._initAnimation();
};

SpriteAnimateRenderable.prototype.setAnimationSpeed = function (
    tickInterval   // number of update calls before advancing the animation
) {
    this.ivUpdateInterval = tickInterval;   // how often to advance
};

SpriteAnimateRenderable.prototype.incAnimationSpeed = function (
    deltaInterval   // number of update calls before advancing the animation
) {
    this.ivUpdateInterval += deltaInterval;   // how often to advance
};

SpriteAnimateRenderable.prototype.setAnimationType = function (animationType) {
    this.ivAnimationType = animationType;
    this.ivCurrentAnimAdvance = -1;
    this.ivCurrentElm = 0;
    this._initAnimation();
};

SpriteAnimateRenderable.prototype.updateAnimation = function () {
    this.ivCurrentTick++;
    if (this.ivCurrentTick >= this.ivUpdateInterval) {
        this.ivCurrentTick = 0;
        this.ivCurrentElm += this.ivCurrentAnimAdvance;
        if ((this.ivCurrentElm >= 0) && (this.ivCurrentElm < this.ivNumElems)) {
            this._setSpriteElement();
        } else {
            this._initAnimation();
        }
    }
};
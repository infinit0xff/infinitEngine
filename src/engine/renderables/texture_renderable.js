"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextureRenderable(myTexture) {
    Renderable.call(this);
    Renderable.prototype.setColor.call(this, [1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getTextureShader());
    
    // texture for this object, cannot be a "null"
    this.ivTexture = myTexture;
    
    // these two instance variables are to cache texture information
    // for supporting per-pixel accurate collision
    this.ivTextureInfo = null;
    this.ivColorArray = null;
    
    // defined for subclass to override
    this.ivTexWidth = 0;
    this.ivTexHeight = 0;
    this.ivTexLeftIndex = 0;
    this.ivTexBottomIndex = 0;

    // set texture
    this.setTexture(myTexture);
}

infinitEngine.Core.inheritPrototype(TextureRenderable, Renderable);

TextureRenderable.prototype.draw = function (aCamera) {
    // activate the texture
    infinitEngine.Textures.activateTexture(this.ivTexture);
    Renderable.prototype.draw.call(this, aCamera);
};

TextureRenderable.prototype.getTexture = function () { return this.ivTexture; };
TextureRenderable.prototype.setTexture = function (newTexture) {
    this.ivTexture = newTexture;
    // these two instance variables are to cache texture information
    // for supporting per-pixel accurate collision
    this.ivTextureInfo = infinitEngine.Textures.getTextureInfo(newTexture);
    this.ivColorArray = null;
    // defined for subclass to override
    this.ivTexWidth = this.ivTextureInfo.ivWidth;
    this.ivTexHeight = this.ivTextureInfo.ivHeight;
    this.ivTexLeftIndex = 0;
    this.ivTexBottomIndex = 0;};
"use strict";

function LightRenderable(myTexture) {
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getLightShader());

    // here is the light source
    this.ivLights = [];
}
infinitEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

LightRenderable.prototype.draw = function (aCamera) {
    this.ivShader.setLights(this.ivLights);
    SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.numLights = function () {
    return this.ivLights.length;
};

LightRenderable.prototype.getLightAt = function (index) {
    return this.ivLights[index];
};

LightRenderable.prototype.addLight = function (l) {
    this.ivLights.push(l);
};

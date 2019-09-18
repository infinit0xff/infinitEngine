"use strict";

function LightRenderable(myTexture) {
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getLightShader());

    // here is the light source
    this.ivLight = null;
}
infinitEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

LightRenderable.prototype.draw = function (aCamera) {
    this.ivShader.setLight(this.ivLight);
    SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.getLight = function () {
    return this.ivLight;
};

LightRenderable.prototype.addLight = function (l) {
    this.ivLight = l;
};

"use strict";

function ParticleRenderable(myTexture) {
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getParticleShader());
}
infinitEngine.Core.inheritPrototype(ParticleRenderable, TextureRenderable);
"use strict";

function IllumRenderable(myTexture, myNormalMap) {
    LightRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getIllumShader());

    // here is the normal map resource id
    this.ivNormalMap = myNormalMap;

    // Normal map texture coordinate will reproduce the corresponding sprite sheet
    // This means, the normal map MUST be based on the sprite sheet
}
infinitEngine.Core.inheritPrototype(IllumRenderable, LightRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
IllumRenderable.prototype.draw = function (aCamera) {
    infinitEngine.Textures.activateNormalMap(this.ivNormalMap);
            // Here thenormal map texture coordinate is copied from those of 
            // the corresponding sprite sheet
    LightRenderable.prototype.draw.call(this, aCamera);
};

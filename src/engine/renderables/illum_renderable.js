"use strict";

function IllumRenderable(myTexture, myNormalMap) {
    LightRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, infinitEngine.DefaultResources.getIllumShader());

    // here is the normal map resource id
    this.ivNormalMap = myNormalMap;

    // normal map texture coordinate will reproduce the corresponding sprite sheet
    // this means, the normal map MUST be based on the sprite sheet
    
    // material for this Renderable
    this.ivMaterial = new Material();
}
infinitEngine.Core.inheritPrototype(IllumRenderable, LightRenderable);

IllumRenderable.prototype.draw = function (aCamera) {
    infinitEngine.Textures.activateNormalMap(this.ivNormalMap);
            // Here thenormal map texture coordinate is copied from those of 
            // the corresponding sprite sheet
    this.ivShader.setMaterialAndCameraPos(this.ivMaterial, aCamera.getPosInPixelSpace());
    LightRenderable.prototype.draw.call(this, aCamera);
};

IllumRenderable.prototype.getMaterial = function () { return this.ivMaterial; };

"use strict";

function ShadowCasterShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

    this.ivLight = null;  // the light that casts the shadow

    // **** The GLSL Shader must define uLights[1] <-- as the only light source!!
    this.ivShaderLight = new ShaderLightAtIndex(this.ivCompiledShader, 0);
}
infinitEngine.Core.inheritPrototype(ShadowCasterShader, SpriteShader);

// overriding the Activation of the shader for rendering
ShadowCasterShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);
    this.ivShaderLight.loadToShader(aCamera, this.ivLight);
};

ShadowCasterShader.prototype.setLight = function (l) {
    this.ivLight = l;
};
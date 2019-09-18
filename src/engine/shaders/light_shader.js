"use strict";

function LightShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

    this.ivLights = null;  // lights from the Renderable

    //*******WARNING***************
    // this number MUST correspond to the GLSL uLight[] array size (for LightFS.glsl)
    //*******WARNING********************
    this.kGLSLuLightArraySize = 4;  // <-- make sure this is the same as LightFS.glsl
    this.ivShaderLights = [];
    var i, ls;
    for (i = 0; i < this.kGLSLuLightArraySize; i++) {
        ls = new ShaderLightAtIndex(this.ivCompiledShader, i);
        this.ivShaderLights.push(ls);
    }
}
infinitEngine.Core.inheritPrototype(LightShader, SpriteShader);

// overriding the activation of the shader for rendering
LightShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // now push the light information to the shader
    var numLight = 0;
    if (this.ivLights !== null) {
        while (numLight < this.ivLights.length) {
            this.ivShaderLights[numLight].loadToShader(aCamera, this.ivLights[numLight]);
            numLight++;
        }
    }
    // switch off the left over ones.
    while (numLight < this.kGLSLuLightArraySize) {
        this.ivShaderLights[numLight].switchOffLight();
        numLight++;
    }
};

LightShader.prototype.setLights = function (l) {
    this.ivLights = l;
};

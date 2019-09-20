"use strict";

function IllumShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    LightShader.call(this, vertexShaderPath, fragmentShaderPath);

    // this is the material property of the Renderable
    this.ivMaterial = null;
    this.ivMaterialLoader = new ShaderMaterial(this.ivCompiledShader);

    var gl = infinitEngine.Core.getGL();
    // Reference to the camera position
    this.ivCameraPos = null;  // points to a vec3
    this.ivCameraPosRef = gl.getUniformLocation(this.ivCompiledShader, "uCameraPosition");

    // reference to the normal map sampler
    this.ivNormalSamplerRef = gl.getUniformLocation(this.ivCompiledShader, "uNormalSampler");
}
infinitEngine.Core.inheritPrototype(IllumShader, LightShader);

// overriding the Activation of the shader for rendering
IllumShader.prototype.activateShader = function(pixelColor, aCamera) {
   // first call the super class's activate
   LightShader.prototype.activateShader.call(this, pixelColor, aCamera);
   var gl = infinitEngine.Core.getGL();
   gl.uniform1i(this.ivNormalSamplerRef, 1); // binds to texture unit 1
   // do not need to set up texture coordinate buffer
   // as we are going to use the ones from the sprite texture 
   // in the fragment shader
   this.ivMaterialLoader.loadToShader(this.ivMaterial);
   gl.uniform3fv(this.ivCameraPosRef, this.ivCameraPos);
};

IllumShader.prototype.setMaterialAndCameraPos = function(m, p) { 
    this.ivMaterial = m; 
    this.ivCameraPos = p;
};
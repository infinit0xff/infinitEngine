"use strict";
 
function ShaderMaterial(aIllumShader) {
    // reference to the normal map sampler
    var gl = infinitEngine.Core.getGL();
    this.ivKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
    this.ivKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
    this.ivKsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
    this.ivShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shininess");
}

// loads material onto the shader
ShaderMaterial.prototype.loadToShader = function (aMaterial) {
    var gl = infinitEngine.Core.getGL();
    gl.uniform4fv(this.ivKaRef, aMaterial.getAmbient());
    gl.uniform4fv(this.ivKdRef, aMaterial.getDiffuse());
    gl.uniform4fv(this.ivKsRef, aMaterial.getSpecular());
    gl.uniform1f(this.ivShineRef, aMaterial.getShininess());
};

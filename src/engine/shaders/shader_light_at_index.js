"use strict";

function ShaderLightAtIndex(shader, index) {
    this._setShaderReferences(shader, index);
}

ShaderLightAtIndex.prototype.loadToShader = function (aCamera, aLight) {
    var gl = infinitEngine.Core.getGL();
    gl.uniform1i(this.ivIsOnRef, aLight.isLightOn());
    if (aLight.isLightOn()) {
        var p = aCamera.wcPosToPixel(aLight.getPosition());
        var ic = aCamera.wcSizeToPixel(aLight.getNear());
        var oc = aCamera.wcSizeToPixel(aLight.getFar());
        var c = aLight.getColor();
        gl.uniform4fv(this.ivColorRef, c);
        gl.uniform3fv(this.ivPosRef, vec3.fromValues(p[0], p[1], p[2]));
        gl.uniform1f(this.ivNearRef, ic);
        gl.uniform1f(this.ivFarRef, oc);
        gl.uniform1f(this.ivIntensityRef, aLight.getIntensity());
    }
};

ShaderLightAtIndex.prototype.switchOffLight = function () {
    var gl = infinitEngine.Core.getGL();
    gl.uniform1i(this.ivIsOnRef, false);
};

ShaderLightAtIndex.prototype._setShaderReferences = function (aLightShader, index) {
    var gl = infinitEngine.Core.getGL();
    this.ivColorRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].Color");
    this.ivPosRef = gl.getUniformLocation(aLightShader,        "uLights[" + index + "].Position");
    this.ivNearRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Near");
    this.ivFarRef = gl.getUniformLocation(aLightShader,        "uLights[" + index + "].Far");
    this.ivIntensityRef = gl.getUniformLocation(aLightShader,  "uLights[" + index + "].Intensity");
    this.ivIsOnRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].IsOn");
};
"use strict";

function ShaderLightAtIndex(shader, index) {
    this._setShaderReferences(shader, index);
}

ShaderLightAtIndex.prototype.loadToShader = function (aCamera, aLight) {
    var gl = infinitEngine.Core.getGL();
    gl.uniform1i(this.ivIsOnRef, aLight.isLightOn());
    if (aLight.isLightOn()) {
        var p = aCamera.wcPosToPixel(aLight.getPosition());
        var n = aCamera.wcSizeToPixel(aLight.getNear());
        var f = aCamera.wcSizeToPixel(aLight.getFar());
        var c = aLight.getColor();
        gl.uniform4fv(this.ivColorRef, c);
        gl.uniform3fv(this.ivPosRef, vec3.fromValues(p[0], p[1], p[2]));
        gl.uniform1f(this.ivNearRef, n);
        gl.uniform1f(this.ivFarRef, f);
        gl.uniform1f(this.ivInnerRef, 0.0);
        gl.uniform1f(this.ivOuterRef, 0.0);
        gl.uniform1f(this.ivIntensityRef, aLight.getIntensity());
        gl.uniform1f(this.ivDropOffRef, 0);
        gl.uniform1i(this.ivLightTypeRef, aLight.getLightType());

        if (aLight.getLightType() === Light.eLightType.ePointLight) {
            gl.uniform3fv(this.ivDirRef, vec3.fromValues(0, 0, 0));
        } else {
            // either spot or directional lights: must compute direction
            var d = aCamera.wcDirToPixel(aLight.getDirection());
            gl.uniform3fv(this.ivDirRef, vec3.fromValues(d[0], d[1], d[2]));
            if (aLight.getLightType() === Light.eLightType.eSpotLight) {
                gl.uniform1f(this.ivInnerRef, Math.cos(0.5 * aLight.getInner())); // stores the cosine of half of inner cone angle
                gl.uniform1f(this.ivOuterRef, Math.cos(0.5 * aLight.getOuter())); // stores the cosine of half of outer cone angle
                gl.uniform1f(this.ivDropOffRef, aLight.getDropOff());
            }
        }
    }
};

ShaderLightAtIndex.prototype.switchOffLight = function () {
    var gl = infinitEngine.Core.getGL();
    gl.uniform1i(this.ivIsOnRef, false);
};

ShaderLightAtIndex.prototype._setShaderReferences = function (aLightShader, index) {
    var gl = infinitEngine.Core.getGL();
    this.ivColorRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Color");
    this.ivPosRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Position");
    this.ivDirRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Direction");
    this.ivNearRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].Near");
    this.ivFarRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Far");
    this.ivInnerRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].CosInner");
    this.ivOuterRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].CosOuter");
    this.ivIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
    this.ivDropOffRef = gl.getUniformLocation(aLightShader,   "uLights[" + index + "].DropOff");
    this.ivIsOnRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].IsOn");
    this.ivLightTypeRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].LightType");
};
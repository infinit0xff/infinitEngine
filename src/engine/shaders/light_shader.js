"use strict";

// constructor 
function LightShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

    // glsl uniform position references
    this.ivColorRef = null;
    this.ivPosRef = null;
    this.ivRadiusRef = null;
    this.ivIsOnRef = null;

    // light source in the game engine
    this.ivLight = null;

    // create the references to these uniforms in the LightShader
    var shader = this.ivCompiledShader;
    var gl = infinitEngine.Core.getGL();
    this.ivColorRef = gl.getUniformLocation(shader, "uLightColor");
    this.ivPosRef = gl.getUniformLocation(shader, "uLightPosition");
    this.ivRadiusRef = gl.getUniformLocation(shader, "uLightRadius");
    this.ivIsOnRef = gl.getUniformLocation(shader, "uLightOn");
}
infinitEngine.Core.inheritPrototype(LightShader, SpriteShader);

// overriding the Activation of the shader for rendering
LightShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // now push the light information to the shader
    if (this.ivLight !== null) {
        this._loadToShader(aCamera);
    } else {
         // switch off the light!
        infinitEngine.Core.getGL().uniform1i(this.ivIsOnRef, false);
    }
};

LightShader.prototype.setLight = function (l) {
    this.ivLight = l;
};

LightShader.prototype._loadToShader = function (aCamera) {
    var gl = infinitEngine.Core.getGL();
    gl.uniform1i(this.ivIsOnRef, this.ivLight.isLightOn());
    if (this.ivLight.isLightOn()) {
        var p = aCamera.wcPosToPixel(this.ivLight.getPosition());
        var r = aCamera.wcSizeToPixel(this.ivLight.getRadius());
        var c = this.ivLight.getColor();

        gl.uniform4fv(this.ivColorRef, c);
        gl.uniform3fv(this.ivPosRef, vec3.fromValues(p[0], p[1], p[2]));
        gl.uniform1f(this.ivRadiusRef, r);
    }
};
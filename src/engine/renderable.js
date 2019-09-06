function Renderable(shader) {
    // shader for this object
    this.ivShader = shader;
    
    // fragment shader color
    this.ivColor = [1, 1, 1, 1];
}

Renderable.prototype.draw = function() {
    var gl = infinitEngine.Core.getGL();
    this.ivShader.activateShader(this.ivColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// getter setter for color instance var
Renderable.prototype.setColor = function(color) { this.ivColor= color; };
Renderable.prototype.getColor = function() { return this.ivColor; };

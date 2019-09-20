"use strict";

// simple phong illumination model material: Ka, Kd, KS, and Shininess.

function Material() {
    this.ivKa = vec4.fromValues(0.0, 0.0, 0.0, 0);
    this.ivKs = vec4.fromValues(0.2, 0.2, 0.2, 1);
    this.ivKd = vec4.fromValues(1.0, 1.0, 1.0, 1);
    this.ivShininess = 20;
}

Material.prototype.setAmbient = function (a) { this.ivKa = vec4.clone(a); };
Material.prototype.getAmbient = function () { return this.ivKa; };

Material.prototype.setDiffuse = function (d) { this.ivKd = vec4.clone(d); };
Material.prototype.getDiffuse = function () { return this.ivKd; };

Material.prototype.setSpecular = function (s) { this.ivKs = vec4.clone(s); };
Material.prototype.getSpecular = function () { return this.ivKs; };

Material.prototype.setShininess = function (s) { this.ivShininess = s; };
Material.prototype.getShininess = function () { return this.ivShininess; };

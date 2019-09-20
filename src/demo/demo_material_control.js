"use strict";

Demo.prototype.materialControl = function () {
    var delta = 0.01;
    var msg = "";

    // player select which object and material channgel to work 
    this._selectMaterialChannel();

    // manipulate the selected component Ambient, Diffuse, Specular
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.E)) {
        this.ivMaterialCh[0] += delta;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.R)) {
        this.ivMaterialCh[0] -= delta;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.T)) {
        this.ivMaterialCh[1] += delta;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Y)) {
        this.ivMaterialCh[1] -= delta;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.U)) {
        this.ivMaterialCh[2] += delta;
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.I)) {
        this.ivMaterialCh[2] -= delta;
    }

    // shinningess
    var mat = this.ivSelectedCh.getRenderable().getMaterial();
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.O)) {
        mat.setShininess(mat.getShininess() + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.P)) {
        mat.setShininess(mat.getShininess() - delta);
    }

    msg += "n(" + mat.getShininess().toPrecision(2) + ")" +
           this._printVec3("D", mat.getDiffuse()) +
           this._printVec3("S", mat.getSpecular()) +
           this._printVec3("A", mat.getAmbient());

    return msg;
};

Demo.prototype._selectMaterialChannel = function () {
    // select which character to work with
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Seven)) {
        this.ivMaterialCh = this.ivSelectedCh.getRenderable().getMaterial().getAmbient();
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Eight)) {
        this.ivMaterialCh = this.ivSelectedCh.getRenderable().getMaterial().getDiffuse();
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Nine)) {
        this.ivMaterialCh = this.ivSelectedCh.getRenderable().getMaterial().getSpecular();
    }
};
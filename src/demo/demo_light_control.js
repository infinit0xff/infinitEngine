"use strict";

Demo.prototype._lightControl = function () {
    var delta = 0.2;
    var msg = "";
    // player select which light to work 
    this._selectLight();

    // manipulate the light
    var lgt = this.ivGlobalLightSet.getLightAt(this.ivLgtIndex);
    var p = lgt.getPosition();
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        lgt.setXPos(p[0] - delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        lgt.setXPos(p[0] + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Up)) {
        lgt.setYPos(p[1] + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Down)) {
        lgt.setYPos(p[1] - delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Z)) {
        lgt.setZPos(p[2] + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.X)) {
        lgt.setZPos(p[2] - delta);
    }

    // radius
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.C)) {
        lgt.setNear(lgt.getNear() + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.V)) {
        lgt.setNear(lgt.getNear() - delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.B)) {
        lgt.setFar(lgt.getFar() + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.N)) {
        lgt.setFar(lgt.getFar() - delta);
    }

    // Intensity
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.K)) {
        lgt.setIntensity(lgt.getIntensity() + delta);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.L)) {
        lgt.setIntensity(lgt.getIntensity() - delta);
    }

    // on/off
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.H)) {
        lgt.setLightTo(!lgt.isLightOn());
    }
    msg = "On(" + lgt.isLightOn() + ") " +
          this._printVec3("P", p) +
          "R(" + lgt.getNear().toPrecision(3) + "/" + lgt.getFar().toPrecision(3) + ") " +
          "I(" + lgt.getIntensity().toPrecision(3) + ")";
    return msg;
};

Demo.prototype._selectLight = function () {
    // select which light to work with
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Zero)) {
        this.ivLgtIndex = 0;
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.One)) {
        this.ivLgtIndex = 1;
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Two)) {
        this.ivLgtIndex = 2;
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Three)) {
        this.ivLgtIndex = 3;
    }
};

Demo.prototype._printVec3 = function (msg, p) {
    return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
};
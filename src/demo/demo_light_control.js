"use strict";

Demo.prototype._lightControl = function () {
    var dirDelta = 0.005;
    var delta = 0.2;
    var msg = "";
    // player select which light to work 
    this._selectLight();

    // manipulate the light
    var lgt = this.ivGlobalLightSet.getLightAt(this.ivLgtIndex);
    var p = lgt.getPosition();
    var d = lgt.getDirection();
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
            d[0] -= dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setXPos(p[0] - delta);
        }
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
            d[0] += dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setXPos(p[0] + delta);
        }
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Up)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
            d[1] += dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setYPos(p[1] + delta);
        }
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Down)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
            d[1] -= dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setYPos(p[1] - delta);
        }
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Z)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
            d[2] += dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setZPos(p[2] + delta);
        }
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.X)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
            d[2] -= dirDelta;
            lgt.setDirection(d);
        } else {
            lgt.setZPos(p[2] - delta);
        }
    }

    // radius
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.C)) {
        lgt.setInner(lgt.getInner() + (delta * 0.01)); // convert to radian
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.V)) {
        lgt.setInner(lgt.getInner() - (delta * 0.01)); // convert to radian
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.B)) {
        lgt.setOuter(lgt.getOuter() + (delta * 0.01)); // convert to radian
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.N)) {
        lgt.setOuter(lgt.getOuter() - (delta * 0.01)); // convert to radian
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

    var lMsg = "";
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Space)) {
        lMsg = this._printVec3("D", d);
    } else {
        lMsg = this._printVec3("P", p);
    }
    msg = "On(" + lgt.isLightOn() + ") " + lMsg +
          "R(" + lgt.getInner().toPrecision(3) + "/" + lgt.getOuter().toPrecision(3) + ") " +
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

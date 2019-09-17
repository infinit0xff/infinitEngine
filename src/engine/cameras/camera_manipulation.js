"use strict";

Camera.prototype.update = function () {
    if (this.ivCameraShake !== null) {
        if (this.ivCameraShake.shakeDone()) {
            this.ivCameraShake = null;
        } else {
            this.ivCameraShake.setRefCenter(this.getWCCenter());
            this.ivCameraShake.updateShakeState();
        }
    }
    this.ivCameraState.updateCameraState();
};

Camera.prototype.panBy = function (dx, dy) {
    var newC = vec2.clone(this.getWCCenter());
    this.ivWCCenter[0] += dx;
    this.ivWCCenter[1] += dy;
    this.ivCameraState.setCenter(newC);
};

// pan the camera to ensure aXform is within camera bounds
// this is complementary to the ClampAtBound: instead of clamping aXform, now, move the camera
Camera.prototype.panWith = function (aXform, zone) {
    var status = this.collideWCBound(aXform, zone);
    if (status !== BoundingBox.eboundCollideStatus.eInside) {
        var pos = aXform.getPosition();
        var newC = vec2.clone(this.getWCCenter());
        if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
            newC[1] = pos[1] + (aXform.getHeight() / 2) - (zone * this.getWCHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
            newC[1] = pos[1] - (aXform.getHeight() / 2) + (zone * this.getWCHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
            newC[0] = pos[0] + (aXform.getWidth() / 2) - (zone * this.getWCWidth() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
            newC[0] = pos[0] - (aXform.getWidth() / 2) + (zone * this.getWCWidth() / 2);
        }
        this.ivCameraState.setCenter(newC);
    }
};


Camera.prototype.panTo = function (cx, cy) {
    this.setWCCenter(cx, cy);
};

// zoom with respect to the center
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.zoomBy = function (zoom) {
    if (zoom > 0) {
        this.setWCWidth(this.getWCWidth() * zoom);
    }
};

// zoom towards (pX, pY) by zoom: 
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.zoomTowards = function (pos, zoom) {
    var delta = [];
    var newC = [];
    vec2.sub(delta, pos, this.getWCCenter());
    vec2.scale(delta, delta, zoom - 1);
    vec2.sub(newC, this.getWCCenter(), delta);
    this.zoomBy(zoom);
    this.ivCameraState.setCenter(newC);
};

Camera.prototype.configInterpolation = function (stiffness, duration) {
    this.ivCameraState.configInterpolation(stiffness, duration);
};

Camera.prototype.shake = function (xDelta, yDelta, shakeFrequency, duration) {
    this.ivCameraShake  = new CameraShake(this.ivCameraState, xDelta, yDelta,
        shakeFrequency, duration);
};
"use strict";

// information to be updated once per render for efficiency concerns
function PerRenderCache() {
    this.ivWCToPixelRatio = 1;  // WC to pixel transformation
    this.ivCameraOrgX = 1; // Lower-left corner of camera in WC 
    this.ivCameraOrgY = 1;
    this.ivCameraPosInPixelSpace = vec3.fromValues(0, 0, 0);
}

function Camera(wcCenter, wcWidth, viewportArray, bound) {
    this.ivCameraState = new CameraState(wcCenter, wcWidth);
    this.ivCameraShake = null;
    this.ivViewport = [];  // [x, y, width, height]
    this.ivViewportBound = 0;
    if (bound !== undefined) {
        this.ivViewportBound = bound;
    }
    this.ivScissorBound = [];  // use for bounds
    this.setViewport(viewportArray, this.ivViewportBound);
    this.ivNearPlane = 0;
    this.ivFarPlane = 1000;
    
    // this is for illumination computation
    this.kCameraZ = 10;

    // transform matrices
    this.ivViewMatrix = mat4.create();
    this.ivProjMatrix = mat4.create();
    this.ivVPMatrix = mat4.create();

    // background color
    this.ivBgColor = [0.8, 0.8, 0.8,1] // rbg alpha

    // per-rendering cached information
    // needed for computing transforms for shaders
    // updated each time in SetupViewProjection()
    this.ivRenderCache = new PerRenderCache();
        // SHOULD NOT be used except 
        // xform operations during the rendering
        // Client game should not access this!
}

Camera.eViewport = Object.freeze({
    eOrgX: 0,
    eOrgY: 1,
    eWidth: 2,
    eHeight: 3
});

// setter and getter WC and viewport
Camera.prototype.setWCCenter = function(xPos, yPos) {
    var p = vec2.fromValues(xPos, yPos);
    this.ivCameraState.setCenter(p);

};

Camera.prototype.getPosInPixelSpace = function () { return this.ivRenderCache.ivCameraPosInPixelSpace; };
Camera.prototype.getWCCenter = function () { return this.ivCameraState.getCenter(); };
Camera.prototype.setWCWidth = function (width) { this.ivCameraState.setWidth(width); };
Camera.prototype.getWCWidth = function () { return this.ivCameraState.getWidth(); };
Camera.prototype.getWCHeight = function () { return this.ivCameraState.getWidth() * this.ivViewport[Camera.eViewport.eHeight] / this.ivViewport[Camera.eViewport.eWidth]; };
   
Camera.prototype.setViewport = function (viewportArray, bound) {
    if (bound === undefined) {
        bound = this.ivViewportBound;
    }
    // [x, y, width, height]
    this.ivViewport[0] = viewportArray[0] + bound;
    this.ivViewport[1] = viewportArray[1] + bound;
    this.ivViewport[2] = viewportArray[2] - (2 * bound);
    this.ivViewport[3] = viewportArray[3] - (2 * bound);
    this.ivScissorBound[0] = viewportArray[0];
    this.ivScissorBound[1] = viewportArray[1];
    this.ivScissorBound[2] = viewportArray[2];
    this.ivScissorBound[3] = viewportArray[3];
};

Camera.prototype.getViewport = function () {
    var out = [];
    out[0] = this.ivScissorBound[0];
    out[1] = this.ivScissorBound[1];
    out[2] = this.ivScissorBound[2];
    out[3] = this.ivScissorBound[3];
    return out;
};
Camera.prototype.setBackgroundColor = function(newColor) {
    this.ivBgColor = newColor; };
Camera.prototype.getBackgroundColor = function() { return this.ivBgColor; };

// getter for the View-Projection transform operator
Camera.prototype.getVPMatrix = function() { return this.ivVPMatrix; };

 // initializes the camera to begin drawing
 Camera.prototype.setupViewProjection = function() {
    
    var gl = infinitEngine.Core.getGL();
    
    // configure the viewport
    // set up the viewport: area on canvas to be drawn
    gl.viewport(this.ivViewport[0], // x position of bottom-left corner
                this.ivViewport[1], // y position of bottom-left corner
                this.ivViewport[2], // width of the area to be drawn
                this.ivViewport[3]);// height of the area to be drawn

    // set up the corresponding scissor area to limit clear area
    gl.scissor(this.ivScissorBound[0], // x position of bottom-left corner of the area to be drawn
        this.ivScissorBound[1], // y position of bottom-left corner of the area to be drawn
        this.ivScissorBound[2], // width of the area to be drawn
        this.ivScissorBound[3]);// height of the area to be drawn

    // set the color to be clear to black
    gl.clearColor(this.ivBgColor[0], this.ivBgColor[1],
        this.ivBgColor[2], this.ivBgColor[3]);  // set the color to be cleared
           
    // enable and clear the scissor area
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);

    // set up the View-Projection transform operator
    // define the view matrix
    var center = [];
    if (this.ivCameraShake !== null) {
        center = this.ivCameraShake.getCenter();
    } else {
        center = this.getWCCenter();
    }
    mat4.lookAt(this.ivViewMatrix,
        [center[0], center[1], this.kCameraZ],   // WC center
        [center[0], center[1], 0],    // 
         // orientation
        [0, 1, 0]);

    // define the projection matrix
    var halfWCWidth = 0.5 * this.getWCWidth();
    var halfWCHeight = 0.5 * this.getWCHeight(); // 
    mat4.ortho(this.ivProjMatrix,
        -halfWCWidth,   // distant to left of WC
        halfWCWidth,    // distant to right of WC
        -halfWCHeight,      // distant to bottom of WC
        halfWCHeight,       // distant to top of WC
        this.ivNearPlane,  // z-distant to near plane
        this.ivFarPlane,    // z-distant to far plane
    );

    // concatnate view and project matrices
    mat4.multiply(this.ivVPMatrix, this.ivProjMatrix, this.ivViewMatrix);
    
    // compute and cache per-rendering information
    this.ivRenderCache.ivWCToPixelRatio = this.ivViewport[Camera.eViewport.eWidth] / this.getWCWidth();
    this.ivRenderCache.ivCameraOrgX = center[0] - (this.getWCWidth() / 2);
    this.ivRenderCache.ivCameraOrgY = center[1] - (this.getWCHeight() / 2);
    
    var p = this.wcPosToPixel(this.getWCCenter());
    this.ivRenderCache.ivCameraPosInPixelSpace[0] = p[0];
    this.ivRenderCache.ivCameraPosInPixelSpace[1] = p[1];
    this.ivRenderCache.ivCameraPosInPixelSpace[2] = this.fakeZInPixelSpace(this.kCameraZ);

};

Camera.prototype.collideWCBound = function (aXform, zone) {
    var bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
    var w = zone * this.getWCWidth();
    var h = zone * this.getWCHeight();
    var cameraBound = new BoundingBox(this.getWCCenter(), w, h);
    return cameraBound.boundCollideStatus(bbox);
};


// prevents the xform from moving outside of the WC boundary.
// by clamping the aXfrom at the boundary of WC, 
Camera.prototype.clampAtBoundary = function (aXform, zone) {
    var status = this.collideWCBound(aXform, zone);
    if (status !== BoundingBox.eboundCollideStatus.eInside) {
        var pos = aXform.getPosition();
        if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
            pos[1] = (this.getWCCenter())[1] + (zone * this.getWCHeight() / 2) - (aXform.getHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
            pos[1] = (this.getWCCenter())[1] - (zone * this.getWCHeight() / 2) + (aXform.getHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
            pos[0] = (this.getWCCenter())[0] + (zone * this.getWCWidth() / 2) - (aXform.getWidth() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
            pos[0] = (this.getWCCenter())[0] - (zone * this.getWCWidth() / 2) + (aXform.getWidth() / 2);
        }
    }
    return status;
};
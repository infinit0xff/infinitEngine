"use strict";

function Camera(wcCenter, wcWidth, viewportArray) {
    this.ivCameraState = new CameraState(wcCenter, wcWidth);
    this.ivViewport = viewportArray; // [x, y, width, height]
    this.ivNearPlane = 0;
    this.ivFarPlane = 1000;

    // transform matrices
    this.ivViewMatrix = mat4.create();
    this.ivProjMatrix = mat4.create();
    this.ivVPMatrix = mat4.create();

    // background color
    this.ivBgColor = [0.8, 0.8, 0.8,1] // rbg alpha

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

Camera.prototype.getWCCenter = function () { return this.ivCameraState.getCenter(); };
Camera.prototype.setWCWidth = function (width) { this.ivCameraState.setWidth(width); };
Camera.prototype.getWCWidth = function () { return this.ivCameraState.getWidth(); };
Camera.prototype.getWCHeight = function () { return this.ivCameraState.getWidth() * this.ivViewport[Camera.eViewport.eHeight] / this.ivViewport[Camera.eViewport.eWidth]; };
   
Camera.prototype.setViewport = function(viewportArray) {
    this.ivViewport = viewportArray; };
Camera.prototype.getViewport = function() { return this.ivViewport; };

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
    this.ivViewport[1],
    this.ivViewport[2],
    this.ivViewport[3]);
    // y position of bottom-left corner
    // width of the area to be drawn
    // height of the area to be drawn

    // set up the corresponding scissor area to limit clear area
    gl.scissor( this.ivViewport[0], // x position of bottom-left corner
    this.ivViewport[1],
    this.ivViewport[2],
    this.ivViewport[3]);
    // y position of bottom-left corner
    // width of the area to be drawn
    // height of the area to be drawn

    // set the color to be clear to black
    gl.clearColor(this.ivBgColor[0], this.ivBgColor[1],
        this.ivBgColor[2], this.ivBgColor[3]);  // set the color to be cleared
           
    // enable and clear the scissor area
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);

    // set up the View-Projection transform operator
    // define the view matrix
    var center = this.getWCCenter();
    mat4.lookAt(this.ivViewMatrix,
        [center[0], center[1], 10],   // WC center
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
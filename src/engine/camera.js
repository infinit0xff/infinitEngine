"use strict";

function Camera(wcCenter, wcWidth, viewportArray) {
    this.ivWCCenter = wcCenter;
    this.ivWCWidth = wcWidth;
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

// setter and getter WC and viewport
Camera.prototype.setWCCenter = function(xPos, yPos) {
    this.ivWCCenter[0] = xPos;
    this.ivWCCenter[1] = yPos;

};

Camera.prototype.getWCCenter = function() { return this.ivWCCenter}

Camera.prototype.setWCWidth = function(width) { this.ivWCWidth = width; }

Camera.prototype.setViewport = function(viewportArray) {
    this.mViewport = viewportArray; };

Camera.prototype.getViewport = function() { return this.ivViewport; };

Camera.prototype.setBackgroundColor = function(newColor) {
    this.ivBgColor = newColor; };

Camera.prototype.getBackgroundColor = function() { return this.ivBgColor; };

// Getter for the View-Projection transform operator
Camera.prototype.getVPMatrix = function() { return this.ivVPMatrix; };

 // initializes the camera to begin drawing
 Camera.prototype.setupViewProjection = function() {
    var gl = infinitEngine.Core.getGL();
    
    // Configure the viewport
        // set up the viewport: area on canvas to be drawn
        gl.viewport(this.ivViewport[0], // x position of bottom-left corner
        this.ivViewport[1],
        this.ivViewport[2],
        this.ivViewport[3]);
        // y position of bottom-left corner
        // width of the area to be drawn
        // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit clear area
        gl.scissor( this.ivViewport[0], // x position of bottom-left corner
        this.ivViewport[1],
        this.ivViewport[2],
        this.ivViewport[3]);
        // y position of bottom-left corner
        // width of the area to be drawn
        // height of the area to be drawn
        // Step A3: set the color to be clear to black
        gl.clearColor(this.ivBgColor[0], this.ivBgColor[1],
            this.ivBgColor[2], this.ivBgColor[3]);  // set the color to be cleared
               
        // enable and clear the scissor area
        gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);

        // set up the View-Projection transform operator
        // define the view matrix
        mat4.lookAt(this.ivViewMatrix,
            // WC center
            [this.ivWCCenter[0], this.ivWCCenter[1], 10],
            [this.ivWCCenter[0], this.ivWCCenter[1], 0],
             // orientation
            [0, 1, 0]);

        // define the projection matrix
        var halfWCWidth = 0.5 * this.ivWCWidth;
        
        // WCHeight = WCWidth * viewportHeight / viewportWidth
        var halfWCHeight = halfWCWidth *  this.ivViewport[3] / this.ivViewport[2];
        
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
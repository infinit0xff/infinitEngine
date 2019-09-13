"use strict";

function FontRenderable(aString) {

    this.ivFont = infinitEngine.DefaultResources.getDefaultFont();
    this.ivOneChar = new SpriteRenderable(this.ivFont + ".png");
    this.ivXform = new Transform(); // transform that moves this object around
    this.ivText = aString;
}

FontRenderable.prototype.draw = function (aCamera) {

    // we will draw the text string by calling to ivOneChar for each of the
    // chars in the ivText string.
    var widthOfOneChar = this.ivXform.getWidth() / this.ivText.length;
    var heightOfOneChar = this.ivXform.getHeight();

    // this.ivOneChar.getXform().SetRotationInRad(this.ivXform.getRotationInRad());
    var yPos = this.ivXform.getYPos();

    // center position of the first char
    var xPos = this.ivXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
    var charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
    
    for (charIndex = 0; charIndex < this.ivText.length; charIndex++) {
        aChar = this.ivText.charCodeAt(charIndex);
        charInfo = infinitEngine.Fonts.getCharInfo(this.ivFont, aChar);

        // set the texture coordinate
        this.ivOneChar.setElementUVCoordinate(charInfo.ivTexCoordLeft, charInfo.ivTexCoordRight,
            charInfo.ivTexCoordBottom, charInfo.ivTexCoordTop);

        // now the size of the char
        xSize = widthOfOneChar * charInfo.ivCharWidth;
        ySize = heightOfOneChar * charInfo.ivCharHeight;
        this.ivOneChar.getXform().setSize(xSize, ySize);

        // how much to offset from the center
        xOffset = widthOfOneChar * charInfo.ivCharWidthOffset * 0.5;
        yOffset = heightOfOneChar * charInfo.ivCharHeightOffset * 0.5;

        this.ivOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

        this.ivOneChar.draw(aCamera);

        xPos += widthOfOneChar;
    }
};

FontRenderable.prototype.getXform = function () { return this.ivXform; };
FontRenderable.prototype.getText = function () { return this.ivText; };
FontRenderable.prototype.setText = function (t) {
    this.ivText = t;
    this.setTextHeight(this.getXform().getHeight());
};

FontRenderable.prototype.setTextHeight = function (h) {
    var charInfo = infinitEngine.Fonts.getCharInfo(this.ivFont, "A".charCodeAt(0)); // this is for "A"
    var w = h * charInfo.ivCharAspectRatio;
    this.getXform().setSize(w * this.ivText.length, h);
};

FontRenderable.prototype.getFont = function () { return this.ivFont; };
FontRenderable.prototype.setFont = function (f) {
    this.ivFont = f;
    this.ivOneChar.setTexture(this.ivFont + ".png");
};

FontRenderable.prototype.setColor = function (c) { this.ivOneChar.setColor(c); };
FontRenderable.prototype.getColor = function () { return this.ivOneChar.getColor(); };

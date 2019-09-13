"use strict";

function Demo() {
    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";

    // the fonts
    this.kFontCon16 = "assets/fonts/Consolas-16";  // notice font names do not need extensions!
    this.kFontCon24 = "assets/fonts/Consolas-24";
    this.kFontCon32 = "assets/fonts/Consolas-32";  // this is also the default system font
    this.kFontCon72 = "assets/fonts/Consolas-72";
    this.kFontSeg96 = "assets/fonts/Segment7-96";

    // The camera to view the scene
    this.ivCamera = null;

    // the hero and the support objects
    this.ivHero = null;
    this.ivFontImage = null;
    this.ivMinion = null;

    this.ivTextSysFont = null;
    this.ivTextCon16 = null;
    this.ivTextCon24 = null;
    this.ivTextCon32 = null;
    this.ivTextCon72 = null;
    this.ivTextSeg96 = null;

    this.ivTextToWork = null;
}
infinitEngine.Core.inheritPrototype(Demo, Scene);

Demo.prototype.loadScene = function () {
    // loads the textures    
    infinitEngine.Textures.loadTexture(this.kFontImage);
    infinitEngine.Textures.loadTexture(this.kMinionSprite);

    // loads all the fonts
    infinitEngine.Fonts.loadFont(this.kFontCon16);
    infinitEngine.Fonts.loadFont(this.kFontCon24);
    infinitEngine.Fonts.loadFont(this.kFontCon32);
    infinitEngine.Fonts.loadFont(this.kFontCon72);
    infinitEngine.Fonts.loadFont(this.kFontSeg96);
};

Demo.prototype.unloadScene = function () {
    infinitEngine.Textures.unloadTexture(this.kFontImage);
    infinitEngine.Textures.unloadTexture(this.kMinionSprite);

    // unload the fonts
    infinitEngine.Fonts.unloadFont(this.kFontCon16);
    infinitEngine.Fonts.unloadFont(this.kFontCon24);
    infinitEngine.Fonts.unloadFont(this.kFontCon32);
    infinitEngine.Fonts.unloadFont(this.kFontCon72);
    infinitEngine.Fonts.unloadFont(this.kFontSeg96);

    // starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    infinitEngine.Core.startScene(nextLevel);
};

Demo.prototype.initialize = function () {
    // set up the cameras
    this.ivCamera = new Camera(
        vec2.fromValues(50, 33),   // position of the camera
        100,                       // width of camera
        [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
    );
    // sets the background to gray
    this.ivCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // create the font and minion images using sprite
    this.ivFontImage = new SpriteRenderable(this.kFontImage);
    this.ivFontImage.setColor([1, 1, 1, 0]);
    this.ivFontImage.getXform().setPosition(15, 50);
    this.ivFontImage.getXform().setSize(20, 20);

    // the right minion
    this.ivMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.ivMinion.setColor([1, 1, 1, 0]);
    this.ivMinion.getXform().setPosition(15, 25);
    this.ivMinion.getXform().setSize(24, 19.2);
    this.ivMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.ivMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.ivMinion.setAnimationSpeed(15);
                                // show each element for mAnimSpeed updates

    // create the hero object with texture from the lower-left corner 
    this.ivHero = new SpriteRenderable(this.kMinionSprite);
    this.ivHero.setColor([1, 1, 1, 0]);
    this.ivHero.getXform().setPosition(35, 50);
    this.ivHero.getXform().setSize(12, 18);
    this.ivHero.setElementPixelPositions(0, 120, 0, 180);

  
    this.ivTextSysFont = new FontRenderable("System Font: in Red");
    this._initText(this.ivTextSysFont, 50, 60, [1, 0, 0, 1], 3);

    this.ivTextCon16 = new FontRenderable("Consolas 16: in black");
    this.ivTextCon16.setFont(this.kFontCon16);
    this._initText(this.ivTextCon16, 50, 55, [0, 0, 0, 1], 2);

    this.ivTextCon24 = new FontRenderable("Consolas 24: in black");
    this.ivTextCon24.setFont(this.kFontCon24);
    this._initText(this.ivTextCon24, 50, 50, [0, 0, 0, 1], 3);

    this.ivTextCon32 = new FontRenderable("Consolas 32: in white");
    this.ivTextCon32.setFont(this.kFontCon32);
    this._initText(this.ivTextCon32, 40, 40, [1, 1, 1, 1], 4);

    this.ivTextCon72 = new FontRenderable("Consolas 72: in blue");
    this.ivTextCon72.setFont(this.kFontCon72);
    this._initText(this.ivTextCon72, 30, 30, [0, 0, 1, 1], 6);

    this.ivTextSeg96  = new FontRenderable("Segment7-92");
    this.ivTextSeg96.setFont(this.kFontSeg96);
    this._initText(this.ivTextSeg96, 30, 15, [1, 1, 0, 1], 7);

    this.ivTextToWork = this.ivTextCon16;
};

Demo.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// his is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo.prototype.draw = function () {

    // clear the canvas
    infinitEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // activate the drawing Camera
    this.ivCamera.setupViewProjection();

    // draw everything
    this.ivHero.draw(this.ivCamera.getVPMatrix());
    this.ivFontImage.draw(this.ivCamera.getVPMatrix());
    this.ivMinion.draw(this.ivCamera.getVPMatrix());

    // drawing the text output
    this.ivTextSysFont.draw(this.ivCamera.getVPMatrix());
    this.ivTextCon16.draw(this.ivCamera.getVPMatrix());
    this.ivTextCon24.draw(this.ivCamera.getVPMatrix());
    this.ivTextCon32.draw(this.ivCamera.getVPMatrix());
    this.ivTextCon72.draw(this.ivCamera.getVPMatrix());
    this.ivTextSeg96.draw(this.ivCamera.getVPMatrix());
};

// function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo.prototype.update = function () {
    // let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.5;
    var xform = this.ivHero.getXform();

    // support hero movements
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Right)) {
        xform.incXPosBy(deltaX);
        if (xform.getXPos() > 100) { // this is the right-bound of the window
            xform.setPosition(0, 50);
        }
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Left)) {
        xform.incXPosBy(-deltaX);
        if (xform.getXPos() < 0) {  // this is the left-bound of the window
            infinitEngine.GameLoop.stop();
        }
    }

    // update code for changing the sub-texture regions being shown"
    var deltaT = 0.001;

    // zoom into the texture by updating texture coordinate
    // for font: zoom to the upper left corner by changing bottom right
    var texCoord = this.ivFontImage.getElementUVCoordinateArray();
            // The 8 elements:
            //      mTexRight,  mTexTop,          // x,y of top-right
            //      mTexLeft,   mTexTop,
            //      mTexRight,  mTexBottom,
            //      mTexLeft,   mTexBottom
    var b = texCoord[SpriteRenderable.eTexCoordArray.eBottom] + deltaT;
    var r = texCoord[SpriteRenderable.eTexCoordArray.eRight] - deltaT;
    if (b > 1.0) {
        b = 0;
    }
    if (r < 0) {
        r = 1.0;
    }
    this.ivFontImage.setElementUVCoordinate(
        texCoord[SpriteRenderable.eTexCoordArray.eLeft],
        r,
        b,
        texCoord[SpriteRenderable.eTexCoordArray.eTop]
    );

    // remember to update this.ivMinion's animation
    this.ivMinion.updateAnimation();

    // interactive control of the display size

    // choose which text to work on
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Zero)) {
        this.ivTextToWork = this.ivTextCon16;
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.One)) {
        this.ivTextToWork = this.ivTextCon24;
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Three)) {
        this.ivTextToWork = this.ivTextCon32;
    }
    if (infinitEngine.Input.isKeyClicked(infinitEngine.Input.keys.Four)) {
        this.ivTextToWork = this.ivTextCon72;
    }

    var deltaF = 0.005;
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Up)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.X)) {
            this.ivTextToWork.getXform().incWidthBy(deltaF);
        }
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Y)) {
            this.ivTextToWork.getXform().incHeightBy(deltaF);
        }
        this.ivTextSysFont.setText(this.ivTextToWork.getXform().getWidth().toFixed(2) + "x" + this.ivTextToWork.getXform().getHeight().toFixed(2));
    }

    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Down)) {
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.X)) {
            this.ivTextToWork.getXform().incWidthBy(-deltaF);
        }
        if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Y)) {
            this.ivTextToWork.getXform().incHeightBy(-deltaF);
        }
        this.ivTextSysFont.setText(this.ivTextToWork.getXform().getWidth().toFixed(2) + "x" + this.ivTextToWork.getXform().getHeight().toFixed(2));
    }
};
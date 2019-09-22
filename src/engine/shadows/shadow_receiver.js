"use strict";

function ShadowReceiver (theReceiverObject) {
    this.kShadowStencilBit = 0x01;              // the stencil bit to switch on/off for shadow
    this.kShadowStencilMask = 0xFF;             // the stencil mask 
    this.ivReceiverShader = infinitEngine.DefaultResources.getShadowReceiverShader();
    
    this.ivReceiver = theReceiverObject;
    
    // to support shadow drawing
    this.ivShadowCaster = [];                    // array of ShadowCasters
}
    
ShadowReceiver.prototype.addShadowCaster = function (lgtRenderable) {
    var c = new ShadowCaster(lgtRenderable, this.ivReceiver);
    this.ivShadowCaster.push(c);
};
// for now, cannot remove shadow casters

ShadowReceiver.prototype.draw = function (aCamera) {
    var c;
    
    // draw receiver as a regular renderable
    this.ivReceiver.draw(aCamera);
    
    this._shadowRecieverStencilOn();
    var s = this.ivReceiver.getRenderable().swapShader(this.ivReceiverShader);
    this.ivReceiver.draw(aCamera);
    this.ivReceiver.getRenderable().swapShader(s);
    this._shadowRecieverStencilOff();
    
    // now draw shadow color to the pixels in the stencil that are switched on
    for (c = 0; c < this.ivShadowCaster.length; c++) {
        this.ivShadowCaster[c].draw(aCamera);
    }
    
    // switch off stencil checking
    this._shadowRecieverStencilDisable();
};

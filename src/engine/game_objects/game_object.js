"use strict";

function GameObject(renderableObj) {
    this.ivRenderComponent = renderableObj;
}

GameObject.prototype.getXform = function () { return this.ivRenderComponent.getXform(); };

GameObject.prototype.update = function () {};

GameObject.prototype.getRenderable = function () { return this.ivRenderComponent; };

GameObject.prototype.draw = function (aCamera) {
    this.ivRenderComponent.draw(aCamera);
};

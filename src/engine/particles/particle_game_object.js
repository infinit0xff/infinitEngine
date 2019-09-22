"use strict";

function ParticleGameObject(texture, atX, atY, cyclesToLive) {
    var renderableObj = new ParticleRenderable(texture);
    var xf = renderableObj.getXform();
    xf.setPosition(atX, atY);
    GameObject.call(this, renderableObj);
    
    var p = new Particle(xf.getPosition());
    this.setPhysicsComponent(p);
    
    this.ivDeltaColor = [0, 0, 0, 0];
    this.ivSizeDelta = 0;
    this.ivCyclesToLive = cyclesToLive;
}
infinitEngine.Core.inheritPrototype(ParticleGameObject, GameObject);

ParticleGameObject.prototype.setFinalColor = function(f) {    
    vec4.sub(this.ivDeltaColor, f, this.ivRenderComponent.getColor());
    if (this.ivCyclesToLive !== 0) {
        vec4.scale(this.ivDeltaColor, this.ivDeltaColor, 1/this.ivCyclesToLive);
    }
};
ParticleGameObject.prototype.setSizeDelta = function(d) {
    this.ivSizeDelta = d;
};

ParticleGameObject.prototype.hasExpired = function() {
    return (this.ivCyclesToLive < 0);
};

ParticleGameObject.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
    this.ivCyclesToLive--;
    var c = this.ivRenderComponent.getColor();
    vec4.add(c, c, this.ivDeltaColor);
    
    var xf = this.getXform();
    var s = xf.getWidth() * this.ivSizeDelta;
    xf.setSize(s, s);
};
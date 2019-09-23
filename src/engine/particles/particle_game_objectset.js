"use strict";

function ParticleGameObjectSet() {
    GameObjectSet.call(this);
    this.ivEmitterSet = [];

}
infinitEngine.Core.inheritPrototype(ParticleGameObjectSet, GameObjectSet);

ParticleGameObjectSet.prototype.addEmitterAt = function (p, n, func) {
    var e = new ParticleEmitter(p, n, func);
    this.ivEmitterSet.push(e);
};

ParticleGameObjectSet.prototype.draw = function (aCamera) {
    var gl = infinitEngine.Core.getGL();
    gl.blendFunc(gl.ONE, gl.ONE);  // for additive blending!
    GameObjectSet.prototype.draw.call(this, aCamera);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore alpha blending
};

ParticleGameObjectSet.prototype.update = function () {
    GameObjectSet.prototype.update.call(this);
    
    // cleanup particles
    var i, e, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()) {
            this.removeFromSet(obj);
        }
    }
    // emit new particles
    for (i=0; i<this.ivEmitterSet.length; i++) {
        e = this.ivEmitterSet[i];
        e.emitParticles(this);
        if (e.expired()) {
            this.ivEmitterSet.splice(i, 1);
        }
    }
};

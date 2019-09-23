"use strict";

function ParticleEmitter(pos, num, createrFunc) {
    // smallest number of particle emitted per cycle
    this.kMinToEmit = 5;

    // emitter position
    this.ivEmitPosition = pos;   // this can be a reference to a xform.mPosition

    // number of particles left to be emitted
    this.ivNumRemains = num;
    
    this.ivParticleCreater = createrFunc;
}
ParticleEmitter.prototype.expired = function () { return (this.ivNumRemains <= 0); };

ParticleEmitter.prototype.emitParticles = function (pSet) {
    var numToEmit = 0;
    if (this.ivNumRemains < this.kMinToEmit) {
        // if only a few are left, emits all of them
        numToEmit = this.ivNumRemains;
    } else  {
        // other wise, emits about 20% of what's left
        numToEmit = Math.random() * 0.2 * this.ivNumRemains;
    }
    // left for future emitting.                            
    this.ivNumRemains -= numToEmit;
    var i, p;
    for (i = 0; i < numToEmit; i++) {
        p = this.ivParticleCreater(this.ivEmitPosition[0], this.ivEmitPosition[1]);
        pSet.addToSet(p);
    }
};

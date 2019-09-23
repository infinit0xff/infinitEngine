"use strict";

Demo.prototype._physicsSimulation = function() {
    
    // Hero platform
    infinitEngine.Physics.processObjSet(this.ivHero, this.ivAllPlatforms);
    
    // Minion platform
    infinitEngine.Physics.processSetSet(this.ivAllMinions, this.ivAllPlatforms);
    
    // DyePack platform
    infinitEngine.Physics.processSetSet(this.ivAllDyePacks, this.ivAllPlatforms);
    
    // DyePack Minions
    infinitEngine.Physics.processSetSet(this.ivAllDyePacks, this.ivAllMinions);
    
   // particle system collisions
   infinitEngine.Particle.processSetSet(this.ivAllMinions, this.ivAllParticles);
   infinitEngine.Particle.processSetSet(this.ivAllPlatforms, this.ivAllParticles);

};

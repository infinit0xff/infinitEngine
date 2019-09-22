"use strict";

Demo.prototype._physicsSimulation = function() {
    
    // Hero platform
    infinitEngine.Physics.processObjSet(this.ivHero, this.ivAllPlatforms);
    
    // Hero Minion
    infinitEngine.Physics.processObjSet(this.ivHero, this.ivAllMinions);
    
    // Minion platform
    infinitEngine.Physics.processSetSet(this.ivAllMinions, this.ivAllPlatforms);
    
    // DyePack platform
    infinitEngine.Physics.processSetSet(this.ivAllDyePacks, this.ivAllPlatforms);
    
    // DyePack Minions
    infinitEngine.Physics.processSetSet(this.ivAllDyePacks, this.ivAllMinions);
    
    // Hero DyePack
    infinitEngine.Physics.processObjSet(this.ivHero, this.ivAllDyePacks);
    
    // all rigid shapes
    infinitEngine.Physics.processSetSet(this.ivAllRigidShapes, this.ivAllPlatforms);
    infinitEngine.Physics.processSelfSet(this.ivAllRigidShapes);
    
    // add rigid shapes if keys are pressed
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.Z)) {
        var c = new Minion(this.kMinionSprite, this.ivCamera.mouseWCX(), this.ivCamera.mouseWCY());
        var p = c.getPhysicsComponent();
        p.setAcceleration(infinitEngine.Physics.getSystemtAcceleration());
        p.setColor([1, 1, 1, 1]);
        this.ivAllRigidShapes.addToSet(c);
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.C)) {
        // Give all rigid shape a random velocity
        var i = 0, s, v;
        for (i=0; i<this.ivAllRigidShapes.size(); i++) {
            s = this.ivAllRigidShapes.getObjectAt(i).getPhysicsComponent();
            v = s.getVelocity();
            v[0] += (Math.random()-0.5)*10;
            v[1] += (Math.random()-0.5)*10;
        }
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.V)) {
        this.ivAllRigidShapes = new GameObjectSet();
    }
    if (infinitEngine.Input.isKeyPressed(infinitEngine.Input.keys.X)) {
        // find the current rigid shape under the mouse and move it with the mouse
        var i = 0, s;
        var pos = vec2.fromValues(this.ivCamera.mouseWCX(), this.ivCamera.mouseWCY());
        var found = false;
        while ((i<this.ivAllRigidShapes.size()) && (!found)) {
            s = this.ivAllRigidShapes.getObjectAt(i).getPhysicsComponent();
            found = s.containsPos(pos);
            i++;
        }
        if (found) {
            s.setPosition(pos[0], pos[1]);
        }
    }
};

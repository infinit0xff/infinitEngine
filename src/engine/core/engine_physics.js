"use strict";

var infinitEngine = infinitEngine || { };
    // initialize the variable while ensuring it is not redefined

infinitEngine.Physics = (function () {
    var ivRelaxationCount = 15;                  // number of relaxation iteration
    var ivRelaxationOffset = 1/ivRelaxationCount; // porportion to apply when scaling friction
    var ivPosCorrectionRate = 0.8;               // percentage of separation to project objects
    var ivSystemtAcceleration = [0, -50];        // system-wide default acceleration
    
    var ivRelaxationLoopCount = 0;               // the current relaxation count
    var ivHasOneCollision = false;               // detect the first collision
    
    var ivCollisionInfo = null;                  // information of the current collision
    
    var initialize = function() {
        ivCollisionInfo = new CollisionInfo(); // to avoid allocating this constantly
    } 
    
    var _positionalCorrection = function (s1, s2, collisionInfo) {
        var s1InvMass = s1.getInvMass();
        var s2InvMass = s2.getInvMass();
        var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * ivPosCorrectionRate;
        var correctionAmount = [0, 0];
        vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

        var ca = [0, 0];
        vec2.scale(ca, correctionAmount, s1InvMass);
        var s1Pos = s1.getPosition();
        vec2.subtract(s1Pos, s1Pos, ca);

        vec2.scale(ca, correctionAmount, s2InvMass);
        var s2Pos = s2.getPosition();
        vec2.add(s2Pos, s2Pos, ca);
    };
    
    // n is the collision normal
    // v is the velocity
    // f is the friction 
    // m is the invMass
    var _applyFriction = function(n, v, f, m) {
        var tangent = vec2.fromValues(n[1], -n[0]);  // perpendicular to n
        var tComponent = vec2.dot(v, tangent);
        if (Math.abs(tComponent) < 0.01)
            return;
        
        f *= m * ivRelaxationOffset;
        if (tComponent < 0) {
            vec2.scale(tangent, tangent, -f);
        } else {
            vec2.scale(tangent, tangent, f);
        }
        vec2.sub(v, v, tangent);
    };
    var resolveCollision = function (s1, s2, collisionInfo) {
        // one collision has been found
        ivHasOneCollision = true;
        
        // correct positions
        _positionalCorrection(s1, s2, collisionInfo);

        // collision normal direction is _against_ s2
        // apply friction
        var s1V = s1.getVelocity();
        var s2V = s2.getVelocity();
        var n = collisionInfo.getNormal();
        _applyFriction(n, s1V, s1.getFriction(), s1.getInvMass());
        _applyFriction(n, s2V, -s2.getFriction(), s2.getInvMass());

        // compute relatively velocity of the colliding objects
        var relativeVelocity = [0, 0];
        vec2.sub(relativeVelocity, s2V, s1V);

        // examine the component in the normal direction
        // relative velocity in normal direction
        var rVelocityInNormal = vec2.dot(relativeVelocity, n);
        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }
        
        // compute and apply response impulses for each object
        var newRestituion = Math.min(s1.getRestitution(), s2.getRestitution());
        // calc impulse scalar
        var j = -(1 + newRestituion) * rVelocityInNormal;
        j = j / (s1.getInvMass() + s2.getInvMass());

        var impulse = [0, 0];
        vec2.scale(impulse, collisionInfo.getNormal(), j);

        var newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
    };
    
    var beginRelaxation = function() { 
        ivRelaxationLoopCount = ivRelaxationCount; 
        ivHasOneCollision = true;
    };
    var continueRelaxation = function() { 
        var oneCollision = ivHasOneCollision;
        ivHasOneCollision = false;
        ivRelaxationLoopCount = ivRelaxationLoopCount - 1;
        return ((ivRelaxationLoopCount > 0) && oneCollision); 
    };
    
    // rigid shape interactions: two game objects
    var processObjObj = function(obj1, obj2) {
        var s1 = obj1.getPhysicsComponent();
        var s2 = obj2.getPhysicsComponent();
        if (s1 === s2)
            return;
        beginRelaxation();
        while (continueRelaxation()) {
            if (s1.collided(s2, ivCollisionInfo)) {
                resolveCollision(s1, s2, ivCollisionInfo);
            }
        }
    };
    
    // rigid shape interactions: a game object and a game object set
    var processObjSet = function(obj, set) {
        var s1 = obj.getPhysicsComponent();
        var i, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set.size(); i++) {
                s2 = set.getObjectAt(i).getPhysicsComponent();
                if ((s1 !== s2) && (s1.collided(s2, ivCollisionInfo))) {
                    resolveCollision(s1, s2, ivCollisionInfo);
                }
            }
        }
    };
    
    // rigid shape interactions: two game object sets
    var processSetSet = function(set1, set2) {
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set1.size(); i++) {
                s1 = set1.getObjectAt(i).getPhysicsComponent();
                for (j=0; j<set2.size(); j++) {
                    s2 = set2.getObjectAt(j).getPhysicsComponent();
                    if ((s1 !== s2) && (s1.collided(s2, ivCollisionInfo))) {
                        resolveCollision(s1, s2, ivCollisionInfo);
                    }
                }
            }
        }
    };
    
    // rigid shape interactions: a set against itself
    var processSelfSet = function(set) {
        var i, j, s1, s2;
        beginRelaxation();
        while (continueRelaxation()) {
            for (i=0; i<set.size(); i++) {
                s1 = set.getObjectAt(i).getPhysicsComponent();
                for (j=i+1; j<set.size(); j++) {
                    s2 = set.getObjectAt(j).getPhysicsComponent();
                    if ((s1 !== s2) && (s1.collided(s2, ivCollisionInfo))) {
                        resolveCollision(s1, s2, ivCollisionInfo);
                    }
                }
            }
        }
    };
    
    var getSystemtAcceleration = function() { return ivSystemtAcceleration; };
    var setSystemtAcceleration = function(g) { ivSystemtAcceleration = g; };
    var getRelaxationCorrectionRate = function() { return ivPosCorrectionRate; };
    var setRelaxationCorrectionRate = function(r) {
        if ((r <= 0) || (r>=1)) {
            r = 0.8;
        }
        ivPosCorrectionRate = r;
    };
    var getRelaxationLoopCount = function() { return ivRelaxationCount; };
    var setRelaxationLoopCount = function(c) { 
        if (c <= 0)
            c = 1;
        ivRelaxationCount = c; 
        ivRelaxationOffset = 1/ivRelaxationCount;
    };
    
    var ivPublic = {
        initialize: initialize,
        resolveCollision: resolveCollision,
        beginRelaxation: beginRelaxation,
        continueRelaxation: continueRelaxation,
        getSystemtAcceleration: getSystemtAcceleration,
        setSystemtAcceleration: setSystemtAcceleration,
        getRelaxationCorrectionRate: getRelaxationCorrectionRate,
        setRelaxationCorrectionRate: setRelaxationCorrectionRate,
        getRelaxationLoopCount: getRelaxationLoopCount,
        setRelaxationLoopCount: setRelaxationLoopCount,
        processObjObj: processObjObj,
        processObjSet: processObjSet,
        processSetSet: processSetSet,
        processSelfSet: processSelfSet
    };

    return ivPublic;
}());

var infinitEngine = infinitEngine || {};

infinitEngine.GameLoop = (function() {

    var kFPS = 60;          // frames per second
    var kFrameTime = 1 / kFPS;
    var kMPF = 1000 * kFrameTime; // milleseconds per frame

    // variables for timing gameloop
    var ivPreviousTime;
    var ivLagTime;
    var ivCurrentTime;
    var ivElaspedTime;

    // current loop state
    var ivLoopIsRunning = false;

    // reference to game logic
    var ivDemo = null;
    
    // assumes subclass from Demo 
    var _runLoop = function() {
        if(ivLoopIsRunning) {
            // set up for next call to _runLoop and update input
            requestAnimationFrame( function(){ _runLoop.call(ivDemo);} );
            
            // compute elapsed time since last runloop execution
            ivCurrentTime = Date.now();
            ivElaspedTime = ivCurrentTime - ivPreviousTime;
            ivPreviousTime = ivCurrentTime;
            ivLagTime += ivElaspedTime;

            // update game appropriate times
            // update only every millesecond per frame
            // if lag larget then update frames, update
            // until caught up
            while ((ivLagTime >= kMPF) && ivLoopIsRunning) {
                infinitEngine.Input.update();
                this.update(); // call Demo update
                ivLagTime -= kMPF;
            }

            // draw
            this.draw();
        } else {
            // the game loop has stopped, unload current scene
            ivDemo.unloadScene();
        }
    };

    var _startLoop = function () {
        // reset frame time
        ivPreviousTime = Date.now();
        ivLagTime = 0.0;

        // remember the loop is running
        ivLoopIsRunning = true;

        // request _runLoop to start when loading is done
        requestAnimationFrame(function () { _runLoop.call(ivDemo) });
    };

    var start = function(demo) {
        ivDemo = demo;

        infinitEngine.ResourceMap.setLoadCompleteCallback(
            function (){
                ivDemo.initialize();
                _startLoop();
            }
        )
    };

    var stop = function() {
        ivLoopIsRunning = false;
    };

    var getUpdateIntervalInSeconds = function () {
        return kFrameTime;
    };

    var ivPublic = {
        start: start,
        stop: stop,
        getUpdateIntervalInSeconds: getUpdateIntervalInSeconds


    };
    return ivPublic;
})();
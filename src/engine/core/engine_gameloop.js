var infinitEngine = infinitEngine || {};

infinitEngine.GameLoop = (function() {

    var KFPS = 60;          // frames per second
    var KMPF = 1000 / KFPS; // milleseconds per frame

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
            while ((ivLagTime >= KFPS) && ivLoopIsRunning) {
                infinitEngine.Input.update();
                this.update(); // call Demo update
                ivLagTime -= KMPF;
            }

            // draw
            this.draw();
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

    var ivPublic = {
        start: start
    };
    return ivPublic;
}());
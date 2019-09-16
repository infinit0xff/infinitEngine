"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.Input = (function() {

    // define keyboard key to map key codes
    var kKeys = {
        // arrows
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,

        // space bar
        Space: 32,

        // numbers
        Zero: 48,
        One: 49,
        Two: 50,
        Three: 51,
        Four: 52,
        Five: 53,
        Six: 54,
        Seven: 55,
        Eight: 56,
        Nine: 57,

        // alphabet
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,

        LastKeyCode: 222
    
    };

    // previous key state
    var ivKeyPreviousState = [];

    // pressed keys
    var ivIsKeyPressed = [];

    // click events 
    // once an event is set, it will remain there until polled
    var ivIsKeyClicked = [];

    var _onKeyDown = function(event) {
        ivIsKeyPressed[event.keyCode] = true; 
    }

    var _onKeyUp = function(event) {
        ivIsKeyPressed[event.keyCode] = false; 
    }
    
    var initialize = function() {
        var i;
        for(i = 0; i< kKeys.LastKeyCode; i++) {
            ivIsKeyPressed[i] = false;
            ivKeyPreviousState[i] = false;
            ivIsKeyClicked[i] = false;
        }

        // register handers 
        window.addEventListener('keyup', _onKeyUp);
        window.addEventListener('keydown', _onKeyDown);
    };

    var update = function() {
        var i;
        for (i = 0; i< kKeys.LastKeyCode; i++) {
            ivIsKeyClicked[i] = (!ivKeyPreviousState[i]) && ivIsKeyPressed[i];
            ivKeyPreviousState[i] = ivIsKeyPressed[i];
        }
    };

    var isKeyPressed = function(keyCode) {
        return ivIsKeyPressed[keyCode];
    }

    var isKeyClicked = function(keyCode) {
        return (ivIsKeyClicked[keyCode]);
    }


    var ivPublic = {
        initialize: initialize,
        update: update,
        isKeyPressed: isKeyPressed,
        isKeyClicked: isKeyClicked,
        keys: kKeys
    };

    return ivPublic;
}());
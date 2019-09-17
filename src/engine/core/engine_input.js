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

     
    var kMouseButton = {
        Left: 0,
        Middle: 1,
        Right: 2
    };
    
    // previous key state
    var ivKeyPreviousState = [];

    // pressed keys
    var ivIsKeyPressed = [];

    // click events 
    // once an event is set, it will remain there until polled
    var ivIsKeyClicked = [];

    // support mouse
    var ivCanvas = null;
    var ivButtonPreviousState = [];
    var ivIsButtonPressed = [];
    var ivIsButtonClicked = [];
    var ivMousePosX = -1;
    var ivMousePosY = -1;

    var _onKeyDown = function(event) {
        ivIsKeyPressed[event.keyCode] = true; 
    }

    var _onKeyUp = function(event) {
        ivIsKeyPressed[event.keyCode] = false; 
    }
    
    var _onMouseMove = function (event) {
        var inside = false;
        var bBox = ivCanvas.getBoundingClientRect();
        // in canvas Space now. convert via ratio from canvas to client.
        var x = Math.round((event.clientX - bBox.left) * (ivCanvas.width / bBox.width));
        var y = Math.round((event.clientY - bBox.top) * (ivCanvas.width / bBox.width));

        if ((x >= 0) && (x < ivCanvas.width) &&
            (y >= 0) && (y < ivCanvas.height)) {
            ivMousePosX = x;
            ivMousePosY = ivCanvas.height - 1 - y;
            inside = true;
        }
        return inside;
    };

    var _onMouseDown = function (event) {
        if (_onMouseMove(event)) {
            ivIsButtonPressed[event.button] = true;
        }
    };

    var _onMouseUp = function (event) {
        _onMouseMove(event);
        ivIsButtonPressed[event.button] = false;
    };

    var initialize = function(canvasID) {
        var i;
        for(i = 0; i< kKeys.LastKeyCode; i++) {
            ivIsKeyPressed[i] = false;
            ivKeyPreviousState[i] = false;
            ivIsKeyClicked[i] = false;
        }

        // register handers 
        window.addEventListener('keyup', _onKeyUp);
        window.addEventListener('keydown', _onKeyDown);
        
        for (i = 0; i < 3; i++) {
            ivButtonPreviousState[i] = false;
            ivIsButtonPressed[i] = false;
            ivIsButtonClicked[i] = false;
        }

        window.addEventListener('mousedown', _onMouseDown);
        window.addEventListener('mouseup', _onMouseUp);
        window.addEventListener('mousemove', _onMouseMove);
        
        ivCanvas = document.getElementById(canvasID);
    };

    var update = function() {
        var i;
        for (i = 0; i< kKeys.LastKeyCode; i++) {
            ivIsKeyClicked[i] = (!ivKeyPreviousState[i]) && ivIsKeyPressed[i];
            ivKeyPreviousState[i] = ivIsKeyPressed[i];
        }
        for (i = 0; i < 3; i++) {
            ivIsButtonClicked[i] = (!ivButtonPreviousState[i]) && ivIsButtonPressed[i];
            ivButtonPreviousState[i] = ivIsButtonPressed[i];
        }
    };

    var isKeyPressed = function(keyCode) {
        return ivIsKeyPressed[keyCode];
    }

    var isKeyClicked = function(keyCode) {
        return (ivIsKeyClicked[keyCode]);
    }

    var isButtonPressed = function (button) {
        return ivIsButtonPressed[button];
    };

    var isButtonClicked = function (button) {
        return ivIsButtonClicked[button];
    };

    var getMousePosX = function () { return ivMousePosX; };
    var getMousePosY = function () { return ivMousePosY; };

    var ivPublic = {
        initialize: initialize,
        update: update,

        // keyboard support
        isKeyPressed: isKeyPressed,
        isKeyClicked: isKeyClicked,
        keys: kKeys,
        
        // mouse support
        isButtonPressed: isButtonPressed,
        isButtonClicked: isButtonClicked,
        getMousePosX: getMousePosX,       // invalid if no corresponding buttonPressed or buttonClicked
        getMousePosY: getMousePosY,
        mouseButton: kMouseButton

    };

    return ivPublic;

}());
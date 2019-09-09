"use strict";

var infinitEngine = infinitEngine || { };

infinitEngine.AudioClips = (function () {
    
    var ivAudioContext = null;
    var ivBgAudioNode = null;

    // initializes the audio context to play sounds.
    var initAudioContext = function () {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            ivAudioContext = new AudioContext();
        } catch (e) {alert("Web Audio Is not supported."); }
    };

    var loadAudio = function (clipName) {
        if (!(infinitEngine.ResourceMap.isAssetLoaded(clipName))) {
            // update resources in load counter.
            infinitEngine.ResourceMap.asyncLoadRequested(clipName);

            // asyncrounsly request the data from server.
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(clipName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', clipName, true);
            // specify that the request retrieves binary data.
            req.responseType = 'arraybuffer';

            req.onload = function () {
                // asynchronously decode, then call the function in parameter.
                ivAudioContext.decodeAudioData(req.response,
                    function (buffer) {
                        infinitEngine.ResourceMap.asyncLoadCompleted(clipName, buffer);
                    }
                    );
            };
            req.send();
        } else {
            infinitEngine.ResourceMap.incAssetRefCount(clipName);
        }
    };

    var unloadAudio = function (clipName) {
        infinitEngine.ResourceMap.unloadAsset(clipName);
    };

    var playACue = function (clipName) {
        var clipInfo = infinitEngine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            // source nodes are one use only.
            var sourceNode = ivAudioContext.createBufferSource();
            sourceNode.buffer = clipInfo;
            sourceNode.connect(ivAudioContext.destination);
            sourceNode.start(0);
        }
    };

    var playBackgroundAudio = function (clipName) {
        var clipInfo = infinitEngine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            // stop audio if playing.
            stopBackgroundAudio();

            ivBgAudioNode = ivAudioContext.createBufferSource();
            ivBgAudioNode.buffer = clipInfo;
            ivBgAudioNode.connect(ivAudioContext.destination);
            ivBgAudioNode.loop = true;
            ivBgAudioNode.start(0);
        }
    };

    var stopBackgroundAudio = function () {
        // check if the audio is  playing.
        if (ivBgAudioNode !== null) {
            ivBgAudioNode.stop(0);
            ivBgAudioNode = null;
        }
    };

    var isBackgroundAudioPlaying = function () {
        return (ivBgAudioNode !== null);
    };

    var ivPublic = {
        initAudioContext: initAudioContext,
        loadAudio: loadAudio,
        unloadAudio: unloadAudio,
        playACue: playACue,
        playBackgroundAudio: playBackgroundAudio,
        stopBackgroundAudio: stopBackgroundAudio,
        isBackgroundAudioPlaying: isBackgroundAudioPlaying
    };

    return ivPublic;

}());
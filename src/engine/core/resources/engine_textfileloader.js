"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.TextFileLoader = (function() {
    
    var eTextFileType = Object.freeze({
        eXMLFile: 0,
        eTextFile: 1
    });

    var loadTextFile = function(fileName, fileType, callBackFunction) {
        if (!(infinitEngine.ResourceMap.isAssetLoaded(fileName))) {
            // update resources load counter
            infinitEngine.ResourceMap.asyncLoadRequested(fileName);

            // request data asyncrounsly
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(fileName + ": loading failed! [Hint: you cannot double click index.html to run this project." + "The index.html file must be loaded by a web-server.]");                    
                }
            };
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');

            req.onload = function() {
               var fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    var parser = new DOMParser();
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }

                infinitEngine.ResourceMap.asyncLoadCompleted(fileName, fileContent);

                if ((callBackFunction !== null) && (callBackFunction !== undefined))
                    callBackFunction(fileName);
            };
            req.send();
        } else {
            infinitEngine.ResourceMap.incAssetRefCount(fileName);

            if ((callBackFunction !== null) && (callBackFunction !== undefined))
                callBackFunction(fileName);
        }
    };


    var unloadTextFile = function(fileName) {
        infinitEngine.ResourceMap.unloadAsset(fileName);
    };
    
    var ivPublic = {
        loadTextFile: loadTextFile,
        unloadTextFile: unloadTextFile,
        eTextFileType: eTextFileType
    };

    return ivPublic;
}());
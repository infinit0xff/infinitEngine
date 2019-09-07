"use strict";

var infinitEngine = infinitEngine || {};

infinitEngine.ResourceMap = (function() {

    // object to store each resource
    var MapEntry = function(rName) {
        this.ivAsset = rName;
    };

    // resource storage
    var ivResourceMap = {};

    // number of outstanding load operations
    var ivNumOutstandingLoads = 0;

    // callback when all textures are loaded
    var ivLoadCompleteCallback = null;

    // support for setting and executing the callback
    var _checkForAllLoadCompleted = function() {
        if ((ivNumOutstandingLoads === 0) && (ivLoadCompleteCallback !== null)) {
            // call complete callback only once
            var funToCall = ivLoadCompleteCallback;
            ivLoadCompleteCallback = null;
            funToCall();
        }
    };

    // set callback AFTER all load commands are issued
    var setLoadCompleteCallback = function (funct) {
        ivLoadCompleteCallback = funct;
        // in case all loading is done
        _checkForAllLoadCompleted();
    };

    // record asynchronous loading requests and completions
    var asyncLoadRequested = function(rName) {
        // place holder to load resources
        ivResourceMap[rName] = new MapEntry(rName);
        ++ivNumOutstandingLoads;
    };
    
    var asyncLoadCompleted = function(rName, loadedAsset) {
        if (!isAssetLoaded(rName))
            alert("infinitEngine.asyncLoadCompleted: [" + rName + "] not in map!");
        ivResourceMap[rName].ivAsset = loadedAsset;
        --ivNumOutstandingLoads;
        _checkForAllLoadCompleted();
    };

    // testing load status, retrieving, and unloading resources.
    var isAssetLoaded = function(rName) {
        return (rName in ivResourceMap);
    };
    
    var retrieveAsset = function(rName) {
        var r = null;
        if(rName in ivResourceMap) {
            r = ivResourceMap[rName].ivAsset;
        } else {
            alert("infinitEngine.retrieveAsset: [" + rName + "] not in map!");
        }
        return r;
    };

    var unloadAsset = function(rName) {
        if (rName in ivResourceMap) {
            delete ivResourceMap[rName];
        }
    };


    var ivPublic = {
        //async resource loading support
        asyncLoadRequested: asyncLoadRequested,
        asyncLoadCompleted: asyncLoadCompleted,
        setLoadCompleteCallback: setLoadCompleteCallback,

        // resource storage
        retrieveAsset: retrieveAsset,
        unloadAsset: unloadAsset,
        isAssetLoaded: isAssetLoaded
    };

    return ivPublic;

}());
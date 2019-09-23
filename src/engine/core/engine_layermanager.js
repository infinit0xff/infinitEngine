"use strict";

var infinitEngine = infinitEngine || { };
    // initialize the variable while ensuring it is not redefined

infinitEngine.eLayer = Object.freeze({
    eBackground: 0,
    eShadowReceiver: 1,
    eActors: 2,
    eFront: 3,
    eHUD: 4
});

infinitEngine.LayerManager = (function () {
    // instance variables
    var kNumLayers = 5;
    
    var ivAllLayers = [];
    
    var initialize = function() {
        ivAllLayers[infinitEngine.eLayer.eBackground] = new GameObjectSet();
        ivAllLayers[infinitEngine.eLayer.eShadowReceiver] = new GameObjectSet();
        ivAllLayers[infinitEngine.eLayer.eActors] = new GameObjectSet();
        ivAllLayers[infinitEngine.eLayer.eFront] = new GameObjectSet();
        ivAllLayers[infinitEngine.eLayer.eHUD] = new GameObjectSet();
    };
    
    var cleanUp = function() {
        initialize();
    };
    
    var drawAllLayers = function(aCamera) {
        var i;
        for (i=0; i<kNumLayers; i++) {
            ivAllLayers[i].draw(aCamera);
        }
    };
    
    var updateAllLayers = function() {
        var i;
        for (i=0; i<kNumLayers; i++) {
            ivAllLayers[i].update();
        }
    };
    
    
    // operations on the layers
    var drawLayer = function(layerEnum, aCamera) {
        ivAllLayers[layerEnum].draw(aCamera);
    };
    var updateLayer = function(layerEnum) {
        ivAllLayers[layerEnum].update();
    };
    var addToLayer = function(layerEnum, obj) {
        ivAllLayers[layerEnum].addToSet(obj);
    };
    var addAsShadowCaster = function(obj) {
        var i;
        for (i = 0; i<ivAllLayers[infinitEngine.eLayer.eShadowReceiver].size(); i++) {
            ivAllLayers[infinitEngine.eLayer.eShadowReceiver].getObjectAt(i).addShadowCaster(obj);
        }
    };
    var removeFromLayer = function(layerEnum, obj) {
        ivAllLayers[layerEnum].removeFromSet(obj);
    };
    var moveToLayerFront = function(layerEnum, obj) {
        ivAllLayers[layerEnum].moveToLast(obj);
    };
    var layerSize = function(layerEnum) {
        return ivAllLayers[layerEnum].size();
    };

    var ivPublic = {
      initialize: initialize,
      drawAllLayers: drawAllLayers,
      updateAllLayers: updateAllLayers,
      cleanUp: cleanUp,
      
      drawLayer: drawLayer,
      updateLayer: updateLayer,
      addToLayer: addToLayer,
      addAsShadowCaster: addAsShadowCaster,
      removeFromLayer: removeFromLayer,
      moveToLayerFront: moveToLayerFront,
      layerSize: layerSize
    };

    return ivPublic;
}());

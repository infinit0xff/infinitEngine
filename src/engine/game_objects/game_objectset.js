"use strict";

function GameObjectSet() {
    this.ivSet = [];
}

GameObjectSet.prototype.size = function () { return this.ivSet.length; };

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.ivSet[index];
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.ivSet.push(obj);
};

GameObjectSet.prototype.removeFromSet = function (obj) {
    var index = this.ivSet.indexOf(obj);
    if (index > -1)
        this.ivSet.splice(index, 1);
};

GameObjectSet.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

GameObjectSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.ivSet.length; i++) {
        this.ivSet[i].update();
    }
};

GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.ivSet.length; i++) {
        this.ivSet[i].draw(aCamera);
    }
};

/*
 * File: MyGame_Shadow: Initializes and sets up shadow
 */
/*jslint node: true, vars: true */
/*global gEngine, MyGame, ShadowReceiver */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

Demo.prototype._setupShadow = function () {
    this.ivBgShadow1 = new ShadowReceiver(this.ivBgL1);
    this.ivBgShadow1.addShadowCaster(this.ivIllumHero);
    this.ivBgShadow1.addShadowCaster(this.ivLgtHero);
    this.ivBgShadow1.addShadowCaster(this.ivLgtMinion);
    this.ivBgShadow1.addShadowCaster(this.ivIllumMinion);
};

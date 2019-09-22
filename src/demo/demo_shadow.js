"use strict";

Demo.prototype._setupShadow = function () {
    this.ivBgShadow = new ShadowReceiver(this.ivBg);
    this.ivBgShadow.addShadowCaster(this.ivLgtHero);
    this.ivBgShadow.addShadowCaster(this.ivIllumMinion);
    this.ivBgShadow.addShadowCaster(this.ivLgtMinion);

    this.ivMinionShadow = new ShadowReceiver(this.ivIllumMinion);
    this.ivMinionShadow.addShadowCaster(this.ivIllumHero);
    this.ivMinionShadow.addShadowCaster(this.ivLgtHero);
    this.ivMinionShadow.addShadowCaster(this.ivLgtMinion);

    this.ivLgtMinionShadow = new ShadowReceiver(this.ivLgtMinion);
    this.ivLgtMinionShadow.addShadowCaster(this.ivIllumHero);
    this.ivLgtMinionShadow.addShadowCaster(this.ivLgtHero);
};

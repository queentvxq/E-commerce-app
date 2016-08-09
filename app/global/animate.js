var App = App || {};
define([
	'vue'
], function (Vue) {
    Vue.transition('cxpRight', {
        afterEnter: function () {
            this._appendComplete();
            this.appendComplete();
        },
        afterLeave: function (_el) {
            this.transitionName = "cxpLeft";
            this._removeComplete();
            this.removeComplete();
        }
    })
    Vue.transition('cxpLeft', {
        afterEnter: function () {
            this._appendComplete();
            this.appendComplete();
        },
        afterLeave: function (_el) {
            this.transitionName = "cxpRight";
            this._removeComplete();
            this.removeComplete();
        }
    });
    Vue.transition('cxpFade', {
        afterEnter: function () {
            App.trace(this.cxName+"-cxpFade");
            this._appendComplete();
            this.appendComplete();
        },
        afterLeave: function (_el) {
            this._removeComplete();
            this.removeComplete();
        }
    });
    Vue.transition('cxpFadeLeft', {
        afterEnter: function () {
            this._appendComplete();
            this.appendComplete();
        },
        afterLeave: function (_el) {
            this._removeComplete();
            this.removeComplete();
        }
    });

    Vue.transition('cxpFadeRight', {
        afterEnter: function () {
            this._appendComplete();
            this.appendComplete();
        },
        afterLeave: function (_el) {
            this._removeComplete();
            this.removeComplete();
        }
    });

})

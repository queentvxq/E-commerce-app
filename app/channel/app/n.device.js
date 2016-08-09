var App = App || {};
define(function () {
    var _device = function () {
        return {
            init: function () {
                return this;
            },
            testnetwork: function (_fun) {
                if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
                    return false;
                } else {
                    if (typeof _fun != "undefined") _fun();
                    return true;
                }
            }
        }
    }
    return _device;
})

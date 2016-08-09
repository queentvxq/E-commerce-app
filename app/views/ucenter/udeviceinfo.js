var App = App || {};
define([
    'uview',
    'text!tpl/u_deviceinfo.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'udeviceinfo',
            cxId: '#scroll-box',
            cxWpid: '#scroll-box',
            cxApi: '/v2/user/UserDeviceServiceInfo',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {

            },
            cxCreated: function () {
                this.cxVas.deviceId = this.$options.vas;
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {

        }
    });
    return v;
})

var App = App || {};
define([
    'uview',
    'text!tpl/shareRep.html',
], function (uview, tpl) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'reportshare',
            cxId: '#reportshare',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () { },
            cxCreated: function () {
                App.n.vcheck.init();
            }
        },
        cxData: {
            transitionName: 'cxpFade'
        },
        methods: {
            download: function () {
                var ua = navigator.userAgent || navigator.vendor || window.opera;
                if (ua.match(/iPad/i) || ua.match(/iPhone/i) || ua.match(/iPod/i)) {
                    window.location.href = App.v.iosurl;
                } else if (ua.match(/Android/i)) {
                    window.location.href = App.v.androidurl;
                } else {
                    alert('望厨APP支持ios和安卓系统的手机！');
                }
            },
        }
    });
    return v;
})

var App = App || {};
define([
    'uview',
    'text!tpl/home.html',
    'views/home/hindex',
    'views/home/hpages',
    'views/home/halbum'
], function (uview, tpl, hindex,hpages,halbum) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'home', //名称
            cxId: '#home-center', //视图ID
            cxChildId: "#home_center", //子视图ID
            cxAutoShow: true,
            cxChildPage: {
                "hindex": hindex,
                "hpages": hpages,
                "halbum": halbum,
            },
            cxReady: function () {
                if (typeof this.$options._initPage != "undefined") {
                    this.openChild(this.$options._initPage);
                }else {
                    this.openChild("hindex");
                }
            },
            cxCreated: function () {}
        },
        cxData: {
            transitionName: 'cxpFade'
        },
        methods: {
        }
    });
    return v;
})

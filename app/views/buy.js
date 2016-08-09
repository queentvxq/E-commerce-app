var App = App || {};
define([
	'uview',
	'text!tpl/buy.html',
    'views/buy/bcart',
    'views/buy/border',
    'views/buy/byouhui',
    'views/buy/baddr'//选择地址
], function (uview, tpl, bcart, border,byouhui,baddr) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'buy', //名称
            cxId: '#b-buy', //视图ID
            cxChildId: "#b_buy", //子视图ID
            cxAutoShow: true,
            cxChildPage: {
                "bcart": bcart,
                "border": border,
                "byouhui":byouhui,
                "baddr":baddr
            },
            cxReady: function () {
                App.footbar(false);
                if (typeof this.$options._initPage != "undefined") {
                    this.openChild(this.$options._initPage);
                } else {
                    this.openChild("bcart");
                }
            }
        },
        methods: {
            opentest: function () {
                console.log("opentest");
            },
            logBtnB: function (evt) {
                console.log("logBtnB");
            }
        }
    });
    return v;
})

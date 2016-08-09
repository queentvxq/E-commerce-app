var App = App || {};
define([
	'uview',
	'text!tpl/mall.html',
    'views/mall/mdiscovery',
    'views/mall/mservice',
    'views/mall/mproduct',
    'views/mall/msearch',
    'global/animation',
], function (uview, tpl, discovery,service,product,search,animation) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'mall', //名称
            cxId: '#m-discovery', //视图ID
            cxChildId: "#m_discovery",//子视图ID
            cxAutoShow: true,
            cxInit: function () {
                
            },
            cxReady: function () {
                if (typeof this.$options._initPage != "undefined") {
                    this.openChild(this.$options._initPage);
                } else {
                    this.openChild("mindex");
                }
            },
            cxCreated: function () {
                
            },
            cxChildPage: {
                'mindex':discovery,
                'product':product,
                'service':service,
                'search':search,
                'animation':animation
            }
        },
        cxData: {
            transitionName: 'cxpFade'
        },
        methods: {
        }
    });
    return v;
})

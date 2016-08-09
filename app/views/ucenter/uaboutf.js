var App = App || {};
define([
	'uview',
	'text!tpl/u_about_f.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uaboutf', //名称
            cxId: '', //视图ID
            cxWpid: '#u_about', //滚动区域的ID
            cxApi: '',
            cxAutoload: true,
            cxAutoShow: true,
            upnameTime:null,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {
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

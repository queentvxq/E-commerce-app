var App = App || {};
define([
	'uview',
	'text!tpl/b_setaddr.html',
    'utopbar2'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar2": utopbar
        },
        objectExtend: {
            cxName: 'baddr', //名称
            cxId: '#b-addr', //视图ID
            cxWpid: '#u_address_set', //滚动区域的ID
            cxApi: '/user/myaddress',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxCreated: function () {
                if (App.p.address) {
                    this.addrid = App.p.address.id;
                }
            },
            cxReady: function () {}
        },
        cxData: {
            transitionName: 'cxpRight',
            addrid: ""
        },
        methods: {
            takeUp: function (_sub, _evt) {
                this.list[_sub].act = true;
                App.p.address = this.list[_sub];
                window.history.back();
            },
            upData:function(){
                window.location.href="#ucenter/uaddr";
            }
        }
    });
    return v;
})

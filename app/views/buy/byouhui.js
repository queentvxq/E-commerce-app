var App = App || {};
define([
	'uview',
	'text!tpl/b_setyouhui.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'byouhui', //名称
            cxId: '#b-youhui', //视图ID
            cxWpid: '#byouhui', //滚动区域的ID
            cxApi: '/v2/shop/OrderCoupons',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxCreated: function () {
                if (App.buyInfo) {
                    this.cxps = App.buyInfo;
                    this.cxps.pids = _.pluck(App.buyInfo.servicelist, "pid").concat(_.pluck(App.buyInfo.shoplist, "pid"));
                    this.cxps.types = _.pluck(App.buyInfo.servicelist, "kindtype").concat(_.pluck(App.buyInfo.shoplist, "kindtype"));
                    this.cxps.nums = _.pluck(App.buyInfo.servicelist, "count").concat(_.pluck(App.buyInfo.shoplist, "count"));
                    this.cxps.ssubids = _.pluck(App.buyInfo.servicelist, "cateid").concat(_.pluck(App.buyInfo.shoplist, "cateid"));
                } else {
                    this.cxps = App.cart.getPayList();
                }
                //发送到服务端数据
                this.cxVas.pids = this.cxps.pids.join();
                this.cxVas.types = this.cxps.types.join();
                this.cxVas.nums = this.cxps.nums.join();
                this.cxVas.ssubids = this.cxps.ssubids.join();
                this.cxVas.addressid = App.user.info.addressid;
            },
            cxReady: function () {}
        },
        cxData: {
            transitionName: 'cxpRight',
            numb: ""
        },
        methods: {
            takeUp: function (_sub, _evt) {
                this.list[_sub].act = true;
                App.p.cpnum = this.list[_sub].number;
                window.history.back();
            }
        }
    });
    return v;
})

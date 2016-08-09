var App = App || {};
define([
	'uview',
	'text!tpl/u_order_s.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uordermx', //名称
            cxId: '#u-ordermx', //视图ID
            cxWpid: '#u_order_msg', //滚动区域的ID
            cxApi: '/v2/user/SelectOrderDetail',
            cxAutoload: true,
            cxAutoShow: true,
            cxVas: {
                ordernumber: "",
                payment: "货到付款"
            },
            cxCreated: function () {
                this.cxVas.ordernumber = this.$options.vas;
                if (App.cxmain.cxChildP.cxChildP) {
                    var _cpName = App.cxmain.cxChildP.cxChildP.cxName;
                    if (_cpName == "uordermx" || _cpName == "uorderlog") {
                        this.transitionName = "cxpFadeLeft";
                    }
                }
            },
            cxReady: function () {
                App.footbar(false);
                //#ucenter/uordermx
            },
            cxLoadDataSuccess: function (data) {
                switch (data.result.paymenthod) {
                    case 1:
                        this.payment = "支付宝";
                        break;
                    case 2:
                        this.payment = "微信";
                        break;
                    case 3:
                        this.payment = "货到付款";
                        break;
                }
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            goPage: function () {
                this.transitionName = "cxpFadeRight";
            },
            retGood: function (_sub, _val) {
                var _this = this;
                App.alert("是否申请退货", {
                    confirm: {
                        onConfirm: function () {
                            App.loading(true);
                            App.upData({
                                url: _val + "&" + App.config.accompany,
                                success: function (data) {
                                    if (data.state == 1) {
                                        _this.listshop[_sub].statesname = "申请退货中";
                                    } else {
                                        App.trace(data.errordes);
                                    }
                                    App.loading(false);
                                }
                            })
                        },
                        onCancel: function () {}
                    }
                })
            },
            telphone: function () {
                App.callPhone(App.about.tel);
            }
        }
    });
    return v;
})

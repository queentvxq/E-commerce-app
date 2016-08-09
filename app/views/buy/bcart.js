var App = App || {};
define([
    'uview',
    'text!tpl/b_cart.html',
    'utopbar',
    'cart'
], function (uview, tpl, utopbar, cart) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'bcart', //名称
            cxId: '#b-cart', //视图ID
            cxWpid: '#bcart', //滚动区域的ID
            cxAutoload: true,
            cxAutoShow: true,
            appendComplete: function () {},
            cxCreated: function () {
                this.list = [];
                if (App.cxmain.cxChildP.cxChildP) {
                    this.transitionName = "cxpFadeLeft";
                }
                var _this = this;
                if (App.cart == null) {
                    //初始化购物车情况
                    App.cart = new cart('mycart');
                }
                App.cart.releasecart();
                App.cart.on('cartChange', function () {
                    _this.list = App.cart.products;
                    _this.priceAll = App.cart.priceAll;
                    _this.testAllPay();
                    if (_this.list.length == 0) {
                        _this.ctempt = true;
                    }
                    _this.$nextTick(_this._cxNextTick);
                });
                App.buyInfo = null;
                //清除临时数据
                App.p = {};

            },
            appendComplete: function () {
                this.transitionName = "cxpFadeRight";
                if (App.cart.products) {
                    if (App.cart.products.length == 0) {
                        this.ctempt = true;
                        this.payAll = false;
                    }
                    this.list = App.cart.products;
                    this.$nextTick(this._cxNextTick);
                }
                App.cart.jisuan();
                this.priceAll = App.cart.priceAll;
            }
        },
        cxData: {
            transitionName: 'cxpFade',
            priceAll: 0,
            payAll: true,
            ctempt: false
        },
        methods: {
            addPc: function (_pid, _type, _cateid) {
                var _opt = {
                    type: _type,
                    cateid: _cateid,
                };
                App.cart.addshopcart(_pid, 1, _opt);
            },
            subPc: function (_id) {
                if (App.cart.getProduct(_id).count > 1) {
                    var _opt = {
                        type: App.cart.getProduct(_id).kindtype,
                        cateid: App.cart.getProduct(_id).cateid,
                    };
                    var _pid = App.cart.getProduct(_id).pid;
                    App.cart.addshopcart(_pid, -1, _opt);
                }
            },
            setPayPc: function (_id, _evt, _sub) {
                if (App.cart.getProduct(_id).pay) {
                    App.cart.selectPay(_id, false);
                } else {
                    App.cart.selectPay(_id, true);
                }
                this.testAllPay();
            },
            delPc: function (_id) {
                App.cart.removeshopcart(_id);
            },
            testAllPay: function () {
                if (App.cart.payAllState()) {
                    this.payAll = true;
                } else {
                    this.payAll = false;
                }
            },
            selectPayAll: function () {
                if (App.cart.payAllState()) {
                    App.cart.selectPayAll(false);
                    this.payAll = false;
                } else {
                    App.cart.selectPayAll(true);
                    this.payAll = true;
                }
            },
            changeInput: function (_sub, _evt) {
                var _val = parseInt(_evt.currentTarget.value);
                if (_.isNaN(_val) || _val < 1) {
                    _val = 1;
                    _evt.currentTarget.value = _val;
                }
                var _id = this.list[_sub].id;
                var _pid = App.cart.getProduct(_id).pid;
                var _opt = {
                    type: App.cart.getProduct(_id).kindtype,
                    cateid: App.cart.getProduct(_id).cateid,
                };
                var _count = App.cart.cartdb().products[_sub].count;
                var _num = _val - _count;
                if (_val > 9999) {
                    _num = 9999 - _count;
                }
                if (_num != 0) {
                    App.cart.addshopcart(_pid, _num, _opt);
                }
            },
            goBuy: function (_evt) {
                if (this.priceAll == 0) {
                    _evt.preventDefault();
                    App.alert("你还没有选择要购买的商品！", {
                        tips: true
                    });
                }
            }
        }
    });
    return v;
});

var App = App || {};
define([
    'uview',
    'text!tpl/b_order.html',
    'utopbar',
    'cart',
    'store'
], function (uview, tpl, utopbar, cart, store) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'border', //名称
            cxId: '#b-order', //视图ID
            cxWpid: '#b_order', //滚动区域的ID
            cxAutoload: true,
            cxAutoShow: true,
            cxPayVas: {},
            cxps: null,
            cxOderId: "",
            xcbInfo: null,
            appendComplete: function () {

            },
            cxCreated: function () {
                var _this = this;
                if (App.cart == null) {
                    //初始化购物车情况
                    App.cart = new cart('mycart');
                }
                if (App.buyInfo) {
                    this.cxps = App.buyInfo;
                    this.cxps.pids = _.pluck(App.buyInfo.servicelist, "pid").concat(_.pluck(App.buyInfo.shoplist, "pid"));
                    this.cxps.types = _.pluck(App.buyInfo.servicelist, "kindtype").concat(_.pluck(App.buyInfo.shoplist, "kindtype"));
                    this.cxps.nums = _.pluck(App.buyInfo.servicelist, "count").concat(_.pluck(App.buyInfo.shoplist, "count"));
                    this.cxps.ssubids = _.pluck(App.buyInfo.servicelist, "cateid").concat(_.pluck(App.buyInfo.shoplist, "cateid"));
                } else {
                    this.cxps = App.cart.getPayList();
                }
                this.servicelist = this.cxps.servicelist;
                this.shoplist = this.cxps.shoplist;
                this.recipient = App.user.info.recipient;
                this.cellphone = App.user.info.phone;
                this.fulladdress = App.user.info.fulladdress;
                //发送到服务端数据
                this.cxPayVas.pids = this.cxps.pids.join();
                this.cxPayVas.types = this.cxps.types.join();
                this.cxPayVas.nums = this.cxps.nums.join();
                this.cxPayVas.ssubids = this.cxps.ssubids.join();
                this.cxPayVas.addressid = App.user.info.addressid;
                this.cxPayVas.cpnum = "";
                this.cxPayVas.expressname = "";
                this.cxPayVas.paytype = 0;
                this.cxPayVas.device = "ios";
                this.cxPayVas.remarks = "";
                this.cxPayVas.isfirster = 0;
                if (App.cxmain.cxChildP.cxChildP) {
                    var _cpName = App.cxmain.cxChildP.cxChildP.cxName;
                    if (_cpName == "byouhui" || _cpName == "baddr") {
                        this.transitionName = "cxpFadeLeft";
                        if (typeof App.p.cpnum != "undefined") {
                            this.cxPayVas.cpnum = App.p.cpnum;
                            this.couponnum = App.p.cpnum;
                            this.cxPayVas.isfirster++;
                        }
                    }
                }
                if (App.p.address) {
                    this.cxPayVas.addressid = App.p.address.id;
                    this.recipient = App.p.address.name;
                    this.cellphone = App.p.address.cellphone;
                    this.fulladdress = App.p.address.province + App.p.address.city + App.p.address.region + App.p.address.street + App.p.address.room;

                }
                for (var k in this.pays) {
                    this.pays[k].show = false;
                }
                for (var j in this.express) {
                    this.express[j].isuse = false;
                }
                /*计算订单*/
                //this.orderReview();
                if (this.cxPayVas.addressid != 0) {
                    this.payReview();
                };
                if (App.p.invoic) this.invoice = App.p.invoic;
                if (App.p.remarks) this.remarks = App.p.remarks;
                this.$watch('invoice', function () {
                    App.p.invoic = _this.invoice;
                });
                this.$watch('remarks', function () {
                    App.p.remarks = _this.remarks;
                });
            },
            cxNextTick: function () {

            }
        },
        cxData: {
            transitionName: 'cxpRight',
            payamount: 0,
            couponamount: 0,
            disprice: 0,
            promotionstr: [],
            servicelist: [],
            shoplist: [],
            recipient: '', //收货人
            cellphone: '', //电话
            fulladdress: '', //收货地址
            couponname: '', //优惠券名称
            reccoupnum: '', //推荐优惠券码
            couponnum: '', //使用的优惠券码
            invoice: '', //发票抬头
            remarks: '', //说明
            youhui: false, //是否使用优惠券
            pays: {
                ALIPAY: {
                    name: "支付宝",
                    icon: "ico01",
                    payid: 1,
                    pay: false,
                    show: false
                },
                WXPAY: {
                    name: "微信支付",
                    icon: "ico02",
                    payid: 2,
                    pay: false,
                    show: false
                },
                DELIVERY: {
                    name: "货到付款",
                    icon: "ico03",
                    payid: 3,
                    pay: false,
                    show: false
                }
            },
            express: {
                WOW: {
                    key: "WOW",
                    name: "望厨",
                    icon: "ico04",
                    id: 1,
                    isuse: false,
                    price: 0,
                    show: false
                },
                SF: {
                    key: "SF",
                    name: "顺丰配送",
                    icon: "ico05",
                    id: 2,
                    isuse: false,
                    price: 0,
                    show: false
                }
            }
        },
        methods: {
            goyouhui: function () {
                this.transitionName = "cxpFadeRight";
            },
            /*设置支付类型*/
            setPayTp: function (_val, _evt) {
                for (var val in this.pays) {
                    this.pays[val].pay = false;
                };
                _val.pay = true;
                this.cxPayVas.paytype = _val.payid;
                this.expressReview();
            },
            /*设置快递方式*/
            setExpressTp: function (_val, _evt) {
                for (var val in this.express) {
                    this.express[val].isuse = false;
                };
                _val.isuse = true;
                this.cxPayVas.expressname = _val.key;
                this.orderReview();
            },
            /*设置优惠券*/
            setYouhui: function () {
                if (this.youhui) {
                    this.youhui = false;
                    this.cxPayVas.cpnum = "";
                } else {
                    if (this.couponnum == "" && this.reccoupnum != "") {
                        this.couponnum = this.reccoupnum;
                    }
                    if (this.cxPayVas.cpnum != "" && this.cxPayVas.cpnum != null) {
                        this.youhui = true;
                    }
                }
                this.orderReview();
            },
            /*订单价格计算*/
            orderReview: function () {
                App.loading(true);
                var _this = this;
                App.upData({
                    url: App.config.urlPath + "/v2/shop/OrderReview?" + App.config.accompany,
                    data: this.cxPayVas,
                    success: function (data) {
                        _this.cxPayVas.isfirster++;
                        App.loading(false);
                        if (data.state == 1) {
                            var _res = data.result;
                            _this.couponamount = _res.couponamount;
                            _this.promotionstr = _res.promotionstr;
                            _this.couponnum = _res.couponnum;
                            _this.reccoupnum = _res.reccoupnum;
                            _this.payamount = _res.payamount;
                            _this.disprice = _res.disprice;
                            if (_res.couponnum != null && _res.couponnum != "") {
                                _this.youhui = true;
                            }
                            _this.cxPayVas.cpnum = _this.couponnum;
                            _this.$nextTick(_this._cxNextTick);
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            /*获取支付方式*/
            payReview: function () {
                App.loading(true);
                var _this = this;
                App.upData({
                    url: App.config.urlPath + "/v2/shop/PayReview?" + App.config.accompany,
                    data: {
                        addressid: this.cxPayVas.addressid,
                        pids: this.cxPayVas.pids,
                        types: this.cxPayVas.types
                    },
                    success: function (data) {
                        App.loading(false);
                        if (data.state == 1) {
                            var _res = data.result;
                            var _i = 0;
                            var _lg = _res.list.length;
                            for (var kp = 0; kp < _lg; kp++) {
                                _this.pays[_res.list[kp].payname].show = true;
                                _this.pays[_res.list[kp].payname].payid = _res.list[kp].payid;
                                if (_i == 0) {
                                    _this.pays[_res.list[kp].payname].pay = true;
                                    _this.cxPayVas.paytype = _res.list[kp].payid;
                                    _i++;
                                } else {
                                    _this.pays[_res.list[kp].payname].pay = false;
                                }
                            }
                            _this.expressReview();
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            /*获取快递方式*/
            expressReview: function () {
                App.loading(true);
                var _this = this;
                App.upData({
                    url: App.config.urlPath + "/v2/shop/ExpressReview?" + App.config.accompany,
                    data: this.cxPayVas,
                    success: function (data) {
                        App.loading(false);
                        if (data.state == 1) {
                            var _res = data.result;
                            var _i = 0;
                            var _set=false;
                            for (var ke in _res.list) {
                                _this.express[_res.list[ke].expressname].show = _res.list[ke].isuse;
                                _this.express[_res.list[ke].expressname].id = _res.list[ke].id;
                                _this.express[_res.list[ke].expressname].price = _res.list[ke].price;
                                if(_res.list[ke].isuse&&!_set){
                                    _this.express[_res.list[ke].expressname].isuse = true;
                                    _this.cxPayVas.expressname = _res.list[ke].expressname;
                                    _set=true;
                                    _this.orderReview();
                                }else{
                                    _this.express[_res.list[ke].expressname].isuse = false;
                                }
                                _this.$nextTick(_this._cxNextTick);
                            }
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            /*提交订单*/
            upOrder: function () {
                this.cxPayVas.remarks = this.remarks;
                this.cxPayVas.invoice = this.invoice;
                App.loading(true);
                var _this = this;
                App.upData({
                    url: App.config.urlPath + "/v2/shop/SubmitOrder?" + App.config.accompany,
                    data: this.cxPayVas,
                    success: function (data) {
                        if (data.state == 1) {
                            //删除临时信息
                            App.p = {};
                            _this.cxOderId = data.result.ordernum;
                            App.trace(data.result.paymethod + ":" + data.result.ordernum);
                            App.trace(data.result.url);

                            if (data.result.paymethod != 3) {
                                if (App.n.pay) {
                                    //#ucenter/uordermx/
                                    var _pty = "alipay";
                                    if (data.result.paymethod == 2) _pty = "wxpay";
                                    App.n.pay.request(data.result.url, _pty, function (result) {
                                        window.location.href = "#ucenter";
                                        setTimeout(function () {
                                            window.location.href = "#ucenter/uordermx/" + data.result.ordernum;
                                        }, 600);
                                    }, function (error) {
                                        App.trace("支付失败：" + error.code);
                                        App.alert("您的付款未完成", {
                                            closed: function () {
                                                window.location.href = "#ucenter";
                                                setTimeout(function () {
                                                    window.location.href = "#ucenter/uorder/2";
                                                }, 600);
                                            }
                                        });
                                        App.pushMsg(1);
                                    });
                                    //刷新购物车
                                    App.cart.releasecart();
                                } else {
                                    App.alert("跳转支付中...");
                                    App.loading(false);
                                    window.location.href = data.result.url;
                                }
                            } else {
                                window.location.href = "#ucenter";
                                setTimeout(function () {
                                    window.location.href = "#ucenter/uordermx/" + data.result.ordernum;
                                }, 600);
                            }
                        } else {
                            App.loading(false);
                            App.alert(data.errordes);
                        }
                    }
                });
            }
        }
    });
    return v;
});

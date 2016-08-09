var App = App || {};
define([
	'uview',
	'text!tpl/u_order.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        data: function () {
            return {
                sa: true,
                sb: false,
                sc: false,
                sd: false
            }
        },
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uorder', //名称
            cxId: '#u-order', //视图ID
            cxWpid: '#u_order_list', //滚动区域的ID
            cxApi: '/v2/user/GcsUserOrderInfo',
            cxAutoload: true,
            cxAutoShow: true,
            cxVas: {
                type: 3
            },
            cxInit: function () {},
            cxCreated: function () {
                this.isGcs = App.user.info.isGcs;
                if (typeof this.$options.vas != "undefined") {
                    this.cxVas.type = parseInt(this.$options.vas);
                    this.changmu(this.cxVas.type);
                } else {
                    this.changmu(this.cxVas.type);
                }
                if (App.cxmain.cxChildP.cxChildP) {
                    if (App.cxmain.cxChildP.cxChildP.cxName == "uindex") {
                        this.transitionName = "cxpRight";
                    }
                }
            },
            cxReady: function () {
                this.$refs.utopbar.title = "工程师订单";
            },
            cxLoadDataSuccess: function (data) {},
            cxNextTick: function () {}
        },
        cxData: {
            transitionName: 'cxpFadeLeft',
            isGcs: 0
        },
        methods: {
            selectData: function (_val) {
                if (this.cxVas.type != _val) {
                    this.changmu(_val);
                    this.cxVas.type = _val;
                    this.loadData();
                }
            },
            changmu: function (_val) {
                this.sa = false;
                this.sb = false;
                this.sc = false;
                this.sd = false;
                switch (_val) {
                    case 1:
                        this.sa = true;
                        break;
                    case 2:
                        this.sb = true;
                        break;
                    case 3:
                        this.sc = true;
                        break;
                    case 4:
                        this.sd = true;
                        break;
                }
            },
            Aorder: function (_sub, _operation, _evt) {
                var _aid = _operation.id;
                switch (_aid) {
                    case 1:
                        this.Apay(_sub, _operation); //付款
                        break;
                    case 2:
                        this.Acancel(_sub, _operation); //撤销
                        break;
                    case 4:
                        this.Aother(); //退货
                        break;
                    case 7:
                        this.Adel(_sub, _operation); //工程师删除
                        break;
                    case 5:
                        this.Alog(_sub, _operation); //查看物流
                        break;
                    case 6:
                        this.Abuy(_sub, _operation); //重新下单
                        break;
                    case 8:
                        this.Abuy(_sub, _operation); //再次购买
                        break;
                    case 9:
                        this.Aworkreplist(_sub, _operation); //填写报告
                        break;
                    case 11:
                        this.AureportList(_sub, _operation); //查看报告
                        break;
                    case 12:
                        this.Adevice(_sub, _operation); //设备管理
                        break;
                    default:
                        this.Aother(_sub, _operation);
                }
            },
            Apay: function (_sub, _oper) {
                var _this = this;
                //正常支付地址
                var _url = App.config.urlPath + "/v2/pay/topay?" + App.config.accompany;
                var _vas = {
                    ordernum: this.list[_sub].ordernumber
                };
                //如果是货到付款方式，重新选择支付方式
                if (this.list[_sub].paymenthod == 3) {
                    this.selectPay(function (_paytype) {
                        if (_paytype != 0) {
                            _url = App.config.urlPath + "/v2/pay/deliverypay?" + App.config.accompany;
                            _vas.paytype = _paytype;
                            _this.upPay(_url, _vas);
                        }
                    });
                } else {
                    this.upPay(_url, _vas);
                }
            },
            Acancel: function (_sub, _oper) {
                var _this = this;
                App.alert("你确定要撤销此订单么?", {
                    confirm: {
                        onConfirm: function () {
                            App.upData({
                                url: _oper.url + "&" + App.config.accompany,
                                success: function (data) {
                                    if (data.state == 1) {
                                        _this.list.splice(_sub, 1);
                                    } else {
                                        App.alert(data.errordes);
                                    }
                                }
                            })
                        },
                        onCancel: function () {
                            //取消操作
                        }
                    }
                });
            },
            Aworkreplist: function (_sub, _oper) {
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/uworkreplist/" + this.list[_sub].ordernumber;
            },
            AureportList: function (_sub, _oper) {
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/ureportList/" + this.list[_sub].ordernumber;
            },
            Adel: function (_sub, _oper) {
                var _this = this;
                _oper.url = _oper.url.replace(/operationrole=0/, "operationrole=1");
                var _this = this;
                App.alert("确认删除么?", {
                    confirm: {
                        onConfirm: function () {
                            App.upData({
                                url: _oper.url + "&" + App.config.accompany,
                                success: function (data) {
                                    if (data.state == 1) {
                                        _this.list.splice(_sub, 1);
                                    } else {
                                        App.alert(data.errordes);
                                    }
                                }
                            });
                        }
                    }
                });
            },
            Alog: function (_sub, _oper) {
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/uorderlog/" + this.list[_sub].ordernumber;
            },
            Abuy: function (_sub, _oper) {
                App.loading(true);
                var _o = {};
                App.upData({
                    url: App.config.urlPath + '/v2/user/GetOrderBuyDetail?' + App.config.accompany,
                    data: {
                        ordernumber: this.list[_sub].ordernumber
                    },
                    success: function (data) {
                        var _shop=data.result.shop;
                        var _service=data.result.service;
                        _.map(_shop,function(v,k,list){
                            list[k].pay=true;
                            list[k].kindtype=0;
                        });
                        _.map(_service,function(v,k,list){
                            list[k].pay=true;
                            list[k].kindtype=1;
                        });
                        _o.servicelist=_service;
                        _o.shoplist=_shop;
                        App.loading(false);
                        App.buyInfo = _o;
                        window.location.href = "#buy/border";
                    }
                });
                this.transitionName = "cxpFadeRight";
            },
            Adevice: function (_sub, _oper) {
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/udevice/" + this.list[_sub].ordernumber;
            },
            Aother: function (_sub, _oper) {
                var _this = this;
                App.loading(true);
                App.upData({
                    url: _oper.url + "&" + App.config.accompany,
                    success: function (data) {
                        if (data.state == 1) {
                            App.loading(false);
                            _this.renData();
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                })
            },
            goPage: function () {
                this.transitionName = "cxpFadeRight";
            },
            selectPay: function (_fun) {
                var _paytype = 0;
                var _html = "<div class='selectPayMd'>";
                _html += "<h3 class='ui-border-b'>选择支付方式</h3>";
                _html += "<div class='am-g'>";
                _html += "<div class='am-u-sm-6 ui-border-r' id='zfbBtn'><img src='assets/imgs/ico01.png'></div>";
                _html += "<div class='am-u-sm-6' id='wxBtn'><img src='assets/imgs/ico02.png'></div>";
                _html += "</div>";
                _html += "</div>";

                App.alert(_html, {
                    tips: true,
                    acd: false,
                    closed: function () {
                        _fun(_paytype);
                    }
                });
                $("#zfbBtn").click(function () {
                    _paytype = 1;
                    App.alert("@close");
                });
                $("#wxBtn").click(function () {
                    _paytype = 2;
                    App.alert("@close");
                });
            },
            upPay: function (_url, _vas) {
                var _this = this;
                App.loading(true);
                App.upData({
                    url: _url,
                    data: _vas,
                    success: function (data) {
                        if (data.state == 1) {
                            _this.cxOderId = data.result.ordernum;
                            App.trace(data.result.paymethod + ":" + data.result.ordernum);
                            App.trace(data.result.url);
                            if (App.n.pay) {
                                //#ucenter/uordermx/
                                var _pty = "alipay";
                                if (data.result.paymethod == 2) _pty = "wxpay";
                                App.n.pay.request(data.result.url, _pty, function (result) {
                                    window.location.href = "#ucenter/uordermx/" + data.result.ordernum;
                                }, function (error) {
                                    App.trace("支付失败：" + error.code);
                                    App.alert("您的付款未完成", {
                                        closed: function () {
                                            window.location.href = "#ucenter/uorder/2";
                                        }
                                    });
                                });
                            } else {
                                App.alert("跳转支付中...");
                                App.loading(false);
                                window.location.href = data.result.url;
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
})

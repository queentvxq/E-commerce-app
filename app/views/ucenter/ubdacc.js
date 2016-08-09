var App = App || {};
define([
	'uview',
	'text!tpl/u_bdacc.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'ubdacc', //名称
            cxId: '#u-bdacc', //视图ID
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxCreated: function () {
                if (App.user.info.cellphone != "") {
                    this.phone = true;
                }
                this.wx = App.user.info.wxbind;
                if (App.cxmain.cxChildP.cxChildP) {
                    if (App.cxmain.cxChildP.cxChildP.cxName == "ubdphone") {
                        this.transitionName = "cxpFadeLeft";
                    }
                }

            },
            cxReady: function () {

            },
            cxNextTick: function () {},
            appendComplete: function () {
                //this.transitionName = "cxpFadeRight";
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            phone: false,
            wx: false
        },
        methods: {
            gobdphone: function () {
                this.transitionName = "cxpFadeRight";
            },
            buildWeixin: function () {
                if (this.wx) {
                    App.alert("您已绑定微信");
                } else {
                    var _this = this;
                    if (window.plus) {
                        App.trace("打开绑定内容");
                        plus.oauth.getServices(function (services) {
                            var auth = {};
                            for (var i = 0; i < services.length; i++) {
                                auth[services[i].id] = services[i];
                            }
                            if (auth.hasOwnProperty('weixin')) {
                                auth.weixin.login(function () { _this.upWeixnData(auth.weixin.authResult.access_token, auth.weixin.authResult.openid)
                                }, function (e) {
                                    App.trace("[" + e.code + "]：" + e.message);
                                    App.alert("绑定失败");
                                });
                            }
                        }, function () {
                            App.alert("无效的登录认证通道！");
                        });
                    } else {
                        App.alert("不能绑定");
                    }
                }
            },
            upWeixnData: function (_token, _openid) {
                App.trace("token：" + _token);
                App.trace("openid：" + _openid);
                var _this = this;
                App.upData({
                    url: App.config.urlPath + "/account/wxappBind?" + App.config.accompany,
                    data: {
                        token: _token,
                        openid: _openid
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            _this.wx = true;
                            App.alert("绑定成功");
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            }
        }
    });
    return v;
})

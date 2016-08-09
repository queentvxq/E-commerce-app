var App = App || {};
define(['jquery', 'cart'], function ($, cart) {
    /*获取用户购物车信息*/
    var relCart = function () {
        App.trace("获取用户线上购物车信息");
        App.cart = new cart('mycart');
        App.cart.releasecart();
    };
    /*获取通知信息*/
    var relNotice = function (_fun) {
        var _this = this;
        var _url = App.config.urlPath + "/v2/user/noticecount?token=" + App.config.token;
        App.upData({
            url: _url,
            success: function (data) {
                if (data.state == 1) {
                    App.user.notice = data.result;
                    if (typeof _fun != "undefined") {
                        _fun(data);
                    }
                } else {
                    App.trace(data.errordes);
                }
            }
        })
    };
    App.user = (function () {
        var _token = "";
        var _uid = "";
        var _rt = "web";
        var p = {
            device: null,
            info: null,
            notice: null,
            v: App.v,
            accompany: function () {
                var _str = "v=" + this.v;
                _str += "&token=" + _token;
                _str += "&rt=" + _rt;
                _str += "&uid=" + _uid;
                App.config.accompany = _str;
                return _str;
            },
            relnotice: relNotice,
            relcart: relCart
        };
        Object.defineProperty(p, "uid", {
            get: function () {
                if (localStorage.uid) {
                    _token = localStorage.uid;
                }
                return _uid;
            },
            set: function (_val) {
                _uid = _val;
                localStorage.uid = _val;
                this.accompany();
            }
        });
        Object.defineProperty(p, "rt", {
            get: function () {
                return _rt;
            },
            set: function (_val) {
                _rt = _val;
                this.accompany();
            }
        });
        Object.defineProperty(p, "token", {
            get: function () {
                if (typeof $.cookie('token') != "undefined") {
                    _token = $.cookie('token');
                } else {
                    if (localStorage.token) {
                        _token = localStorage.token;
                    }
                }
                return _token;
            },
            set: function (_val) {
                App.config.token = _token = _val;
                if (_val == "") {
                    localStorage.removeItem("token");
                    $.removeCookie('token');
                    $.cookie('UserLogin', '');
                    $.removeCookie('UserLogin');
                    $.removeCookie('tokenWeixin');
                } else {
                    $.cookie('token', _val);
                    localStorage.token = _val;
                }
                this.accompany();
            }
        });
        return p;
    }());
    /*获取用户信息数据*/
    App.ldUserinfo = function (_fun, _ren) {
        App.upData({
            url: App.config.urlPath + "/user/userinfo?token=" + App.config.token,
            success: function (data) {
                if (data.state == 1) {
                    App.user.info = data.result;
                    App.user.uid = data.result.userid;
                    App.cxmain.$refs.footbar.a_buy = "#buy";
                    App.trace("获取用户数据成功");
                    /*获取购物车*/
                    relCart();
                    /*获取通知*/
                    relNotice();
                    /*修改用户默认购买地址信息*/
                    App.user.info.recipient = data.result.recipient;
                    App.user.info.phone = data.result.cellphone;
                    App.user.info.fulladdress = data.result.fulladdress;
                    App.user.info.addressid = data.result.addressid;
                    if (typeof _fun != "undefined") {
                        _fun();
                    }
                    if (App.cxmain.cxChildP) {
                        if (App.cxmain.cxChildP.cxChildP) {
                            var _cpName = App.cxmain.cxChildP.cxChildP.cxName;
                            if (_cpName == "uindex") {
                                App.cxmain.cxChildP.cxChildP.avatar = App.user.info.avatar;
                                App.cxmain.cxChildP.cxChildP.nickname = App.user.info.nickname;
                                App.cxmain.cxChildP.cxChildP.gender = App.user.info.gender;
                                if (App.user.info.isGcs == 1) {
                                    App.cxmain.cxChildP.cxChildP.isGcs = true;
                                }
                            }
                        }
                    }
                } else {
                    App.trace("获取用户数据失败");
                }
            }
        });
    }
})

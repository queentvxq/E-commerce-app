var App = App || {};
define(['jquery'], function ($) {
    /*是否微信登陆用户*/
    App.isWeixin = function (n) {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    };
    /*微信用户自动登陆*/
    App.autoWeixin = function () {
        var _href = window.location.href;
        App.trace("_href:" + _href.indexOf("#"));
        if (_href.indexOf("#") > -1) _href = _href.substr(_href.indexOf("#") + 1);
        if (_href == "") _href = "ucenter";
        _href = "ftpara_" + _href;
        App.upData({
            url: App.config.urlPath + "/user/bindingweixin?",
            data: {
                type: 1,
                state: _href
            },
            success: function (data) {
                if (data.state == 1) {
                    App.trace("微信自动登陆成功：" + data.result.info);
                    if ($.cookie('tokenWeixin') != "tokenWeixin") {
                        $.cookie('tokenWeixin', "tokenWeixin");
                        App.tokenWeixin = true;
                        //微信自动登陆跳转
                        App.trace("微信跳转：" + data.result.info);
                        window.location.href = data.result.info;
                    } else {
                        $.removeCookie('tokenWeixin');
                        window.location.href = "#home";
                    }
                } else {
                    App.alert('用户登陆错误');
                }
            },
            error: function () {

            }
        });
    }
})

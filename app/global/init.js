var App = App || {};
define([
    'views/cxmain',
	'router',
    'animate',
    'cart',
    'alert',
    'lduserinfo',
    'weixin',
    'tool',
    'debug'
], function (main, router, animate, cart, alert, lduserinfo, weixin, tool, debug) {
    var startInit = 0; //0未开始初始化，1已经完成初始化
    /*微信自动登陆*/
    var autoLogin = function () {
        App.trace("自动登陆");
        //微信自动登陆
        if (App.isWeixin()) {
            /*设置用户来源*/
            App.user.rt = "weixin";
            App.trace("微信自动登陆");
            App.autoWeixin();
        } else {
            App.trace("手动登陆");
            $.removeCookie('token');
            App.config.token = '';
            App.trace("清空记录");
            //App.router.init("home");
            App.trace("开始路由->" + window.location.href);
        }
    };
    /*获取关于我们的信息*/
    var aboutApp = function () {
        var _url = App.config.urlPath + "/v2/about/index?" + App.config.accompany;
        App.upData({
            _this: this,
            url: _url,
            success: function (data) {
                if (data.state == 1) {
                    App.about = data.result;
                } else {
                    App.trace(data.errordes);
                }
            }
        })
    };
    /*创建调试器*/
    App.debug = debug;
    /*系统初始化*/
    App.init = function (_fun) {
        /*App初始化退出全屏*/
        if (App.n.ok) plus.navigator.setFullscreen(false);
        App.trace("当前版本：" + App.v);
        App.trace("init start");
        /*开启初始化调试*/
        if (App.config.debug == "15d8d8449dd86cf95deefb4b6a0aad14") {
            App.debug.init();
        }
        //设置条数输出窗口事件
        $("#trace").click(function () {
            $(this).toggleClass('act');
        });
        //去除首页loading动画
        $(".loading").fadeOut("fast", function () {
            $(".loading").remove();
        });
        //初始化主容器
        App.cxmain = new main();
        App.cxmain.$mount().$appendTo('#main');
        //初始化购物车情况（本地购物车信息）
        App.cart = new cart('mycart');
        //获取服务端登陆情况信息（本地历史登陆信息）
        if ($.cookie('UserLogin')) {
            App.user.token = $.cookie('UserLogin');
        }
        /*获取关于我们*/
        aboutApp();
        //创建路由对象并开始
        App.router = router;
        App.router.init("home");
        //是否微信
        if (App.isWeixin()) {
            /*设置用户来源*/
            App.user.rt = "weixin";
        }
        //判断本地登录情况
        if (App.user.token != "undefined") {
            App.config.token = App.user.token;
            /*验证本地token是否和线上的token比对正确*/
            App.trace("验证 token");
            App.upData({
                url: App.config.urlPath + "/account/verifytoken?token=" + App.config.token,
                success: function (data) {
                    if (data.state == 1) {
                        if (data.result.valid) {
                            App.trace("验证token有效->获取用户信息");
                            App.ldUserinfo(function () {
                                App.trace("开始路由->" + window.location.href);
                            });
                        } else {
                            autoLogin();
                        }
                    } else {
                        App.state = 401;
                        if (data.errordes == "") {
                            App.alert(data.result.info);
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                },
                error: function () {
                    App.state = 401;
                    App.alert('获取服务器数据错误');
                }
            });
        } else {
            autoLogin();
        }
    }
    return App.init;
})

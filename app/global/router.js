var App = App || {};
define([
	'director'
], function (Director) {
    /*登陆*/
    var login = function () {
        openPage("login", 'lindex');
    };
    /*首页*/
    var index = function (child, vas) {
        if (typeof child == "undefined") {
            openPage("home", 'hindex');
        } else {
            openPage("home", {
                child: child,
                vas: vas
            });
        }
    };
    /*发现（商城、服务）*/
    var mall = function (child, vas) {
        if (typeof child == "undefined") {
            openPage("mall", 'mindex');
        } else {
            openPage("mall", {
                child: child,
                vas: vas
            });
        }
    };
    /*购物车*/
    var buy = function (child, vas) {
        if (App.user.info == null) {
            window.location.href="#ucenter/uorder";
        } else {
            if (typeof child == "undefined") {
                openPage("buy", 'bcart');
            } else {
                openPage("buy", {
                    child: child,
                    vas: vas
                });
            }
        }
    };
    /*用户中心*/
    var ucenter = function (child, vas) {
        if (typeof child == "undefined") {
            openPage("ucenter", 'uindex');
        } else {
            if (child == "umsg") {
                if (App.user.info == null) {
                    window.history.back();
                    App.login.show();
                    return false;
                }
            }
            openPage("ucenter", {
                child: child,
                vas: vas
            });
        }
    };
    /*注册*/
    var reg = function () {
        openPage("reg");
    };

    /*重置密码*/
    var reset = function () {
        openPage("reset");
    };

    var openPage = function (_page, _obj) {
        App.trace("开始" + _page + " Location:" + window.location.href);
        App.cxmain.openChild(_page, _obj);
    }

    var routes = {
        '#': index,
        '/home': index,
        '/home/:child': index,
        '/home/:child/:vas': index,
        '/mall': mall,
        '/mall/:child': mall,
        '/mall/:child/:vas': mall,
        '/buy': buy,
        '/buy/:child': buy,
        '/buy/:child/:vas': buy,
        '/ucenter': ucenter,
        '/ucenter/:child': ucenter,
        '/ucenter/:child/:vas': ucenter,
        '/login': login,
        '/reg': reg,
        '/reset': reset
    };

    var router = new Router(routes);
    router.configure({
        on: function () {
        },
        before: function (a) {

        }
    });
    return router;
})

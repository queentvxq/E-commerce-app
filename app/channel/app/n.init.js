var App = App || {};
define([
    'channel/app/n.pay',
    'channel/app/n.share',
    'channel/app/n.push',
    'channel/app/n.vcheck',
    'channel/app/n.device',
    'channel/app/n.index'
], function (pay, share, push, vcheck, device, index) {
    App.n.init = function (_fun) {
        App.n.ok = true;
        /*获取设备情况*/
        App.n.device = device().init();
        /*设置用户来源*/
        App.user.rt = "app";
        /*初始化支付情况*/
        App.n.pay = pay().init();
        /*检测网络*/
        if (App.n.device.testnetwork()) {
            /*初始化推送服务插件*/
            App.n.push.init();
            /*版本检测*/
            App.n.vcheck.init();
        }
        /*设置安卓返回键*/
        var _it = null;
        var _bk = 0;
        plus.key.addEventListener('backbutton', function (e) {
            if (App.cxmain.cxChildP.cxChildP) {
                var _cxName = App.cxmain.cxChildP.cxChildP.cxName;
                App.trace("后退前页面：" + _cxName);
                if (_cxName == "hindex") {
                    _bk++;
                    if (_it) {
                        clearTimeout(_it);
                    }
                    _it = setTimeout(function () {
                        _bk = 0;
                    }, 500);
                    if (_bk > 1) {
                        plus.runtime.quit();
                    }
                    return false;
                }
            }
            window.history.back();
        }, false);
        /*运行环境从后台切换到前台事件*/
        document.addEventListener("resume", function (e) {
            App.trace("回到系统");
            App.loading(false);
        }, false);
    }
    if (window.plus) {
        App.n.init();
    } else {
        document.addEventListener("plusready", App.n.init, false);
    }
    return App.n;
})

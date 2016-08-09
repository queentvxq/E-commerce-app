var App = App || {};
define(['store'], function (store) {
    App.n.push = {
        init: function () {
            this.addEventListener();
            this.upCinfo();
        },
        clientInfo: null,
        addEventListener: function () {
            plus.push.addEventListener("click", function (msg) {
                // 分析msg.payload处理业务逻辑
                App.trace("clickPayload:" + msg.payload);
                App.trace("clickContent:" + msg.content);
                if (msg.payload.url) {
                    if (msg.payload.url != "") {
                        if (App.config.token != "") {
                            window.location.href = "#" + msg.payload.url;
                        } else {
                            window.location.href = "#home";
                            setTimeout(function () {
                                window.location.href = "#" + msg.payload.url;
                            });
                        }
                    }
                }
            }, true);
            plus.push.addEventListener("receive", function (msg) {
                // 分析msg.payload处理业务逻辑
                App.trace("payload:" + msg.payload);
                for (var k in msg.payload) {
                    App.trace("payload." + k + ":" + msg.payload[k]);
                }
                plus.push.clear();
                plus.runtime.setBadgeNumber(0);
            }, true);
        },
        upCinfo: function () {
            this.clientInfo = new store('ClientInfo');
            var _this = this;
            var _cInfo = plus.push.getClientInfo();
            var _url = App.config.urlPath + "/v2/device/adddevice?" + App.config.accompany;
            App.upData({
                _this: this,
                url: _url,
                data: {
                    cid: _cInfo.clientid,
                    token: _cInfo.token,
                    uuid: _cInfo.token,
                    system: plus.os.name,
                    version: plus.os.version
                },
                success: function (data) {
                    if (data.state == 1) {
                        /*设置信息红点数量*/
                        _this.clientInfo.set('db', _cInfo);
                    } else {
                        App.trace(data.errordes);
                    }
                }
            });
            App.trace("获取消息数量");
            plus.runtime.setBadgeNumber(0);
            var _mgs = plus.push.getAllMessage();
            if (_mgs) {
                plus.runtime.setBadgeNumber(_mgs.length);
                App.trace("消息数量:" + _mgs.length);
            }
        }
    }

    return App.n.pay;
})

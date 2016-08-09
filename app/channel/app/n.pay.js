var App = App || {};
define(function () {
    var _pay = function () {
        return {
            init: function () {
                this.getChannel();
                return this;
            },
            channels: null,
            channel: null,
            getChannel: function (_fun) {
                var _this = this;
                plus.payment.getChannels(function (cs) {
                    _this.channels = cs;
                    for (var k in cs) {
                        App.trace("支付类型：" + cs[k].id + ":" + cs[k].description)
                    }
                    _this.channel = cs[0];
                }, function (e) {
                    App.trace("获取支付通道失败：" + e.message);
                });
            },
            request: function (_statement, _pay,_success,_error) {
                for (var k in this.channels) {
                    if (this.channels[k].id == _pay) {
                        this.channel = this.channels[k];
                        break;
                    }
                }
                plus.payment.request(this.channel, _statement, function (result) {
                    App.loading(false);
                    _success(result);
                }, function (error) {
                    App.loading(false);
                    _error(error);
                });
            }
        }
    }
    return _pay;
})

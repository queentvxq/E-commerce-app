var App = App || {};
define(['store'], function (store) {
    App.n.vcheck = {
        mv: 0, //最小版本
        nv: 0, //最新版本
        uv: 0, //用户版本
        wv: 0, //跳过版本
        vstore: null,
        init: function () {
            this.vstore = new store('vstore');
            var _this = this;
            App.upData({
                url: App.config.urlPath + '/v2/device/CheckVersion?' + App.config.accompany,
                success: function (data) {
                    if (data.state == 1) {
                        App.nv = data.result;
                        _this.vstore.set("v", App.nv);
                        _this.nv = _this.formatv(App.nv.version);
                        _this.mv = _this.formatv(App.nv.minversion);
                        _this.uv = _this.formatv(App.v);
                        if (typeof _this.vstore.get("wv") == "undefined") {
                            _this.vstore.set("wv", App.v);
                        }
                        _this.wv = _this.formatv(_this.vstore.get("wv"));
                        _this.test();
                    }
                }
            });
        },
        /*子版本号不超两位，修正版本号不超三位*/
        formatv: function (_val) {
            var _sArr = _val.split(".");
            var _v = parseInt(_sArr[0]) * 10000 + parseInt(_sArr[1]) * 100 + parseInt(_sArr[2]) / 1000;
            return _v;
        },
        test: function () {
            if (this.uv < this.mv) {
                this.warn();
            } else if (this.wv != this.nv && this.uv < this.nv) {
                this.warn();
            }
        },
        warn: function () {
            var _this = this;
            var _jclose = false;
            var _html = "<div class='vvs'>";
            if (this.uv < this.mv) {
                _html += "<div class='ui-border-b'>望厨有新版本了，体验一下吧</div>";
                _html += "<a class='getVBtn' id='gvA'>马上更新</a>";
                _jclose = true;
            } else {
                _html += "<div class='ui-border-b'>望厨有新版本了，体验一下吧</div>";
                _html += "<a class='getVBtn ui-border-b' id='gvA'>马上更新</a>";
                _html += "<a class='getVBtn ui-border-b' id='gvB'>稍后提醒</a>";
                _html += "<a class='getVBtn' id='gvC'>不再提醒</a>";
            }
            _html += "</div>";

            App.alert(_html, {
                tips: true,
                acd: false,
                jclose: _jclose
            });

            $("#gvA").click(function () {
                App.alert("@close");
                if (plus.os.name == "Android") {
                    window.location.href = App.nv.androidurl;
                } else {
                    window.location.href = App.nv.iosurl;
                }
            });

            $("#gvB").click(function () {
                App.alert("@close");
            });

            $("#gvC").click(function () {
                _this.vstore.set("wv", App.nv.version);
                App.alert("@close");
            });
        }
    }
    return App.n.vcheck;
})

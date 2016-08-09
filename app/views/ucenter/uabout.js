var App = App || {};
define([
	'uview',
	'text!tpl/u_about.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uabout', //名称
            cxId: '', //视图ID
            cxWpid: '', //滚动区域的ID
            cxApi: '',
            cxAutoload: true,
            cxAutoShow: true,
            upnameTime: null,
            _it: null,
            _bk: 0,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {
                var _this = this;
                App.upData({
                    url: App.config.urlPath + '/v2/device/CheckVersion?' + App.config.accompany,
                    data: {},
                    success: function (data) {
                        _this.version = data.result.version;
                    }
                });
                this.v = App.user.v;
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            version: '',
            v: ''
        },
        methods: {
            unameChange: function () {
                if (this.upnameTime) {
                    clearTimeout(this.upnameTime);
                } else {
                    this.upnameTime = setTimeout(function () {
                        _this.upData();
                    }, 500)
                }
                this.upData();
            },
            down: function () {
                App.down();
            },
            odebug: function () {
                var _this=this;
                this._bk++;
                if (this._it) {
                    clearTimeout(this._it);
                }
                this._it = setTimeout(function () {
                    _this._bk = 0;
                }, 1000);
                if (this._bk > 2) {
                    if (!App.debug.show) {
                        if (App.debug._init) {
                            App.debug.open();
                        } else {
                            App.debug.init();
                        }
                    } else {
                        App.debug.close();
                    }
                }
            }
        }
    });
    return v;
})

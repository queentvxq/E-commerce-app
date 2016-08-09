var App = App || {};
define([
    'uview',
    'text!tpl/halbum.html',
    'utopbar',
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'halbum',
            cxId: '#h_album',
            cxWpid: '#h_album',
            cxAutoload: true,
            cxAutoShow: true,
            cxApi: '',
            cxInit: function () {
                App.footbar(false);
            },
            cxCreated: function () {
                var _this = this;
                this.cxVas.id = this.$options.vas;
                App.upData({
                    url: App.config.urlPath + "/SpecialShopShow/SpecialShow?"+App.config.accompany,
                    data: {
                        id: this.$options.vas
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            _this.list = data.result.list;
                            _this.type = data.result.type;
                            _this.title = data.result.title;
                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                    }
                });
            },
            appendComplete: function () {
                this.cHeight = $("#h_album").height();
                this.heightSet();
            },
        },
        cxData: {
            transitionName: 'cxpRight',
            title: '',
            type: ''
        },
        methods: {
            goBack: function () {
                if (window.history.length > 2) {
                    window.history.back();
                } else {
                    window.location.href = "#home";
                }
            },
            share: function () {
                var content = this.title;
                var href = '#home/halbum/' + this.$options.vas;
                var type = 2;
                App.n.share.share(content, href, type);
            },
            heightSet: function () {
                var _self = this;
                setTimeout(function () {
                    if ($("#h_album").height() != _self.cHeight) {
                        _self.cHeight = $("#h_album").height();
                    }
                    _self.heightSet();
                }, 1000);
                _self.vScroll.refresh();
            }
        }
    });
    return v;
});


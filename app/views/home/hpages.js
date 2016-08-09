var App = App || {};
define([
    'uview',
    'text!tpl/hpages.html',
    'store'
], function (uview, tpl, store) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'hpages',
            cxId: '#h_pages',
            cxWpid: '#h_pages',
            probeType: 3,
            cxAutoload: true,
            cxAutoShow: true,
            cxApi: '/v2/shop/AnthologyDetail',
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {
                this.vScroll.on('scroll', function () {
                    $('#slider').css({
                        'top': -this.y / 2
                    });
                });
            },
            cxCreated: function () {
                this.cxVas.pagesize = 50;
                this.cxVas.id = this.$options.vas;
                this.imgHeight = parseInt($(window).width() * 0.56);//top imgs height setting
                this.list_imgHeight = parseInt($(window).width() * 0.9 * 0.565) + 'px';//list images width & height
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            back: function () {
                if (window.history.length > 2) {
                    window.history.back();
                } else {
                    window.location.href = "#home";
                }
            },
            share: function () {
                var content = '品质生活';
                var href = '#home/hpages/' + this.$options.vas;
                var type = 2;
                App.n.share.share(content, href, type);
            },
            likeit: function (id, isfav, index) {
                var _this = this;
                var h_store = new store('home');
                var local = h_store.get('indexGoods');
                App.loading(true);
                App.upData({
                    url: App.config.urlPath + "/shop/addmyfavorite?" + App.config.accompany,
                    data: {
                        pid: id,
                        type: isfav ? 1 : 0
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            for (var i in local.list) {
                                if (local.list[i].l.id == id) {
                                    h_store.set("indexGoods.list[" + i + "].l.iscollection", !isfav);
                                }
                            }
                            _this.goods.list[index].iscollection = !isfav;
                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                        App.loading(false);
                    },
                    error: function () {
                        App.alert('获取数据错误');
                        App.loading(false);
                    }
                });

            }
        }
    });
    return v;
});


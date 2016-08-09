var App = App || {};
define([
    'vue',
    'uview',
    'text!tpl/hindex.html',
    'store',
    'lazyload',
    'slider',
], function (Vue, uview, tpl, store, lazyload, slider) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'hindex',
            cxId: '#h_index',
            cxWpid: '#h_index',
            probeType: 3,
            cxAutoload: true,
            cxAutoShow: true,
            api1: '/V2/Shop/Index',
            api2: '/V2/Shop/IndexGoods',
            h_store: null,
            cxInit: function () {
                App.footbar(true);
            },
            cxData: {
                transitionName: 'cxpFadeLeft'
            },
            plusPage: function () {
                var _this = this;
                this.h_store = new store('home');
                this.cxAllPage = this.h_store.get('allpage') || 1;
                if (this.cxPage < this.cxAllPage) {
                    this._cxRenderAfterPut();
                    this.vScroll.scrollBy(0, -1);
                    this.$loading.text('加载中...');
                    this.cxVas = {
                        page: this.cxVas.page + 1,
                        pagesize: 10
                    }
                    this.getData(_this.api2);
                } else {
                    this.$loading.text('无更多数据');
                    this.cxPageEnd = true;
                }
            },
            cxReady: function () {
                var _this = this;
                var slickset = {
                    centerMode: true,
                    arrows: false,
                    dots: false,
                    infinite: true,
                    centerPadding: 0,
                    variableWidth: true,
                    slidesToShow: 1,
                    speed: 500,
                }
                $("#collection").slick(slickset);
                
                _this.myslider();
                $('#myslider').imagesLoaded().done(function () {
                    setTimeout(function () {
                        _this.myslider();
                    }, 2000);
                });
                $('#collection').imagesLoaded().done(function () {
                    setTimeout(function () {
                        $('#collection').slick('unslick');
                        $("#collection").slick(slickset);
                    }, 1500);
                });
                this.vScroll.on('scroll', function () {
                    $('#myslider').css({
                        'top': -this.y / 2
                    });
                });
            },
            cxCreated: function () {
                var _this = this;
                if (App.user.notice) {
                    if (App.user.notice.messagecount > 0) {
                        this.new = true;
                    }
                }
                _this.h_store = new store('home');
                var check = _this.h_store.get('check');
                var getinfo = {};
                _this.midH = $(window).width() * 0.56 + 'px';//轮播图片高度;选集高度;商品图片
                _this.cH = $(window).width() * 0.7 * 0.53 + 'px';
                _this.cW = $(window).width() * 0.7 + 'px';

                if (check) {
                    App.upData({
                        url: App.config.urlPath + "/v2/shop/checkcache",
                        success: function (data) {
                            getinfo = {
                                "slider": data.result.adversion,     //首页轮播版本
                                "col": data.result.collversion,      //选集版本版本
                                "list": data.result.indexgoodsversion,//首页商城和服务版本
                                "specailcolumn": data.result.specailcolumnversion//专题版本
                            }
                            _this.h_store.set("check", getinfo);
                            if (check.slider !== data.result.adversion || check.col !== data.result.collversion || check.specailcolumn !== data.result.specailcolumnversion) {
                                _this.advertisement = [];
                                _this.anthology = [];
                                _this.getData(_this.api1);
                            } else {
                                _.each(_this.h_store.get('index'), function (val, key) {
                                    Vue.set(_this, key, val);
                                    _this.$nextTick(_this._cxNextTick);
                                });
                            }
                            if (check.list !== data.result.indexgoodsversion) {
                                _this.list = [];
                                _this.getData(_this.api2);
                            } else {
                                _.each(_this.h_store.get('indexGoods'), function (val, key) {
                                    Vue.set(_this, key, val);
                                    _this.$nextTick(_this._cxNextTick);
                                });
                            }
                            $(_this.cxWpid).children().append(_this.$loading);
                        }
                    });
                } else {
                    _this.list = [];
                    App.upData({
                        url: App.config.urlPath + "/v2/shop/checkcache",
                        success: function (data) {
                            getinfo = {
                                "slider": data.result.adversion,
                                "col": data.result.collversion,
                                "list": data.result.indexgoodsversion,
                                "specailcolumn": data.result.specailcolumnversion
                            }
                            _this.h_store.set("check", getinfo);
                            _this.getData(_this.api1);
                            _this.getData(_this.api2);
                        }
                    });
                }
            }
        },
        methods: {
            myslider: function () {
                $('#myslider').flexslider({
                    directionNav: false,
                    pauseOnAction: true,
                    slideshowSpeed: 3900,
                    playAfterPaused: 800,
                    before: function (slider) {
                        if (slider._pausedTimer) {
                            window.clearTimeout(slider._pausedTimer);
                            slider._pausedTimer = null;
                        }
                    },
                    after: function (slider) {
                        var pauseTime = slider.vars.playAfterPaused;
                        if (pauseTime && !isNaN(pauseTime) && !slider.playing) {
                            if (!slider.manualPause && !slider.manualPlay && !slider.stopped) {
                                slider._pausedTimer = window.setTimeout(function () {
                                    slider.play();
                                }, pauseTime);
                            }
                        }
                    }
                });
            },
            getData: function (api) {
                var _this = this;
                var setname;
                if (api == '/V2/Shop/Index') {
                    setname = 'index';
                } else {
                    setname = 'indexGoods';
                }
                App.upData({
                    url: App.config.urlPath + api + "?" + App.config.accompany,
                    data: _this.cxVas,
                    success: function (data) {
                        console.log(data);
                        if (data.state == 1) {
                            if ((data.result.list instanceof Array)) {
                                _this.cxPage = data.result.page;
                                if (_this.list.length < 1) {
                                    _this.cxAllPage = Math.ceil(data.result.total / data.result.size);
                                    _this.h_store.set('allpage', _this.cxAllPage);
                                    if (data.result.list.length > 0) {
                                        for (var i = 0; i < data.result.list.length; i++) {
                                            _this.list.push({ l: data.result.list[i], n: i });
                                        }
                                        data.result.list = _this.list;
                                        _this.h_store.set(setname, data.result);
                                        if (_this.cxPage < _this.cxAllPage) {
                                            $(_this.cxWpid).children().append(_this.$loading);
                                        }
                                    }
                                } else {
                                    var x = _this.list.length;
                                    for (var i = 0; i < data.result.list.length; i++) {
                                        _this.list.push({ l: data.result.list[i], n: x + i });
                                    }
                                }
                            } else {
                                _.each(data.result, function (val, key) {
                                    Vue.set(_this, key, val);
                                });
                                _this.h_store.set(setname, data.result);
                            }
                            _this.$nextTick(_this._cxNextTick);
                            _this._cxRenderAfterPut();
                        }
                    }
                });
            },
            updatalike: function (id, isfav, num) {
                var _this = this;
                App.loading(true);
                var local = _this.h_store.get('indexGoods');
                App.upData({
                    url: App.config.urlPath + "/shop/addmyfavorite" + "?=" + App.config.accompany,
                    data: {
                        pid: id,
                        type: isfav ? 1 : 0
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            if (num < local.list.length)
                                _this.h_store.set("indexGoods.list[" + num + "].l.iscollection", !isfav);
                            for (var i in _this.list) {
                                if (_this.list[i].l.id == id)
                                    _this.list[i].l.iscollection = !isfav;
                            }
                        } else {
                            data.errordes == "" ? App.alert(data.result.info) : App.alert(data.errordes);
                        }
                        App.loading(false);
                    },
                    error: function () {
                        App.alert('获取数据错误');
                        App.loading(false);
                    }
                });
            },
            clearSearchInfo: function(){
                App.lastOne = {};
                window.location.href = "#mall/search";
            }
        }
    });
    return v;
});

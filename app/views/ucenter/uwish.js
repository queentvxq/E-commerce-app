var App = App || {};
define([
    'uview',
    'text!tpl/u_wish.html',
    'utopbar',
    'cart',
    'store'
], function (uview, tpl, utopbar, cart, store) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uwish', //名称
            cxId: '#u-wish', //视图ID
            cxWpid: '#u_uish_list', //滚动区域的ID
            cxApi: '/user/mycollection',
            cxAutoload: true,
            cxAutoShow: true,
            pan_mc: {
                it: 0,
                unlock: false,
                pan: null,
                obj: null,
                x: 0,
                mvX: 0,
                mvY: 0
            },
            Hammer: null,
            cxInit: function () { },
            cxReady: function () { },
            cxCreated: function () {
                if (App.cart == null) {
                    //初始化购物车情况
                    App.cart = new cart('mycart');
                    App.cart.releasecart();
                }
            },
            appendComplete: function () {
                this.Hammer = $.AMUI.Hammer;
                var _det = this.Hammer.DIRECTION_ALL;
                $(".usitempc").on('touchstart', this.iPanStart);
            },
            cxRenderAfterPut: function () {
                $(".usitempc").off();
                $(".usitempc").on('touchstart', this.iPanStart);
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            addCart: function (_id) {
                App.loading(true);
                App.cart.addshopcart(_id, 1, {
                    type: 0,
                }, function () {
                    App.loading(false);
                    App.alert("添加购物车成功",{tips:true});
                });
            },
            delWish: function (_sub, _id) {
                App.loading(true);
                var _this = this;
                var _url = App.config.urlPath + "/shop/addmyfavorite?" + App.config.accompany;

                var h_store = new store('home');
                var local = h_store.get('indexGoods');

                App.upData({
                    url: _url,
                    data: {
                        pid: _id,
                        type: 1
                    },
                    success: function (data) {
                        App.loading(false);
                        if (data.state != 1) {

                            App.alert(data.errordes);
                        } else {
                            //local product changes
                            if (local) {
                                for (var i in local.list) {
                                    if (local.list[i].l.id == _id) {
                                        h_store.set("indexGoods.list[" + i + "].l.iscollection", false);
                                    }
                                }
                            }
                            _this.list.splice(_sub, 1);
                        }
                    }
                });
            },
            iPanStart: function (evt) {
                var _this = this;
                //evt.preventDefault();
                if (this.pan_mc.pan != evt.currentTarget && this.pan_mc.pan != null) {
                    this.pan_mc.obj.removeClass("act ren");
                    this.pan_mc.obj.addClass("ren");
                    var _obj = this.pan_mc.obj;
                    var _i = setTimeout(function () {
                        _obj.css({
                            "left": 0
                        });
                        clearTimeout(_i);
                    }, 300);
                }
                this.pan_mc.mvX = evt.originalEvent.touches[0].clientX;
                this.pan_mc.mvY = evt.originalEvent.touches[0].clientY;

                this.pan_mc.pan = evt.currentTarget;
                this.pan_mc.obj = $(evt.currentTarget);

                this.pan_mc.x = this.pan_mc.obj.offset().left;
                this.pan_mc.obj.removeClass("act ren");
                $(".usitempc").on('touchmove', this.iPanMove);
                $(".usitempc").on('touchend', this.iPanEnd);
                this.pan_mc.unlock = false;
                this.pan_mc.it = setTimeout(function () {
                    _this.pan_mc.unlock = true;
                }, 100);
            },
            iPanMove: function (evt) {
                var _mvX = evt.originalEvent.touches[0].clientX - this.pan_mc.mvX;
                var _mvY = evt.originalEvent.touches[0].clientY - this.pan_mc.mvY;
                if (Math.abs(_mvX) < Math.abs(_mvY)) {
                    clearTimeout(this.pan_mc.it);
                } else if (_mvX < -100) {
                    this.pan_mc.unlock = true;
                }
                if (this.pan_mc.unlock) {
                    var _x = this.pan_mc.x + _mvX;
                    if (_x > -150 && _x < 30) {
                        this.pan_mc.obj.offset({
                            left: _x
                        });
                    }
                }
            },
            iPanEnd: function (evt) {
                var _this = this;
                if (this.pan_mc.obj.position().left < -50) {
                    this.pan_mc.obj.addClass("act");
                    var _i = setTimeout(function () {
                        _this.pan_mc.obj.css({
                            "left": "-90px"
                        });
                        clearTimeout(_i);
                    }, 300);
                } else {
                    this.pan_mc.obj.addClass("ren");
                    var _i = setTimeout(function () {
                        _this.pan_mc.obj.css({
                            "left": 0
                        });
                        clearTimeout(_i);
                    }, 300);
                }
                $(".usitempc").off('touchmove');
                $(".usitempc").off('touchend');
            }
        }
    });
    return v;
})

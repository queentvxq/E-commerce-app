var App = App || {};
define([
    'vue',
	'uview',
	'text!tpl/m_product.html',
    'store'
], function (Vue, uview, tpl,store) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'mproduct', //名称
            cxId: '#m-main', //视图ID
            cxWpid: '#m-detail-wrapper', //滚动区域的ID
            cxApi:'/V2/Shop/ProductResDetails',
            cxAutoload: false,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
                App.buyInfo = {};
            },
            cxReady: function () {
                var _self = this;
                $('#m-detail-title .am-slider').flexslider({
                    directionNav: false,
                    slideshow: true,
                    pauseOnHover: true,
                    animationLoop: false,
                    start: function () {
                        if(_self.vScroll){
                            _self.vScroll.refresh();
                        }
                    }
                });
                if(App.config.token&&App.cart.count>0){//登录后且购物车中商品数量不为0,显示购物车中商品数量
                    this.islogged = true;
                }
            },
            cxCreated: function () {
                var _this = this;
                if (App.cart == null) {
                    //初始化购物车情况
                    App.cart = new cart('mycart');
                    App.cart.releasecart();
                }
                _this.cartCount = App.cart.count;
                App.cart.on('cartChange', function () {
                    _this.cartCount = App.cart.count;
                    if(App.config.token&&App.cart.count>0){//登录后且购物车中商品数量不为0,显示购物车中商品数量
                        _this.islogged = true;
                    }
                });
            },
            appendComplete: function(){
                this.$scrollCon = $("#mViews");
                this.cHeight = this.$scrollCon.height();
                this.containerResize();
                // this.relateSerSelected = {};//清空选中搭配服务
                // this.relateProSelected = {};
                // this.defereds();
            },
            cxRenderAfterPut: function(){
                this.defereds();
            }
        },
        cxData: {
            count:1,
            iscollection: false,
            // relateSerSelected: {},//选中搭配服务
            // relateProSelected: {},//选中搭配商品
            cHeight:0,//滚动区域高度
            cartCount:0,//购物车数量
            related:false,//是否显示搭配购买
            islogged:false,//登录后且购物车中商品数量不为0,显示购物车中商品数量
        },
        methods: {
            addToWish: function(){
                if(App.config.token){
                    App.loading(true);
                    var _self = this,
                    _c = this.iscollection,
                    id = this.id;
                    //local product changes
                    var h_store = new store('home');
                    var local = h_store.get('indexGoods');
                    App.upData({
                        url: App.config.urlPath + "/shop/addmyfavorite?" + App.config.accompany,
                        data: {pid:id,type:_c?1:0},
                        success: function (data) {
                            if (data.state == 1) {
                                //local product changes
                                if(local){
                                    for (var i in local.list) {
                                        if (local.list[i].l.id == id) {
                                            h_store.set("indexGoods.list[" + i + "].l.iscollection", !_c);
                                        }
                                    }
                                }
                                _self.iscollection = _c?false:true;
                            } else {
                                if (data.errordes != "") {
                                    App.alert(data.errordes);
                                } else {
                                    App.alert(data.result.info);
                                }
                            }
                            App.loading(false);
                        },
                        error: function () {
                            App.alert('获取数据错误');
                            App.loading(false);
                        }
                    });
                }else{
                    App.login.show();
                }
                
            },
            containerResize: function(){
                var _self = this;
                setTimeout(function(){
                    if(_self.$scrollCon.height() != _self.cHeight){
                        _self.vScroll.refresh();
                        _self.cHeight = _self.$scrollCon.height();
                    }
                    _self.containerResize();
                },250);

            },
            defereds: function(){
                var _self = this,
                    imgdefereds=[];
                $('img').each(function(){
                     var dfd=$.Deferred();
                     $(this).bind('load',function(){
                        dfd.resolve();
                     }).bind('error',function(){
                     //图片加载错误，加入错误处理
                        App.trace('商品/服务图片加载错误');
                        dfd.resolve();
                     })
                     if(this.complete) setTimeout(function(){
                        dfd.resolve();
                     },1000);
                     imgdefereds.push(dfd);
                });
                $.when.apply(null,imgdefereds).done(function(){
                    if(_self.vScroll){
                        _self.vScroll.refresh();
                    }

                    $('#m-detail-title .am-slider').flexslider({
                        directionNav: false,
                        slideshow: true,
                        pauseOnHover: true,
                        animationLoop: false,
                        start: function () {
                            if(_self.vScroll){
                                _self.vScroll.refresh();
                            }
                        }
                    });
                    
                });
            },
            add: function(e){
                this.count ++;
                e.stopImmediatePropagation();
            },
            minus: function(){
                if(this.count > 1){
                    this.count --;
                }
            },
            // selectRelateService: function(event,pid,id,img,price){
            //     var isSelected = event.target.className.indexOf('active')>-1?true:false;
            //     $(".item-select .m-service-item ul li").removeClass("active");
            //     if(!isSelected){
            //         event.target.className += " active";
            //         this.relateSerSelected[pid] = {id:id,img:img,price:price};
            //     }else{
            //         delete this.relateSerSelected[pid];
            //     }
                
            // },
            // selectRelateProduct: function(event,id,img,price){
            //     var $target = event.target.className.indexOf('relateprolist')>-1?event.target:event.target.parentNode;
            //     $target = $target.className.indexOf('relateprolist')>-1?$target:$target.parentNode;
            //     if(this.relateProSelected[id]){
            //         delete this.relateProSelected[id];
            //         $target.className = $target.className.replace(/active/g,'');
            //     }else{
            //         this.relateProSelected[id] = {img:img,price:price};
            //         $target.className += " active";
            //     }
                
            // },
            addCart: function(id,_style){
                if(App.config.token){
                    var _self = this;
                    var _opt = {
                        type: 0,
                        cateid: 0
                    }
                    App.cart.addshopcart(id,_self.count,_opt);
                    // //搭配购买服务
                    // for(s in _self.relateSerSelected){
                    //     var _opt = {
                    //         type: 1,
                    //         cateid: _self.relateSerSelected[s].id
                    //     }
                    //     App.cart.addshopcart(s,1,_opt);
                    // }
                    // //搭配购买商品
                    // for(p in _self.relateProSelected){
                    //     var _opt = {
                    //         type: 0,
                    //         cateid: 0
                    //     }
                    //     App.cart.addshopcart(p,1,_opt);
                    // }
                    this.cartCount = App.cart.count;
                    App.ani.anicart(_style);
                }else{
                    App.login.show();
                }
                
            },
            addBuyInfo: function(){
                if(App.config.token){
                    var _self = this,
                    shoplist = [],servicelist = [];
                    shoplist = [{
                            kindtype:     0,//service:1,product:0
                            pid:          _self.id,
                            picurl:       _self.previewimg,
                            count:        _self.count,
                            cateid:       0,
                            price:        _self.memberprice,
                            name:         _self.ingredientname+" "+_self.name+" "+_self.model
                        }];
                    // //搭配购买服务
                    // for(s in _self.relateSerSelected){
                    //     servicelist.push({
                    //         kindtype:     1,//service:1,product:0
                    //         pid:      s,
                    //         picurl:      _self.relateSerSelected[s].img,
                    //         count:      1,
                    //         cateid:   _self.relateSerSelected[s].id||0,
                    //         price:   _self.relateSerSelected[s].price,
                    //     })
                    // }
                    // //搭配购买商品
                    // for(p in _self.relateProSelected){
                    //     shoplist.push({
                    //         kindtype:     0,//service:1,product:0
                    //         pid:      p,
                    //         picurl:      _self.relateProSelected[p].img,
                    //         count:      1,
                    //         cateid:   0,
                    //         price:      _self.relateProSelected[p].price,
                    //     })
                    // }

                    App.buyInfo = {
                        shoplist:shoplist,
                        servicelist: servicelist
                    };
                    window.location.href = "#buy/border";
                }else{
                    App.login.show();
                }
            },
            share: function(content,id){
                App.n.share.share(content,"#mall/product/"+id,0);
            },
            setCount: function(){
                if(this.count < 1){
                    this.count = 1;
                }
            }
        },
        beforeCompile: function () {
            App.loading(true);
            var _self = this;
            App.upData({
                url: App.config.urlPath + this.cxApi + "?" + App.config.accompany,
                data: {id:this.$options.vas},
                success: function (data) {
                    if (data.state == 1) {
                        _.each(data.result, function (val, key) {
                            Vue.set(_self, key, val);
                        });
                        if(data.result.relateprolist.length>0||data.result.relateserlist.length>0){
                            _self.related = true;
                        }
                        if(data.result.relateprolist.length == 0){
                            delete _self.relateprolist;
                        }
                        if(data.result.relateserlist.length == 0){
                            delete _self.relateserlist;
                        }
                    } else {
                        if (data.errordes != "") {
                            App.alert(data.errordes);
                        } else {
                            App.alert(data.result.info);
                        }
                        if(data.resultcode == 404||data.resultcode == 503){
                            $(".am-modal").on('closed.modal.amui', function (e) {
                                window.history.back();
                            });
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
    });
    return v;
})

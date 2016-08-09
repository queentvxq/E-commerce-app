var App = App || {};
define([
    'vue',
	'uview',
	'text!tpl/m_service.html'
], function (Vue, uview, tpl) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'mservice', //名称
            cxId: '#m-main', //视图ID
            cxWpid: '#m-detail-wrapper', //滚动区域的ID
            cxApi:'/v2/shop/ServiceResDetails',
            cxAutoload: false,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
                App.trace('service init');
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
                    _self.islogged = true;
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
                $("#m-detail-title .m-service-item ul li:eq(0)").click();
                this.$scrollCon = $("#mViews");
                this.cHeight = this.$scrollCon.height();
                this.containerResize();
                // this.defereds();
                // App.trace('service appendComplete');
                // this.relateSerSelected = {};//清空选中搭配服务
                // this.relateProSelected = {};
            },
            cxRenderAfterPut: function(){
                this.defereds();
            }
        },
        cxData: {
            count:1,
            iscollection:true,
            content:"",
            serviceSelectedId: 0,//选中的服务的Id
            // relateSerSelected:{},//选中搭配服务
            // relateProSelected:{},//选中搭配商品
            cHeight:0,//滚动区域高度
            cartCount:0,//购物车数量
            related:false,//是否显示搭配购买
            islogged:false
        },
        methods: {
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
            selectService: function(event,originprice,memberprice,id,name){
                $("#m-detail-title .m-service-item ul li").removeClass("active");
                event.target.className += " active";
                if(originprice||memberprice){
                    this.originprice = originprice;
                    this.memberprice = memberprice;
                }
                this.serviceSelectedId = id;
                this.serviceSelectedName = name;
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
                var _self = this;
                if(App.config.token){
                    var _opt = {
                        type: 1,
                        cateid: _self.serviceSelectedId||0,
                        price: this.memberprice
                    }
                    App.cart.addshopcart(id,1,_opt);
                    // //搭配购买服务
                    // for(s in _self.relateSerSelected){
                    //     var _opt = {
                    //         type: 1,
                    //         cateid: _self.relateSerSelected[s]
                    //     }
                    //     App.cart.addshopcart(s,1,_opt);
                    // }
                    // //搭配购买商品
                    // for(p in _self.relateProSelected){
                    //     var _opt = {
                    //         type: 0,
                    //     }
                    //     App.cart.addshopcart(p,1,_opt);
                    // }
                    if(!_self.isAlreadyInCart(id,_self.serviceSelectedId)){
                        App.ani.anicart(_style);
                    }
                }else{
                    App.login.show();
                }
            },
            isAlreadyInCart: function(id,cateId){
                var result = false;
                var plist = App.cart.products;
                var _lg = plist.length;
                for (var k = 0; k < _lg; k++) {
                    if (plist[k].pid == id && plist[k].cateid == cateId) {
                        result = true;
                        break;
                    }
                };
                return result;
            },
            addBuyInfo: function(){
                if(App.config.token){
                    var _self = this,
                    shoplist = [],servicelist = [];
                    servicelist = [{
                            kindtype:     1,//service:1,product:0
                            pid:        _self.id,
                            picurl:     _self.previewimg,
                            count:      _self.count,
                            cateid:     _self.serviceSelectedId||0,
                            price:      _self.memberprice,
                            name:       _self.name,
                            catename:   _self.serviceSelectedName||0
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
                    //     shoplist.push( {
                    //         kindtype: 0,//service:1,product:0
                    //         pid:      p,
                    //         picurl:   _self.relateProSelected[p].img,
                    //         count:    1,
                    //         cateid:   0,
                    //         price:    _self.relateProSelected[p].price,
                    //     })
                    // }

                    App.buyInfo = {shoplist:shoplist,servicelist:servicelist};
                    window.location.href = "#buy/border";
                }else{
                    App.login.show();
                }
            },
            share: function(content,id){
                App.n.share.share(content,"#mall/service/"+ id,1);
            }

        },
        beforeCompile: function () {
            App.loading(true);
            var _self = this;
            App.trace("service detail-开始获取数据：");
            App.upData({
                url: App.config.urlPath + this.cxApi + "?" + App.config.accompany,
                data: {sid:this.$options.vas},
                success: function (data) {
                    App.trace("service detail-获取数据：success");
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
        },
        ready: function(){
            
            
        }
    });
    return v;
})

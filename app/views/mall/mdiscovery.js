var App = App || {};
define([
	'uview',
	'text!tpl/m_discovery.html'
], function (uview, tpl) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'mindex', //名称
            cxId: '#m-main', //视图ID
            cxWpid: '#wrapper', //滚动区域的ID
            cxApi:'/v2/shop/DiscoveryGoods',
            cxAutoload: false,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(true);
            },
            cxReady: function () {
                if (App.user.notice) {
                    if (App.user.notice.messagecount > 0) {
                        this.new = true;
                    }
                }

                if(App.config.token){
                    this.logged = true;
                }else{
                    this.logged = false;
                }
            },
            cxNextTick: function(){
                var _self = this;
                _self.myWF = new App.WaterFall({
                    "container":"wf-main",
                    "colWidth":'47',
                    "colWidthUnit":'%',
                });
                if(_self.vScroll){
                    _self.vScroll.refresh();
                }
                
                this.defereds();
                    
                
                
                
                // this.wf = false;
                if(this.updateCate){
                    $("#m-category>ul>li:eq("+_self.index+")").addClass('active');
                    this.updateCate = false;
                }
                
                // if(this.hScroll){
                //     //横向滚动条
                    
                //     var sum_w = 0,mg_w = 10;
                //     _.each($("#m-category>ul>li"),function(li,index){
                //         var _w = $(li).css('width').split('px')[0];
                //         sum_w = sum_w + parseInt(_w) + mg_w;
                //     });
                //     $("#m-category>ul").css('width',sum_w+10+'px');
                //     _self.hScroll = new _self.iScroll('#m-category', {
                //         scrollX: true,
                //         scrollY: false,
                //         preventDefault: false,
                //         eventPassthrough: true
                //     });
                //     this.hScroll = false;
                // }
                
            },
            appendComplete: function(){
                //$("#m-category>ul>li:eq(0)").addClass('active');
                if(App.discovery && App.discovery.type>=0){
                    this.productToggle(App.discovery.type,App.discovery.cateId);
                }else{
                    this.getCate(1);
                }
            

            }
        },
        cxData: {
            index:       0,//cate index
            categories:  [],
            type:        1,
            categoryId:  '',
            isService:   true,
            isMall:      false,
            // wf:          false,//是否需更新瀑布流
            updateCate:  false,
            new:         false,//新消息
            // hScroll:     false//是否需更新横向滚动条
            logged:false,
        },
        methods: {
            productToggle: function(type,cateId){
                this.type = type;

                if(type){//service
                    this.isMall = false;
                    this.isService = true;
                }else{//mall
                    this.isMall = true;
                    this.isService = false;
                }
                this.getCate(type,cateId);

            },
            selectCategories: function(id){
                var _self = this;
                $("#m-category>ul>li").removeClass('active');
                // if(event == 0){
                //     $("#m-category>ul>li:eq(0)").addClass('active');
                // }else{
                //     $(event.target).closest('li').addClass('active');
                // }
                var index;
                for(var i=0;i<_self.categories.length;i++){
                    if(_self.categories[i].categoryid == id){
                        _self.index = i;
                    }
                }
                $("#m-category>ul>li:eq("+_self.index+")").addClass('active');
                var _self = this;
                this.list = [];
                this.loadData(function(){
                    _self.wf = true;
                    
                },{type:_self.type,categoryId:id});
                App.discovery = {
                    type:_self.type,
                    cateId:id
                };//存入全局变量，记录本次切换
            },
            getCate: function(type,categoryId){
                var _self = this;
                App.upData({
                    url: App.config.urlPath + "/v2/shop/DiscoveryCategory?" + App.config.accompany,
                    data:{type: type},
                    success: function (data) {
                        if (data.state == 1) {
                            _self.categories = data.result;
                            _self.selectCategories(categoryId?categoryId:_self.categories[0].categoryid);
                            _self.updateCate = true;
                            // _self.hScroll = true;
                        } else {
                            App.alert('获取类别失败');
                        }
                    }
                });
            },
            defereds: function(){
                var _self = this;
                    // imgdefereds=[];
                $('.pdimg img').each(function(){
                     var dfd=$.Deferred();
                     $(this).bind('load',function(){
                        _self.myWF = new App.WaterFall({
                            "container":"wf-main",
                            "colWidth":'47',
                            "colWidthUnit":'%',
                        });
                        if(_self.vScroll){
                            _self.vScroll.refresh();
                        }
                        dfd.resolve();
                     }).bind('error',function(){
                     //图片加载错误，加入错误处理
                        App.trace('商品/服务图片加载错误');
                        dfd.resolve();
                     })
                     if(this.complete) setTimeout(function(){
                        var _self = this;
                        _self.myWF = new App.WaterFall({
                            "container":"wf-main",
                            "colWidth":'47',
                            "colWidthUnit":'%',
                        });
                        if(_self.vScroll){
                            _self.vScroll.refresh();
                        }
                        dfd.resolve();
                     },1000);
                     // imgdefereds.push(dfd);
                });
                // $.when.apply(null,imgdefereds).done(function(){
                //     _self.myWF = new App.WaterFall({
                //         "container":"wf-main",
                //         "colWidth":'48',
                //         "colWidthUnit":'%',
                //     });
                //     if(_self.vScroll){
                //         _self.vScroll.refresh();
                //     }
                //     $("#m-result-pds ul>li img").css("opacity",1);
                // });
            },
            toMsg: function(){
                if(App.config.token){
                    window.location.href = "#ucenter/umsg"
                }else{
                    App.login.show();
                }
            },
            clearSearchInfo: function(){
                App.lastOne = {};
                window.location.href = "#mall/search";
            }

        },
        beforeCompile: function(){
        },
    });
    return v;
})

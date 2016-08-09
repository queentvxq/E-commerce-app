var App = App || {};
define([
	'uview',
	'text!tpl/msearch_bar.html',
    'search'
], function (uview, tpl, ndbSearch) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'msearchbar', //名称
            cxId: '#msearch_bar', //视图ID
            cxWpid: '#m_result', //滚动区域的ID
            cxApi:'/v2/shop/search',
            cxAutoload: false,
            cxAutoShow: true,
            cxInit: function () {
                
            },
            cxReady: function () {
                var _keyArr=_.clone(this.ndbSearch.keywords).reverse();
                var keywordsArr = [];
                for(var k in _keyArr){
                    if(k<this.klg){
                        keywordsArr.push(_keyArr[k])
                    }
                }
                this.mylist = keywordsArr;
                if(_keyArr.length <= this.klg){
                    this.hasmore = false;
                }
            },
            cxNextTick: function(){
                this.defereds();
            },
            appendComplete: function(){
                var lastOne = App.lastOne;

                if (lastOne&&lastOne.type>=0&&lastOne.key) {
                    this.type = lastOne.type;
                    this.keyword = lastOne.key;
                    if(lastOne.type == 1){
                        this.isService = true;
                        this.isMall = false;
                    }else{
                        this.isService = false;
                        this.isMall = true;
                    }
                    this.type = lastOne.type;
                    this.goSearch(lastOne.key);
                    App.lastOne = {};
                }else{
                    $("#inputSearch").focus();
                }
            }
        },
        cxData: {
            mylist:    [],//搜索历史列表
            ndbSearch: new ndbSearch('mysearch'),
            klg:       3,//历史记录默认显示条数
            list:      [],//商品or服务列表
            noList:   false,//是否搜索到信息
            isService: true,
            isMall:    false,
            type:      1,//1:service,0:product
            hotList:   [],
            hasmore:   true,//是否显示”查看全部“按钮
        },
        methods: {
            selectCate: function(type){
                this.type = type;
                if(type){
                    this.isService = true;
                    this.isMall = false;
                }else{
                    this.isService = false;
                    this.isMall = true;
                }
                if(this.keyword){
                    this.goSearch();
                }
            },
            moreHistory:function(e){
                this.getMylist(10);
                // this.sScroll.refresh();
                this.hasmore = false;
            },
            // hotkword:function(e){
            //     var _keyword = $(e.currentTarget).attr('dataval');
            //     this.goSearch(_keyword);
            // },
            getMylist: function(length){
                var _keyArr=_.clone(this.ndbSearch.keywords).reverse();
                var keywordsArr = [];
                var len = _keyArr.length<length?_keyArr.length:length;
                for(var i=0;i<len;i++){
                    keywordsArr.push(_keyArr[i])
                }
                this.mylist = keywordsArr;
                if(_keyArr.length <= length){
                    this.hasmore = false;
                }else{
                    this.hasmore = true;

                }
            },
            clearmylist:function(){
                this.ndbSearch.delAll();
                this.mylist = this.ndbSearch.keywords;
                this.hasmore = false;
            },
            goSearch: function (_keyword) {
                var _self = this;
                document.activeElement.blur();
                if(_keyword){
                    this.keyword = _keyword;
                }else if(!_keyword&&this.keyword){
                    var _keyword = this.keyword;
                }else{
                    App.alert("请先输入关键词!");
                    return false;
                }
                this.ndbSearch.add(_keyword);
                this.loadData(function(){
                    if(_self.cxAllPage == 0){
                        _self.noList = true;
                    }else{
                        _self.noList = false;
                    }
                    //在本地存储最近一次的搜索
                    App.lastOne = {
                        type: _self.type,
                        key:  _keyword
                    };
                },{
                    type: this.type,
                    key:  _keyword
                });
                this.closeup();
                this.getMylist(3);
                
            },
            showup: function () {
                $("#msearch_bar").addClass('act');
                // this.$closedSearchBtn.show();
                $("#searchHistory").fadeIn("slow");
            },
            emptyKeyword:function(){
                this.keyword = "";
                this.showup();
            },
            closeup: function () {
                $("#msearch_bar").removeClass('act');
                // this.$closedSearchBtn.hide();
                $("#searchHistory").fadeOut("hide");
            },
            getHotWords: function(){
                var _self = this;
                var _url = App.config.urlPath + "/shop/hotsearch?" + App.config.accompany;
                App.upData({
                    url: _url,
                    success: function (data) {
                        if (data.state == 1) {
                            _self.hotList = data.result.list;
                        }else{
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            defereds: function(){
                var _self = this,
                    imgdefereds=[];
                $('.pdimg img').each(function(){
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
                    _self.myWF = new App.WaterFall({
                        "container":"wf-main",
                        "colWidth":'48',
                        "colWidthUnit":'%',
                    });
                    if(_self.vScroll){
                        _self.vScroll.refresh();
                    }
                    $("#m-result-pds ul>li").css("opacity",1);
                });
            },
            // goBack: function(){

            // }
        },
        beforeCompile: function(){
            this.getHotWords();
        }

    });
    return v;
})

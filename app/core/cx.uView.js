var App = App || {};
define([
    'vue',
    'amazeui',
    'IScroll'
], function (Vue, amazeui, IScroll) {
    var v = Vue.extend({
        /*自身非计算属性的扩展*/
        _objectExtend: {
            cxName: '', //命名
            cxId: '', //视图ID
            cxChildId: '', //子视图对象ID
            cxWpid: '', //滚动区域的ID
            probeType: '', //probeType setting
            cxChildP: null, //子级视图
            cxParentP: null, //父级视图
            cxChildPage: null, //子页面对象
            cxNextPageNs: [], //切换页面的名称集合，切换的页面是当前页面的下一级相关页面，一般是业务上是包含关系
            cxLsnImg: "", //监听图片载入处理，空字符表示不监听处理,可Jquery对象
            /*数据列表信息*/
            cxApi: '', //加载数据接口地址
            cxVas: {}, //发送到服务端数据
            cxPage: 1, //当前页位置
            cxPagesize: 10, //每页显示数量
            cxPageEnd: false, //是否最后一页
            cxState: -1, //筛选状态（）
            cxTotal: 0, //数据列总数
            cxAllPage: 0, //总页数
            cxAutoload: false,
            /*动画切换信息*/
            cxAmt: 'cxpFade',
            cxAmtSt: -1, //动画当前状态
            cxAdded: false, //是否已经完成添加到舞台上了
            cxAutoShow: false, //是否自动显示到舞台
            cxAmtEnd: false, //切换动画是否结束
            $loading: $('<div id="splistloading">上拉加载更多</div>'), //加载提示
            $noSpan: $('<div>没有数据</div>'),
            ldVisble: true, //是否显示加载更多内容
            /*滚动控制*/
            iScroll: null, //滚动组建
            vScroll: null, //滚动视图实例
            vScrollStaY: 0, //滚动开始Y坐标
            vScrollEndY: 0, //滚动结束Y坐标
            /*默认计算属性*/
            _dataInit: {
                replace: false,
                list: [],
                show: false, //是否显示（舞台中的删除与添加，并非彻底销毁）
                transitionName: 'cxpFade' //切换动画表现形式cxpRight,cxpLeft,cxpFade
            },
            /*自定义初始化方法*/
            cxInit: function () {},
            cxCreated: function () {},
            loadData: function (_fun, _vas, _option) {
                var _this = this;
                //是否自定义上传设置
                if (typeof _option != "undefined") {
                    App.upData(_option);
                } else if (this.cxApi != '') {
                    var _cxVas = {
                        page: 1
                    };
                    if (typeof _vas != "undefined") {
                        for (var k in _vas) {
                            _cxVas[k] = _vas[k];
                        }
                    };
                    App.loading(true);
                    this._loadExp('上拉加载更多');
                    this.cxPageEnd = false;
                    this.$loading.remove();
                    this.list = [];
                    if (this.vScroll) _this.vScroll.scrollTo(0, 0);
                    this.loadDataPlus(_cxVas, _fun);
                } else {
                    if (typeof (_fun) != "undefined") _fun(this);
                }
            },
            /*刷新数据*/
            renData: function () {
                this.loadData();
            },
            /*参数主要是需要发送到服务端的数据内容，例如页数，关键词等*/
            loadDataPlus: function (_vas, _fun) {
                if (typeof (_vas) == "undefined" && _vas instanceof Object) {
                    App.alert('缺少数据');
                } else if (this.cxApi != '') {
                    var _this = this;
                    var _url = App.config.urlPath + this.cxApi + "?" + App.config.accompany;
                    if (typeof _vas != "undefined") {
                        for (var k in _vas) {
                            this.cxVas[k] = _vas[k];
                        }
                        App.trace(this.cxName + "-开始获取数据：" + this.cxApi);
                        App.upData({
                            url: _url,
                            data: this.cxVas,
                            success: function (data) {
                                try {
                                    if (data.state == 1) {
                                        //返回的数据格式化到当前视图的模型之中
                                        if ((data.result.list instanceof Array)) {
                                            _this.cxPage = data.result.page;
                                            //当前是否有数据内容(小于1)
                                            if (_this.list.length < 1) {
                                                _this.cxAllPage = Math.ceil(data.result.total / data.result.size);
                                                //加载数据大于0条
                                                if (data.result.list.length > 0) {
                                                    _this.list = data.result.list;
                                                    if (_this.cxPage < _this.cxAllPage) {
                                                        $(_this.cxWpid).children(":first").append(_this.$loading);
                                                    }
                                                }
                                            } else {
                                                for (var ik in data.result.list) {
                                                    _this.list.push(data.result.list[ik]);
                                                }
                                            }
                                            if (_this.cxAllPage == _this.cxPage) {
                                                _this._loadExp('没有更多数据了');
                                            } else {
                                                _this._loadExp('上拉加载更多');
                                            }
                                        } else {
                                            _.each(data.result, function (val, key) {
                                                Vue.set(_this, key, val);
                                            });
                                        }
                                        _this.$nextTick(_this._cxNextTick);
                                        if (typeof (_fun) != "undefined") _fun(_this);
                                    } else {
                                        if (data.errordes != "") {
                                            App.alert(data.errordes);
                                        } else {
                                            App.alert(data.result.info);
                                        }
                                        if (typeof (_fun) != "undefined") _fun(_this);
                                    }
                                    App.loading(false);
                                    _this.cxLoadDataSuccess(data);
                                } catch (er) {
                                    App.loading(false);
                                    App.trace('返回的数据格式处理错误');
                                }
                                App.trace(_this.cxName + "-获取数据成功：" + _this.cxApi);
                            },
                            error: function () {
                                App.alert('获取数据错误');
                                App.loading(false);
                            }
                        });
                    };
                }
            },
            /*数据加载完成*/
            cxLoadDataSuccess: function () {},
            /*更新DOM后调用方法*/
            _cxNextTick: function () {
                var _this = this;
                $("img").error(function () {
                    $(this).attr("src", "assets/imgs/fire.png")
                });
                if (this.cxLsnImg != "") {
                    $(this.cxLsnImg).each(function () {
                        this.onload = function () {
                            _this._cxRenderAfterPut();
                        }
                    });
                }
                this._cxRenderAfterPut();
                this.cxNextTick();
            },
            /*更新DOM后调用方法*/
            cxNextTick: function () {},
            /*更多数据*/
            plusPage: function () {
                if (this.cxPage < this.cxAllPage) {
                    this._cxRenderAfterPut();
                    this.vScroll.scrollBy(0, -1);
                    this._loadExp('数据加载中...');
                    this.loadDataPlus({
                        page: (this.cxPage + 1)
                    });
                } else {
                    this._loadExp('没有更多数据了');
                    this.cxPageEnd = true;
                }
            },
            cxRender: function () {},
            /*加载数据底部提示（主要适用于更多数据）*/
            _loadExp: function (_val) {
                this.$loading.html(_val);
            },
            /*视图更新后执行命令*/
            _cxRenderAfterPut: function () {
                var _this = this;
                //内容滑动模块
                if (this.vScroll) {
                    var _it = setTimeout(function () {
                        _this.vScroll.refresh();
                        _this.cxRenderAfterPut();
                        clearTimeout(_it);
                    }, 100);
                } else {
                    if (this.cxWpid != "") {
                        if (this.probeType == 3) {
                            this.vScroll = new IScroll(this.cxWpid, {
                                probeType: 3,
                                mouseWheel: true,
                                disableTouch: false,
                                eventPassthrough: "horizontal"
                            });
                        } else {
                            this.vScroll = new this.iScroll(this.cxWpid, {
                                mouseWheel: true,
                                disableTouch: false,
                                eventPassthrough: "horizontal"
                            });
                        }
                        //滚动开始
                        this.vScroll.on("scrollStart", function () {
                            _this.vScrollStaY = this.y;
                            if (_this.vScrollStaY == this.maxScrollY && _this.vScrollStaY != 0) {
                                _this.scrollBomStart();
                            }
                            _this.scrollStart(this);
                        });
                        //滚动监听
                        // this.vScroll.on('scroll', function () {
                        //     _this.scroll(this);
                        // });
                        //滚动结束
                        this.vScroll.on("scrollEnd", function () {
                            _this.vScrollEndY = this.y;
                            /*判断当前滚动的位置情况，已经在顶部的拖动和已经在底部的拖动事件判断*/
                            if (_this.vScrollStaY == _this.vScrollEndY && _this.vScrollEndY == 0) {
                                _this.scrollTopEvt();
                            } else if (_this.vScrollStaY == _this.vScrollEndY && _this.vScrollStaY != 0) {
                                _this.scrollBomEvt();
                            } else {
                                _this._loadExp('上拉加载更多');
                            }
                            _this.scrollEnd(this);
                        });
                    }
                    this.cxRenderAfterPut();
                }
            },
            cxRenderAfterPut: function () {},
            scrollStart: function () {},
            scroll: function () {},
            scrollEnd: function () {},
            /*滚动到顶部*/
            scrollTopEvt: function () {

            },
            scrollBomStart: function () {
                if (!this.cxPageEnd) {
                    this._loadExp('释放加载数据');
                }
            },
            /*滚动到底部*/
            scrollBomEvt: function () {
                if (!this.cxPageEnd) {
                    this.plusPage();
                }
            },
            /*已增加视图，入场*/
            cxShow: function () {
                this.show = true;
                this.cxAdded = true;
                App.trace("显示：" + this.cxName);
            },
            /*删除视图，默认带有向右侧移出的动画效果*/
            cxRemove: function (_delCP) {
                if (_delCP) {
                    this.$destroy(true);
                } else {
                    if (this.vScroll) {
                        this.vScroll.destroy();
                        this.vScroll = null;
                    }
                    this.show = false;
                    this.cxAdded = false;
                }
            },
            /*加载子对象视图到当前*/
            loadPage: function (_page, _delCP) {
                if (this.cxChildP != null) {
                    App.trace("删除：" + this.cxChildP.cxName);
                    this.cxChildP.cxRemove(_delCP);
                }
                if (this.cxChildId != "") {
                    App.trace("子页面对象->" + _page.cxName);
                    //设置当前页面父级
                    _page.cxParentP = this;
                    //当前页结构加载到用户中心模块视图
                    _page.$mount().$appendTo(this.cxChildId);
                    this.$nextTick(this.cxNextTick);
                    //是否自动显示到舞台上
                    if (_page.cxAutoShow && !_page.cxAdded) {
                        App.trace("显示到舞台上：" + _page.cxName);
                        _page.cxShow();
                    }
                    //设置当前页面
                    this.cxChildP = _page;
                }
            },
            /*删除自身子对象*/
            closeChild: function () {
                if (this.cxChildP != null) {
                    this.cxChildP.cxRemove();
                }
            },
            /*添加自身到舞台之后执行!内部事件*/
            _appendComplete: function () {
                this.cxAmtEnd = true;
                if (this.transitionName == "cxpRight") {
                    this.transitionName = "cxpLeft";
                } else if (this.transitionName == "cxpLeft") {
                    this.transitionName = "cxpRight";
                }
                if (typeof this.transitionName !== "undefined") {
                    if (this.cxAutoload) this.loadData();
                }
                this._cxRenderAfterPut();
                this.cxReady();
            },
            /*在打开状态通过URL传递参数*/
            cxInput: function () {},
            /*删除自身完成之后执行!内部事件*/
            _removeComplete: function () {},
            /*添加自身到舞台之后执行*/
            appendComplete: function () {},
            /*删除自身完成之后执行*/
            removeComplete: function () {},
            /*加载到DOM成功之后，执行是在入场动画完成之后*/
            cxReady: function () {},
            /*彻底销毁*/
            cxDestroy: function () {

            }
        },
        methods: {
            /**
             * 打开子页面 _obj子页面对象，包含页面名称与参数_obj.child和_obj.vas
             * @param {object} _obj 
             * 
             **/
            openChild: function (_obj) {
                if (typeof _obj == "string") {
                    App.trace("打开页面：" + _obj);
                    if (this.cxChildP) {
                        if (this.cxChildP.cxName == _obj) {
                            this.cxChildP.show = true;
                            if (this.cxChildP.cxChildP) {
                                this.cxChildP.cxChildP.cxRemove();
                            }
                            return false;
                        }
                    }
                    if (_obj) {
                        this.loadPage(new this.cxChildPage[_obj](), true);
                    }

                } else {
                    App.trace("打开页面：" + _obj.child);
                    if (this.cxChildP) {
                        if (this.cxChildP.cxName == _obj.child) {
                            this.cxChildP.show = true;
                            //传递URL参数数据
                            this.cxChildP.cxInput(_obj.vas);
                            if (this.cxChildP.cxChildP) {
                                this.cxChildP.cxChildP.cxRemove();
                            }
                            return false;
                        }
                    }
                    if (_obj) {
                        if (this.cxChildPage.hasOwnProperty(_obj.child)) {
                            if (typeof _obj.vas != "undefined") {
                                this.loadPage(new this.cxChildPage[_obj.child]({
                                    vas: _obj.vas
                                }), true);
                            } else {
                                this.loadPage(new this.cxChildPage[_obj.child](), true);
                            }
                        } else {
                            App.alert("打开地址错误", {
                                closed: function () {
                                    history.go(-1);
                                }
                            });
                        }
                    }
                }
            },
            goBack: function () {
                window.history.back();
            }
        },
        computed: {},
        /*在实例开始初始化时同步调用。此时数据观测、事件和 watcher 都尚未初始化*/
        init: function () {
            _.extend(this, this.$options._objectExtend);
            if (typeof (this.$options.objectExtend) === "object") {
                _.extend(this, this.$options.objectExtend);
            }
            this.iScroll = $.AMUI.iScroll;
            this.cxInit();
            App.loading(false);
        },
        /*在实例创建之后同步调用。此时实例已经结束解析选项，这意味着已建立：数据绑定，计算属性，方法，watcher/事件回调。
        但是还没有开始 DOM 编译，$el 还不存在。*/
        created: function () {
            //合并扩展的方法属性(计算属性)
            for (var key in this._dataInit) {
                Vue.set(this, key, this._dataInit[key]);
            }
            if (typeof (this.$options.cxData) === "object") {
                for (var key in this.$options.cxData) {
                    Vue.set(this, key, this.$options.cxData[key]);
                }
            }
            //初始化发送服务端分页相关数据
            this.cxVas.page = this.cxPage;
            this.cxVas.pagesize = this.cxPagesize;
            this.cxVas.state = this.cxState;
            //切换动画方式修改
            /*            if (App.cxmain.cxChildP) {
                            if (this.cxNextPageNs.length > 0) {
                                var _cp = App.cxmain.cxChildP.cxChildP;
                                if (_.contains(this.cxNextPageNs, _cp.cxName)) {
                                    this.transitionName = "cxpFadeLeft";
                                }
                            }
                        }*/
            //运行自定义
            this.cxCreated();
        },
        /*DOM文档插入之前!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        beforeCompile: function () {

        },
        /*DOM文档插入之后!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        ready: function () {
            if (typeof this.transitionName == "undefined" || this.transitionName == "cxpNone") {
                if (this.cxAutoload) this.loadData();
                this.cxReady();
                this.$nextTick(this._cxNextTick);
            }
            var _this = this;
            App.trace(this.cxName + ":ready-" + this.transitionName);
            if (_this.cxAutoShow && _this.cxAdded && !_this.cxAmtEnd && typeof (this.transitionName) != "undefined") {
                App.trace(_this.cxName + "强制数据重载");
                App.reload.r();
            }
        },
        attached: function () {},
        /*在开始销毁实例时调用。此时实例仍然有功能。*/
        beforeDestroy: function () {

        },
        /*在实例被销毁之后调用。此时所有的绑定和实例的指令已经解绑，所有的子实例也已经被销毁。
        如果有离开过渡，destroyed 钩子在过渡完成之后调用。*/
        destroyed: function () {

        }
    });
    return v;
})

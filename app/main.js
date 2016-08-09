require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'app/',
    shim: {
        underscore: {
            exports: '_'
        },
        vue: {
            deps: [
				'underscore',
				'jquery',
                'updata',
                'cookie'
			]
        }
    },
    paths: {
        jquery: 'libs/jquery.min',
        backbone: 'libs/backbone-min',
        underscore: 'libs/underscore',
        domReady: 'libs/domReady',
        amazeui: 'libs/amazeui.min',
        cookie: 'libs/jquery.cookie',
        text: 'libs/text',
        vue: 'libs/vue.min',
        director: 'libs/director.min',
        md5: 'libs/md5',
        updata: 'core/cx.upDataServer',
        store: 'core/cx.localStorage',
        uview: 'core/cx.uView',
        cart: 'ndb/ndbCart',
        search: 'ndb/ndbSearch',
        router: 'global/router',
        animate: 'global/animate',
        alert: 'global/alert',
        lduserinfo: 'global/ldUserinfo',
        weixin: 'global/weixin',
        tool: 'global/tool',
        init: 'global/init',
        debug: 'global/debug',
        cxmain: 'views/cxmain',
        footbar: 'views/component/footBar',
        utopbar: 'views/component/utopBar',
        utopbar2: 'views/component/utopBar2',
        login: 'views/component/login',
        native: 'channel/app/n.init',
        lazyload: 'libs/imagesloaded.pkgd.min',
        slider: 'libs/slick.min',
        IScroll: 'libs/iscroll-probe'
    }
});

App = {
    v: "0.9.99",
    config: {
        urlPath: "http://apiqa.ukitchenplus.com", //api,apiqa
        oldPath: 'http://qa.ukitchenplus.com', //m,qa
        fPath: "http://aapi.ukitchenplus.com",//aapi,f
        token: '',
        accompany: '', //跟随发送数据的附属
        uid: '',
        debug:"15d8d8449dd86cf95deefb4b6a0aad14"
        //5a3428ccdaba80f09828bb8bb53395b0(false)
    },
    init: null, //加载完成之后初始化应用
    about: null, //App官方相关信息
    user: null, //用户信息
    /*
     ** 应用状态
     ** 0 未有启动,1 启动正常，
     ** 101 加载程序完成， 102 开始初始化，103 获取本地数据 ，
     ** 201 验证本地token是否有效，202本地验证token成功，203微信自动登陆，204微信自动登陆成功
     ** 205 微信自动登陆失败
     ** 401 服务器获取数据失败
     */
    state: 0,
    views: {}, //所有视图view
    cxmain: null, //主视图容器
    actView: null, //当前活动主视图
    router: {}, //路由
    cart: null, //购物车
    buyInfo: null, //临时购物车
    discovery: {}, //发现页类目存储,type&cateid
    lastOne: {}, //最近一次搜索的信息,type&key
    tokenvalid: false, //验证token情况
    upData: null, //提交数据方法
    tokenWeixin: false, //微信token验证是否存在方法
    $modal: null, //全局弹窗模型Jqury对象的DOM 使用App.alert方法操作的对象
    alert: null, //function 弹出窗口方法
    isWeixin: null, //function 是否微信登陆用户
    autoWeixin: null, //function 微信用户自动登陆方法
    ldUserinfo: null, //function 获取用户信息方法
    footbar: null, //function 底部导航显示控制 true或false
    extend: null, //function 原型对象扩展方法
    tool: {}, //常用工具，例如字符串处理
    n: {}, //本地化模块对象
    w: {}, //微信公众号模块对象
    p: {}, //页面之间需要相互调用处理的临时数据对象
    trace: null, //function 调试输出
};
require(['domReady', 'init', 'native', "store", 'channel/app/n.index'], function (domReady, _init, native, store, index) {
    if (App.n.ok) $(".loading").remove();
    domReady(function () {
        //vcheck.init();
        //index().init();
        if (App.n.ok) {
            App.trace("init App");
            if (!App.n.device.testnetwork(function () {
                    if (localStorage.getItem("uv") != App.v) {
                        if (plus.os.name == "Android") {
                            if (parseFloat(plus.os.version) > 4.4) {
                                index().init();
                            } else {
                                _init();
                            }
                        } else {
                            index().init();
                        }
                    } else {
                        _init();
                    }
                })) {
                App.alert("当前无法连接网络");
            }
        } else {
            _init();
        }
    });
});

/*




*/

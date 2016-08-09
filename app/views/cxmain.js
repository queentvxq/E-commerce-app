var App = App || {};
define([
	'uview',
	'text!tpl/main.html',
    'views/home',
    'views/mall',
    'views/buy',
    'views/ucenter',
    'views/login',
    'views/reg',
    'views/reset',
    'footbar',
    'views/component/login'
], function (uview, tpl, home, mall, buy, ucenter, login, reg, reset, footbar, loginBar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-login": loginBar,
            "com-footbar": footbar,
            
        },
        objectExtend: {
            cxName: 'cxmain', //名称
            cxId: '#cx-main', //视图ID
            cxChildId: "#cx_main",
            cxAutoShow: true,
            cxReady: function () {
                //this.openChild("ucenter", 'uindex');

            }
        },
        cxData: {
            transitionName: 'cxpFade',
            show: true
        },
        methods: {
            /**
             * 打开子页面 _pname子页面名称，_sed子页面参数（实际也是打开页面子页面名称）
             * @param {String} _pname
             * @param {Stting} _sed  
             **/
            openChild: function (_pname, _sed) {
                App.loading(false);
                App.trace("进入:"+_pname);
                if (this.cxChildP) {
                    /*如果打开的是当前页面，直接处理当前页面并返回当前页面*/
                    if (this.cxChildP.cxName == _pname) {
                        if (typeof _sed != "undefined") {
                            App.trace("当前栏目"+_pname + "->" + _sed);
                            this.cxChildP.openChild(_sed);
                        }
                        return this.cxChildP;
                    }
                }
                App.footbar(true);
                if(typeof (_sed) == "object"){
                    App.trace(_pname + "->" + _sed.child+"&vas="+_sed.vas); 
                }else{
                    App.trace(_pname + "->" + _sed);                    
                }
                //切换底部导航样式
                this.$refs.footbar.change(_pname);
                //打开对应的页面
                switch (_pname) {
                    case "home":
                        this.loadPage(new home({
                            _initPage: _sed
                        }), true);
                        break;
                    case "mall":
                        this.loadPage(new mall({
                            _initPage: _sed
                        }), true);
                        break;
                    case "buy":
                        this.loadPage(new buy({
                            _initPage: _sed
                        }), true);
                        break;
                    case "ucenter":
                        this.loadPage(new ucenter({
                            _initPage: _sed
                        }), true);
                        break;
                    case "login":
                        this.loadPage(new login(), true);
                        break;
                    case "reg":
                        this.loadPage(new reg(), true);
                        break;
                    case "reset":
                        this.loadPage(new reset(), true);
                        break;
                    default:
                        this.loadPage(new ucenter(), true);

                }

                return this.cxChildP;
            }
        }
    })
    return v;
})

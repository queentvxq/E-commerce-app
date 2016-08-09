var App = App || {};
define([
	'uview',
	'text!tpl/u_loginmethod.html'
], function (uview, tpl) {
    var v = uview.extend({
        template: tpl,
        cxData: {
            transitionName: 'cxpBottomIn',
            show: false
        },
        methods: {
            cancel: function () {
                this.show = false;
            },
            wechatLogin: function(){
                var _self =this;
                App.trace("plus:"+window.plus);
                if(window.plus){
                    App.trace("wechat login");
                    // 获取登录认证通道
                    plus.oauth.getServices(function(services){
                        var auth;//0:qq,1:weibo,2:wechat
                        for(var i=0;i<services.length;i++){
                            if(services[i].id == "weixin"){
                                auth = services[i];
                            }
                        }
                        if(auth.id == "weixin"){
                            var w=null;
                            if(plus.os.name == "Android"){
                                w=plus.nativeUI.showWaiting();
                            }
                            document.addEventListener("pause",function(){
                                setTimeout(function(){
                                    w&&w.close();w=null;
                                },2000);
                            }, false );
                            auth.login(function(){
                                w&&w.close();w=null;
                                // App.alert("登录认证成功："+JSON.stringify(auth.authResult));
                                App.trace("wechat login getInfo success");
                                _self.sendCode(auth.authResult.access_token,auth.authResult.openid);
                                App.trace("wechat login getInfo success:"+auth.authResult.access_token);
                            },function(e){
                                w&&w.close();w=null;
                                App.alert("登录认证失败："+"["+e.code+"]："+e.message);
                            });
                        }else{
                            App.alert("无效的登录认证通道！");
                        }
                    },function(e){
                        App.alert("获取登录认证失败："+e.message);
                    });
                }
            },
            // getInfo: function(auth){
            //     var _self = this;
            //     auth.getUserInfo(function(){
            //         App.alert("获取用户信息成功："+JSON.stringify(auth.userInfo));
            //         // var nickname=auth.userInfo.nickname||auth.userInfo.name;
            //         // App.alert("欢迎“"+nickname+"”登录！");
            //         _self.sendCode(auth.userInfo.openid);
            //     },function(e){
            //         App.alert("获取用户信息失败："+"["+e.code+"]："+e.message);
            //     });
            // },
            sendCode: function(token,openid){
                var _self = this;
                App.trace("wechat sendCode"+token+"---------"+openid);
                App.upData({
                    url: App.config.urlPath + "/account/wxapplogin",
                    data: {token:token,openid:openid},
                    success: function (data) {
                        App.trace("wechat sendCode state:"+data.state);
                        if (data.state == 1) {
                            var result = data.result;
                            App.user.token=result.token;
                            App.user.uid=result.uid;
                            App.ldUserinfo(function () {
                                App.trace("登陆成功token:" + $.cookie('token'));
                                App.cxmain.$refs.loginbar.show = false;
                                App.alert("登录成功",{tips:true});
                            })
                            App.trace("登陆成功token:" + App.user.token);
                            _self.cosLoagin();
                            localStorage.removeItem('home');
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            cosLoagin: function () {
                var $iframe = $("<iframe>");
                var _url = App.config.oldPath + '/ssopage.aspx?' + App.config.accompany;
                $iframe.attr('src', _url);
                $('head').append($iframe);
                $iframe[0].onload = function () {
                    console.log('加载完成');
                }
                return false;
            }

        }
    });
    return v;
})

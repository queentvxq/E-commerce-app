var App = App || {};
define([
	'uview',
	'text!tpl/u_login.html',
    
], function (uview, tpl) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'login', //名称
            cxId: '#u-login', //视图ID
            cxWpid: '#u_login', //滚动区域的ID
            cxApi: '/account/login',
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
                App.cxmain.$refs.loginbar.show = false;
            },
            cxReady: function () {},
            cxCreated: function () {},
            appendComplete: function () {
                var _self = this;
                var t = setTimeout(function(){
                    _self.testPhone(_self.accountA);
                    _self.testCode(_self.pwdA);
                    _self.testPhone(_self.accountB);
                    _self.testPassword(_self.pwdB);
                    clearTimeout(t);
                },2000);
                
            }
        },
        cxData: {
            accountA: "",
            accountB: "",
            pwdA: "",
            pwdB: "",
            canSend: true,//counting down:false
            isClear: false,
            
            active:"grey",//if send code btn active

            aPhoneValid:false,
            aBtnActive:"grey",
            aCanLog:false,

            bPhoneValid:false,
            bBtnActive:"grey",
            bCanLog:false,
        },
        methods: {
            upDataSendVad: function (e) {
                var _self = this;
                if(_self.canSend&&_self.aPhoneValid){
                    _self.canSend = false;
                    var _url = App.config.urlPath + "/code/send?" + App.config.accompany;
                    var _vas = {
                        type: 2,
                        phone: _self.accountA
                    }
                    $("#takVad").text('发送中...');
                    App.upData({
                        url: _url,
                        data: _vas,
                        success: function (data) {
                            if (data.state == 1) {
                                App.alert("动态码已发送",{tips:true});
                                var secs =59; //count down seconds
                                var backgroundTime = Math.round(new Date().getTime()/1000);
                                App.trace("开始计时时间戳"+backgroundTime);
                                var t = setInterval(function(){
                                    

                                    $('#takVad').text(secs+'秒后重新发送');
                                    if(secs == 0){
                                        $("#takVad").text('发送验证码');
                                        
                                        _self.canSend = true;
                                        clearInterval(t);
                                    }
                                    secs --;

                                },1000);
                                
                                document.addEventListener("resume",function(){
                                    btc = backgroundTime;
                                    App.trace("退出时间戳"+btc);

                                    var nowTime = Math.round(new Date().getTime()/1000);
                                    App.trace("恢复时间戳"+nowTime);
                                    // 如果程序退出到后台时间超过20秒，则重新要求输入手势密码
                                    var passSec = nowTime - btc;
                                    App.trace("减秒:"+passSec);
                                    if (passSec != 0) {
                                        if ( passSec < 59) {
                                            secs = 59 - passSec;
                                            $('#takVad').text(secs+'秒后重新发送');
                                            App.trace("恢复&减秒"+secs);
                                        }else{
                                            $("#takVad").text('发送验证码');
                                            _self.canSend = true;
                                            clearInterval(t);
                                            App.trace("恢复&解除"+secs);
                                        }
                                    }
                                }, false );
                                
                            }else{
                                $("#takVad").text('发送验证码');
                                _self.canSend = true;
                                App.alert(data.errordes);
                            }
                        }
                    });
                }
            },
            clear: function(event,phone){
                if(this.isClear){
                    event.target.value = "";
                    this.isClear = false;
                }
                this.testPhone(phone);
            },
            testPhone: function(phone,flag){
                if(flag == "a"){
                    if (phone.length != 11) {
                        this.aPhoneValid = false;
                        this.active = "grey";
                    }else{
                        this.aPhoneValid = true;
                        this.active = "";
                    }
                }else{
                    this.bPhoneValid = phone.length == 11?true:false;
                    // if (phone.length != 11) {
                    //     this.bPhoneValid = false;
                    // }else{
                    //     this.phoneValid = true;
                    // }
                }
                
                this.testLogin(flag);
            },
            testCode: function(code){
                this.codeValid = code.length != 6?false:true;
                this.testLogin("a");
            },
            testPassword: function(password){
                this.passwordValid = password.length<=18&&password.length>=6?true:false;
                this.testLogin("b");
            },
            testLogin:function(flag){
                if(flag == "a"){
                    if(this.aPhoneValid&&this.codeValid){
                        this.aBtnActive = ""
                        this.aCanLog = true;
                    }else{
                        this.aBtnActive = "grey"
                        this.aCanLog = false;
                    }
                }else{
                    if(this.bPhoneValid&&this.passwordValid){
                        this.bBtnActive = ""
                        this.bCanLog = true;
                    }else{
                        this.bBtnActive = "grey"
                        this.bCanLog = false;
                    }
                }
                
            },
            logBtnA: function (evt) {
                if(this.aCanLog){
                    evt.preventDefault();
                    this.login(this.accountA, this.pwdA, 0);
                }
            },
            logBtnB: function (evt) {
                if(this.bCanLog){
                    evt.preventDefault();
                    this.login(this.accountB, this.pwdB, 1);
                }
            },
            login: function (_account, _pwd, _type) {
                var _this = this;
                var isValid = _type?this.bCanLog:this.aCanLog;
                if(isValid){//手机号合法
                    var _url = App.config.urlPath + this.cxApi + "?" + App.config.accompany;
                    var vas = {
                        type: _type,
                        account: _account,
                        pwd: _pwd
                    };
                    if (_type == 0) vas.code = $("#pwdA").val();
                    App.upData({
                        url: _url,
                        data: vas,
                        success: function (data) {
                            if (data.state == 1) {
                                var result = data.result;
                                App.user.token=result.token;
                                App.user.uid=result.uid;
                                App.ldUserinfo(function () {
                                    App.trace("登陆成功token:" + $.cookie('token'));
                                    _this.goBack();
                                })
                                App.trace("登陆成功token:" + App.user.token);
                                _this.cosLoagin();
                                localStorage.removeItem('home');
                            } else {//输错6次，账号锁定
                                _this.isClear = true;
                                var rest = data.result.rest;
                                if(data.resultcode == "1001"){
                                    if(rest == 0){
                                    App.alert(data.errordes+",账号被锁定");
                                    }else if(rest <= 3){//剩余3次开始提示
                                        App.alert(data.errordes+"，您还能输入"+rest+"次");
                                    }else{
                                        App.alert(data.errordes,{tips:true});
                                    }
                                }else{
                                    // App.alert(data.errordes);
                                    App.alert(data.errordes,{tips:true});
                                }
                                
                                
                            }
                        }
                    });
                }
                
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

var App = App || {};
define([
	'uview',
	'text!tpl/u_reg.html'
], function (uview, tpl) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'reg', //名称
            cxId: '#u-login', //视图ID
            cxWpid: '#u_login', //滚动区域的ID
            cxApi: '/account/register',
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {},
            appendComplete: function () {
                var _self = this;
                var t = setTimeout(function(){
                    _self.testPhone(_self.phone);
                    _self.testCode(_self.code);
                    _self.testPassword(_self.pwd);
                    clearTimeout(t);
                },2000);
                
            }
        },
        cxData: {
            phone: "",
            code: "",
            pwd: "",
            canSend: true,//counting down:false
            isClear: false,
            type:  "password",
            icon:  "grey",//if show password
            phoneValid:false,
            active:"grey",//if send code btn active
            codeValid:false,
            passwordValid:false,
            regActive:"grey",
            canReg: false,//if all inputs are valid
        },
        methods: {
            upDataSendVad: function (e) {
                var _self = this;
                if(_self.canSend&&_self.phoneValid){
                    _self.canSend = false;
                    var _url = App.config.urlPath + "/code/send?" + App.config.accompany;
                    var _vas = {
                        type: 0,
                        phone: _self.phone
                    }
                    var $tvr = $("#takVadReg");
                    $tvr.text('发送中...');
                    App.upData({
                        url: _url,
                        data: _vas,
                        success: function (data) {
                            if (data.state == 1) {
                                App.alert("动态码已发送",{tips:true});
                                var secs =59; //count down seconds
                                var backgroundTime = Math.round(new Date().getTime()/1000);
                                App.trace("开始计时时间戳"+backgroundTime);
                                _self.interval = setInterval(function(){

                                    $tvr.text(secs+'秒后重新发送');
                                    if(secs == 0){
                                        $tvr.text('发送验证码');
                                        _self.canSend = true;
                                        clearInterval(_self.interval);
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
                                $tvr.text('发送验证码');
                                _self.canSend = true;
                                App.alert(data.errordes);
                            }
                        }
                    });
                }
            },
            clear: function(event){
                if(this.isClear){
                    event.target.value = "";
                    this.isClear = false;
                }
                this.testPhone(this.phone);
            },
            testPhone: function(phone){
                if (phone.length != 11) {
                    // App.alert("输入的手机号有误，请重新输入");
                    this.phoneValid = false;
                    this.active = "grey";
                    return false;
                }else{
                    this.phoneValid = true;
                    this.active = "";
                    return true;
                }
                this.testReg();
            },
            testCode: function(code){
                this.codeValid = code.length != 6?false:true;
                this.testReg();
            },
            testPassword: function(password){
                this.passwordValid = password.length<=18&&password.length>=6?true:false;
                this.testReg();
            },
            testReg:function(){
                if(this.phoneValid&&this.codeValid&&this.passwordValid){
                    this.regActive = ""
                    this.canReg = true;
                }else{
                    this.regActive = "grey"
                    this.canReg = false;
                }
            },
            submit: function () {
                var _self = this;
                if(this.canReg){//手机号合法
                    var _url = App.config.urlPath + "/account/register";
                    var vas = {
                        phone: _self.phone,
                        pwd: _self.pwd,
                        code: _self.code
                    };
                    App.upData({
                        url: _url,
                        data: vas,
                        success: function (data) {
                            if (data.state == 1) {
                                App.cxmain.openChild('ucenter');
                            }else{
                                App.alert(data.errordes,{tips:true});
                            }
                        }
                    });
                }
            },
            showPwd: function() {
                if(this.type == "password"){
                    this.type = "text";
                    this.icon = "";
                }else{
                    this.type = "password";
                    this.icon = "grey";
                }
            },
        }
    });
    return v;
})

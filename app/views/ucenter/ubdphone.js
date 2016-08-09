var App = App || {};
define([
	'uview',
	'text!tpl/u_bdphone.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'ubdphone', //名称
            cxId: '#u-bdacc', //视图ID
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {
                this.phone = App.user.info.cellphone;
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            phone: '',
            code: ""
        },
        methods: {
            //发送手机验证
            upDataSendVad: function () {
                var _url = App.config.urlPath + "/code/send?" + App.config.accompany;
                var _vas = {
                    type: 1,
                    phone: this.phone
                }
                App.upData({
                    url: _url,
                    data: _vas,
                    success: function (data) {
                        if (data.state == 1) {
                            App.alert('验证码已发送');
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            //绑定手机
            upDataVad: function () {
                var _this = this;
                var _url = App.config.urlPath + "/user/bindphone?" + App.config.accompany;
                var _vas = {
                    code: this.code,
                    phone: this.phone
                }
                App.upData({
                    url: _url,
                    data: _vas,
                    success: function (data) {
                        if (data.state == 1) {
                            App.alert('绑定手机成功', {
                                closed: function () {
                                    App.user.info.cellphone=_this.phone;
                                    window.history.back();
                                }
                            });
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            }
        }
    });
    return v;
})

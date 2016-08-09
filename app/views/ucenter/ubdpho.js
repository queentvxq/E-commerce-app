var App = App || {};
define([
	'uview',
	'text!tpl/u_bdpho.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'ubdpho', //名称
            cxId: '#u_bdpho', //视图ID
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {
                this.phone = App.user.info.cellphone;
                this.ordernumber = this.$options.vas;
                console.log(this.phone);
                console.log(this.ordernumber);
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            phone: '',
            ordernumber: ""
        },
        methods: {
            //绑定手机
            upDataVad: function () {
                var _this = this;
                var _url = App.config.urlPath + "/V2/User/BindOrder?" + App.config.accompany;
                var _vas = {
                    ordernumber: this.ordernumber,
                    phone: this.phone
                }
                App.upData({
                    url: _url,
                    data: _vas,
                    success: function (data) {
                        if (data.state == 1) {
                            App.alert('绑定手机成功', {
                                closed: function () {
                                    window.location.href = "#ucenter";
                                    setTimeout(function () {
                                        window.location.href = "#ucenter/uordermx/" + _this.ordernumber;
                                    }, 500);
                                }
                            });
                        } else {
                            App.alert('错误');
                        }
                    }
                });
            }
        }
    });
    return v;
})

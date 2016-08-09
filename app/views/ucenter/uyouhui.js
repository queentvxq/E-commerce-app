var App = App || {};
define([
	'uview',
	'text!tpl/u_youhui.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uyouhui', //名称
            cxId: '#u-youhui', //视图ID
            cxWpid: '#u_youhui_list', //滚动区域的ID
            cxApi: '/v2/user/mycoupon',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {}
        },
        cxData: {
            transitionName: 'cxpRight',
            numb: ""
        },
        methods: {
            takeUp: function () {
                if(this.numb!=""){
                    var _this = this;
                    App.upData({
                        url: App.config.urlPath + "/v2/user/getnCoupon?" + App.config.accompany,
                        data: {
                            couponnum: this.numb
                        },
                        success: function (data) {
                            if (data.state == 1) {
                                _this.numb="";
                                _this.renData();
                            } else {
                                if (data.errordes != "") {
                                    App.alert(data.errordes);
                                } else {
                                    App.alert(data.result.info);
                                }
                            }
                        }
                    });                    
                }else{
                    //App.alert("请输入优惠券码");
                }
            }
        }
    });
    return v;
})

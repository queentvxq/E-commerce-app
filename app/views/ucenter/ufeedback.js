var App = App || {};
define([
	'uview',
	'text!tpl/u_feedback.html',
    'utopbar2'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar2": utopbar
        },
        objectExtend: {
            cxName: 'ufeedback', //名称
            cxId: '#u-feedback', //视图ID
            cxWpid: '#u_feedback', //滚动区域的ID
            cxApi: '/user/feedback',
            cxAutoShow: true,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {}
        },
        cxData: {
            transitionName: 'cxpRight',
            content: '',
            btname: '发送'
        },
        methods: {
            upData: function () {
                console.log("upData");
                var _url = App.config.urlPath + this.cxApi + "?token=" + App.config.token;
                App.upData({
                    url: _url,
                    data: {
                        content: this.content
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            App.alert('感谢你的反馈', {
                                closed: function () {
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

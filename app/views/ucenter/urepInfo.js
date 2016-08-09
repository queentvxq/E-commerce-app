var App = App || {};
define([
    'uview',
    'text!tpl/u_repinfo.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'urepinfo',
            cxId: '#u_r_i',
            cxWpid: '#u_r_i_m',
            cxApi: '/v2/user/UserReportDetailInfo',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {},
            cxCreated: function () {
                this.cxVas.reportId = this.$options.vas;
                this.cxVas = {
                    reportId:this.$options.vas
                }
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            share:function () {
                var content = '望厨服务分享';
                var href = 'others/repshare.html';
                var type = 2;
                App.n.share.share(content,href,type);
            }
        }
    });
    return v;
})

var App = App || {};
define([
    'uview',
    'text!tpl/u_report_list.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'ureportList',
            cxId: '#u_reportl_m',
            cxWpid: '#u_reportl_m',
            cxApi: '/v2/user/GetEvaluatReportDetail',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () { },
            cxCreated: function () {
                this.cxVas.ordernumber ='';
                if(this.$options.vas!=undefined){
                    this.cxApi = '/v2/user/GetSeviceReportDetail';
                    this.cxVas.ordernumber = this.$options.vas;
                }
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            urepinfo:function (id) {
                window.location.href = '#ucenter/urepInfo/'+id;
            }
        }
    });
    return v;
})

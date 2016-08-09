var App = App || {};
define([
	'uview',
	'text!tpl/u_order_log.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uorderlog', //名称
            cxId: '#u-orderlog', //视图ID
            cxWpid: '#u_order_w', //滚动区域的ID
            cxApi: '/v2/user/SelectWlInfo',
            cxAutoload: true,
            cxAutoShow: true,
            cxVas: {
                ordernumber: ""
            },
            cxCreated: function () {
                this.cxVas.ordernumber = this.$options.vas;
            },
            cxReady: function () {
                App.footbar(false);
                //#ucenter/uordermx
            },
            cxLoadDataSuccess: function (data) {
                var _list=data.result.list;
                var _lg=_list.length;
                if(_lg>0){
                    for(var i=0;i<_lg;i++){
                        _list[i].list.reverse();
                    }
                }
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {

        }
    });
    return v;
})

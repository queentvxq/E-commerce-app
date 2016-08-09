var App = App || {};
define([
    'uview',
    'text!tpl/u_device.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'udevice',//名称
            cxId: '#u_device_list', //视图ID
            cxWpid: '#u_device_list', //滚动区域的ID
            cxApi: '/v2/user/UserDeviceInfo',
            cxPage: 1,
            cxPagesize: 10,
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {

            },
            cxCreated: function () {
                this.cxVas.ordernumber ='';
                if(this.$options.vas!=undefined){
                    this.cxVas.ordernumber = this.$options.vas;
                }
                if (App.cxmain.cxChildP.cxChildP) {
                    if (App.cxmain.cxChildP.cxChildP.cxName == "uindex") {
                        this.transitionName = "cxpRight";
                    }
                }
                
            }
        },
        cxData: {
            transitionName: 'cxpFadeLeft'
        },
        methods: {
            goinfo:function (id) {
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/udeviceinfo/" + id;
            },
            newDevice:function () {
                this.transitionName = "cxpFadeRight";
                if(this.$options.vas){
                    window.location.href = "#ucenter/udeviceAdd/"+this.$options.vas;
                }else{
                    window.location.href = "#ucenter/udeviceAdd";
                }
            }
        }
    });
    return v;
})

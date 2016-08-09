var App = App || {};
define([
    'uview',
    'text!tpl/u_workreplist.html',
    'utopbar',
    'store'
], function (uview, tpl, utopbar, store) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'u_work_list',
            cxId: '#u_w_l',
            cxWpid: '#u_w_l',
            cxApi: '/v2/user/GetServiceReportList',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            store: null,
            cxReady: function () { },
            cxCreated: function () {
                this.list ='';
                this.cxVas.ordernumber = this.$options.vas;
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            updata: function (subordernumber, parentserviceid, serviceid, state) {
                App.upData({
                    url: App.config.urlPath + '/v2/user/ServiceReportStart?' + App.config.accompany,
                    data: {
                        subordernumber: subordernumber,
                        parentserviceid: parentserviceid,
                        serviceid: serviceid,
                        state: state,
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.state == 1) {

                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                    }
                });
            },
            start: function (subordernumber, parentserviceid, serviceid) {
                this.updata(subordernumber, parentserviceid, serviceid, 0);
                $('#' + 's' + serviceid).remove();
                $('#' + 'e' + serviceid).show();
            },
            end: function (subordernumber, parentserviceid, serviceid) {
                this.updata(subordernumber, parentserviceid, serviceid, 1);
                $('#' + 'e' + serviceid).remove();
                $('#endbtn').show();
            },
            gorep: function (subordernumber, parentserviceid, serviceid) {
                var _this = this;
                if ($('#' + 's' + serviceid)[0] == undefined) {
                    _this.store = new store('report');
                    var data = {
                        subordernumber: subordernumber,
                        parentserviceid: parentserviceid,
                        serviceid: serviceid
                    }
                    _this.store.set('report', data);
                    window.location.href = '#ucenter/ureport';
                }else{
                    App.alert("请先开始服务");
                }

            }
        }
    });
    return v;
})

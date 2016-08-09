var App = App || {};
define([
	'uview',
	'text!tpl/u_address.html',
    'views/ucenter/uaddressAdd'
], function (uview, tpl, uaddressAdd) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'uaddress', //名称
            cxId: '#u_address', //视图ID
            cxWpid: '#u_address', //滚动区域的ID
            cxChildId: "#childPage", //子视图ID
            cxApi: '/user/myaddress',
            $cxAdsList: null,
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxReady: function () {
                this.$cxAdsList = $("#adslist");
            },
            cxCreated: function () {},
            appendComplete: function () {
                this.transitionName = 'cxpRight';
                if (typeof this.$options.vas != "undefined") {
                    console.log(this.$options.vas);
                }
            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            openAdd: function () {
                this.cxRemove();
                this.loadPage(new uaddressAdd());
            },
            editAddress: function (e) {
                var vas = {};
                vas.id = $(e.currentTarget).attr('valId');
                vas.name = $(e.currentTarget).attr('valName');
                vas.cellphone = $(e.currentTarget).attr('valPhone');
                vas.street = $(e.currentTarget).attr('valStreet');
                vas.room = $(e.currentTarget).attr('valRoom');
                vas.valProv = $(e.currentTarget).attr('valProv');
                vas.valCity = $(e.currentTarget).attr('valCity');
                vas.valRegion = $(e.currentTarget).attr('valRegion');
                vas.provinceid = $(e.currentTarget).attr('provinceid');
                vas.cityid = $(e.currentTarget).attr('cityid');
                vas.regionid = $(e.currentTarget).attr('regionid');
                this.cxRemove();
                this.loadPage(new uaddressAdd(vas));
            }
        }
    });
    return v;
})

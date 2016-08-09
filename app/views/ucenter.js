var App = App || {};
define([
    'uview',
    'text!tpl/ucenter.html',
    'views/ucenter/uindex',
    'views/ucenter/uset',
    'views/ucenter/uorder',
    'views/ucenter/uwish',
    'views/ucenter/uyouhui',
    'views/ucenter/umsg',
    'views/ucenter/uaddress',
    'views/ucenter/ufeedback',//反馈
    'views/ucenter/udevice',//设备管理
    'views/ucenter/udeviceAdd',//添加设备
    'views/ucenter/udeviceinfo',//设备信息
    'views/ucenter/uaddr',//用户地址
    'views/ucenter/uaddrEdit',//修改地址
    'views/ucenter/uaddrNew',//新建地址
    'views/ucenter/ureportList', //个人服务报告列表
    'views/ucenter/urepInfo', //服务报告详情
    'views/ucenter/ureport', //填写服务报告
    'views/ucenter/ubdacc',//绑定账号
    'views/ucenter/ubdphone',//绑定手机
    'views/ucenter/uwork',//工作单
    'views/ucenter/uworkreplist', //工作单列表
    'views/ucenter/uordermx',//订单详细
    'views/ucenter/uorderlog',//物流信息
    'views/ucenter/usetHd',
    'views/ucenter/uabout',
    'views/ucenter/repshare',
    'views/ucenter/ubdpho',
    'views/ucenter/uaboutf'
], function (uview, tpl, uindex, uset, uorder, uwish, uyouhui, umsg, uaddress, ufeedback, udevice, udeviceAdd, udeviceinfo, uaddr, uaddrEdit, uaddrNew, ureportList, urepInfo, ureport, ubdacc, ubdphone, uwork, uworkreplist, uordermx, uorderlog, usetHd, uabout, repshare,ubdpho,uaboutf) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'ucenter', //名称
            cxId: '#u-center', //视图ID
            cxChildId: "#u_center",
            cxAutoShow: true,
            cxChildPage: {
                "uindex": uindex,
                "uset": uset,
                "uorder": uorder,
                "uwish": uwish,
                "uyouhui": uyouhui,
                "umsg": umsg,
                "uaddress": uaddress,
                "ufeedback": ufeedback,
                "udevice": udevice,
                "udeviceAdd": udeviceAdd,
                "udeviceinfo": udeviceinfo,
                "uaddr": uaddr,
                "uaddrEdit": uaddrEdit,
                "uaddrNew": uaddrNew,
                "ureportList": ureportList,
                "urepInfo": urepInfo,
                "ureport": ureport,
                "ubdacc": ubdacc,
                "ubdphone": ubdphone,
                "uwork": uwork,
                "uworkreplist": uworkreplist,
                "uordermx": uordermx,
                "uorderlog": uorderlog,
                "usetHd": usetHd,
                "uabout": uabout,
                "repshare": repshare,
                "ubdpho":ubdpho,
                "uaboutf":uaboutf
            },
            cxReady: function () {
                App.trace("uenter_initPage:" + this.$options._initPage);
                if (typeof this.$options._initPage != "undefined") {
                    this.openChild(this.$options._initPage);
                } else {
                    this.openChild("uindex");
                }
            },
            cxNextTick: function () {
                if (this.cxChildP.cxName != "uindex") {
                    App.footbar(false);
                } else {
                    App.footbar(true);
                }
            }
        },
        cxData: {
            transitionName: 'cxpFade'
        },
        methods: {}
    });
    return v;
})

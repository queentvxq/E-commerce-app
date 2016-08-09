var App = App || {};
define([
    'uview',
    'text!tpl/u_deviceAdd.html',
    'utopbar2'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar2": utopbar
        },
        objectExtend: {
            cxName: 'udeviceAdd',
            cxId: '',
            cxWpid: '',
            cxApi: '',
            _store: '',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {
                $('input[readonly]').focus(function () {
                    this.blur();
                });
            },
            cxCreated: function () {
                var _this = this;
                _this.device.category = '';
                App.upData({
                    url: App.config.urlPath + '/v2/user/GetNProductCategoryInfo?' + App.config.accompany,
                    data: {},
                    success: function (data) {
                        if (data.state == 1) {
                            _this.device.devicecategory = data.result.list;
                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                    }
                });
                App.upData({
                    url: App.config.urlPath + '/v2/user/getbrands?' + App.config.accompany,
                    success: function (data) {
                        if (data.state == 1) {
                            _this.device.getbrands = data.result;
                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                    }
                });
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            device: {
                devicecategory: '', //设备
                getbrands: '',      //品牌
                category: ''
            }
        },
        methods: {
            getcategory: function () {                   //获取设备
                var _this = this;
                var id = _this.selected;
                App.upData({
                    url: App.config.urlPath + '/v2/user/GetNProductCategoryInfo?' + App.config.accompany,
                    data: {
                        parentid: id
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            _this.device.category = data.result.list;
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
            showmy_model: function () {
                $("#mymodel").show().focus();
            },
            getdate: function () {
                var date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10)
                    month = '0' + month;
                if (day < 10)
                    day = '0' + month;
                var max = year + '-' + month + '-' + day;
                var min = (year - 10) + '-' + month + '-' + day;
                $("#mydate").attr('min', min);
                $("#mydate").attr('max', max);
                $("#mydate").click();
                $("#mydate").focus();
            },
            device_add_btn: function () {
                App.upData({
                    url: App.config.urlPath + '/v2/user/AddDevice?' + App.config.accompany,
                    data: {
                        ordernumber: this.$options.vas,
                        devicecategory: $('#devicecategory').val() == null ? 0 : $('#devicecategory').val(),
                        ingredientid: $('#ingredientid').val() == null ? 0 : $('#ingredientid').val(),
                        model: $('#mymodel').val() == null ? 0 : $('#mymodel').val(),
                        categoryid: $("#category").val() == null ? 0 : $("#category").val(),
                        installyear: $("#mydate").val().split('-')[0],
                        installmonth: $("#mydate").val().split('-')[1],
                    },
                    success: function (data) {
                        if (data.state == 1) {
                            window.history.back();
                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                    }
                });
            }
        }
    });
    return v;
})
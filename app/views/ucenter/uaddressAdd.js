var App = App || {};
define([
	'uview',
	'text!tpl/u_address_add.html',
	'text!tpl/u_modal_cty.html'
], function (uview, tpl, tpl_md) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'uaddressAdd', //名称
            cxId: '#u-addressAdd', //视图ID
            cxApi: '/user/updateaddress',
            cxAutoShow: true,
            myScroll: null,
            $modal: null,
            cxInit: function () {
                //弹窗模块
                this.$modal = $(tpl_md);
                this.$modal.on('opened.modal.amui', function () {});
            },
            cxReady: function () {
                this.transitionName = 'cxpLeft';
            },
            cxCreated: function () {
                if (typeof this.$options.id != "undefined") {
                    this.adname = this.$options.name;
                    this.cellphone = this.$options.cellphone;
                    this.street = this.$options.street;
                    this.room = this.$options.room;
                    this.pro_name = this.$options.valProv;
                    this.ciy_name = this.$options.valCity;
                    this.reg_name = this.$options.valRegion;
                    this.provinceid = this.$options.provinceid;
                    this.cityid = this.$options.cityid;
                    this.regionid = this.$options.regionid;
                }
            },
            appendComplete: function () {}
        },
        cxData: {
            transitionName: 'cxpRight',
            provinceid: 1,
            cityid: 1,
            regionid: 1,
            adid: "",
            adname: "",
            cellphone: "",
            street: "",
            room: "",
            pro_name: "选择省",
            ciy_name: "选择市",
            reg_name: "选择县区"
        },
        methods: {
            upData: function () {
                var _vas = {
                    name: this.adname,
                    cellphone: this.cellphone,
                    provinceid: this.provinceid,
                    cityid: this.cityid,
                    regionid: this.regionid,
                    street: this.street,
                    room: this.room
                };
                if (typeof this.$options.id != "undefined") _vas.id = this.$options.id;

                var _this = this;
                App.upData({
                    url: App.config.urlPath + this.cxApi + "?" + App.config.accompany,
                    data: _vas,
                    success: function (data) {
                        if (data.state == 1) {
                            _this.cxRemove();
                            _this.cxParentP.show = true;
                            _this.cxParentP.loadData();
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
            selectPro: function () {
                this.openModal('/user/getprovince', '#areaPro');
            },
            selectCiy: function () {
                this.openModal('/user/getcity', '#areaCiy');
            },
            selectReg: function () {
                this.openModal('/user/getregion', '#areaRegion');
            },
            openModal: function (_api, _target) {
                $('body').append(this.$modal);
                this.$modal.modal("toggle");
                $("#u_adress_area>ul").html('<li>数据加载中...</li>');
                /*获取数据*/
                var _data = {
                    pid: this.provinceid,
                    cid: this.cityid
                };
                var _this = this;
                var _url = App.config.urlPath + _api + "?" + App.config.accompany;
                App.upData({
                    url: _url,
                    data: _data,
                    success: function (data) {
                        if (data.state == 1) {
                            var list = data.result.list;
                            var lg = list.length;
                            var _html = '';
                            for (var i = 0; i < lg; i++) {
                                _html += '<li data-val="' + list[i].id + '">' + list[i].name + '</li>'
                            }
                            $("#u_adress_area>ul").html(_html);
                            $("#u_adress_area li").click(function (e) {
                                switch (_target) {
                                    case "#areaPro":
                                        _this.pro_name = $(e.currentTarget).text();
                                        _this.provinceid = $(e.currentTarget).attr('data-val');
                                        break;
                                    case "#areaCiy":
                                        _this.ciy_name = $(e.currentTarget).text();
                                        _this.cityid = $(e.currentTarget).attr('data-val');
                                        break;
                                    case "#areaRegion":
                                        _this.reg_name = $(e.currentTarget).text();
                                        _this.regionid = $(e.currentTarget).attr('data-val');
                                        break;
                                }
                                _this.$modal.modal("close");
                            });
                            _this.refreshScroll();
                        } else {
                            App.alert(data.errordes);
                        }
                    }
                });
            },
            refreshScroll: function () {
                this.myScroll = new this.iScroll('#u_adress_area', {
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale',
                    fadeScrollbars: true,
                    click: true
                });
            }
        }
    });
    return v;
})

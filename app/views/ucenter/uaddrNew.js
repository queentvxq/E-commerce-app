var App = App || {};
define([
    'uview',
    'text!tpl/u_addrNew.html',
    'store',
    'utopbar2'
], function (uview, tpl, store,utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar2": utopbar
        },
        objectExtend: {
            cxName: 'uaddrEdit',
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
                var _this = this;
                $('#placeselect').tabs({ noSwipe: 1 });

                $(".am-tabs-bd div").on('click', '.data-list', function () {
                    var id = parseInt($(this).attr('data-val'));
                    if ($(this).attr('type') == 'p') {
                        _this.city_select(id);
                        _this.addr.province = $(this).text();
                        _this.addr.provinceid = id;
                    }
                    if ($(this).attr('type') == 'c') {
                        _this.region_select(id);
                        _this.addr.city = $(this).text();
                        _this.addr.cityid = id;
                    }
                    if ($(this).attr('type') == 'o') {
                        _this.addr.region = $(this).text();
                        _this.addr.regionid = id;
                        _this.addr.place = _this.addr.province + ' ' + _this.addr.city + ' ' + _this.addr.region;
                        $('#placeselect').hide();
                    }
                });
            },
            cxCreated: function () {
                this.addr = {
                    province: '',
                    city: '',
                    region: '',
                    provinceid: '',
                    cityid: '',
                    regionid: '',
                    name: '',
                    cellphone: '',
                    street: '',
                    room: '',
                    isdefault: 0,
                    place: ''
                }
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            addr: {}
        },
        methods: {
            goBack: function () {
                window.history.back();
            },
            saveBtn: function () {
                App.upData({
                    url: App.config.urlPath + '/user/updateaddress?' + App.config.accompany,
                    data: this.addr,
                    success: function (data) {
                        if (data.state == 1) {
                            App.ldUserinfo();
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
            },
            close_sel: function () {
                $('#placeselect').hide();
            },
            place_select: function () {
                $('#placeselect').show();
                this.get_place_data('getprovince', '');
            },
            city_select: function (pid) {
                var id = { "pid": pid }
                this.get_place_data('getcity', id);
                $('#placeselect').tabs('open', 1);
            },
            region_select: function (pid) {
                var id = { "cid": pid }
                this.get_place_data('getregion', id);
                $('#placeselect').tabs('open', 2);

            },
            get_place_data: function (t, id) {
                var type;
                if (id == '') {
                    type = 'p';
                } else if (id.pid) {
                    type = 'c';
                } else {
                    type = 'o';
                }
                App.upData({
                    url: App.config.urlPath + '/user/' + t + "?" + App.config.accompany,
                    data: id,
                    success: function (data) {
                        if (data.state == 1) {
                            var data = data.result.list;
                            var _html = '';
                            for (var i = 0; i < data.length; i++) {
                                _html += "<div type=" + type + " class='data-list' data-val=" + data[i].id + " >" + data[i].name + "</div>";
                                $("#" + t).html(_html);
                            }
                        } else {
                            data.errordes == "" ? App.alert(data.result.info) : App.alert(data.errordes);
                        }
                    }
                });
            }
        }
    });
    return v;
})
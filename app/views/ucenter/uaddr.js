var App = App || {};
define([
    'uview',
    'text!tpl/u_addr.html',
    'utopbar',
    'store'
], function (uview, tpl, utopbar,store) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uaddr',
            cxId: '#u_addr_list',
            cxWpid: '#u_addr_list',
            cxApi: '/user/myaddress',
            cxAutoload: true,
            cxAutoShow: true,
            _store: '',
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () { },
            cxCreated: function () {
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
            goBack: function () {

            },
            set_default: function (id) {
                App.upData({
                    url: App.config.urlPath + '/user/SetAddrDefault?' + App.config.accompany,
                    data: { "id": id },
                    success: function (data) {
                        console.log(data);
                        if (data.state == 1) {
                            $('.select span').removeClass('addr_active');
                            $('#set' + id).children('span').addClass('addr_active');
                            App.ldUserinfo();
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
            setlocal: function (id,name,cellphone,province,city,region,provinceid,cityid,regionid,street,room) {
                var info = {
                    "id":id,
                    "name":name,
                    "cellphone":cellphone,
                    "province":province,
                    "city":city,
                    "region":region,
                    "provinceid":provinceid,
                    "cityid":cityid,
                    "regionid":regionid,
                    "street":street,
                    "room":room,
                    "isdefault":$('#set' + id).children('span').hasClass('addr_active')?1:0
                }
                this._store = new store('addr'),
                this._store.set('addr',info);
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/uaddrEdit/" + id;
            },
            del_addr: function (id) {
                App.upData({
                    url: App.config.urlPath + '/v2/user/deleteaddress?' + App.config.accompany,
                    data: { id: id },
                    success: function (data) {
                        if (data.state == 1) {
                            $('#'+id).remove();
                            App.ldUserinfo();
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
            newAddr: function(){
                this.transitionName = "cxpFadeRight";
                window.location.href = "#ucenter/uaddrNew";
            }
        }
    });
    return v;
})

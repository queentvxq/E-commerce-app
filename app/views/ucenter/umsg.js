var App = App || {};
define([
	'uview',
	'text!tpl/u_msg.html',
    'utopbar2'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar2": utopbar
        },
        objectExtend: {
            cxName: 'umsg', //名称
            cxId: '#u-msg', //视图ID
            cxWpid: '#u_msg_list', //滚动区域的ID
            cxApi: '/user/mymessage',
            cxAutoload: true,
            cxAutoShow: true,
            cxInit: function () {},
            cxReady: function () {

            }
        },
        cxData: {
            transitionName: 'cxpRight',
            delmsg: false
        },
        methods: {
            openMore: function (_id, evt, _sub) {
                if (this.list[_sub].state == 0) {
                    var _this = this;
                    var _url = App.config.urlPath + "/user/readmessage?" + App.config.accompany;
                    App.upData({
                        url: _url,
                        data: {
                            id: _id
                        },
                        success: function (data) {
                            _this.list[_sub].state = 1;
                            _this.notice();
                        }
                    })
                }
                if(this.list[_sub].url!=""){
                    window.location.href="#"+this.list[_sub].url;
                }else{
                    $("#i" + _id).toggleClass('act');
                    this.vScroll.refresh();                    
                }
            },
            notice: function () {
                var _new = false;
                for (var k in this.list) {
                    if (this.list[k].state == 1) {
                        _new = true;
                        App.user.notice.messagecount=0
                        break;
                    }
                }
                this.$refs.utopbar.new = _new;
            },
            editNotice: function () {
                if (!this.delmsg) {
                    this.$refs.utopbar.btname = "保存"
                    this.delmsg = true;
                } else {
                    this.$refs.utopbar.btname = "编辑"
                    this.delmsg = false;
                    this.renData();
                }
            },
            delNotice: function (_sub, _id) {
                App.loading(true);
                var _this = this;
                var _url = App.config.urlPath + "/v2/user/deletemessage?token=" + App.config.token;
                App.upData({
                    url: _url,
                    data: {
                        id: _id
                    },
                    success: function (data) {
                        App.loading(false);
                        if (data.state != 1) {
                            App.alert(data.errordes);
                        } else {
                            _this.list.splice(_sub, 1);
                        }
                    }
                });
            }
        }
    });
    return v;
})

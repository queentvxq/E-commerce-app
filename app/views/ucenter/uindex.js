var App = App || {};
define([
	'uview',
	'text!tpl/u_index.html'
], function (uview, tpl) {
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'uindex', //名称
            cxId: '#u_index', //视图ID
            cxWpid: '#u_index', //滚动区域的ID
            cxAutoload: true,
            cxAutoShow: true,
            cxPagesize: 20,
            cxInit: function () {
                App.footbar(true);
            },
            cxReady: function () {},
            cxCreated: function () {
                var _this = this;
                if (App.user.notice) {
                    if (App.user.notice.messagecount > 0) {
                        this.new = true;
                    }
                    this.wcount = App.user.notice.waitingcount;
                    this.pcount = App.user.notice.processingcount;
                }
                if (App.cxmain.cxChildP.cxChildP) {
                    this.transitionName = "cxpFadeLeft";
                }
                if (App.user.info) {
                    if (App.user.info.avatar != "") this.avatar = App.user.info.avatar;
                    this.nickname = App.user.info.nickname;
                    this.gender = App.user.info.gender;
                    if (App.user.info.isGcs == 1) {
                        this.isGcs = true;
                    }
                }
                App.user.relnotice(function () {
                    _this.wcount = App.user.notice.waitingcount;
                    _this.pcount = App.user.notice.processingcount;
                    if (App.user.notice.messagecount > 0) {
                        _this.new = true;
                    }
                });
                if (App.about) {
                    this.tel = App.about.tel;
                }
            },
            appendComplete: function () {
                this.transitionName = "cxpFadeRight";
            },
            removeComplete: function () {}
        },
        cxData: {
            transitionName: 'cxpFade',
            avatar: "assets/imgs/uimg.png",
            nickname: "登录/注册",
            new: false,
            wcount: 0,
            pcount: 0,
            tel: false,
            isGcs: false
        },
        methods: {
            /*退出用户中心*/
            logOut: function () {
                App.logout();
            },
            showLogin: function () {
                App.login.show();
            },
            testLogin: function (evt) {
                if (App.config.token == "") {
                    evt.preventDefault();
                    App.login.show();
                    return false;
                }
            },
            goPage: function (_val, _evt) {
                if (App.config.token == "") {
                    App.login.show();
                } else {
                    window.location.href = "#ucenter/uset";
                }
            },
            telphone: function (_val) {
                App.callPhone(_val);
            }
        }
    });
    return v;
})

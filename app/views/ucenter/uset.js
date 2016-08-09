var App = App || {};
define([
	'uview',
	'text!tpl/u_set.html',
    'utopbar'
], function (uview, tpl, utopbar) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar": utopbar
        },
        objectExtend: {
            cxName: 'uset', //名称
            cxId: '#u-set', //视图ID
            cxWpid: '#u_set', //滚动区域的ID
            cxAutoload: true,
            cxAutoShow: true,
            upnameTime: null,
            _it: null,
            _bk: 0,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {
                this.userinfo = App.user.info;
                if (App.user.info.avatar != "") this.avatar = App.user.info.avatar;
                this.nickname = App.user.info.nickname;
                this.gender = App.user.info.gender;

                this.$watch('nickname', this.unameChange);
                this.$watch('gender', this.upData);

                if (App.cxmain.cxChildP.cxChildP) {
                    if (App.cxmain.cxChildP.cxChildP.cxName == "usetHd") {
                        this.transitionName = "cxpFadeLeft";
                    }
                }
                this.wx = !App.isWeixin();

                var _this = this;
                App.upData({
                    url: App.config.urlPath + '/v2/device/CheckVersion?' + App.config.accompany,
                    data: {},
                    success: function (data) {
                        _this.version = data.result.version;
                        if (App.user.v !== _this.version) {
                            $(".redDot").append("<span class='cxdot' style='top:32%;right:3.2rem;'></span>")
                        }
                    }
                });
                this.v = App.user.v;
            }
        },
        cxData: {
            transitionName: 'cxpRight',
            avatar: "assets/imgs/uimg.png",
            nickname: '',
            gender: 1,
            userinfo: null,
            wx: true,
            version: '',
            v: ''
        },
        methods: {
            unameChange: function () {
                var _this = this;
                if (this.upnameTime) {
                    clearTimeout(this.upnameTime);
                };
                this.upnameTime = setTimeout(function () {
                    _this.upData();
                }, 500);
            },
            upData: function () {
                var _this = this;
                var _url = App.config.urlPath + "/user/setnickname?" + App.config.accompany;
                var _data = {
                    nickname: this.nickname,
                    gender: this.gender
                };
                if (App.tool.getLength(this.nickname) > 16) {
                    App.alert("名字太长啦", {
                        tips: true
                    });
                } else {
                    if (this.nickname != "") {
                        App.upData({
                            url: _url,
                            data: _data,
                            success: function (data) {
                                if (data.state == 1) {
                                    App.user.info.gender = _this.gender;
                                    App.user.info.nickname = _this.nickname;
                                } else {
                                    App.alert("修改错误");
                                }
                            }
                        })
                    };
                }
            },
            logOut: function () {
                App.logout();
            },
            goPage: function () {
                this.transitionName = "cxpFadeRight";
            },
            odebug: function () {
                var _this = this;
                this._bk++;
                if (this._it) {
                    clearTimeout(this._it);
                }
                this._it = setTimeout(function () {
                    _this._bk = 0;
                }, 1000);
                if (this._bk > 2) {
                    if (!App.debug.show) {
                        if (App.debug._init) {
                            App.debug.open();
                        } else {
                            App.debug.init();
                        }
                    } else {
                        App.debug.close();
                    }
                }
            }
        }
    });
    return v;
})

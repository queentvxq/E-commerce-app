var App = App || {};
define(['jquery', "underscore", 'md5'], function ($, _, md5) {
    var loadSpr = {
        /*loading状态 true完成，false加载中*/
        state: true,
        /*加载的对象数组，一般是页面*/
        objArr: [],
        $loading: $('<div id="o_load"><div class="loading08"><div class="loader">Loading...</div></div></div>')
    };
    /*对象扩展*/
    App.extend = function (subclass, superclass) {
        function o() {
            this.constructor = subclass;
        }
        o.prototype = superclass.prototype;
        return (subclass.prototype = new o());
    };
    /*调试输出显示*/
    App.trace = function (val) {
        if (App.debug._init) {
            $("#trace").prepend(val + "</br>");
        } else {
            App.debug.trace.push(val);
        }
    };
    /*加载的loading显示*/
    App.loading = function (_tf) {
        if (_tf) {
            if (loadSpr.state) {
                loadSpr.state = false;
                $("body").append(loadSpr.$loading);
                loadSpr.$loading.show();
            }
        } else {
            if (!loadSpr.state) {
                loadSpr.state = true;
                loadSpr.$loading.fadeOut("fast", function () {
                    loadSpr.$loading.remove();
                });
            }
        }
    };
    /*显示和隐藏底部导航 */
    App.footbar = function (_val) {
        App.cxmain.$refs.footbar.show = _val;
    };
    /*重新载入页面*/
    App.reload = {
        it: null,
        c: function () {
            if (this.it) {
                clearTimeout(this.it);
                this.it = null;
            };
        },
        r: function () {
            this.c();
            this.it = setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    };
    /*退出登录*/
    App.logout = function () {
        App.upData({
            url: App.config.urlPath + "/account/logoff?token=" + App.config.token,
            success: function (data) {
                if (data.state == 1) {
                    App.user.token = "";
                    window.history.back();
                    //window.location.href = "#login";
                    localStorage.removeItem('home');
                    localStorage.removeItem("uid");
                    App.user.info = null;
                    App.user.notice = null;
                } else {
                    App.user.token = "";
                    App.alert('退出失败');
                }
                App.cxmain.$refs.footbar.setBuyBtn();
            }
        });
    };
    /*弹出登录提示框*/
    App.login = {
        show: function () {
            App.cxmain.$refs.loginbar.show = true;
        }
    };
    /*格式化数字*/
    App.tool.Ftime = function (_num) {
        var _m = parseInt(parseInt(_num) / 60);
        var _s = parseInt(parseInt(_num) % 60);
        if (_m < 10) _m = "0" + _m;
        if (_s < 10) _s = "0" + _s;
        return (_m + ":" + _s);
    };
    /*计算字符长度，中文字符表示两个*/
    App.tool.getLength=function(_val){
        return _val.replace(/[^\x00-\xff]/g,"aa").length;
    };
    /*定时器*/
    App.tool.IT = {
        o: {},
        new: function (_fun, _time) {
            var _d = new Date().getTime();
            this.o[_d] = setInterval(_fun, _time);
            return this.o[_d];
        },
        clear: function (_id) {
            clearInterval(_id);
        },
        clearAll: function () {
            for (var k in this.o) {
                clearInterval(this.o[k]);
            }
        }
    };
    /*拨打电话*/
    App.callPhone = function (_val) {
        if (App.isWeixin()) {
            window.location.href = "tel:" + _val;
        } else {
            App.alert("是否拨打电话：" + _val, {
                confirm: {
                    onConfirm: function () {
                        window.location.href = "tel:" + _val;
                    },
                    onCancel: function () {
                        //取消操作
                    }
                }
            });
        }
    };
    /*传输加密验证(MD5)*/
    App.enKey = function (_val) {
        //正式FD4F0C7B424D4178BAA3AE4A2976DAC4
        var _key = "C4FB7D2FE6E0982439180C4328A8CBD0";
        var _str = "";
        var _arr = _val.split("");
        var _lg = _arr.length;
        _arr.sort();
        for (var k = 0; k < _lg; k++) {
            _str += _arr[k];
        };
        _str = _key + _str;
        return md5.hex_md5(_str);
    };
    /*push信息内容*/
    App.pushMsg = function (_type, _val) {
        if (typeof _type == "undefined") _type = 1;
        if (typeof _val == "undefined") _val = "";
        App.upData({
            data: {
                type: _type,
                value: _val
            },
            url: App.config.urlPath + "/v2/shop/thepush?" + App.config.accompany
        });
    };
    /*下载APP*/
    App.down = function () {
        if (!App.isWeixin()) {
            if (plus.os.name == "Android") {
                plus.runtime.openURL(App.v.androidurl);
            } else {
                window.location.href = App.v.iosurl;
            }
        }
    };
    /*瀑布流list*/
    App.WaterFall = function (_param) {
        this.id = typeof _param.container == 'string' ? document.getElementById(_param.container) : _param.container;
        this.colWidth = _param.colWidth;
        this.colWidthUnit = _param.colWidthUnit || 'px';
        this.colCount = _param.colCount || 2;
        this.cls = _param.cls && _param.cls != '' ? _param.cls : 'wf-cld';
        this.init();
    };
    App.WaterFall.prototype = {
        id: '', //* container ID
        colWidth: '', //* column width
        colWidthUnit: 'px', //unit of column width,default is 'px'
        colCount: 2, //the number of columns,default is 2
        cls: 'wf-cld', //className of child elements,default is 'wf-cld'
        getByClass: function (cls, p) {
            var arr = [],
                reg = new RegExp("(^|\\s+)" + cls + "(\\s+|$)", "g");
            var nodes = p.getElementsByTagName("*"),
                len = nodes.length;
            for (var i = 0; i < len; i++) {
                if (reg.test(nodes[i].className)) {
                    arr.push(nodes[i]);
                    reg.lastIndex = 0;
                }
            }
            return arr;
        },
        maxArr: function (arr) {
            var len = arr.length,
                temp = arr[0];
            for (var ii = 1; ii < len; ii++) {
                if (temp < arr[ii]) {
                    temp = arr[ii];
                }
            }
            return temp;
        },
        getMar: function (node) {
            var dis = 0;
            if (node.currentStyle) {
                dis = parseInt(node.currentStyle.marginBottom);
            } else if (document.defaultView) {
                dis = parseInt(document.defaultView.getComputedStyle(node, null).marginBottom);
            }
            return dis;
        },
        getMinCol: function (arr) {
            var ca = arr,
                cl = ca.length,
                temp = ca[0],
                minc = 0;
            for (var ci = 0; ci < cl; ci++) {
                if (temp > ca[ci]) {
                    temp = ca[ci];
                    minc = ci;
                }
            }
            return minc;
        },
        init: function () {
            var _this = this;
            var col = [], //column height
                iArr = []; //index
            var nodes = _this.getByClass(_this.cls, _this.id),
                len = nodes.length;
            for (var i = 0; i < _this.colCount; i++) {
                col[i] = 0;
            }
            for (var i = 0; i < len; i++) {
                nodes[i].h = nodes[i].offsetHeight + _this.getMar(nodes[i]);
                iArr[i] = i;
            }

            for (var i = 0; i < len; i++) {
                var ming = _this.getMinCol(col);
                nodes[i].style.left = ming * _this.colWidth + _this.colWidthUnit;
                nodes[i].style.top = col[ming] + "px";
                col[ming] += nodes[i].h;
            }

            _this.id.style.height = _this.maxArr(col) + "px";
        }
    };

})

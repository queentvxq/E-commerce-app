var App = App || {};
define(['jquery'], function ($) {
    var _index = function () {
        return {
            w_h: $(window).height(),
            w_w: $(window).width(),
            imglog: "assets/imgs/wctxt.png",
            loadLg: 0,
            sub: 0,
            imgArr: [],
            adArr: [],
            it: null,
            $ads: null,
            touchAStarX: 0,
            touchBStarX: 0,
            tmvxA: 0,
            mvx: 0,
            move: ["moveA", "moveB", "moveC"],
            imglist: [
                {
                    sub: 0,
                    img: "assets/imgs/ib01.jpg",
                    title: "一位小资白领的小确幸",
                    txt: ["关于生活，我从不亏待自己", "细节之处也都会在意", "对待厨房用品，自然也要挑剔"],
                    btn: ""
                },
                {
                    sub: 1,
                    img: "assets/imgs/ib02.jpg",
                    title: "一名全职太太的逃离",
                    txt: ["在「今天」计划一场逃离", "将宝宝和爱人暂时忘记", "和美味约会，我从不缺席"],
                    btn: ""
                },
                {
                    sub: 2,
                    img: "assets/imgs/ib03.jpg",
                    title: "一个工作狂的独白",
                    txt: ["办公室是常驻地，应酬也没法抗拒", "更加想念家里天地", "选择专业厨房服务", "给家人一个惊喜"],
                    btn: "进入望厨"
                }
            ],
            init: function () {
                //保存当前版本信息
                localStorage.setItem("uv", App.user.v);
                this.$ads = $("<div id='indexAd'></div>");
                $("#main").append(this.$ads);
                var _lg = this.imglist.length;
                for (var i = 0; i < _lg; i++) {
                    var $_ad = this.createSpan(this.imglist[i]);
                    this.adArr.push($_ad);
                    this.$ads.append($_ad);
                }
                this.goAd();
                this.eventListener();
                return this;
            },
            eventListener: function () {
                this.$ads.on("touchstart", this, this.touchStart);
                this.$ads.on("touchmove", this, this.touchMove);
                this.$ads.on("touchend", this, this.touchEnd);
            },
            touchStart: function (e) {
                $(".am").addClass("amPaused");
                $(".iAdSpan").removeClass("anim");
                var _this = e.data;
                var touches = e.originalEvent.touches;
                _this.touchAStarX = touches[0].pageX;
                _this.autoPlay(false);
            },
            touchMove: function (e) {
                var _this = e.data;
                var touches = e.originalEvent.touches;
                var x = touches[0].pageX - _this.touchAStarX;
                var _mvx = parseInt(x / _this.w_w * 10000) / 100;
                _this.mvx = _mvx;
                _this.moveSpan(_mvx);
            },
            touchEnd: function (e) {
                $(".am").removeClass("amPaused");
                $(".iAdSpan").addClass("anim");
                $('.iAdSpan').removeAttr("style");
                var _this = e.data;
                if (_this.sub > 2) {
                    _this.goMain();
                } else {
                    if (_this.mvx < -20) {
                        _this.goAd();
                    } else if (_this.mvx > 20) {
                        _this.sub = _this.sub - 2;
                        _this.goAd();
                    }
                }
            },
            moveSpan: function (_mvx) {
                if ($(".moveA").length > 0) {
                    $(".moveA").css("-webkit-transform", "translateX(" + (_mvx - 200) + "%)");
                }
                if ($(".moveB").length > 0) {
                    $(".moveB").css("-webkit-transform", "translateX(" + (_mvx - 100) + "%)");
                }
                if ($(".moveC").length > 0) {
                    $(".moveC").css("-webkit-transform", "translateX(" + _mvx + "%)");
                }
                if ($(".moveD").length > 0) {
                    $(".moveD").css("-webkit-transform", "translateX(" + (_mvx + 100) + "%)");
                }
                if ($(".moveE").length > 0) {
                    $(".moveE").css("-webkit-transform", "translateX(" + (_mvx + 200) + "%)");
                }
            },
            buildStart: function () {
                this.autoPlay(true);
            },
            autoPlay: function (_val) {
                if (_val) {
                    var _this = this;
                    clearInterval(this.it);
                    this.it = setInterval(function () {
                        _this.goAd();
                    }, 5000);
                } else if (this.it) {
                    clearInterval(this.it);
                    this.it = null;
                }
            },
            goAd: function () {
                if (this.sub < 0) {
                    this.sub = 0;
                } else if (this.sub > 2) {
                    this.sub = 2;
                }
                for (var i = 0; i < 3; i++) {
                    this.adArr[i].removeClass("moveA moveB moveC moveD moveE am");
                }
                switch (this.sub) {
                    case 0:
                        this.adArr[0].addClass("moveC am");
                        this.adArr[1].addClass("moveD");
                        this.adArr[2].addClass("moveE");
                        break;
                    case 1:
                        this.adArr[0].addClass("moveB am");
                        this.adArr[1].addClass("moveC am");
                        this.adArr[2].addClass("moveD");
                        break;
                    case 2:
                        this.adArr[0].addClass("moveA");
                        this.adArr[1].addClass("moveB am");
                        this.adArr[2].addClass("moveC am");
                        break;
                }
                this.sub++;
                if (this.sub > 2) {
                    clearInterval(this.it);
                }
            },
            createSpan: function (_imgObj) {
                var _this = this;
                var _hm = "<div class='iAdSpan anim'>";
                _hm += "<img class='iadImg' src='" + _imgObj.img + "' id='adimg'" + _imgObj.sub + ">";
                _hm += "<div>";
                _hm += "<span class='iadTit'>" + _imgObj.title + "</span>";
                for (var i = 0; i < _imgObj.txt.length; i++) {
                    _hm += "<span>" + _imgObj.txt[i] + "</span>";
                };
                _hm += "</div>";
                _hm += "<img class='iadLog' src='" + this.imglog + "'>";
                _hm += "</div>";
                var _ad = $(_hm);
                if (_imgObj.btn != "") {
                    var $aBtn = $("<span class='aBtn'>" + _imgObj.btn + "</span>");
                    $aBtn.click(function () {
                        _this.goMain();
                    });
                    _ad.append($aBtn);
                }
                this.loadImg(_imgObj.img);
                return _ad;
            },
            loadImg: function (_url) {
                var _this = this;
                var _img = new Image();
                _img.onload = function () {
                    this.ww = this.width / _this.w_w;
                    this.wh = this.height / _this.w_h;
                    _this.loadLg++;
                    if (_this.loadLg == _this.imglist.length) {
                        _this.buildStart();
                    }
                }
                _img.src = _url;
                this.imgArr.push(_img);
            },
            goMain: function () {
                $("#indexAd").remove();
                App.init();
            }
        }
    }
    return _index;
})

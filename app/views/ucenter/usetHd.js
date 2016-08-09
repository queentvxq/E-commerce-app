var App = App || {};
define([
	'uview',
	'text!tpl/u_set_hd.html'
], function (uview, tpl) {
    var angle = 0;
    var start = 0;
    var v = uview.extend({
        template: tpl,
        objectExtend: {
            cxName: 'usetHd', //名称
            cxId: '#u-ssetHd', //视图ID
            cxAutoload: true,
            cxAutoShow: true,
            upnameTime: null,
            hdImg: null,
            cxInit: function () {},
            cxReady: function () {},
            cxCreated: function () {

            },
            appendComplete: function () {
                angle = 0;
                start = 0;
                var _this = this;
                this.hdImg = new htimgFun($("#u_setHd"));
                this.hdImg.init();
                this.hdImg.success = function (data) {
                    if (data.state == 1) {
                        App.user.info.avatar = data.result.info;
                        window.history.back();
                    } else {
                        App.alert(data.errordes);
                    }
                };

            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            selectImg: function () {
                this.hdImg.$inputFile.click();
            },
            upBtn: function () {
                this.hdImg.clipImage();
            },
            cancel: function () {
                history.back();
            },
            rotate: function () {
                if (start !== 0) {
                    angle += 90;
                    if (angle === 360) angle = 0;
                    this.hdImg.drawImage();
                }
            }
        }
    });
    var htimgFun = function ($dom) {
        this.$dom = $dom;
        this.$id = $dom.find("#u_set_hd");
        this.move = false; //是否允许移动
        this.scale = false; //是否允许缩放
        this.touchAStarX = 0; //第一触控点X坐标
        this.touchBStarX = 0; //第二触控点X坐标
        this.touchAStarY = 0; //第一触控点Y坐标
        this.touchBStarY = 0; //第二触控点Y坐标
        this.cvsW = 0; //画布宽度
        this.cvsH = 0; //画布高度
        this.clipX = 0; //裁切X坐标
        this.clipY = 0; //裁切Y坐标
        this.clipW = 200; //裁切宽度
        this.clipH = 200; //裁切高度
        this.$cvs = null; //画布的JQ对象
        this.cvs = null; //画布
        this.ctx = null; //画布绘图对象
        this.img = null; //图像
        this.imgX = 0; //图像X坐标
        this.imgY = 0; //图像Y坐标
        this.imgScale = 1; //缩放比例
        this.imgScaleStar = 1; //
        this.imgLoaded = false; //是否加载完成图像
        this.$inputFile = null; //
        this.$loadImgBtn = null; //
        this.$upBtn = null;
        this.clipCvs = null;
        this.init = function () {
            var _this = this;
            this.cvsW = window.innerWidth; //画布宽度    
            this.cvsH = window.innerHeight; //画布高度
            this.$cvs = $("<canvas id='canvas'></canvas>");
            this.$cvs.attr('width', this.cvsW);
            this.$cvs.attr('height', this.cvsH);
            $(this.$id).append(this.$cvs);

            this.$inputFile = $('<input type="file" name="imgOne" id="imgOne"  style="display: none;"/>');
            $(this.$id).append(this.$inputFile);

            this.cvs = this.$cvs[0];

            this.$cvs.on("touchstart", this, this.touchStart);
            this.$cvs.on("touchmove", this, this.touchMove);
            this.$cvs.on("touchend", this, this.touchEnd);
            this.ctx = this.cvs.getContext('2d');

            this.$inputFile.on("change", function (e) {
                _this.localImg(e.target.files[0]);
            });

        };
        this.touchStart = function (e) {
            var _this = e.data;
            var touches = e.originalEvent.touches;
            if (touches.length > 1) {
                _this.move = false;
                _this.scale = true;
                _this.touchAStarX = touches[0].pageX;
                _this.touchAStarY = touches[0].pageY;
                _this.touchBStarX = touches[1].pageX;
                _this.touchBStarY = touches[1].pageY;
            } else {
                _this.move = true;
                _this.scale = false;
                _this.touchAStarX = touches[0].pageX;
                _this.touchAStarY = touches[0].pageY;
            }
        };
        this.touchMove = function (e) {
            var _this = e.data;
            var touches = e.originalEvent.touches;
            App.trace("scale:"+_this.scale+"  lg:"+touches.length);
            if (_this.scale && touches.length > 1) {
                var mAx = touches[0].pageX;
                var mAy = touches[0].pageY;
                var mBx = touches[1].pageX;
                var mBy = touches[1].pageY;

                var scaleX = Math.abs(mAx - mBx) - Math.abs(_this.touchAStarX - _this.touchBStarX);
                var scaleY = Math.abs(mAy - mBy) - Math.abs(_this.touchAStarY - _this.touchBStarY);
                if (scaleX > 1 && scaleY > 1) {
                    if (scaleX > scaleY) {
                        _this.imgScale = ((scaleX + _this.img.width) / _this.img.width).toFixed(2);
                    } else {
                        _this.imgScale = ((scaleY + _this.img.height) / _this.img.height).toFixed(2);
                    }
                } else {
                    if (scaleX > scaleY) {
                        _this.imgScale = ((scaleY + _this.img.height) / _this.img.height).toFixed(2);
                    } else {
                        _this.imgScale = ((scaleX + _this.img.width) / _this.img.width).toFixed(2);
                    }
                }
                _this.imgScale = _this.imgScale * _this.imgScaleStar;
                _this.drawImage();
            } else if (_this.move) {
                var x = touches[0].pageX - _this.touchAStarX;
                var y = touches[0].pageY - _this.touchAStarY;

                _this.touchAStarX = touches[0].pageX;
                _this.touchAStarY = touches[0].pageY;
                switch (angle) {
                    case 0:
                        _this.imgX += x;
                        _this.imgY += y;
                        break;
                    case 90:
                        _this.imgX += y;
                        _this.imgY += -x;
                        break;
                    case 180:
                        _this.imgX += -x;
                        _this.imgY += -y;
                        break;
                    case 270:
                        _this.imgX += -y;
                        _this.imgY += x;
                        break;
                }
                _this.drawImage();
            }

        };
        this.touchEnd = function (e) {
            var _this = e.data;
            _this.imgScaleStar = _this.imgScale;
        };
        this.loadImg = function (_data) {
            var _this = this;
            this.img = new Image();
            this.img.onload = function () {
                _this.imgScale = _this.cvsW / this.width;
                _this.imgLoaded = true;
                _this.imgY = (_this.cvsH - (_this.img.height * _this.imgScale)) / 2;
                _this.drawImage();
                //_this.drawImage(this.img, -this.width, 0);
            }
            this.img.src = _data;
            start = 1;
        };
        this.drawImage = function () {
            this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
            this.ctx.save();

            var _rect = 200;
            this.clipX = (this.cvsW - _rect) / 2;
            this.clipY = (this.cvsH - _rect) / 2;
            this.ctx.strokeStyle = "#fff";

            this.ctx.translate(this.cvs.width / 2, this.cvs.height / 2);
            this.ctx.rotate(angle * Math.PI / 180);


            this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.imgX - this.cvs.width / 2, this.imgY - this.cvs.height / 2, this.img.width * this.imgScale, this.img.height * this.imgScale);
            this.ctx.strokeRect(-_rect / 2, -_rect / 2, _rect, _rect);
            this.ctx.restore();
        };
        this.clipImage = function () {
            var imgData = this.ctx.getImageData(this.clipX, this.clipY, this.clipW, this.clipH);
            this.clipCvs = $('<canvas width="' + this.clipW + '" height="' + this.clipH + '"></canvas>')[0];
            var clipCtx = this.clipCvs.getContext("2d");
            clipCtx.putImageData(imgData, 0, 0);
            var idata = this.clipCvs.toDataURL("image/jpeg",0.95);
            this.upData(idata);
        };
        this.localImg = function (fileUrl) {
            if (typeof FileReader === 'undefined') {
                alert('Y没有图...');
                return;
            }
            var _this = this;
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.loadImg(this.result);

            }
            reader.readAsDataURL(fileUrl);

        };
        this.upData = function (_data) {
            var _this = this;
            $.ajax({
                url: App.config.urlPath + "/user/avatar?ext=jpg&token=" + App.config.token,
                data: _data,
                contentType: 'image/jpeg',
                type: "POST",
                dataType: 'json',
                success: function (db) {
                    _this.success(db);
                },
                error: function (a, b, c) {
                    App.alert("上传头像错误");
                }
            });
        };
        this.success = function () {

        };
    }
    return v;
})

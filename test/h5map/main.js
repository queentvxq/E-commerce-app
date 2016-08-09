var hdImg = {
    $id: 'body',
    move: false, //是否允许移动
    scale: false, //是否允许缩放
    touchAStarX: 0, //第一触控点X坐标
    touchBStarX: 0, //第二触控点X坐标
    touchAStarY: 0, //第一触控点Y坐标
    touchBStarY: 0, //第二触控点Y坐标
    cvsW: 0, //画布宽度
    cvsH: 0, //画布高度
    clipX:0,//裁切X坐标
    clipY:0,//裁切Y坐标
    clipW:200,//裁切宽度
    clipH:200,//裁切高度
    $cvs: null, //画布的JQ对象
    cvs: null, //画布
    ctx: null, //画布绘图对象
    img: null, //图像
    imgX: 0, //图像X坐标
    imgY: 0, //图像Y坐标
    imgScale: 1, //缩放比例
    imgScaleStar: 1,//
    imgLoaded: false, //是否加载完成图像
    $inputFile:null,//
    $loadImgBtn:null,//
    $upBtn:null,
    clipCvs:null,
    init: function () {
        var _this=this;
        this.cvsW = window.innerWidth;
        this.cvsH = window.innerHeight;
        this.$cvs = $("<canvas id='canvas'></canvas>");
        this.$cvs.attr('width', this.cvsW);
        this.$cvs.attr('height', this.cvsH);
        $(this.$id).append(this.$cvs);
        this.$inputFile=$('<input type="file" name="imgOne" id="imgOne"  style="display: none;"/>');
        $(this.$id).append(this.$inputFile);
        
        this.cvs = this.$cvs[0];;

        this.$cvs.on("touchstart", this, this.touchStart);
        this.$cvs.on("touchmove", this, this.touchMove);
        this.$cvs.on("touchend", this, this.touchEnd);
        this.ctx = this.cvs.getContext('2d');
        
        
        this.$loadImgBtn=$("#loadImgBtn");
        this.$loadImgBtn.click(function(e){
            _this.$inputFile.click();
        });
        this.$inputFile.on("change", function ( e ) {
            _this.localImg(e.target.files[0]);
		});
        this.upBtn=$("#upBtn");
        this.upBtn.click(function(e){
            _this.clipImage();
        });
        
    },
    touchStart: function (e) {
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
    },
    touchMove: function (e) {
        var _this = e.data;
        var touches = e.originalEvent.touches;
        $("#trace").html(_this.scale.toString());
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
            _this.imgX += x;
            _this.imgY += y;
            _this.drawImage();
        }

    },
    touchEnd: function (e) {
        var _this = e.data;
        _this.imgScaleStar = _this.imgScale;
    },
    loadImg: function (_data) {
        var _this = this;
        this.img = new Image();
        this.img.onload = function () {
            console.log(this.width);
            _this.imgScale=_this.cvsW/this.width;
            _this.imgLoaded = true;
            _this.imgY=(_this.cvsH-(_this.img.height * _this.imgScale))/2;
            _this.drawImage();
        }
        this.img.src = _data;
    },
    drawImage: function () {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.imgX, this.imgY, this.img.width * this.imgScale, this.img.height * this.imgScale);
        var _rect=200;
        this.clipX=(this.cvsW-_rect)/2;
        this.clipY=(this.cvsH-_rect)/2;
        this.ctx.strokeRect(this.clipX,this.clipY,_rect,_rect);
    },
    clipImage:function(){
        //this.ctx.rect(this.clipX,this.clipY,this.clipW,this.clipH);
        //this.ctx.clip();        
        var imgData=this.ctx.getImageData(this.clipX,this.clipY,this.clipW,this.clipH);
        this.clipCvs=$('<canvas width="'+this.clipW+'" height="'+this.clipH+'"></canvas>')[0];
        var clipCtx=this.clipCvs.getContext("2d");        
        clipCtx.putImageData(imgData,0,0);        
        var idata=this.clipCvs.toDataURL("image/jpeg");
        this.upData(idata);
    },
    localImg: function (fileUrl) {
        if (typeof FileReader === 'undefined') {
            alert('Y没有图...');
            return;
        }
        var _this=this;
        var reader = new FileReader();
        reader.onload = function (e) {
            _this.loadImg(this.result);
        }
        reader.readAsDataURL(fileUrl);

    },
    upData: function (_data) {
        $.ajax({
            url: "http://apiqa.ukitchenplus.com/user/avatar?ext=jpg&token=" + $.cookie("token"),
            data: _data,
            contentType: 'image/jpeg',
            type: "POST",
            dataType: 'json',
            success: function (txt) {
                console.log(txt);
            },
            error: function (XMLHttpRequest, ajaxOptions, thrownError) {
                $("#outTxt").html("错误信息：" + ajaxOptions);
                console.log($.cookie("UserLogin"));
            }
        });
    }
}
hdImg.init();

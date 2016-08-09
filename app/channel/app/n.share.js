var App = App || {};
define(function () {
	App.n.share = {
		sharewx: null,
		baseurl: App.config.fPath,
		content_base: '望厨 ~ ',
		title: '望厨:', //我的朋友中使用
		content: '', //描述
		id: '', //商品或服务id
		type: '', //0：商品；1：服务
		href: '', //地址
		thumbs:['https://mmbiz.qlogo.cn/mmbiz/RJDibFAbsd0F7AbDmLP04XWUAbkyOTlxsiateSNkCXvL4MdBlQNIATiceyVka7TngNB3o2yHKOVkoeNgN30y82qzA/0?wx_fmt=png'],
		scene: 0, //朋友圈或我的朋友
		modal: '',
		initflag: 0,
		init: function () {
			var _this = this;
			var mt = ($(window).height() - 180) / 2 + 'px';
			var html = "<div class='am-modal' tabindex='-1' id='cx-wx-modal' style='top:" + mt + "'>" +
				"<div class='am-modal-dialog'>" +
				"<div class='title'><div>分享到</div></div>" +
				"<div class='am-g'>" +
				"<div class='am-u-sm-6' id='myfriend'>" +
				"<div><img src='assets/imgs/wechart.png'></div>" +
				"<div class='txt'>微信好友</div>" +
				"</div>  " +
				"<div class='am-u-sm-6' id='friend'>" +
				"<div><img src='assets/imgs/wx_circle.png'></div>" +
				"<div class='txt'>朋友圈</div>" +
				"</div>  " +
				"</div>" +
				"</div>" +
				"</div>";
			var wxhtml = '<div id="wx-modal">请点击右上角分享!</div>';
			var isWx = App.isWeixin();
			if(isWx){
				this.modal = $(wxhtml);
			}else{
				this.modal = $(html);
			}
			$('body').on('click', '#friend', function () {
				_this.scene = 0;
				_this.shareWeixin();
				_this.modal.modal('close');
			});
			$('body').on('click', '#myfriend', function () {
				_this.scene = 1;
				_this.shareWeixin();
				_this.modal.modal('close');
			});
			_this.modal.on('closed.modal.amui', function (e) {
				_this.modal.remove();
			});
		},
		share: function (content, href, type) {
			var _this = this;
			if (this.initflag == 0) {
				this.init();
				this.initflag = 1;
			}
			this.content = _this.content_base + content;
			this.href = href;
			//分享统计
			this.id = href.split('/')[2];
			this.type = type;
			$("body").append(this.modal);
			this.modal.modal('open');
			if (this.sharewx == null) {
				plus.share.getServices(function (s) {
					for (var i in s) {
						if ('weixin' == s[i].id) {
							_this.sharewx = s[i];
						}
					}
				}, function (e) {
					alert("获取分享服务列表失败");
				});
			}
		},
		sharecount: function () {
            var _this = this;
			App.upData({
				url: App.config.urlPath + '/V2/Shop/ShareTimesStatistics',
				data: {
					goodsid: _this.id,
					type: _this.type
				},
				success: function (data) {
					if (data.state == 1) {
                        console.log('success');
                    }
				}
			});
		},
		shareWeixin: function () {
			var isWx = App.isWeixin();
			if (!isWx) {
				var _this = this;
				if (_this.scene == 0) {
					_this.sharewx.send({
						content: _this.content,
						href: _this.baseurl + _this.href,
						thumbs:_this.thumbs,
						extra: {
							scene: 'WXSceneTimeline'
						}
					}, function () {
						if (_this.type == 0 || _this.type == 1) {
							_this.sharecount();
						}
					}, function (e) { });
				} else {
					_this.sharewx.send({
						content: _this.content,
						href: _this.baseurl + _this.href,
						thumbs:_this.thumbs,
						title: _this.title,
						extra: {
							scene: 'WXSceneSession'
						}
					}, function () {
						if (_this.type == 0 || _this.type == 1) {
							_this.sharecount();
						}
					}, function (e) { });
				}
			}
		}
	}
	return App.n.share;
})
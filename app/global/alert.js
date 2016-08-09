var App = App || {};
define(['jquery'], function ($) {
    /* 弹出对话框confirm对象
      confirm={
        onConfirm:function(){
            //确认操作
        },
        onCancel:function(){
            //取消操作
        }
      }
     ***/
    var _o = {
        w_h: $(window).height(),
        opened: false,
    };
    App.alert = function (msg, _option) {
        if (typeof _o.$modal != "undefined" && msg == "@close") {
            _o.$modal.modal('close');
        } else if (!_o.opened) {
            if (_o.w_h < 10) _o.w_h = $(window).height();
            /*弹窗选项*/
            _o.option = {
                opened: function () {},
                closed: function () {},
                closeViaDimmer: true,
                confirm: false, //是否需要确认取消操作
                tips: false, //无响应操作按钮
                otm: 2000, //自动关闭时间
                acd: true, //自动关闭
                jclose: false //是否通过JS关闭窗口
            };
            /*更新选项*/
            if (typeof (_option) == "object") {
                for (var k in _option) {
                    _o.option[k] = _option[k];
                }
            }
            /*弹窗样式*/
            var _html = "";
            /*JS关闭*/
            if (_o.option.jclose) {
                _html += '<div class="am-modal am-modal-loading" id="ag-modal">';
            } else {
                _html += '<div class="am-modal" id="ag-modal">';
            }
            _html += '<div class="am-modal-dialog"><div class="am-modal-bd">' + msg + '</div>';
            /*无底部按钮*/
            if (!_o.option.tips) {
                _html += '<div class="am-modal-footer">';
                if (_o.option.confirm) {
                    _html += '<span class="am-modal-btn" data-am-modal-cancel><i class="am-icon-close"></i></span>';
                }
                _html += '<span class="am-modal-btn" data-am-modal-confirm><i class="am-icon-check"></i></span>';
                _html += '</div>';
            } else {
                if (_o.option.acd) {
                    setTimeout(function () {
                        _o.$modal.modal('close');
                    }, _o.option.otm);
                }
            }
            _html += '</div></div>';
            _o.$modal = $(_html);
            _o.$modal.on('opened.modal.amui', function (e) {
                _o.option.opened();
            });
            _o.$modal.on('closed.modal.amui', function (e) {
                _o.opened = false;
                _o.$modal.remove();
                _o.option.closed();
            });
            if (_o.option.confirm) {
                $('body').append(_o.$modal);
                _o.$modal.modal(_o.option.confirm);
            } else {
                $('body').append(_o.$modal);
                _o.$modal.modal({
                    closeViaDimmer: true
                });
            };
            $(".am-modal-active").offset({
                top: (_o.w_h - _o.$modal.height()) / 2
            });
            _o.opened = true;
        }
    }
})

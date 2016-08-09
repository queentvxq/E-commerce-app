define(['jquery'], function ($) {
    var _$console = $("<div id='dbgConsole'></div>");
    var _o = {};
    _o.op = false;
    _o.show = false;
    _o._init = false;
    _o.asyncData = [];
    _o.trace = [];
    _o.$dbgStBtn = $("<div id='dbgStBtn'></div>");
    _o.push = function (_date, _val, _type) {
        if (typeof _type == "undefined") _type = 1;
        var _of = _val.indexOf("?");
        var _st = _val.lastIndexOf("/", _of) + 1;
        var _api = _val.substring(_st, _of);
        _o.asyncData.push({
            api: _api,
            date: _date,
            val: _val,
            type: _type
        })
    };
    _o.init = function () {
        this.show = true;
        this._init = true;
        this.$dbgStBtn.click(function () {
            if (_o.op) {
                _o.op = false;
                _$console.remove();
            } else {
                _o.op = true;
                _$console.empty();
                $("body").append(_$console);
                _o.openConsole();
            }
        });
        $("#trace").show();
        var _lg = this.trace.length;
        if (_lg > 0) {
            for (var i = 0; i < _lg; i++) {
                $("#trace").prepend(this.trace[i] + "</br>");
            }
            this.trace = [];
        }
        $("body").append(this.$dbgStBtn);
    };
    _o.openConsole = function () {
        var _this = this;
        var _lg = this.asyncData.length;
        for (var k = _lg - 1; k >= 0; k--) {
            var _shl = "";
            if (this.asyncData[k].type == 1) {
                _shl += "<span class='dbgSpan am-text-danger'>";
            } else {
                _shl += "<span class='dbgSpan am-text-success'>";
            }
            _shl += this.asyncData[k].api + "<br />" + this.asyncData[k].type + ":" + k + "-";
            _shl += this.asyncData[k].date + "</span>";
            var _$span = $(_shl);

            _$span.click(k, function (_evt) {
                App.alert(_this.asyncData[_evt.data].val);
            });
            _$console.append(_$span);
        }
    };
    _o.open = function () {
        $("#trace").show();
        this.$dbgStBtn.show();
        this.show = true;
    };
    _o.close = function () {
        $("#trace").hide();
        this.$dbgStBtn.hide();
        this.show = false;
    };
    return _o;
})

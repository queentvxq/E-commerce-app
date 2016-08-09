var App = App || {};
define(['jquery'], function ($) {
    var debug = function (_val, _type) {
        if (App.debug) {
            var _d = new Date();
            var _tm = _d.getDate() + "" + _d.getHours() + "" + _d.getMinutes();
            _tm += "" + _d.getSeconds() + "" + _d.getMilliseconds();
            App.debug.push(_tm, _val, _type);
        }
    };
    App.upData = function (_obj) {
        if (App.n.ok) {
            /*APP端检测网络*/
            if(!App.n.device.testnetwork()){
                App.alert("当前无法连接网络");
                return false;
            }
        }
        /*对象赋值*/        
        var obj = {};
        obj.type = "POST";
        obj.url = "";
        obj.dataType = "json";
        obj.contentType = 'application/json;charset=utf-8';
        obj.cache = true;
        obj.success = function (data) {
            debug("------read------<br/>" + this.url + "<br/>" + JSON.stringify(data), 2);
            this.cxSuccess(data);
        };
        obj.cxSuccess = function (data) {

        };
        obj.error = function (a, b, c) {
            App.loading(false);
            App.alert('数据通信有问题');
        };
        /*enkey*/
        if (_obj.data) {
            var _enStr = "";
            for (var v in _obj.data) {
                _enStr += ""+_obj.data[v];
            }
            _enStr = _enStr;
            if(_obj.url.indexOf("?")<0){
                _obj.url=_obj.url+"?";
            }
            _obj.url = _obj.url + "&verifycode=" + App.enKey(_enStr);
        }
        /*对象处理*/
        for (var k in _obj) {
            //数据对象转换
            if (k != 'data') {
                if (k == "success") {
                    obj["cxSuccess"] = _obj[k];
                } else {
                    obj[k] = _obj[k];
                }
            } else {
                obj[k] = JSON.stringify(_obj[k]);
            }
        }
        debug("------create------<br/>" + obj.url + "<br/>" + obj.data, 1);

        $.ajax(obj);
    }
})

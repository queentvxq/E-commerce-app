/*本地数据hu*/
define(["underscore", "backbone"], function (_, Backbone) {
    /*构造一个本地数据存储类*/
    var localData = function (_val) {
        this.name = _val;
        if (typeof localStorage.getItem(_val) === "string") {
            this.db = JSON.parse(localStorage.getItem(_val));
        } else {
            this.db = {};
            localStorage.setItem(_val, "{}");
        }
        this.init();
    };

    localData.extend = function (protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }
        _.extend(child, parent, staticProps);
        child.prototype = _.create(parent.prototype, protoProps);
        child.prototype.constructor = child;
        child.__super__ = parent.prototype;
        return child;
    };
    localData.prototype.init = function () {

    };
    /**设置值，_key如果是一个字符串，可以使用 . 和 [] 相连的字符串做获取连接
     ** 例如  "cart.products[2]" 访问
     ** 数组形式的连接只支持一维数组，如需要处理多维数组请直接访问this.db对象的操作
     ** 操作完成之后使用this.save来保存到本地
     ***/
    localData.prototype.set = function (_key, _val) {
        if (typeof _key === "string") {
            var _objDot = _key.split('.');
            this.setDotVal(this.db, _objDot, _val);
        } else if (typeof _key === "object") {
            for (var k in _key) {
                this.db[k] = _key[k];
            }
        } else {
            return this
        }
        this.save();
    };
    /*返回属性值*/
    localData.prototype.get = function (_key) {
        if (typeof _key === "string") {
            var _objDot = _key.split('.');
            if (_objDot.length < 2) {
                if (_key.match(/\[(\d+)\]/)) {
                    var _sub = parseInt(_key.match(/\[(\d+)\]/)[1]);
                    var _arr = _key.substring(0, _key.indexOf('['));
                    return this._db[_arr][_sub];
                } else {
                    return this.db[_key];
                }
            }
        }
    };
    /*删除属性（或清除自身数据）*/
    localData.prototype.del = function (_key) {
        if (typeof _key != "undefined") {
            delete this.db[_key];
            this.save();
        } else {
            localStorage.removeItem(this.name);
        }
    };
    localData.prototype.toJSON = function () {
        return localStorage.getItem(this.name);
    };
    /*设置对象值得具体方法*/
    localData.prototype.setDotVal = function (_db, _objDotArr, _val) {
        //console.log(_objDotArr.length);
        var _key = _objDotArr.shift();
        if (_key.match(/\[(\d+)\]/)) {
            var _sub = parseInt(_key.match(/\[(\d+)\]/)[1]);
            var _arr = _key.substring(0, _key.indexOf('['));
            if (_db[_arr] instanceof Array) {
                if (_objDotArr.length > 0) {
                    this.setDotVal(_db[_arr][_sub], _objDotArr, _val);
                } else {
                    _db[_arr][_sub] = _val;
                }
            } else {
                throw "没有" + _arr + "数组对象";
            }
        } else if (_.has(_db, _key)) {
            if (_objDotArr.length > 0) {
                this.setDotVal(_db[_key], _objDotArr, _val);
            } else {
                _db[_key] = _val;
            }
        } else {
            _db[_key] = _val;
        }
    };
    localData.prototype.retArrVal = function () {};
    /*保存数据到本地*/
    localData.prototype.save = function () {
        localStorage.setItem(this.name, JSON.stringify(this.db));
    };
    /*返回本地数据对象*/
    localData.prototype.getDb = function () {
        return JSON.parse(localStorage.getItem(this.name));
    };
    /**/
    _.extend(localData.prototype, Backbone.Events);

    return localData;
})

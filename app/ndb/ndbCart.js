/*购物车数据*/
define(['store'], function (store) {
    var cart = store.extend({
        /*在转换购物车列表时products会转变为计算数学*/
        products: [],
        count: 0,
        countPay: 0,
        priceAll: 0,
        init: function () {
            if (this.get('products')) {
                this.products = this.get('products');
                this.renCount();
            }
        },
        initDb: function (_db) {
            if (_db) {
                this.set('products', _db);
                this.products = this.get('products');
                this.renCount();
            } else {
                this.set('products', []);
            }
        },
        /*添加商品到购物车*/
        addshopcart: function (_pid, _count, _opt, _fun) {
            App.trace('更新购物车');
            var _this = this;
            var _url = App.config.urlPath + "/shop/addshopcart?" + App.config.accompany;
            var _vas = {
                pid: _pid,
                count: _count,
                type: 0
            };
            if (typeof (_opt) == "object") {
                _vas.type = _opt.type;
                _vas.cateid = _opt.cateid;
            }
            App.upData({
                url: _url,
                data: _vas,
                success: function (data) {
                    if (data.state == 1) {
                        App.trace('更新网上购物车成功');
                        var opt = data.result;
                        var _id = data.result.id;
                        opt.pay = true;
                        _this.productEdt(_id, _count, opt);
                        _this.set("products", _this.products);
                        _this.trigger('cartChange', _this);
                        if (typeof _fun != "undefined") {
                            _fun(data);
                        }
                    } else {
                        App.alert(data.errordes);
                    }
                }
            });
        },
        /*移除购物车的商品*/
        removeshopcart: function (_id, _fun) {
            App.trace('删除购物车');
            var _this = this;
            var _url = App.config.urlPath + "/shop/removeshopcart?" + App.config.accompany;
            App.upData({
                url: _url,
                data: {
                    id: _id
                },
                success: function (data) {
                    if (data.state == 1) {
                        App.trace("删除购物车商品" + _id);
                        if (typeof (_fun) != "undefined") _fun(_this);
                    } else {
                        App.alert(data.errordes);
                    }
                }
            });
            this.productDel(_id);
            this.jisuan();
            this.set("products", this.products);
            this.trigger('cartChange', this);
            this.trigger('cartRemoveChange', this);
        },
        /*从服务端更新购物车*/
        releasecart: function () {
            var _this = this;
            var _url = App.config.urlPath + "/v2/shop/getshopcart?" + App.config.accompany;
            App.upData({
                url: _url,
                data: {
                    size: 1000
                },
                success: function (data) {
                    if (data.state == 1) {
                        var _list = [];
                        if (data.result.list) {
                            _list = data.result.list;
                        } else {
                            _list = data.result.shoplist.list.concat(data.result.servicelist.list);
                        }
                        for (var key in _list) {
                            _list[key]['pay'] = true;
                        }
                        _this.products = _list;
                        _this.set("products", _list);
                        /*
                        _this.products = data.result.list;
                        _this.set("products", _this.products);*/
                        _this.trigger('cartChange', _this);
                    } else {
                        App.alert(data.errordes);
                    }
                }
            });
        },
        /*更新商品到本地购物车，商品数量的变化*/
        productEdt: function (_id, _count, _opt) {
            var lg = this.products.length;
            for (var k = 0; k < lg; k++) {
                if (this.products[k].id == _id) {
                    this.products[k].count = parseInt(this.products[k].count) + parseInt(_count);
                    this.jisuan();
                    return this.products;
                }
            };
            var _pd = {
                id: _id,
                count: _count
            }
            _.extend(_pd, _opt);
            this.products.push(_pd);
            this.jisuan();
            return this.products;
        },
        /*删除本地购物车商品*/
        productDel: function (_id) {
            var lg = this.products.length;
            for (var k = 0; k < lg; k++) {
                if (this.products[k].id == _id) {
                    this.products.splice(k, 1);
                    return this.products;
                }
            };
        },
        /*是否购买勾选商品*/
        selectPay: function (_id, _val) {
            if (typeof (_id) != "undefined") {
                var lg = this.products.length;
                for (var k = 0; k < lg; k++) {
                    if (this.products[k].id == _id) {
                        this.products[k].pay = _val;
                        this.jisuan();
                        this.trigger('cartChange', this);
                        return this.products;
                    }
                };
            }
        },
        /*设置全部商品是否勾选*/
        selectPayAll: function (_val) {
            var lg = this.products.length;
            for (var k = 0; k < lg; k++) {
                this.products[k].pay = _val;
            };
            this.jisuan();
            this.trigger('cartChange', this);
        },
        payAllState: function () {
            var _bol = true;
            var lg = this.products.length;
            if (lg > 0) {
                for (var k = 0; k < lg; k++) {
                    if (!this.products[k].pay) {
                        _bol = false;
                        break;
                    }
                };
            } else {
                _bol = false;
            }
            return _bol;
        },
        /*设置单个产品属性*/
        setProduct: function (_id, _vas) {
            if (typeof (_id) != "undefined") {
                var lg = this.products.length;
                for (var k = 0; k < lg; k++) {
                    if (this.products[k].id == _id) {
                        for (var key in _vas) {
                            this.products[k][key] = _vas[k];
                        }
                        this.jisuan();
                        this.trigger('cartChange', this);
                        return this.products[k];
                    }
                };
            }
        },
        /*返回产品信息*/
        getProduct: function (_id) {
            var _pc = null;
            if (typeof (_id) != "undefined") {
                var _lg = this.products.length;
                for (var k = 0; k < _lg; k++) {
                    if (this.products[k].id == _id) {
                        _pc = this.products[k];
                        break;
                    }
                };
            }
            return _pc;
        },
        /*计算价格*/
        jisuan: function () {
            this.priceAll = 0;
            this.countPay = 0;
            var lg = this.products.length;
            for (var k = 0; k < lg; k++) {
                if (this.products[k].pay) {
                    this.priceAll += (parseInt(this.products[k].count) * parseFloat(this.products[k].price));
                    this.countPay += parseInt(this.products[k].count);
                }
            }
            this.priceAll = this.priceAll.toFixed(2);
            this.countPay = this.countPay.toFixed(2);
            App.trace(this.priceAll);
            this.renCount();

        },
        /*更新商品数量*/
        renCount: function () {
            this.count = 0;
            var lg = this.products.length;
            for (var k = 0; k < lg; k++) {
                if (this.products[k]) {
                    this.count += this.products[k].count;
                }
            };
        },
        /*返回购买的内容*/
        getPayList: function () {
            var _list = {
                shoplist: [],
                servicelist: [],
                pids: [],
                types: [],
                nums: [],
                ssubids: []
            };
            var _ps = this.products;
            var _lg = _ps.length;
            for (var k = 0; k < _lg; k++) {
                if (_ps[k].pay == true) {
                    if (_ps[k].kindtype == 0) {
                        _list.shoplist.push(_ps[k]);
                    } else {
                        _list.servicelist.push(_ps[k]);
                    }
                    _list.pids.push(_ps[k].pid);
                    _list.types.push(_ps[k].kindtype);
                    _list.nums.push(_ps[k].count);
                    _list.ssubids.push(_ps[k].cateid);
                }
            }
            return _list;
        },
        cartdb: function () {
            return this.getDb();
        }
    });
    return cart;
});

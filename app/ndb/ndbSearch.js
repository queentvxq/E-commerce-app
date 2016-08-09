/*购物车数据*/
define(['store'], function (store) {
    var cart = store.extend({
        keywords: [],
        /*初始化搜索记录*/
        init: function () {
            if (this.get("list")) {
                this.keywords = this.get("list");
            } else {
                this.set("list", this.keywords);
            }
        },
        /*添加商品到购物车*/
        add: function (_keyword) {
            if (_keyword != "") {
                for (var key in this.keywords) {
                    if (this.keywords[key] == _keyword) {
                        this.keywords.splice(key,1);
                    }
                }
                this.keywords.push(_keyword);
                this.set("list", this.keywords);
            }
        },
        /*清除历史纪录*/
        delAll: function () {
            this.keywords = [];
            this.set("list", this.keywords);
        }
    });
    return cart;
});

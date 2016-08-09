var App = App || {};
define([
	'vue',
	'text!tpl/bar_b1.html'
], function (Vue, tpl) {
    var v = Vue.extend({
        template: tpl,
        data: function () {
            return {
                ai: true,
                am: false,
                ab: false,
                au: false,
                show: true,
                a_buy: "#buy"
            }
        },
        created: function () {
            if (App.config.token == '') {
                this.a_buy = "javascript:void(0)";
            }
        },
        methods: {
            change: function (_pname) {
                this.ai = false;
                this.am = false;
                this.ab = false;
                this.au = false;
                switch (_pname) {
                    case "home":
                        this.ai = true;
                        break;
                    case "mall":
                        this.am = true;
                        break;
                    case "buy":
                        this.ab = true;
                        break;
                    case "ucenter":
                        this.au = true;
                        break;
                    case "login":
                        this.au = true;
                        break;
                }
            },
            setBuyBtn: function () {
                if (App.config.token == '') {
                    this.a_buy = "javascript:void(0)";
                } else {
                    this.a_buy = "#buy";
                }
            },
            goMall: function (){
                App.discovery = {};
                window.location.href = "#mall";
            },
            openBuy: function () {
                if (App.config.token == '') {
                    App.login.show();
                }
            }
        }
    });
    return v;
})

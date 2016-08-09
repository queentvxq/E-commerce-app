var App = App || {};
define([
	'vue',
	'text!tpl/bar_t1.html'
], function (Vue, tpl) {
    var v = Vue.extend({
        props: ['title'],
        template: tpl,
        data: function () {
            return {
                title: "",
                back: true,
                new: false
            }
        },
        ready: function () {
            if (App.user.notice) {
                if (App.user.notice.messagecount > 0) {
                    this.new = true;
                }
            }
        },
        methods: {
            goBack: function () {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = "#home";
                }
            }
        }
    });
    return v;
})

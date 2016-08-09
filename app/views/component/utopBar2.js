var App = App || {};
define([
	'vue',
	'text!tpl/bar_t2.html'
], function (Vue, tpl) {
    var v = Vue.extend({
        props: ['title','btname'],
        template: tpl,
        ready:function(){
            //this.back=!(App.isWeixin());
            //console.log(this.back);
        },
        methods: {
            goBack: function () {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = "#home";
                }
            },
            saveData:function(){
                this.$dispatch('btn-evt', this)
            }
        }
    });
    return v;
})

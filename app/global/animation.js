var App = App || {};
define([''], function () {
    App.ani = {
        /*给一个类增加一个样式，只能动画结束后才能进行下一个*/
        animationO: function (_class,_style){
            try {
                $(_class).addClass(_style);
                $(_class)[0].addEventListener("animationend", function(){
                    $(_class).removeClass(_style);
                });
            } catch(err) {}
        },
        /*给一个类增加一个样式，动画未结束也能进行下一个动画，同时删除上一个动画*/
        animationT: function (_class,_style){
            if(!$(_class).hasClass(_style)){
                $(_class).addClass(_style);
            }else{
                $(_class).removeClass(_style);
                setTimeout(function(){
                    App.ani.animationT(_class,_style);
                },100);
            }
            $(_class)[0].addEventListener("webkitAnimationEnd", function(){
                $(_class).removeClass(_style);
            });
        },
        /*通过类名控制两个动画animation-name，能同时进行多个动画事件，结束后删除,aniTwo为第二个动画名*/
        animationNames: function (_style){
            var _mc=$('<div></div>');
            $("body").append(_mc);
            _mc.addClass(_style);
            // 一次只能弹出一个
            // if (_mc.length>0) {
            //     _mc.siblings('.cartroll').remove();
            // }
            _mc[0].addEventListener("webkitAnimationEnd", function(e){
                if (_mc.css('animation-name','aniTwo')) {
                    _mc[0].addEventListener("webkitAnimationEnd", function(){
                        _mc.remove();
                    });
                }
            });
        },
        /*购物车动画，通过类名控制一个动画，能同时进行多个动画事件，结束后删除*/
        anicart: function (_style){
            var _mc=$('<div></div>');
            $("body").append(_mc);
            _mc.addClass(_style);
            // 一次只能弹出一个
            // if (_mc.length>0) {
            //     _mc.siblings('.cartroll').remove();
            // }
            _mc[0].addEventListener("webkitAnimationEnd", function(e){
                console.log(e.target);
                _mc.remove();
            });
        }






    }


})

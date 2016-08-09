var gulp = require('gulp');
var less = require('gulp-less'), // less
    htmlmin = require('gulp-htmlmin'), //html压缩
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'), // js压缩
    amdOptimize = require("amd-optimize"), //require打包
    concat = require('gulp-concat'), // 合并文件
    rename = require('gulp-rename'), // 重命名
    clean = require('gulp-clean'), //清空文件夹
    notify = require('gulp-notify'), //提示信息
    flatten = require('gulp-flatten'), //只拷贝文件，不拷贝目录
    filter = require('gulp-filter'), //过滤文件
    changed = require('gulp-changed'),//增量传递文件
    del = require('del'),//删除文件
    vinylPaths = require('vinyl-paths'),//获取 stream 中每个文件的路径
    replace = require('gulp-replace'); //文件内容替换
//合并css并压缩
gulp.task('css', function () {
    // 注意这里通过数组的方式写入两个地址,仔细看第一个地址是css目录下的全部css文件,第二个地址是css目录下的areaMap.css文件,但是它前面加了!,这个和.gitignore的写法类似,就是排除掉这个文件.
    gulp.src(['html/assets/css/ucjcss/*.css'])
        .pipe(concat('./ucj.css'))
        .pipe(gulp.dest('./assets/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('./assets/css'));
});
// 压缩html模板
gulp.task('html', function () {
    return gulp.src('./html/tpl/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true, //压缩HTML
            removeComments: true, //清除HTML注释
        }))
        .pipe(gulp.dest('./app/tpl'))

});
//拷贝图片资源
gulp.task('images', function () {
    gulp.src('./html/assets/imgs/*')
        .pipe(gulp.dest('./assets/imgs'))
});
//拷贝字体资源
gulp.task('fonts', function () {
    gulp.src('./html/assets/fonts/*')
        .pipe(gulp.dest('./assets/fonts'))
});
//默认任务
gulp.task('default', function () {
    gulp.run('css', 'html', 'images', 'fonts');

    //gulp.watch('html/assets/css/ucjcss/*.css', ['css']);
    //gulp.watch('./html/tpl/*.html', ['html']);
});
//合并压缩css和html文件
gulp.task('taskwl', function () {
    gulp.run('css', 'html');
});

//发布内容到服务器测试环境---------------------TEST
//发布拷贝css
gulp.task('rt_css', function () {
    gulp.src('./assets/css/*')
        .pipe(gulp.dest('./release/wx/frontend-test/up/assets/css'));
});
//发布拷贝图片资源
gulp.task('rt_img', function () {
    gulp.src('./assets/imgs/*')
        .pipe(gulp.dest('./release/wx/frontend-test/up/assets/imgs'));
});
//发布拷贝字体资源
gulp.task('rt_font', function () {
    gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./release/wx/frontend-test/up/assets/fonts'));
});
//发布拷贝所有资源
gulp.task('rt_assets', function () {
    gulp.run('rt_css', 'rt_img', 'rt_font');
});
//发布拷贝index
gulp.task('rt_index', function () {
    gulp.src('./index.html')
        .pipe(gulp.dest('./release/wx/frontend-test/up'));
});
//发布拷贝index
gulp.task('rt_tpl', function () {
    gulp.src('./app/tpl/*')
        .pipe(gulp.dest('./release/wx/frontend-test/up/app/tpl'));
});
//发布
gulp.task('reltest', function () {
    gulp.run('rt_css', 'rt_img', 'rt_font', 'rt_app', 'rt_index');
});

//发布内容到服务器正式环境---------------------PUT
//发布拷贝css
gulp.task('r_css', function () {
    gulp.src('./assets/css/*')
        .pipe(gulp.dest('./release/wx/frontend/up/assets/css'));
});
//发布拷贝图片资源
gulp.task('r_img', function () {
    gulp.src('./assets/imgs/*')
        .pipe(gulp.dest('./release/wx/frontend/up/assets/imgs'));
});
//发布拷贝字体资源
gulp.task('r_font', function () {
    gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./release/wx/frontend/up/assets/fonts'));
});

//发布到服务器正式目录
gulp.task('release', function () {
    gulp.run('r_css', 'r_img', 'r_font');
});


/*打包APP资源发布*/
var requireConfig = {
    baseUrl: 'app/',
    shim: {
        underscore: {
            exports: '_'
        },
        vue: {
            deps: [
				'underscore',
				'jquery',
                'updata',
                'cookie'
			]
        }
    },
    paths: {
        jquery: 'libs/jquery.min',
        backbone: 'libs/backbone-min',
        underscore: 'libs/underscore',
        domReady: 'libs/domReady',
        amazeui: 'libs/amazeui.min',
        cookie: 'libs/jquery.cookie',
        text: 'libs/text',
        vue: 'libs/vue.min',
        director: 'libs/director.min',
        md5:'libs/md5',
        updata: 'core/cx.upDataServer',
        store: 'core/cx.localStorage',
        uview: 'core/cx.uView',
        cart: 'ndb/ndbCart',
        search: 'ndb/ndbSearch',
        router: 'global/router',
        animate: 'global/animate',
        alert: 'global/alert',
        lduserinfo: 'global/ldUserinfo',
        weixin: 'global/weixin',
        tool: 'global/tool',
        init: 'global/init',
        debug: 'global/debug',
        cxmain: 'views/cxmain',
        footbar: 'views/component/footBar',
        utopbar: 'views/component/utopBar',
        utopbar2: 'views/component/utopBar2',
        login: 'views/component/login',
        native: 'channel/app/n.init',
        lazyload:'libs/imagesloaded.pkgd.min',
        slider:'libs/slick.min',
        IScroll:'libs/iscroll-probe'
    }
};

var d = new Date();
var _v = "v" + d.getYear() + "" + (d.getMonth() + 10);
_v += (d.getDate() + 10) + "" + (d.getHours() + 10) + "" + (d.getMinutes() + 10);
//发布到服务器测试目录----------------------------------------------

gulp.task('rt_app', function () {
    gulp.run('rt_js', 'rt_js_index');
});
//压缩合并JS文件
gulp.task('rt_js', function () {
    gulp.src('./app/**/*.js')
        .pipe(amdOptimize("main", requireConfig))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('release/wx/frontend-test/up/app/d/' + _v))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('release/wx/frontend-test/up/app/d/' + _v))
        .pipe(notify({
            message: 'js合并压缩完成'
        }));
});
//修改引用文件路径
gulp.task('rt_js_index', function () {
    gulp.src('./index.html')
        .pipe(replace('data-main="app/main"', 'data-main="app/d/' + _v + '/main"'))
        .pipe(gulp.dest('./release/wx/frontend-test/up'));
});
//清空目录
gulp.task('rt_clean', function () {
  gulp.src('./release/apk/app/*')
    .pipe(gulp.dest('dist'))
    .pipe(vinylPaths(del));
});
//发布到APP本地应用打包
gulp.task('rt_apk', function () {
    gulp.src('./release/wx/frontend-test/up/**/*')
        .pipe(gulp.dest('./release/apk/'));
});

//发布到APP本地应用打包
gulp.task('r_apk', function () {
    gulp.src('./release/wx/frontend/up/**/*')
        .pipe(gulp.dest('./release/apk/'));
});

//发布到服务器正式目录----------------------------------------------
gulp.task('r_app', function () {
    gulp.run('r_js', 'r_js_index');
});
//压缩合并JS文件
gulp.task('r_js', function () {
    gulp.src('./app/**/*.js')
        .pipe(amdOptimize("main", requireConfig))
        .pipe(concat('main.js'))
        .pipe(replace('http://apiqa.ukitchenplus.com', 'http://api.ukitchenplus.com'))
        .pipe(replace('http://qa.ukitchenplus.com', 'http://m.ukitchenplus.com'))
        .pipe(replace('http://aapi.ukitchenplus.com', 'http://f.ukitchenplus.com'))
        .pipe(replace('C4FB7D2FE6E0982439180C4328A8CBD0', 'FD4F0C7B424D4178BAA3AE4A2976DAC4'))
        .pipe(replace('15d8d8449dd86cf95deefb4b6a0aad14', '5a3428ccdaba80f09828bb8bb53395b0'))
        .pipe(gulp.dest('release/wx/frontend/up/app/d/' + _v))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('release/wx/frontend/up/app/d/' + _v))
        .pipe(notify({
            message: 'js合并压缩完成'
        }));
});
//修改引用文件路径
gulp.task('r_js_index', function () {
    gulp.src('./index.html')
        .pipe(replace('data-main="app/main"', 'data-main="app/d/' + _v + '/main"'))
        .pipe(gulp.dest('./release/wx/frontend/up'));
});
/*









*/

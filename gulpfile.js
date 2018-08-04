'use strict';

var gulp        = require('gulp'),
	rigger      = require('gulp-include'),
	prefixer    = require('gulp-autoprefixer'),
	sass        = require('gulp-sass'),
	cssmin      = require('gulp-cssmin'),
	uglify      = require('gulp-uglify'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),
	spritesmith	= require('gulp.spritesmith'),
	connect     = require('gulp-connect'),
	opn         = require('opn'),
	rimraf      = require('rimraf'),
    bower       = require('gulp-bower'),
    svgSprite   = require('gulp-svg-sprite'),
	svgmin      = require('gulp-svgmin'),
	cheerio     = require('gulp-cheerio'),
	replace     = require('gulp-replace'),
	plumber     = require('gulp-plumber'),
    filter      = require('gulp-filter'),
    inlinesource = require('gulp-inline-source'),
    log = require('fancy-log'),
    imgRetina = require('gulp-img-retina'),
    htmlmin = require('gulp-htmlmin'),
    csso = require('gulp-csso'),
    gulpif = require('gulp-if');

const arg = (argList => {
    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');
    
        if (opt === thisOpt) {
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        }
        else {
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;
})(process.argv);

var buildpath = 'build',
    testpath = 'test';
	
var path = {
    build: {
        html:   buildpath + '/',
        js:     buildpath + '/js/',
        css:    buildpath + '/css/',
        img:    buildpath + '/img/',
        fonts:  buildpath + '/fonts/',
        bower:  buildpath + '/vendor/'
    },
    test: {
        html:   testpath + '/',
        img:    testpath + '/img/',
        fonts:  testpath + '/fonts/'
    },
    src: {
        html:                'src/pages/*.html',
        js:                  'src/js/script.js',
        style:               'src/sass/style.scss',
        img:                 'src/img/work/**/*.*',
        imgicons:            'src/img/icons/*.png',
        svgicons:            'src/img/icons/*.svg',
        fonts:               'src/fonts/**/*.*',
        bower:               'bower_components/**/*.*',
        path_sasspartials:   'src/sass/partials/',
        path_sasstemplates:  'src/sass/templates/',
        path_img:            'src/img/work/'
    },
    watch: {
        html:   'src/pages/**/*.html',
        bower:  'bower_components/**/*.*',        
        js:     'src/js/**/*.js',
        style:  'src/less/**/*.sass',
        img:    [
        	'src/img/**/*.*',
        	'!src/img/work/icons.png',
        	'!src/img/work/icons.svg'
        ],
        fonts:  'src/fonts/**/*.*'
    },
    clean: './build',
    cleanTest: './test'
};

var server = {
    host: 'localhost',
    port: '2288'
};

gulp.task('clean:build', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('clean:test', function (cb) {
    rimraf(path.cleanTest, cb);
});

gulp.task('clean', [
    'clean:test',
    'clean:build'
]);

gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        livereload: true
    });
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port + '/' + buildpath );
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(gulpif(ardv.retina, imgRetina(retinaOpts)))
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(rigger()) 
        .pipe(uglify()) 
        .pipe(gulp.dest(path.build.js)) 
        .pipe(connect.reload()); 
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefixer())
        // .pipe(csso())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css)) 
        .pipe(connect.reload());
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(path.src.imgicons)
		.pipe(spritesmith({
			imgName: 'icons.png',
			cssName: 'icons.scss',
			algorithm: 'binary-tree',
			cssFormat: 'css',
			cssTemplate: 'css_template_icons.css.mustache',
		}));
		
	spriteData.img.pipe(gulp.dest(path.src.path_img));
	spriteData.css.pipe(gulp.dest(path.src.path_sasspartials));
});

gulp.task('svg:sprite:build', function () {
    return gulp.src(path.src.svgicons)
        .pipe(plumber())
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg',
					render: {
						scss: {
							dest: '../../../../' + path.src.path_sasspartials + 'svg_sprite.scss',
							template: 'css_template_svg_icons.mustache'
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(path.src.path_img));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(connect.reload());

	gulp.run('sprite');
	gulp.run('svg:sprite:build');
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('bower:build', function() {
	var mfilter = filter([
            '**/*.*', 
            '!**/src/**/*.*', 
            '!**/*.json', 
            '!**/.gitignore', 
            '!**/*Gulpfile.js', 
            '!**/*.md', 
            '!**/*.json', 
            '!**/.jshintrc', 
            '!**/*.txt', 
            '!**/*.psd',
            '!**/*.scss',
            '!**/*.sass',
            '!**/*.less',
            '!**/*.map',
            '!**/*.md',
    ]);
    var cssfilter = filter(['**/*.css'], {restore: true});
    var jsfilter = filter(['**/*.js'], {restore: true});
	
	gulp.src(path.src.bower)
		.pipe(cssfilter)
		.pipe(cssmin())
		.pipe(cssfilter.restore)
		.pipe(mfilter)
        .pipe(gulp.dest(path.build.bower))
});

gulp.task('watch', function() {
	gulp.watch(path.watch.html,  ['html:build']);
	gulp.watch(path.watch.js,    ['js:build']);
	gulp.watch(path.watch.style, ['style:build']);
	gulp.watch(path.watch.img,   ['image:build']);
	gulp.watch(path.watch.fonts, ['fonts:build']);
	gulp.watch(path.watch.bower, ['bower:build', 'style:build']);
});

gulp.task('build', [
    'image:build',
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'bower:build'
]);

gulp.task('build:test', function () {
    gulp.src(path.build.html + '*.html')
        .pipe(inlinesource())
        .pipe(gulpif(ardv.htmlmin, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(path.test.html));
    gulp.src(path.build.img + '*')
        .pipe(gulp.dest(path.test.img));
    gulp.src(path.build.fonts + '*')
        .pipe(gulp.dest(path.test.fonts));
});

gulp.task('test', ['build'], function () {
    gulp.start('build:test');
});

gulp.task('build:watch', [
    'image:build',
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'bower:build',
	'watch'
]);

gulp.task('server', ['build', 'watch', 'webserver', 'openbrowser']);
gulp.task('default', ['build']);
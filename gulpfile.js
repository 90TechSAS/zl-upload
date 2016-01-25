var gulp       = require('gulp'),
    inject     = require('gulp-inject'),
    annotate   = require('gulp-ng-annotate'),
    babel      = require("gulp-babel"),
    less       = require('gulp-less'),
    minifyCSS  = require('gulp-minify-css'),
    concat     = require('gulp-concat'),
    bowerFiles = require('main-bower-files'),
    browserify = require('browserify'),
    del        = require('del'),
    gulpDocs = require('gulp-ngdocs'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify');


gulp.task('clean-temp', function(){
    return del(['dest']);
});

gulp.task('es6-commonjs',['clean-temp'], function(){
    return gulp.src(['./src/app/**/*.js','./src/app/**/**/*.js'])
        .pipe(babel({auxiliaryCommentBefore: 'istanbul ignore next'}))
        .pipe(gulp.dest('dest/temp'));
});

gulp.task('bundle-commonjs-clean', function(){
    return del(['build']);
});

gulp.task('ngdocs', [], function () {
    return gulp.src(['./src/app/**/*.js','./src/app/**/**/*.js'])
    .pipe(gulpDocs.process())
    .pipe(gulp.dest('./docs'));
});

gulp.task('commonjs-bundle',['bundle-commonjs-clean','es6-commonjs'], function(){
    return browserify(['dest/temp/app.js']).bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(annotate())
        //.pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest("build"));
});

gulp.task('index', function () {
  gulp.src('./index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower',relative: true}))
    .pipe(inject(gulp.src(['./build/app.js', './src/assets/css/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./'));
});


gulp.task('less', function () {
    gulp.src('./assets/less/style.less')
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./assets/css/'));
});

gulp.task('watch', function(){
    gulp.watch(['./src/app/**/*.js'], ['commonjs-bundle']);
    gulp.watch(['./src/app/**/**/*.js'], ['commonjs-bundle']);
    gulp.watch(['./src/assets/less/style.less'],['less']);
});

gulp.task('default', ['commonjs-bundle']);
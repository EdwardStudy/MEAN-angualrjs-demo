var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var csso = require('gulp-csso');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var uncss = require('gulp-uncss');

gulp.task('sass', function() {
    gulp.src('./public/css/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(uncss({
            html: [
                'public/index.html',
                'public/views/add.html',
                'public/views/detail.html',
                'public/views/home.html',
                'public/views/login.html',
                'public/views/signup.html'
            ]
        }))
        .pipe(csso())
        .pipe(gulp.dest('./public/css'));
});

//压缩
gulp.task('compress', function() {
    gulp.src([
        'public/lib/angular.js',
        'public/lib/*.js',
        'public/js/app.js',
        'public/js/services/*.js',
        'public/js/controllers/*.js',
        'public/js/filters/*.js',
        'public/js/directives/*.js'
    ])
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('public'));
});

gulp.task('templates', function() {
    gulp.src('public/views/**/*.html')
        .pipe(templateCache({ root: 'views', module: 'MyApp' }))
        .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
    gulp.watch('public/css/*.scss', ['sass']);
    gulp.watch('public/views/**/*.html', ['templates']);
    gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/lib'], ['compress']);
});

gulp.task('default', ['sass','compress','templates', 'watch']);
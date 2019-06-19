let gulp = require('gulp');
let sass = require('gulp-sass');
let header = require('gulp-header');
let cleanCSS = require('gulp-clean-css');
let rename = require("gulp-rename");
let autoprefixer = require('gulp-autoprefixer');
let pkg = require('./package.json');
let browserSync = require('browser-sync').create();

// Set the banner content
let banner = ['/*!\n',
	' */\n',
	'\n'
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

	//React
	gulp.src([
		'./node_modules/react/cjs/*'
	])
		.pipe(gulp.dest('./vendor/react'));

	//React-Dom
	gulp.src([
		'./node_modules/react-dom/cjs/*'
	])
		.pipe(gulp.dest('./vendor/react-dom'));

	//React-Bootstrap
	gulp.src([
		'./node_modules/react-bootstrap/dist/*'
	])
		.pipe(gulp.dest('./vendor/react-bootstrap'));

	// Bootstrap
	gulp.src([
		'./node_modules/bootstrap/dist/**/*',
		'!./node_modules/bootstrap/dist/css/bootstrap-grid*',
		'!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
	])
		.pipe(gulp.dest('./vendor/bootstrap'));
	// Font Awesome 5
	gulp.src([
		'./node_modules/@fortawesome/**/*'
	])
		.pipe(gulp.dest('./vendor'));

	// jQuery
	gulp.src([
		'./node_modules/jquery/dist/*',
		'!./node_modules/jquery/dist/core.js'
	])
		.pipe(gulp.dest('./vendor/jquery'));

	// jQuery Easing
	gulp.src([
		'./node_modules/jquery.easing/*.js'
	])
		.pipe(gulp.dest('./vendor/jquery-easing'));

	// Simple Line Icons
	gulp.src([
		'./node_modules/simple-line-icons/fonts/**'
	])
		.pipe(gulp.dest('./vendor/simple-line-icons/fonts'));

	gulp.src([
		'./node_modules/simple-line-icons/css/**'
	])
		.pipe(gulp.dest('./vendor/simple-line-icons/css'))

});

// Compile SCSS
gulp.task('css:compile', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass.sync({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(header(banner, {
			pkg: pkg
		}))
		.pipe(gulp.dest('./assets/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
	return gulp.src([
		'./assets/css/*.css',
		'!./assets/css/*.min.css'
	])
		.pipe(cleanCSS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Default task
gulp.task('default', ['css', 'vendor']);

// Configure the browserSync task
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});

// Dev task
gulp.task('dev', ['css', 'browserSync'], function() {
	gulp.watch('./src/scss/*.scss', ['css']);
	gulp.watch('**/*.html', browserSync.reload);
	gulp.watch('**/*.js', browserSync.reload);
});
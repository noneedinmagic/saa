const gulp = require('gulp');
const browserSync = require('browser-sync');
const $ = {
	sass: require('gulp-sass'),
	notify: require("gulp-notify"),
	cleancss: require('gulp-clean-css'),
	rename: require('gulp-rename'),
	postcss: require('gulp-postcss'),
    uglify: require("gulp-uglify"),
    concat: require('gulp-concat'),
    rigger: require('gulp-rigger'),
    ftp: require('vinyl-ftp'),
};
const reload = browserSync.reload;

const config = {
	bower: './bower_components/',
	res: './resources/',
	dist: './docs/',
	build: './build/',
	extras: './extras/',
};

gulp.task('styles', function(){
	gulp.src(config.res + 'scss/*.scss')
		.pipe($.sass({
			errLogToConsole: true,
			outputStyle: 'nested',
			includePaths: [
				config.res + 'scss',
			],
		}).on('error', $.sass.logError))
		.pipe($.postcss([
			require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}),
			require('css-mqpacker'),
		]))
		.pipe(gulp.dest(config.dist + 'css'))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.cleancss({
            processImportFrom:['!fonts.googleapis.com'],
            keepSpecialComments:1,
        }))
        .pipe(gulp.dest(config.dist + 'css'))
    	.pipe(reload({stream: true}));
});

gulp.task('js',function(){
	gulp.src([
		config.res + 'js/[^_]*.js',
	], {base: config.res + 'js/'})
		.pipe($.rigger())
		.pipe(gulp.dest(config.dist + 'javascript'))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.uglify())
		.pipe(gulp.dest(config.dist + 'javascript'))
    	.pipe(reload({stream: true}));
});

gulp.task('html', function(){
	gulp.src([
			config.res + 'html/[^_]*.html',
		], {base: config.res + 'html/'})
		.pipe($.rigger())
		.pipe(gulp.dest(config.dist))
    	.pipe(reload({stream: true}));
});

gulp.task('fonts', function(){
	gulp.src(config.res + 'fonts/*.{eot,ttf,woff2,woff,eof,svg}')
		.pipe(gulp.dest(config.dist + 'fonts'));
});

gulp.task('images', function(){
	gulp.src(config.res + 'images/**/*.{jpg,png,svg}')
		.pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('extras', function(){
	gulp.src([
			config.extras + '**/*',
		], {base: config.extras})
		.pipe(gulp.dest(config.dist));
	gulp.src([
			config.bower + 'bootstrap/dist/css/bootstrap.min.css',
			config.bower + 'bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css',
		])
		.pipe(gulp.dest(config.dist + 'css'));
	gulp.src([
			config.bower + 'jquery/dist/jquery.min.js',
			config.bower + 'bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
		])
		.pipe(gulp.dest(config.dist + 'javascript'));
});

gulp.task('build', ['styles', 'js', 'html', 'fonts', 'images', 'extras']);

gulp.task('browser', ['build'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: [config.dist],
			routes: {
				// '/bower_components': 'bower_components'
			}
		}
	});

	gulp.watch([
		config.res + 'images/**/*',
		config.res + 'fonts/**/*',
	]).on('change', reload);

	gulp.watch(config.res + 'scss/**/*.scss', ['styles']);
	gulp.watch(config.res + 'js/**/*.js', ['js']);
	gulp.watch(config.res + 'fonts/**/*', ['fonts']);
	gulp.watch(config.res + 'html/**/*', ['html']);
	// gulp.watch('bower.json', ['fonts']);
});

gulp.task('browser:dist', () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: [config.dist],
		},
	});
});
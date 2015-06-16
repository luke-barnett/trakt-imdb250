var gulp = require('gulp'),
	bower = require('gulp-bower'),
	del = require('del'),
	sass = require('gulp-sass'),
	sourceMaps = require('gulp-sourcemaps');

var lib = require('bower-files')(
  {
  	overrides: {
  		'bootstrap-sass': {
  			main: [
				'assets/stylesheets/**',
				'assets/fonts/**',
				'assets/javascripts/bootstrap.js'
  			]
  		},
  		'knockout-mapping': {
  			main: [
				'knockout.mapping.js'
  			]
  		}
  	}
  }
);

var config = {
	bowerDir: './bower_components',
	assetsBase: './assets'
};

config.js = config.assetsBase + '/javascript';
config.vendorJS = config.js + '/vendor';
config.sass = config.assetsBase + '/stylesheets';
config.vendorSass = config.sass + '/vendor';
config.fonts = config.assetsBase + '/fonts';

gulp.task('bower', function () {
	return bower({ cmd: 'update' });
});

gulp.task('clean:vendor-js', function () {
	return del([config.vendorJS + '/**']);
});

gulp.task('clean:vendor-sass', function () {
	return del([config.vendorSass + '/**']);
});
gulp.task('clean:sass', function () {
	return del([config.sass + '/*.css*']);
});

gulp.task('vendor-js', ['bower', 'clean:vendor-js'], function () {
	return gulp.src(lib.ext('js').files, { base: config.bowerDir })
	  .pipe(gulp.dest(config.vendorJS));
});

gulp.task('vendor-fonts', ['bower'], function () {
	return gulp.src(lib.ext(['woff', 'woff2', 'ttf']).files)
	  .pipe(gulp.dest(config.fonts));
});

gulp.task('vendor-sass', ['bower', 'clean:vendor-sass'], function () {
	return gulp.src(lib.ext('scss').files, { base: config.bowerDir })
	  .pipe(gulp.dest(config.vendorSass));
});

gulp.task('sass', function () {
	return gulp.src(config.sass + "/*.scss")
	  .pipe(sourceMaps.init())
	  .pipe(sass({
	  	outputStyle: 'compressed'
	  }))
	  .pipe(sourceMaps.write('./'))
	  .pipe(gulp.dest(config.sass));
});

gulp.task('clean', ['clean:vendor-js', 'clean:vendor-sass', 'clean:sass']);

gulp.task('vendor', ['vendor-sass', 'vendor-js', 'vendor-fonts']);

gulp.task('default', ['sass']);

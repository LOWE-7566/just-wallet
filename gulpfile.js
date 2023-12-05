let gulp = require("gulp");
let rename = require("gulp-rename");
let uglify = require('gulp-uglify-es').default;
const sourcemaps = require("gulp-sourcemaps");
let concat = require("gulp-concat")

gulp.task("uglify-cjs", function () {
  console.log("gulp-uglifying")
	return gulp.src("lib/bundle.cjs.js")
		.pipe(rename("bundle.cjs.min.js"))
		.pipe(uglify(/* options */))
		.pipe(sourcemaps.write()) // In
		.pipe(gulp.dest("lib/min"));
});

gulp.task("uglify-esm", function () {
  console.log("gulp-uglifying")
	return gulp.src("lib/bundle.esm.js")
		.pipe(rename("bundle.min.js"))
		.pipe(uglify(/* options */))
		.pipe(sourcemaps.write()) // In
		.pipe(gulp.dest("lib/min"));
});

gulp.task('concat', function() {
  return gulp.src('./*/*.ts')
    .pipe(sourcemaps.init())
      .pipe(concat('all.full'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('lib'));
});
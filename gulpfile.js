let gulp = require("gulp");
let rename = require("gulp-rename");
let uglify = require('gulp-uglify-es').default;
const sourcemaps = require("gulp-sourcemaps");
let concat = require("gulp-concat")

gulp.task("uglify-cjs", function () {
  console.log("gulp-uglifying")
	return gulp.src("lib/bundle.cjs")
		.pipe(rename("bundle.min.cjs"))
		.pipe(uglify(/* options */))
		.pipe(sourcemaps.write()) // In
		.pipe(gulp.dest("lib"));
});

gulp.task("uglify-esm", function () {
  console.log("gulp-uglifying")
	return gulp.src("lib/bundle.mjs")
		.pipe(rename("bundle.min.mjs"))
		.pipe(uglify(/* options */))
		.pipe(sourcemaps.write()) // In
		.pipe(gulp.dest("lib"));
});

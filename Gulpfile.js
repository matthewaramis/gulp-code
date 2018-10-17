// Require Gulp first!
const gulp = require("gulp");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const pump = require("pump");
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");

sass.compiler = require("node-sass");

gulp.task("scss", function() {
  return gulp
    .src("./src/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./src/css"))
    .pipe(browserSync.stream());
});

gulp.task("minify", function(done) {
  return pump(
    [
      gulp.src("./src/*.js"),
      eslint(),
      eslint.failAfterError(),
      eslint.format(),
      uglify(),
      rename({ extname: ".min.js" }),
      gulp.dest("./src/js"),
      browserSync.stream()
    ],
    done
  );
});

gulp.task("serve", function() {
  browserSync.init({
    server: "./src"
  });

  gulp.watch("./src/*.scss", gulp.series("scss"));
  gulp.watch("./src/*.js", gulp.series("minify"));
  gulp.watch("./src/*.html").on("change", browserSync.reload);
});

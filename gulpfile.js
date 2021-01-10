const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");

sass.compiler = require('node-sass');

function sassCompile(cb) {
    gulp.src("./sass/dz.sass")
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(rename("style.css"))
        .pipe(gulp.dest("./css/"));
    
    cb();
}

function sassWatch(cb) {
    gulp.watch("./sass/**/*.sass", sassCompile);
    
    cb();
}

gulp.task("sass", sassCompile);
gulp.task("sass:watch", sassWatch);
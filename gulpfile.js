const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const cwebp = require('gulp-cwebp');

sass.compiler = require('node-sass');

function sassCompile(cb) {
    gulp.src("./sass/dz.sass")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(rename("style.css"))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write("./maps/"))
        .pipe(gulp.dest("./css/"));
    
    cb();
}

function sassWatch(cb) {
    gulp.watch("./sass/**/*.sass", sassCompile);
    
    cb();
}

function toWebp(cb) {
    gulp.src('./img/*')
        .pipe(cwebp())
        .pipe(gulp.dest('./img/webp/'));

    cb();
}

gulp.task("sass", sassCompile);
gulp.task("sass:watch", sassWatch);
gulp.task("webp", toWebp);
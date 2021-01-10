const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cwebp = require("gulp-cwebp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");

sass.compiler = require("node-sass");

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
    gulp.src("./img/*")
        .pipe(cwebp())
        .pipe(gulp.dest("./img/webp/"));

    cb();
}

function htmlMin(cb) {
    gulp.src("./*.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest("./"));

    cb();
}

function cssMin(cb) {
    gulp.src("./css/*.css")
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            compatibility: 'ie8+',
            debug: true
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'));
    
    cb();
}

gulp.task("sass", sassCompile);
gulp.task("sass:watch", sassWatch);
gulp.task("webp", toWebp);
gulp.task("htmlMin", htmlMin);
gulp.task("cssMin", cssMin);
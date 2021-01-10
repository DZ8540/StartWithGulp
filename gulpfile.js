const gulp = require("gulp"),
    sass = require("gulp-sass"),
    rename = require("gulp-rename"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require("gulp-sourcemaps"),
    cwebp = require("gulp-cwebp"),
    htmlmin = require("gulp-htmlmin"),
    cleanCSS = require("gulp-clean-css"),
    jsmin = require("gulp-jsmin"),
    browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");

function sassCompile(cb) {
    gulp.src("./sass/dz.sass")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(rename({
            basename: "style",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write("./maps/"))
        .pipe(gulp.dest("./css/"))
        .pipe(browserSync.stream());
    
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
            compatibility: "ie8+",
            debug: true
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(rename({
            basename: "style",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./css/"));
    
    cb();
}

function jsMin(cb) {
    gulp.src("./js/*.js")
        .pipe(jsmin())
        .pipe(rename({
            basename: "dz",
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(gulp.dest("./js/"));
    
    cb();
}

function browserSyncOn(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("./*.html")
        .on('change', browserSync.reload);

    console.log("I'm same to watching sass and other all files for you)))!!!!");
    
    cb();
}

function _watchAllFiles(cb) {
    gulp.watch(["./js/**/*.js", "./img/**/*"], {
        events: ['add', 'change', 'unlink']
    }, () => {
        gulp.src("./")
            .pipe(browserSync.stream());
    });

    cb();
}

gulp.task("sass", sassCompile);
gulp.task("sass:watch", sassWatch);
gulp.task("webp", toWebp);
gulp.task("htmlMin", htmlMin);
gulp.task("cssMin", cssMin);
gulp.task("jsMin", jsMin);
gulp.task("syncOn", gulp.series(browserSyncOn, sassWatch, _watchAllFiles));
const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const svgSprite = require('gulp-svg-sprite');
const browserSync = require('browser-sync').create();
const del = require('del');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const jsmin = require('gulp-jsmin');
const cssmin = require('gulp-cssmin');

let jsLibs = [
  'node_modules/custom-select/build/custom-select.min.js',
]

let cssLibs = [
  'node_modules/custom-select/build/custom-select.css',
]

function clean() {
  return del('docs');
}

function style() {
  return gulp.src(cssLibs)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('docs/css')),

  gulp.src('app/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('docs/css'))
    .on('end', browserSync.reload);
}


function html() {
  return gulp.src('app/pages/*.html')
    .pipe(rename({
      dirname: ""
    }))
    .pipe(gulp.dest('docs/'))
    .on('end', browserSync.reload);
}

function fontsTransfer() {
  return gulp.src('app/fonts/*.*')
    .pipe(gulp.dest('docs/fonts'))
}

function bundleJS() {
  return gulp.src(jsLibs)
    .pipe(concat('libs.js'))
    .pipe(jsmin()) 
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('docs/js'))
    .on('end', browserSync.reload),

  gulp.src(['app/blocks/**/*.js', 'app/js/main.js'])
    .pipe(concat('scripts.js'))
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('docs/js'))
    .on('end', browserSync.reload);
};

// function favicons() {
//   return gulp.src('app/*.ico')
//       .pipe(gulp.dest('docs'));
// }

// function favicons() {
//   return gulp.src('app/favicon/*.*')
//       .pipe(gulp.dest('docs/favicon'));
// }


function imageTransfer() {
  return gulp.src('app/img/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('docs/img'))
}

function icons() {
  return gulp.src('app/icons/single/*.svg')
      .pipe(replace('&gt;', '>'))
      .pipe(rename({prefix: 'icon-'}))
      .pipe(svgSprite({
          mode: {
              symbol: {
                  dest: '',
                  sprite: 'icons.svg'
              }
          },
          svg: {
              namespaceClassnames: false,
              xmlDeclaration: false,
              doctypeDeclaration: false,
              namespaceIDs: false,
              dimensionAttributes: false
          }
      }))
      .pipe(gulp.dest('app/icons/'))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './docs',
    }
  });
  gulp.watch('app/**/*.scss', style);
  gulp.watch('app/pages/*.html', html);
  gulp.watch('app/img/*.{png,jpg,jpeg,gif,webp,svg}', gulp.series(imageTransfer));
  gulp.watch('app/icons/single/*.svg', gulp.series(icons));
  gulp.watch(['app/**/**/*.js', 'app/**/*.js'], gulp.series(bundleJS));
}

gulp.task('build', gulp.series(clean, icons, style, imageTransfer, fontsTransfer, bundleJS, html, function (done) {
    done();
  })
);

gulp.task('watch:dev', gulp.series('build',  gulp.parallel(watch)));



exports.style = style
exports.html = html
exports.bundleJS = bundleJS
exports.icons = icons
exports.fontsTransfer = fontsTransfer
exports.imageTransfer = imageTransfer
exports.watch = watch
exports.clean = clean